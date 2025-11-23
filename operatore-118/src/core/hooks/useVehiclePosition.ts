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
 * Compute a mission vehicle's interpolated position at `currentSimTime`.
 *
 * Returns `{ latitude, longitude, progress, arrived }` or `undefined` when
 * the mission has no active route. The result is memoized with `useMemo`.
 *
 * Inputs that affect the result: route waypoints, `route.startedAt`,
 * `route.totalDistance`, `mission.speed`, `mission.status`, and `currentSimTime`.
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
