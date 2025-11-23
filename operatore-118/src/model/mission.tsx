import { Codice } from './eventDetails';

/**
 * Current phase of a mission's operational lifecycle
 */
export const MissionStatus = {
    /** Mission created, vehicle assigned but not yet dispatched */
    MISSION_RECEIVED: 'mission_received',
    
    /** Vehicle is traveling from station to event location */
    TRAVELING_TO_SCENE: 'traveling_to_scene',
    
    /** Vehicle has arrived at event location */
    ON_SCENE: 'on_scene',
    
    /** Vehicle is traveling to hospital */
    TRAVELING_TO_HOSPITAL: 'traveling_to_hospital',
    
    /** Vehicle has arrived at hospital */
    ON_HOSPITAL: 'on_hospital',
    
    /** Vehicle is free at hospital (patient handoff complete) */
    FREE_ON_HOSPITAL: 'free_on_hospital',
    
    /** Vehicle is returning to station */
    RETURNING_TO_STATION: 'returning_to_station',
    
    /** Mission completed, vehicle back at station */
    COMPLETED: 'completed'
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];

/**
 * Geographic waypoint in a route
 */
export type Waypoint = {
    /** Latitude in decimal degrees */
    latitude: number;
    
    /** Longitude in decimal degrees */
    longitude: number;
};

/**
 * Route information for vehicle travel
 * 
 * Contains the complete path that a vehicle follows, including
 * waypoints from routing services (e.g., following real streets)
 * and travel metadata for animation calculations.
 */
export type Route = {
    /** 
     * Waypoints forming the complete route path from origin to destination
     * 
     * These points typically come from a routing service (like OSRM or GraphHopper)
     * and represent the actual path along streets, not a straight line.
     * The first waypoint is the origin, the last is the destination.
     */
    waypoints: Waypoint[];
    
    /** 
     * Total route distance in meters
     * 
     * While this could theoretically be calculated from waypoints, it's cached here for performance:
     * - Routing APIs (OSRM, GraphHopper) provide this value for free
     * - useVehiclePosition runs every render (potentially 60 FPS during animations)
     * - Recalculating would require iterating all waypoints with Haversine formula each frame
     * - Storage cost is negligible (one number) vs computational cost of repeated calculation
     * - API-provided distance is more accurate (follows actual roads, not straight-line approximation)
     */
    totalDistance: number;
    
    /** 
     * Simulation time when this route started
     * 
     * Used to calculate vehicle position along the route:
     * progress = (currentSimTime - startedAt) * speed / totalDistance
     */
    startedAt: number;
};

/**
 * Represents an emergency mission with assigned resources and operational status
 * 
 * A Mission is created from an Event and tracks the operational response,
 * including assigned vehicle, personnel, route information, and mission lifecycle status.
 * The route data enables persistent, resumable vehicle animations on the map.
 */
export type Mission = {
    /** Unique identifier for the mission */
    id: string;
    
    /** ID of the assigned vehicle responding to the emergency */
    vehicleId: string;
    
    /** 
     * Creation timestamp of the mission in milliseconds
     * 
     * Represents the simulation time when the mission was created,
     * typically when a vehicle is dispatched to respond to a call.
     */
    createdAt: number;
    
    /** Current status of the mission */
    status: MissionStatus;
    
    /** 
     * Route information for current travel leg
     * 
     * Updated when mission status changes (e.g., from scene to hospital).
     * Undefined when mission is completed or vehicle is on scene.
     */
    route?: Route;
    
    /** 
     * Average travel speed in km/h
     * 
     * Defaults to 50 km/h for emergency vehicles, but can vary based on
     * road conditions, traffic, or urgency level.
     */
    speed: number;
};

const HIGH_PRIORITY_SPEED = 50; // km/h
const MEDIUM_PRIORITY_SPEED = 40; // km/h
const LOW_PRIORITY_SPEED = 30; // km/h

export function calculateMissionSpeed(codice: Codice): number {
    switch (codice) {
        case Codice.ROSSO:
            return HIGH_PRIORITY_SPEED;
        case Codice.GIALLO:
            return MEDIUM_PRIORITY_SPEED;
        case Codice.VERDE:
            return LOW_PRIORITY_SPEED;
        default:
            // Fallback to medium priority speed
            return MEDIUM_PRIORITY_SPEED;
    }
}