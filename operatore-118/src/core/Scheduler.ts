import { VirtualClock } from './VirtualClock';
import { EventQueue } from './EventQueue';
import type { SimEvent, SimContext } from './EventQueue';

/**
 * Scheduler - Discrete-event scheduler that coordinates with VirtualClock
 * 
 * Manages a priority queue of simulation events and uses real timers to process
 * them at the correct simulation time. Automatically adjusts timer delays based
 * on clock speed and paused state.
 * 
 * ## Architecture
 * The scheduler bridges simulation time (managed by VirtualClock) and real time
 * (browser timers). It maintains a min-heap priority queue ordered by (time, sequence)
 * and arms real-world setTimeout timers that fire when the next simulation event
 * is due, accounting for clock speed multipliers.
 * 
 * ## Clock Integration
 * - Subscribes to VirtualClock onChange events to re-arm timers when speed/pause changes
 * - Automatically pauses timer scheduling when clock is paused
 * - Calculates real-world delays as: realDelay = simDelay / clockSpeed
 * 
 * ## Event Processing
 * Events are processed in strict chronological order. When multiple events share
 * the same simulation time, they execute in the order they were scheduled (sequence order).
 * The scheduler prevents UI blocking by yielding after processing large event bursts.
 * 
 * ## Lifecycle
 * Must call dispose() when done to unsubscribe from clock and cancel pending timers.
 * After disposal, all operations throw errors.
 * 
 * @example
 * ```typescript
 * const clock = new VirtualClock(1.0, false, 0);
 * const ctx: SimContext = { 
 *   now: () => clock.now(),
 *   dispatch: store.dispatch 
 * };
 * const scheduler = new Scheduler(clock, ctx);
 * 
 * // Schedule event 5 seconds from now in simulation time
 * const { cancel } = scheduler.scheduleIn(5000, {
 *   type: 'Ping',
 *   handler: (ctx, ev) => console.log('Ping at', ctx.now())
 * });
 * 
 * // Cancel if needed
 * cancel();
 * 
 * // Clean up when done
 * scheduler.dispose();
 * ```
 */
export class Scheduler {
  private queue = new EventQueue();
  private clock: VirtualClock;
  private context: SimContext;
  private currentTimerId: number | undefined;
  private clockUnsubscribe: (() => void) | undefined;
  private disposed = false;

  /**
   * Creates a new Scheduler instance and subscribes to clock changes
   * 
   * Initializes the event queue, subscribes to VirtualClock onChange notifications,
   * and arms the first timer. The scheduler is immediately ready to accept events.
   * 
   * @param clock - VirtualClock instance to coordinate with. The scheduler subscribes
   *                to this clock's onChange events and uses it to determine current
   *                simulation time and speed multiplier.
   * @param context - SimContext passed to all event handlers. Typically contains
   *                  a now() function and dispatch() for Redux integration.
   */
  constructor(clock: VirtualClock, context: SimContext) {
    this.clock = clock;
    this.context = context;
    
    // Subscribe to clock changes to re-arm timers
    this.clockUnsubscribe = clock.onChange(() => {
      if (!this.disposed) {
        this.rearmTimer();
      }
    });
    
    // Initial timer setup
    this.rearmTimer();
  }

