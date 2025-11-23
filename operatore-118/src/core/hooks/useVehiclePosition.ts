import { useMemo } from 'react';
import type { Mission, Waypoint } from '../../model/mission';
import { MissionStatus } from '../../model/mission';

/**
 * Result of vehicle position calculation
 */
export type VehiclePosition = {
  /** Current latitude */
  latitude: number;
  
  /** Current longitude */
  longitude: number;
  
  /** Progress along current route (0.0 to 1.0) */
  progress: number;
  
  /** Whether vehicle has reached destination */
  arrived: boolean;
};

/**
 * Interpolates a position along a route based on distance traveled
 * 
 * Uses linear interpolation between waypoints to find the current position
 * when a given distance has been traveled along the route.
 * 
 * @param waypoints - Array of waypoints forming the route
 * @param distanceTraveled - Distance traveled in meters
 * @returns Interpolated position and whether destination is reached
 */
function interpolateAlongRoute(
  waypoints: Waypoint[],
  distanceTraveled: number
): { position: Waypoint; arrived: boolean } {
  if (waypoints.length === 0) {
    throw new Error('Cannot interpolate along empty route');
  }
  
  if (waypoints.length === 1) {
    return { position: waypoints[0], arrived: true };
  }
  
  // Calculate cumulative distances along the route
  const segments: { start: Waypoint; end: Waypoint; distance: number; cumulative: number }[] = [];
  let cumulativeDistance = 0;
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i];
    const end = waypoints[i + 1];
    const segmentDistance = haversineDistance(start, end);
    
    segments.push({
      start,
      end,
      distance: segmentDistance,
      cumulative: cumulativeDistance
    });
    
    cumulativeDistance += segmentDistance;
  }
  
  // If traveled beyond total route distance, return final waypoint
  if (distanceTraveled >= cumulativeDistance) {
    return { position: waypoints[waypoints.length - 1], arrived: true };
  }
  
  // Find the segment containing the current position
  for (const segment of segments) {
    const segmentEnd = segment.cumulative + segment.distance;
    
    if (distanceTraveled <= segmentEnd) {
      // Interpolate within this segment
      const distanceIntoSegment = distanceTraveled - segment.cumulative;
      const segmentProgress = segment.distance > 0 ? distanceIntoSegment / segment.distance : 0;
      
      const position: Waypoint = {
        latitude: segment.start.latitude + (segment.end.latitude - segment.start.latitude) * segmentProgress,
        longitude: segment.start.longitude + (segment.end.longitude - segment.start.longitude) * segmentProgress
      };
      
      return { position, arrived: false };
    }
  }
  
  // Fallback (should not reach here)
  return { position: waypoints[waypoints.length - 1], arrived: true };
}

/**
 * Calculates distance between two points using Haversine formula
 * 
 * @param a - First waypoint
 * @param b - Second waypoint
 * @returns Distance in meters
 */
function haversineDistance(a: Waypoint, b: Waypoint): number {
  const R = 6371000; // Earth radius in meters
  const lat1 = a.latitude * Math.PI / 180;
  const lat2 = b.latitude * Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  
  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  
  return R * c;
}

/**
 * Calculates current vehicle position based on mission route and simulation time
 * 
 * This hook derives the vehicle's current position without requiring continuous
 * Redux updates. The position is calculated on each render based on:
 * - Mission route waypoints (persisted in Redux)
 * - Route start time (persisted in Redux)
 * - Current simulation time (updated periodically in Redux)
 * - Vehicle speed (persisted in Redux)
 * 
 * The calculation uses the formula:
 * distanceTraveled = (currentSimTime - routeStartedAt) * (speed / 3.6)
 * 
 * Where speed is converted from km/h to m/s by dividing by 3.6.
 * 
 * @param mission - Mission object containing route and timing information
 * @param currentSimTime - Current simulation time in milliseconds
 * @returns Current vehicle position, progress, and arrival status.
 *          Returns undefined if mission has no active route.
 * 
 * @example
 * ```tsx
 * function VehicleMarker({ mission }: { mission: Mission }) {
 *   const simTime = useAppSelector(selectSimulationTime);
 *   const position = useVehiclePosition(mission, simTime);
 *   
 *   if (!position) return null;
 *   
 *   return (
 *     <Marker position={[position.latitude, position.longitude]}>
 *       <Popup>Progress: {(position.progress * 100).toFixed(0)}%</Popup>
 *     </Marker>
 *   );
 * }
 * ```
 */
