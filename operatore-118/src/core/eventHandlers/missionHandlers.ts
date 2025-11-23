import type { SimEvent, SimContext } from '../EventQueue';
import { updateMissionStatus } from '../redux/slices/game';
import { MissionStatus } from '../../model/mission';
import { fetchRoute } from '../MissionRouting';
import type { Vehicle } from '../../model/vehicle';
import type { Call } from '../../model/call';

/**
 * Payload for MISSION_DISPATCH event handler.
 */
export interface MissionDispatchPayload {
  eventId: string;
  missionId: string;
  vehicleId: string;
  callId: string;
  scheduledEventId?: string;
}

/**
 * Creates a MISSION_DISPATCH event handler.
 * 
 * Handles automatic mission dispatch: fetches route from vehicle location to
 * call location and updates mission status to TRAVELING_TO_SCENE.
 * 
 * Note: Cleanup of persisted scheduled events is handled automatically by
 * the scheduling infrastructure (see scheduleEvent wrapper).
 * 
 * @param getVehicle - Function to retrieve vehicle by id
 * @param getCall - Function to retrieve call by id
 * @returns Handler function for the scheduler
 */
export function createMissionDispatchHandler(
  getVehicle: (id: string) => Vehicle | undefined,
  getCall: (id: string) => Call | undefined
) {
  return async (ctx: SimContext, event: SimEvent<MissionDispatchPayload>) => {
    if (!event.payload) return;
    
    const { eventId, missionId, vehicleId, callId } = event.payload;
    
    try {
      const vehicle = getVehicle(vehicleId);
      const call = getCall(callId);
      
      if (!vehicle || !call) {
        console.error('Vehicle or call not found for mission dispatch', event.payload);
        return;
      }
      
      // Fetch real route from vehicle current location to call location using OSRM
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
          eventId,
          missionId,
          status: MissionStatus.TRAVELING_TO_SCENE,
          route
        }));
      }
    } catch (error) {
      console.error('Failed to calculate route for mission dispatch:', error);
    }
  };
}
