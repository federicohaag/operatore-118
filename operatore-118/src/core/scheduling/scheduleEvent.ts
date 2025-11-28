import type { AppDispatch } from '../redux/store';
import type { Scheduler } from './Scheduler';
import type { VirtualClock } from '../simulation/VirtualClock';
import type { SimEvent, SimContext } from '../simulation/EventQueue';
import { addScheduledEvent, removeScheduledEvent } from '../redux/slices/game';
import type { EventType } from '../simulation/EventQueue';

/**
 * Wraps a handler to automatically cleanup persisted scheduled events.
 * 
 * When the event fires, removes the persisted event from Redux before
 * executing the user-provided handler.
 * 
 * @param handler - User-provided event handler
 * @returns Wrapped handler with automatic cleanup
 */
function withScheduledEventCleanup<TPayload>(
  handler: (ctx: SimContext, event: SimEvent<TPayload>) => void | Promise<void>
) {
  return async (ctx: SimContext, event: SimEvent<TPayload & { scheduledEventId?: string }>) => {
    // Remove from persisted scheduled events
    if (ctx.dispatch && event.payload?.scheduledEventId) {
      ctx.dispatch(removeScheduledEvent(event.payload.scheduledEventId));
    }
    
    // Execute user handler
    await handler(ctx, event as any);
  };
}

/**
 * Schedules an event with both the scheduler and Redux persistence.
 * 
 * This ensures scheduled events survive page reloads by:
 * 1. Persisting event metadata to Redux (synced to localStorage)
 * 2. Scheduling the event in the active scheduler instance
 * 
 * @param params - Scheduling parameters
 * @param params.scheduler - Scheduler instance
 * @param params.clock - Virtual clock for simulation time
 * @param params.dispatch - Redux dispatch function
 * @param params.delayMs - Delay in simulation milliseconds
 * @param params.eventType - Type of event to schedule
 * @param params.payload - Event payload (must be serializable for Redux)
 * @param params.handler - Event handler function
 * @returns The generated scheduled event ID
 */
export function scheduleEvent<TPayload = any>(params: {
  scheduler: Scheduler;
  clock: VirtualClock;
  dispatch: AppDispatch;
  delayMs: number;
  eventType: EventType;
  payload: TPayload;
  handler: (ctx: any, event: SimEvent<TPayload & { scheduledEventId?: string }>) => void | Promise<void>;
}): string {
  const { scheduler, clock, dispatch, delayMs, eventType, payload, handler } = params;
  
  // Generate unique ID for this scheduled event
  const scheduledEventId = crypto.randomUUID();
  const scheduledTime = clock.now() + delayMs;
  
  console.log('📅 Scheduling event:', {
    type: eventType,
    scheduledEventId,
    currentTime: clock.now(),
    delayMs,
    scheduledTime,
    payload
  });
  
  // Persist to Redux (for reload persistence)
  dispatch(addScheduledEvent({
    id: scheduledEventId,
    scheduledTime,
    type: eventType,
    payload
  }));
  
  // Wrap handler with automatic cleanup
  const wrappedHandler = withScheduledEventCleanup(handler);
  
  // Schedule in the active scheduler
  scheduler.scheduleIn(delayMs, {
    type: eventType,
    payload: { ...payload, scheduledEventId } as any,
    handler: wrappedHandler as any
  });
  
  return scheduledEventId;
}