export function useVehiclePosition(
  mission: Mission,
  currentSimTime: number
): VehiclePosition | undefined {
  return useMemo(() => {
    // Only calculate position for missions with active routes
    if (!mission.route || mission.route.waypoints.length === 0) {
      return undefined;
    }
    
    // Get destination (last waypoint)
    const destination = mission.route.waypoints[mission.route.waypoints.length - 1];
    
    // For stationary missions (on scene, at hospital, or completed), return the destination
    if (mission.status === MissionStatus.ON_SCENE || 
        mission.status === MissionStatus.ON_HOSPITAL ||
        mission.status === MissionStatus.FREE_ON_HOSPITAL ||
        mission.status === MissionStatus.COMPLETED) {
      return {
        latitude: destination.latitude,
        longitude: destination.longitude,
        progress: 1.0,
        arrived: true
      };
    }
    
    // Calculate elapsed time in milliseconds
    const elapsedMs = currentSimTime - mission.route.startedAt;
    const elapsedSeconds = elapsedMs / 1000;
    
    // Calculate distance traveled
    // speed is in km/h, convert to m/s: km/h / 3.6 = m/s
    const speedMps = mission.speed / 3.6;
    const distanceTraveled = speedMps * elapsedSeconds;
    
    // Calculate progress (0.0 to 1.0)
    const progress = mission.route.totalDistance > 0 
      ? Math.min(distanceTraveled / mission.route.totalDistance, 1.0)
      : 1.0;
    
    // Interpolate position along waypoints
    const { position, arrived } = interpolateAlongRoute(
      mission.route.waypoints,
      distanceTraveled
    );
    
    return {
      latitude: position.latitude,
      longitude: position.longitude,
      progress,
      arrived
    };
  }, [mission, currentSimTime]);
}

/**
 * Estimates arrival time for a mission in progress
 * 
 * Calculates the estimated simulation time when the vehicle will reach
 * its destination based on remaining distance and current speed.
 * 
 * @param mission - Mission with active route
 * @param currentSimTime - Current simulation time in milliseconds
 * @returns Estimated arrival time in milliseconds, or undefined if no active route
 * 
 * @example
 * ```tsx
 * const eta = useEstimatedArrival(mission, simTime);
 * if (eta) {
 *   const remainingMs = eta - simTime;
 *   const remainingMinutes = Math.ceil(remainingMs / 60000);
 *   return <span>ETA: {remainingMinutes} min</span>;
 * }
 * ```
 */
export function useEstimatedArrival(
  mission: Mission,
  currentSimTime: number
): number | undefined {
  return useMemo(() => {
    if (!mission.route || 
        mission.status === MissionStatus.ON_SCENE ||
        mission.status === MissionStatus.ON_HOSPITAL ||
        mission.status === MissionStatus.FREE_ON_HOSPITAL ||
        mission.status === MissionStatus.COMPLETED) {
      return undefined;
    }
    
    // Calculate elapsed time
    const elapsedMs = currentSimTime - mission.route.startedAt;
    const elapsedSeconds = elapsedMs / 1000;
    
    // Calculate distance traveled
    const speedMps = mission.speed / 3.6;
    const distanceTraveled = speedMps * elapsedSeconds;
    
    // Calculate remaining distance
    const remainingDistance = Math.max(0, mission.route.totalDistance - distanceTraveled);
    
    // Calculate remaining time
    const remainingSeconds = speedMps > 0 ? remainingDistance / speedMps : 0;
    const remainingMs = remainingSeconds * 1000;
    
    return currentSimTime + remainingMs;
  }, [mission, currentSimTime]);
}
