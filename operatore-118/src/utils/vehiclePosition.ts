import type { Vehicle } from '../model/vehicle';
import type { Mission } from '../model/mission';
import { MissionStatus } from '../model/mission';
import { calculateDistance } from './distance';

/**
 * Calculates the current position of a vehicle based on its active mission
 * 
 * For vehicles with an active route (traveling), computes position along the route.
 * For stationary vehicles, returns their station location or last known position.
 * 
 * @param vehicle The vehicle to compute position for
 * @param mission The vehicle's current mission (if any)
 * @param currentSimTime Current simulation time in milliseconds
 * @returns Updated coordinates for the vehicle's current location
 */
export function calculateVehicleCurrentLocation(
    vehicle: Vehicle,
    mission: Mission | undefined,
    currentSimTime: number
): { latitude: number; longitude: number } {
    // If no mission or mission has no route, use vehicle's stored currentLocation
    if (!mission || !mission.route) {
        return vehicle.currentLocation;
    }
    
    // Only calculate position for traveling statuses
    const isTraveling = 
        mission.status === MissionStatus.TRAVELING_TO_SCENE ||
        mission.status === MissionStatus.TRAVELING_TO_HOSPITAL ||
        mission.status === MissionStatus.RETURNING_TO_STATION;
    
    if (!isTraveling) {
        return vehicle.currentLocation;
    }
    
    // Calculate position along route
    const position = calculatePositionAlongRoute(mission, currentSimTime);
    return position || vehicle.currentLocation;
}

/**
 * Calculates position along a route based on elapsed time and speed
 * 
 * Uses the same algorithm as AnimatedVehicleMarkers to ensure consistency.
 * 
 * @param mission Mission containing route and speed information
 * @param currentSimTime Current simulation time in milliseconds
 * @returns Interpolated position or null if calculation fails
 */
function calculatePositionAlongRoute(
    mission: Mission,
    currentSimTime: number
): { latitude: number; longitude: number } | null {
    if (!mission.route || !mission.route.waypoints.length) {
        return null;
    }
    
    const { route, speed } = mission;
    const { waypoints, totalDistance, startedAt } = route;
    
    // Calculate elapsed time and distance traveled
    const elapsedMs = currentSimTime - startedAt;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const distanceTraveled = speed * elapsedHours; // km
    
    // If arrived, return last waypoint
    if (distanceTraveled >= totalDistance / 1000) { // totalDistance is in meters
        const lastWaypoint = waypoints[waypoints.length - 1];
        return { latitude: lastWaypoint.latitude, longitude: lastWaypoint.longitude };
    }
    
    // Find the segment containing the current position
    let accumulatedDistance = 0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
        const from = waypoints[i];
        const to = waypoints[i + 1];
        const segmentDistance = calculateDistance(
            from.latitude,
            from.longitude,
            to.latitude,
            to.longitude
        );
        
        if (accumulatedDistance + segmentDistance >= distanceTraveled) {
            // Current position is within this segment
            const distanceIntoSegment = distanceTraveled - accumulatedDistance;
            const segmentProgress = distanceIntoSegment / segmentDistance;
            
            // Linear interpolation
            return {
                latitude: from.latitude + (to.latitude - from.latitude) * segmentProgress,
                longitude: from.longitude + (to.longitude - from.longitude) * segmentProgress
            };
        }
        
        accumulatedDistance += segmentDistance;
    }
    
    // Fallback to last waypoint
    const lastWaypoint = waypoints[waypoints.length - 1];
    return { latitude: lastWaypoint.latitude, longitude: lastWaypoint.longitude };
}
