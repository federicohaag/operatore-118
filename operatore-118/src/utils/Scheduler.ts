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
 * @example
 * ```typescript
 * const clock = new VirtualClock(1.0, false, 0);
 * const ctx: SimContext = { now: () => clock.now() };
 * const scheduler = new Scheduler(clock, ctx);
 * 
 * scheduler.scheduleIn(5000, {
 *   type: 'Ping',
 *   handler: (ctx, ev) => console.log('Ping at', ctx.now())
 * });
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
   * Creates a new Scheduler
   * 
   * @param clock - VirtualClock instance to coordinate with
   * @param context - SimContext passed to event handlers
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
   * Schedules an event at a specific simulation time
   * 
   * @param event - The event to schedule
   * @returns Object with unique ID and cancel function
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
   * @param msFromNow - Milliseconds from current simulation time
   * @param event - The event to schedule (without time field)
   * @returns Object with unique ID and cancel function
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
   * @param targetSimTime - The simulation time to process events until
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
   * @returns Number of active events
   */
  size(): number {
    return this.queue.size();
  }

  /**
   * Disposes the scheduler, unsubscribing from clock changes and canceling timers
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
   * Processes all events with time <= targetTime
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