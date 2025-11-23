import type { Waypoint, Route } from '../model/mission';

/**
 * Fetch a route between two waypoints using OSRM (fallbacks to straight line).
 *
 * @param from Starting waypoint {latitude, longitude}
 * @param to Destination waypoint {latitude, longitude}
 * @param startedAt Simulation time when the route starts
 * @returns Route with `waypoints[]`, `totalDistance` (meters) and `startedAt`
 */
export async function fetchRoute(
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
