import type { SimEvent, SimContext } from '../../simulation/EventQueue';
import { updateMissionStatus, incrementVehiclesOnScene } from '../../redux/slices/game';
import { MissionStatus, type Route, type Waypoint } from '../../../model/mission';
import type { Vehicle } from '../../../model/vehicle';
import type { Call } from '../../../model/call';

/**
 * Payload for MISSION_DISPATCH event handler.
 */
export interface MissionDispatchPayload {
  eventId: string;
  missionId: string;
  vehicleId: string;
  callId: string;
  missionSpeed: number;
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
    
    const { eventId, missionId, vehicleId, callId, missionSpeed } = event.payload;
    
    try {
      const vehicle = getVehicle(vehicleId);
      const call = getCall(callId);
      
      if (!vehicle || !call) {
        console.error('Vehicle or call not found for mission dispatch', event.payload);
        return;
      }
      
      console.log('📦 Dispatching mission:', {
        missionId,
        vehicleId,
        speed: missionSpeed
      });
      
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
        
        // Schedule vehicle arrival event
        // Calculate arrival time: totalDistance (m) / speed (km/h) = time (hours)
        // Convert to milliseconds
        if (ctx.scheduler && ctx.clock) {
          const distanceKm = route.totalDistance / 1000; // meters to km
          const travelTimeHours = distanceKm / missionSpeed; // Use mission speed from payload
          const travelTimeMs = travelTimeHours * 60 * 60 * 1000;
          
          console.log('⏱️ Calculated arrival time:', {
            distanceKm,
            speedKmh: missionSpeed,
            travelTimeHours,
            travelTimeMs,
            arrivalAt: ctx.clock.now() + travelTimeMs
          });
          
          // Import scheduleEvent dynamically to avoid circular dependency
          const { scheduleEvent } = await import('../scheduleEvent');
          const { EventType } = await import('../../simulation/EventQueue');
          
          scheduleEvent({
            scheduler: ctx.scheduler,
            clock: ctx.clock,
            dispatch: ctx.dispatch as any,
            delayMs: travelTimeMs,
            eventType: EventType.VEHICLE_ARRIVED,
            payload: { eventId, missionId },
            handler: createVehicleArrivedHandler()
          });
          
          console.log('✅ Vehicle arrival event scheduled');
        } else {
          console.warn('⚠️ Could not schedule vehicle arrival - missing scheduler or clock');
        }
      }
    } catch (error) {
      console.error('Failed to calculate route for mission dispatch:', error);
    }
  };
}

/**
 * Payload for VEHICLE_ARRIVED event handler.
 */
export interface VehicleArrivedPayload {
  eventId: string;
  missionId: string;
  scheduledEventId?: string;
}

/**
 * Creates a VEHICLE_ARRIVED event handler.
 * 
 * Handles vehicle arrival at the scene: updates mission status to ON_SCENE
 * and clears the route since the vehicle is no longer traveling.
 * 
 * Note: Cleanup of persisted scheduled events is handled automatically by
 * the scheduling infrastructure (see scheduleEvent wrapper).
 * 
 * @returns Handler function for the scheduler
 */
export function createVehicleArrivedHandler() {
  return async (ctx: SimContext, event: SimEvent<VehicleArrivedPayload>) => {
    console.log('🎯 VEHICLE_ARRIVED event fired:', event.payload);
    
    if (!event.payload) return;
    
    const { eventId, missionId } = event.payload;
    
    try {
      // Update mission status to ON_SCENE and clear route
      if (ctx.dispatch) {
        console.log('📍 Updating mission to ON_SCENE:', { eventId, missionId });
        
        ctx.dispatch(updateMissionStatus({
          eventId,
          missionId,
          status: MissionStatus.ON_SCENE,
          route: undefined
        }));
        
        // Increment vehicles on scene counter
        console.log('➕ Incrementing vehicles on scene for event:', eventId);
        ctx.dispatch(incrementVehiclesOnScene(eventId));
        
        console.log('✅ Vehicle arrival processed successfully');
      }
    } catch (error) {
      console.error('Failed to update mission status to ON_SCENE:', error);
    }
  };
}

/**
 * Fetch a route between two waypoints using OSRM (fallbacks to straight line).
 *
 * @param from Starting waypoint {latitude, longitude}
 * @param to Destination waypoint {latitude, longitude}
 * @param startedAt Simulation time when the route starts
 * @returns Route with `waypoints[]`, `totalDistance` (meters) and `startedAt`
 */
async function fetchRoute(
    from: Waypoint,
    to: Waypoint,
    startedAt: number
): Promise<Route> {
    // OSRM public demo server
    // Format: /route/v1/{profile}/{coordinates}
    // Coordinates are lon,lat (note: longitude first!)
    const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`OSRM routing failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.routes || data.routes.length === 0) {
            throw new Error('No route found between the two points');
        }
        
        const route = data.routes[0];
        
        // Convert GeoJSON coordinates (lon, lat) to our Waypoint format (lat, lon)
        const waypoints: Waypoint[] = route.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({
                latitude: lat,
                longitude: lon
            })
        );
        
        // OSRM returns distance in meters
        const totalDistance: number = route.distance;
        
        return {
            waypoints,
            totalDistance,
            startedAt
        };
    } catch (error) {
        console.error('Error fetching route from OSRM:', error);
        
        // Fallback: create a simple straight-line route with just 2 points
        console.warn('Falling back to straight-line route');
        
        // Calculate straight-line distance using Haversine formula
        const R = 6371000; // Earth radius in meters
        const lat1 = from.latitude * Math.PI / 180;
        const lat2 = to.latitude * Math.PI / 180;
        const dLat = (to.latitude - from.latitude) * Math.PI / 180;
        const dLon = (to.longitude - from.longitude) * Math.PI / 180;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return {
            waypoints: [from, to],
            totalDistance: distance,
            startedAt
        };
    }
}