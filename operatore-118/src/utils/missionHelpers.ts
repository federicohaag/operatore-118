import type { Event } from '../model/event';
import type { Mission } from '../model/mission';

/**
 * Finds a vehicle's current mission across all events
 * 
 * @param vehicleId Vehicle ID to search for
 * @param events Array of all events
 * @returns The mission if found, undefined otherwise
 */
export function findVehicleMission(
    vehicleId: string,
    events: Event[]
): Mission | undefined {
    for (const event of events) {
        const mission = event.missions.find(m => m.vehicleId === vehicleId);
        if (mission) {
            return mission;
        }
    }
    return undefined;
}

/**
 * Gets mission status information for a vehicle
 * 
 * @param vehicleId Vehicle ID to get status for
 * @param events Array of all events
 * @returns Object with status string and number, or null if no mission
 */
export function getVehicleMissionStatus(
    vehicleId: string,
    events: Event[]
): { status: string; statusNumber: number } | null {
    const mission = findVehicleMission(vehicleId, events);
    if (!mission) {
        return null;
    }
    
    const statusNumber = getMissionStatusNumber(mission.status);
    return { status: mission.status, statusNumber };
}

/**
 * Converts mission status string to numeric code
 * 
 * @param status Mission status string
 * @returns Numeric status code (0-7)
 */
export function getMissionStatusNumber(status: string): number {
    switch (status) {
        case 'mission_received': return 0;
        case 'traveling_to_scene': return 1;
        case 'on_scene': return 2;
        case 'traveling_to_hospital': return 3;
        case 'on_hospital': return 4;
        case 'free_on_hospital': return 5;
        case 'returning_to_station': return 6;
        case 'completed': return 7;
        default: return 0;
    }
}

/**
 * Gets Italian label for mission status
 * 
 * @param status Mission status string
 * @returns Italian description of the status
 */
export function getMissionStatusLabel(status: string): string {
    switch (status) {
        case 'mission_received': return '0: Missione ricevuta';
        case 'traveling_to_scene': return '1: In viaggio verso il luogo';
        case 'on_scene': return '2: Sul luogo';
        case 'traveling_to_hospital': return '3: In viaggio verso ospedale';
        case 'on_hospital': return '4: In ospedale';
        case 'free_on_hospital': return '5: Libero in ospedale';
        case 'returning_to_station': return '6: Ritorno alla base';
        case 'completed': return '7: Completata';
        default: return 'Sconosciuto';
    }
}
