import type { Scheduler } from './Scheduler';
import { removeScheduledEvent, type ScheduledEvent } from '../redux/slices/game';
import type { AppDispatch } from '../redux/store';
import { EventType } from '../simulation/EventQueue';
import { createMissionDispatchHandler } from './handlers/missionHandlers';

/**
 * Restores scheduled events from Redux state to the scheduler after page reload
 * 
 * @param scheduler The scheduler instance to register events with
 * @param scheduledEvents Array of persisted events from Redux state
 * @param currentSimulationTime Current simulation time in milliseconds
 * @param dispatch Redux dispatch function
 * @param vehicles Map of vehicle data for route calculation
 * @param calls Map of call data for route calculation
 */
export function restoreScheduledEvents(
    scheduler: Scheduler,
    scheduledEvents: ScheduledEvent[],
    currentSimulationTime: number,
    dispatch: AppDispatch,
    vehicles: any,
    calls: any
) {
    scheduledEvents.forEach(event => {
        const delay = event.scheduledTime - currentSimulationTime;
        
        // Only restore events that haven't happened yet
        if (delay > 0) {
            if (event.type === EventType.MISSION_DISPATCH) {
                // Create handler using centralized factory
                const handler = createMissionDispatchHandler(
                    (id) => vehicles[id],
                    (id) => calls[id]
                );
                
                scheduler.scheduleIn(delay, {
                    type: EventType.MISSION_DISPATCH,
                    payload: { ...event.payload, scheduledEventId: event.id },
                    handler: handler as any
                });
            }
        } else {
            // Event is overdue, remove it from state
            console.warn('Scheduled event is overdue, removing:', event);
            dispatch(removeScheduledEvent(event.id));
        }
    });
}