  /**
   * Schedules an event at a specific absolute simulation time
   * 
   * Inserts the event into the priority queue ordered by (time, sequence). If the
   * new event is due before the currently armed timer, re-arms the timer with the
   * earlier deadline. The event's handler will be invoked when the simulation clock
   * reaches the specified time.
   * 
   * @param event - The event to schedule. Must include:
   *                - time: Absolute simulation time (milliseconds) when to fire
   *                - type: Event type identifier (string)
   *                - handler: Callback function receiving (context, event)
   *                - payload: Optional typed payload data
   * 
   * @returns Object containing:
   *          - id: Unique numeric identifier for this event
   *          - cancel: Function that removes the event from the queue.
   *                    Returns true if canceled, false if already executed/canceled.
   *                    Calling cancel triggers timer re-arming.
   * 
   * @throws Error if the scheduler has been disposed
   * 
   * @example
   * ```typescript
   * const { id, cancel } = scheduler.schedule({
   *   time: 10000, // Fire at sim time 10 seconds
   *   type: 'CALL_RECEIVED',
   *   payload: { callId: '123' },
   *   handler: (ctx, ev) => {
   *     console.log('Call received at', ctx.now());
   *   }
   * });
   * ```
   */
  schedule<Payload>(event: SimEvent<Payload>): { id: number; cancel: () => boolean } {
    if (this.disposed) {
      throw new Error('Scheduler has been disposed');
    }

    const result = this.queue.push(event);
    
    // Wrap the cancel function to trigger re-arming
    const originalCancel = result.cancel;
    const cancel = () => {
      const wasCanceled = originalCancel();
      if (wasCanceled && !this.disposed) {
        // Re-arm timer in case the canceled event was the next due event
        this.rearmTimer();
      }
      return wasCanceled;
    };
    
    this.rearmTimer();
    return { id: result.id, cancel };
  }

  /**
   * Schedules an event relative to the current simulation time
   * 
   * Convenience method that calculates the absolute simulation time by adding
   * msFromNow to clock.now(), then delegates to schedule(). This is the recommended
   * way to schedule future events relative to the current state.
   * 
   * @param msFromNow - Delay in milliseconds from current simulation time.
   *                    Must be >= 0. The event fires at clock.now() + msFromNow.
   * @param event - The event to schedule, omitting the time field. Must include:
   *                - type: Event type identifier (string)
   *                - handler: Callback function receiving (context, event)
   *                - payload: Optional typed payload data
   * 
   * @returns Object containing:
   *          - id: Unique numeric identifier for this event
   *          - cancel: Function that removes the event from the queue.
   *                    Returns true if canceled, false if already executed/canceled.
   * 
   * @throws Error if the scheduler has been disposed
   * 
   * @example
   * ```typescript
   * // Schedule event 30 seconds from now
   * scheduler.scheduleIn(30000, {
   *   type: 'DISPATCH_TIMEOUT',
   *   payload: { callId: '456' },
   *   handler: (ctx, ev) => {
   *     ctx.dispatch(timeoutCall(ev.payload.callId));
   *   }
   * });
   * ```
   */
  scheduleIn<Payload>(msFromNow: number, event: Omit<SimEvent<Payload>, 'time'>): { id: number; cancel: () => boolean } {
    const fullEvent: SimEvent<Payload> = {
      ...event,
      time: this.clock.now() + msFromNow
    };
    return this.schedule(fullEvent);
  }

  /**
   * Processes all events up to and including the target simulation time
   * 
   * Immediately snaps the VirtualClock to targetSimTime and processes all queued
   * events with time <= targetSimTime in chronological order. This is useful for
   * batch processing or fast-forwarding the simulation.
   * 
   * Cancels the currently armed timer before processing to prevent race conditions,
   * then re-arms after processing completes. Events scheduled during handler execution
   * that are also due at targetSimTime will be processed in the same batch.
   * 
   * @param targetSimTime - The absolute simulation time (milliseconds) to advance to.
   *                        All events with time <= this value will be executed.
   *                        The clock will be seeked to exactly this time.
   * 
   * @throws Error if the scheduler has been disposed
   * 
   * @example
   * ```typescript
   * // Fast-forward simulation by 1 hour
   * const futureTime = clock.now() + 3600000;
   * scheduler.runUntil(futureTime);
   * // All events between now and futureTime have been processed
   * ```
   */
  runUntil(targetSimTime: number): void {
    if (this.disposed) {
      throw new Error('Scheduler has been disposed');
    }

    // Cancel current timer to prevent interference
    this.cancelCurrentTimer();
    
    // Snap clock to target time
    this.clock.seek(targetSimTime);
    
    // Process all due events
    this.processDueEvents(targetSimTime);
    
    // Re-arm timer for next event
    this.rearmTimer();
  }

