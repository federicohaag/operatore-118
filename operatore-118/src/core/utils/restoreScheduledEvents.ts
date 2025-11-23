import type { Scheduler } from '../Scheduler';
import { removeScheduledEvent, updateMissionStatus, type ScheduledEvent } from '../redux/slices/game';
import { MissionStatus } from '../../model/mission';
import { fetchRoute } from '../MissionRouting';
import type { AppDispatch } from '../redux/store';
import { EventType } from '../EventQueue';

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
            if (event.type === EventType.MISSION_CREATION) {
                scheduler.scheduleIn(delay, {
                    type: EventType.MISSION_CREATION,
                    payload: { ...event.payload, scheduledEventId: event.id },
                    handler: async (ctx, ev) => {
                        if (!ev.payload) return;
                        
                        // Remove from persisted scheduled events
                        if (ctx.dispatch && ev.payload.scheduledEventId) {
                            ctx.dispatch(removeScheduledEvent(ev.payload.scheduledEventId));
                        }
                        
                        try {
                            const vehicle = vehicles[ev.payload.vehicleId];
                            const call = calls[ev.payload.callId];
                            
                            if (!vehicle || !call) {
                                console.error('Vehicle or call not found for mission dispatch', ev.payload);
                                return;
                            }
                            
                            // Fetch real route from vehicle current location to event location using OSRM
                            const route = await fetchRoute(
                                {
                                    latitude: vehicle.currentLocation.latitude,
                                    longitude: vehicle.currentLocation.longitude
                                },
                                {
                                    latitude: call.location.address.latitude,
                                    longitude: call.location.address.longitude
                                },
                                ctx.now()
                            );
                            
                            // Update mission status to traveling with real route
                            if (ctx.dispatch) {
                                ctx.dispatch(updateMissionStatus({
                                    eventId: ev.payload.eventId,
                                    missionId: ev.payload.missionId,
                                    status: MissionStatus.TRAVELING_TO_SCENE,
                                    route
                                }));
                            }
                        } catch (error) {
                            console.error('Error dispatching mission', error);
                        }
                    }
                });
            }
        } else {
            // Event is overdue, remove it from state
            console.warn('Scheduled event is overdue, removing:', event);
            dispatch(removeScheduledEvent(event.id));
        }
    });
}
