import type { AppDispatch } from '../redux/store';
import type { Scheduler } from '../scheduling/Scheduler';
import type { VirtualClock } from '../simulation/VirtualClock';
import type { Vehicle } from '../../model/vehicle';
import type { Call } from '../../model/call';
import type { Codice } from '../../model/eventDetails';
import { MissionStatus, calculateMissionSpeed } from '../../model/mission';
import { addMissionToEvent } from '../redux/slices/game';
import { EventType } from '../simulation/EventQueue';
import { createMissionDispatchHandler } from '../scheduling/handlers/missionHandlers';
import { scheduleEvent } from '../scheduling/scheduleEvent';

/**
 * Configuration for automatic mission dispatch.
 */
const MISSION_DISPATCH_DELAY_MS = 20000; // 20 simulation seconds

/**
 * Creates a new mission for a vehicle and schedules automatic dispatch.
 * 
 * This encapsulates the core game logic for mission creation:
 * - Creates a mission in MISSION_RECEIVED status
 * - Adds mission to the event in Redux
 * - Persists a scheduled MISSION_DISPATCH event
 * - Schedules automatic dispatch after configured delay
 * 
 * @param params - Mission creation parameters
 * @param params.eventId - ID of the event to assign mission to
 * @param params.vehicle - Vehicle assigned to the mission
 * @param params.call - Emergency call associated with the event
 * @param params.priorityCode - Event priority code (ROSSO, GIALLO, VERDE)
 * @param params.clock - Virtual clock for simulation time
 * @param params.scheduler - Scheduler for automatic dispatch
 * @param params.dispatch - Redux dispatch function
 * @param params.getVehicle - Function to retrieve vehicle by ID (for handler)
 * @param params.getCall - Function to retrieve call by ID (for handler)
 */
export function createMission(params: {
  eventId: string;
  vehicle: Vehicle;
  call: Call;
  priorityCode: Codice;
  clock: VirtualClock;
  scheduler: Scheduler;
  dispatch: AppDispatch;
  getVehicle: (id: string) => Vehicle | undefined;
  getCall: (id: string) => Call | undefined;
}): void {
  const { eventId, vehicle, call, priorityCode, clock, scheduler, dispatch, getVehicle, getCall } = params;
  
  // Calculate speed based on event priority
  const speed = calculateMissionSpeed(priorityCode);
  
  // Create mission in MISSION_RECEIVED status
  const mission = {
    id: crypto.randomUUID(),
    vehicleId: vehicle.id,
    createdAt: clock.now(),
    status: MissionStatus.MISSION_RECEIVED,
    speed
  };
  
  // Add mission to event in Redux
  dispatch(addMissionToEvent({ eventId, mission }));
  
  // Create handler using centralized factory
  const handler = createMissionDispatchHandler(getVehicle, getCall);
  
  // Schedule automatic dispatch (persisted + scheduler)
  scheduleEvent({
    scheduler,
    clock,
    dispatch,
    delayMs: MISSION_DISPATCH_DELAY_MS,
    eventType: EventType.MISSION_DISPATCH,
    payload: { eventId, missionId: mission.id, vehicleId: vehicle.id, callId: call.id },
    handler: handler as any
  });
}