  /**
   * Clears all events from the queue and cancels any active timer
   * 
   * Removes all pending events from the priority queue and cancels the currently
   * armed setTimeout timer. Does not affect the VirtualClock state or reset simulation
   * time. This is useful for resetting the simulation while keeping the clock running.
   * 
   * No-op if the scheduler has been disposed (does not throw).
   * 
   * @example
   * ```typescript
   * // Clear all pending events (e.g., when resetting game state)
   * scheduler.clear();
   * // Queue is now empty, but clock continues running
   * ```
   */
  clear(): void {
    if (this.disposed) {
      return;
    }

    this.queue.clear();
    this.cancelCurrentTimer();
  }

  /**
   * Gets the number of active events in the queue
   * 
   * Returns the count of events that are scheduled but not yet executed or canceled.
   * This does not include events that are currently being processed.
   * 
   * @returns Number of active events in the queue (0 or positive integer)
   * 
   * @example
   * ```typescript
   * console.log(`Pending events: ${scheduler.size()}`);
   * ```
   */
  size(): number {
    return this.queue.size();
  }

  /**
   * Disposes the scheduler, releasing all resources
   * 
   * Unsubscribes from VirtualClock onChange events, cancels the currently armed
   * setTimeout timer, and clears all events from the queue. After disposal, the
   * scheduler is permanently unusable - all subsequent operations (except dispose
   * and clear) will throw errors.
   * 
   * Safe to call multiple times (idempotent). This method should be called during
   * component cleanup to prevent memory leaks.
   * 
   * @example
   * ```typescript
   * // In React useEffect cleanup
   * useEffect(() => {
   *   const scheduler = new Scheduler(clock, context);
   *   return () => scheduler.dispose();
   * }, []);
   * ```
   */
  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.cancelCurrentTimer();
    
    if (this.clockUnsubscribe) {
      this.clockUnsubscribe();
      this.clockUnsubscribe = undefined;
    }
    
