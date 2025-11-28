import { VirtualClock } from '../simulation/VirtualClock';
import { EventQueue, EventType } from '../simulation/EventQueue';
import type { SimEvent, SimContext } from '../simulation/EventQueue';

/**
 * Scheduler - discrete-event scheduler
 *
 * Bridges `VirtualClock` to real timers and runs `SimEvent` handlers at the
 * correct simulation times. Uses an `EventQueue` and arms real `setTimeout`
 * delays computed from simulation delays and clock speed.
 */
export class Scheduler {
  private queue = new EventQueue();
  private clock: VirtualClock;
  private context: SimContext;
  private currentTimerId: number | undefined;
  private clockUnsubscribe: (() => void) | undefined;
  private disposed = false;

  /** Create scheduler and subscribe to clock changes. */
  constructor(clock: VirtualClock, context: SimContext) {
    this.clock = clock;
    // Augment context with scheduler and clock for nested scheduling
    this.context = {
      ...context,
      scheduler: this,
      clock: clock
    };
    
    // Subscribe to clock changes to re-arm timers
    this.clockUnsubscribe = clock.onChange(() => {
      if (!this.disposed) {
        this.rearmTimer();
      }
    });
    
    // Initial timer setup
    this.rearmTimer();
  }

  /** Schedule an absolute `SimEvent`. Returns id and cancel(). */
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

  /** Schedule event relative to now (msFromNow). */
  scheduleIn<Payload>(msFromNow: number, event: Omit<SimEvent<Payload>, 'time'>): { id: number; cancel: () => boolean } {
    const fullEvent: SimEvent<Payload> = {
      ...event,
      time: this.clock.now() + msFromNow
    };
    return this.schedule(fullEvent);
  }

  /** Fast-forward to `targetSimTime` and process all due events. */
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

  /** Clear all pending events and cancel timer. */
  clear(): void {
    if (this.disposed) {
      return;
    }

    this.queue.clear();
    this.cancelCurrentTimer();
  }

  /** Number of active (non-canceled) events. */
  size(): number {
    return this.queue.size();
  }

  /** Dispose scheduler: unsubscribe, cancel timer, clear queue. */
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

  /** Arm a real timer for the next due event (no-op if paused/empty). */
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

  /** Cancel currently armed real timer if any. */
  private cancelCurrentTimer(): void {
    if (this.currentTimerId !== undefined) {
      clearTimeout(this.currentTimerId);
      this.currentTimerId = undefined;
    }
  }

  /** Timer callback: advance clock to next event and process due events. */
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

  /** Process and execute all events with time <= targetTime. */
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
        // Avoid logging high-frequency simulation time updates
        if (event.type !== EventType.UPDATE_SIMULATION_TIME) {
          console.log('⚡ Executing event:', {
            type: event.type,
            time: event.time,
            currentTime: this.clock.now(),
            payload: event.payload
          });
        }
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
                if (remainingEvent.type !== EventType.UPDATE_SIMULATION_TIME) {
                  console.log('⚡ Executing event (after yield):', {
                    type: remainingEvent.type,
                    time: remainingEvent.time,
                    currentTime: this.clock.now(),
                    payload: remainingEvent.payload
                  });
                }
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
          if (event.type !== EventType.UPDATE_SIMULATION_TIME) {
            console.log('⚡ Executing newly scheduled event:', {
              type: event.type,
              time: event.time,
              currentTime: this.clock.now(),
              payload: event.payload
            });
          }
          event.handler(this.context, event);
        } catch (error) {
          console.error(`Error in event handler (type: ${event.type}, time: ${event.time}):`, error);
        }
      }
    }
  }
}