    this.queue.clear();
  }

  /**
   * Arms a real timer for the next due event based on current clock state
   * 
   * Calculates the real-world delay until the next event should fire by converting
   * simulation time to real time using the clock's speed multiplier:
   * realDelay = (eventTime - clockNow) / clockSpeed
   * 
   * No timer is armed if the clock is paused or the queue is empty. If an event is
   * overdue (dtSim <= 0), schedules immediate execution with setTimeout(0).
   * 
   * Automatically cancels any previously armed timer before arming a new one.
   * 
   * @private
   */
  private rearmTimer(): void {
    if (this.disposed) {
      return;
    }

    // Cancel any existing timer
    this.cancelCurrentTimer();

    const nextEvent = this.queue.peek();
    if (!nextEvent || this.clock.paused) {
      // No events or clock is paused - no timer needed
      return;
    }

    const currentSimTime = this.clock.now();
    const dtSim = nextEvent.time - currentSimTime;

    if (dtSim <= 0) {
      // Event is due now or overdue - process immediately
      this.currentTimerId = setTimeout(() => this.onTimerFire(), 0);
    } else {
      // Calculate real-world delay based on clock speed
      const speed = Math.max(this.clock.speed, 1e-9); // Avoid division by zero
      const realDelay = dtSim / speed;
      
      this.currentTimerId = setTimeout(() => this.onTimerFire(), realDelay);
    }
  }

  /**
   * Cancels the current real timer if one is active
   * 
   * Calls clearTimeout() on the currently armed timer and resets currentTimerId
   * to undefined. Safe to call when no timer is active (no-op).
   * 
   * @private
   */
  private cancelCurrentTimer(): void {
    if (this.currentTimerId !== undefined) {
      clearTimeout(this.currentTimerId);
      this.currentTimerId = undefined;
    }
  }

  /**
   * Called when the real timer fires - processes due events and re-arms
   * 
   * This is the callback invoked by setTimeout when an event becomes due. It:
   * 1. Snaps the VirtualClock to the event's time
   * 2. Processes all events at that time via processDueEvents()
   * 3. Re-arms the timer for the next event
   * 
   * No-op if the scheduler has been disposed or the queue is empty.
   * 
   * @private
   */
  private onTimerFire(): void {
    if (this.disposed) {
      return;
    }

    this.currentTimerId = undefined;

    const nextEvent = this.queue.peek();
    if (!nextEvent) {
      return;
    }

    // Snap simulation time to the event time
    this.clock.seek(nextEvent.time);

    // Process all events at this time (and any new ones scheduled during handling)
    this.processDueEvents(nextEvent.time);

    // Re-arm for the next event
    this.rearmTimer();
  }

  /**
   * Processes all events with time <= targetTime in chronological order
   * 
   * Implements two-phase processing:
   * 1. Collects all due events from the queue (time <= targetTime)
   * 2. Executes handlers in sequence order, catching and logging errors
   * 
   * Implements burst limiting: after processing 1000 events, yields control to
   * the event loop with setTimeout(0) to prevent UI blocking. This is critical
   * for maintaining responsiveness during large event cascades.
   * 
   * After initial batch, checks for newly scheduled events that are also due at
   * targetTime and processes them iteratively until no more due events exist.
   * This ensures correct handling of events scheduled during handler execution.
   * 
   * Errors in event handlers are caught, logged to console with event details,
   * and do not prevent subsequent events from executing.
   * 
   * @param targetTime - The simulation time threshold. All events with
   *                     time <= this value will be executed.
   * 
   * @private
   */
  private processDueEvents(targetTime: number): void {
    const eventsToProcess: SimEvent[] = [];
    
    // Collect all due events in one pass
    while (true) {
      const nextEvent = this.queue.peek();
      if (!nextEvent || nextEvent.time > targetTime) {
        break;
      }
      
      const event = this.queue.pop()!;
      eventsToProcess.push(event);
    }

    // Execute events in sequence order (they're already sorted by time, seq)
    let processedCount = 0;
    const maxBurstSize = 1000; // Prevent UI blocking
    
    for (const event of eventsToProcess) {
      try {
        event.handler(this.context, event);
      } catch (error) {
        console.error(`Error in event handler (type: ${event.type}, time: ${event.time}):`, error);
      }
      
      processedCount++;
      
      // Micro-yield after processing many events to prevent UI jank
      if (processedCount >= maxBurstSize) {
        processedCount = 0;
        // Note: In a real implementation, you might want to use a more sophisticated
        // yielding mechanism, but setTimeout(0) provides basic yielding
        if (eventsToProcess.length > maxBurstSize) {
          setTimeout(() => {
            // Continue processing remaining events
            const remaining = eventsToProcess.slice(maxBurstSize);
            for (const remainingEvent of remaining) {
              try {
                remainingEvent.handler(this.context, remainingEvent);
              } catch (error) {
                console.error(`Error in event handler (type: ${remainingEvent.type}, time: ${remainingEvent.time}):`, error);
              }
            }
          }, 0);
          break;
        }
      }
    }

    // Check for new events that may have been scheduled during processing
    // and are also due at the current time
    let hasNewDueEvents = true;
    while (hasNewDueEvents) {
      const nextEvent = this.queue.peek();
      if (!nextEvent || nextEvent.time > targetTime) {
        hasNewDueEvents = false;
      } else {
        // Process newly scheduled events that are also due
        const event = this.queue.pop()!;
        try {
          event.handler(this.context, event);
        } catch (error) {
          console.error(`Error in event handler (type: ${event.type}, time: ${event.time}):`, error);
        }
      }
    }
  }
}