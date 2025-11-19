/**
 * Type of emergency medical vehicle based on equipment and medical personnel
 * 
 * Italian 118 system classifies vehicles by their medical capabilities:
 * - MSB: Basic Life Support ambulance (Mezzo di Soccorso di Base)
 * - MSA1: Advanced Life Support ambulance with nurse (Mezzo di Soccorso Avanzato 1)
 * - MSA2: Advanced Life Support ambulance with doctor (Mezzo di Soccorso Avanzato 2)
 */
export const VehicleType = {
    /** Basic Life Support ambulance with EMTs */
    MSB: 'MSB',
    
    /** Advanced Life Support ambulance with nurse */
    MSA1: 'MSA1',
    
    /** Advanced Life Support ambulance with doctor */
    MSA2: 'MSA2'
} as const;

export type VehicleType = typeof VehicleType[keyof typeof VehicleType];

/**
 * Convention type indicating the operational agreement for the vehicle
 * 
 * Defines the contractual arrangement and operational hours:
 * - H24: 24-hour continuous operation
 * - H12: 12-hour operation
 * - H8: 8-hour operation
 * - GET: On-demand/guaranteed emergency time
 * - AGG: Additional/supplementary vehicle
 */
export const ConventionType = {
    /** 24-hour continuous operation */
    H24: 'H24',
    
    /** 12-hour operation */
    H12: 'H12',
    
    /** 8-hour operation */
    H8: 'H8',
    
    /** On-demand/guaranteed emergency time */
    GET: 'GET',
    
    /** Additional/supplementary vehicle */
    AGG: 'AGG'
} as const;

export type ConventionType = typeof ConventionType[keyof typeof ConventionType];

/**
 * Working schedule for a vehicle
 * 
 * Defines operational hours and days of service.
 * The schedule format varies based on convention type and may include
 * multiple time ranges and specific day patterns.
 */
export type WorkingSchedule = {
    /** Working hours in format "HH:MM-HH:MM" or multiple ranges */
    workingHours: string;
    
    /** 
     * Days of operation
     * 
     * Can be:
     * - "LUN-DOM" (Monday-Sunday)
     * - "LUN-SAB" (Monday-Saturday)
     * - Specific days like "LUN,MER,VEN,SAB"
     * - "SAB-DOM" (Saturday-Sunday)
     * - "RANDOM" for irregular schedules
     */
    days: string;
};

/**
 * Geographic coordinates for a vehicle station location
 */
export type Coordinates = {
    /** Latitude in decimal degrees */
    latitude: number;
    
    /** Longitude in decimal degrees */
    longitude: number;
};

/**
 * Represents a vehicle station location
 */
export type Station = {
    /** Name of the station */
    name: string;
    
    /** Geographic coordinates of the station */
    coordinates: Coordinates;
};

/**
 * Represents an emergency vehicle stationed at a specific location
 * 
 * Vehicles are the primary response resources in the 118 system. Each vehicle
 * is assigned to a station (postazione) operated by a volunteer organization
 * or public service provider, with defined operational hours and capabilities
 * based on its type (MSB, MSA1, MSA2).
 */
export type Vehicle = {
    /** Station where the vehicle is based */
    station: Station;
    
    /** Type of vehicle indicating medical capabilities */
    vehicleType: VehicleType;
    
    /** Radio callsign for communication */
    radioName: string;
    
    /** Convention type defining operational agreement */
    convention: ConventionType;
    
    /** Working schedule defining operational hours and days */
    schedule: WorkingSchedule;
};

/**
 * Parses a coordinate string in format "latitude,longitude" to Coordinates object
 * 
 * @param coordinateString Comma-separated latitude,longitude string
 * @returns Coordinates object with numeric latitude and longitude
 * @throws Error if the coordinate string format is invalid
 */
export function parseCoordinates(coordinateString: string): Coordinates {
    const parts = coordinateString.split(',');
    if (parts.length !== 2) {
        throw new Error(`Invalid coordinate format: ${coordinateString}`);
    }
    
    const latitude = parseFloat(parts[0].trim());
    const longitude = parseFloat(parts[1].trim());
    
    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error(`Invalid coordinate values: ${coordinateString}`);
    }
    
    return { latitude, longitude };
}

/**
 * Formats coordinates to a string in format "latitude,longitude"
 * 
 * @param coordinates Coordinates object to format
 * @returns Comma-separated coordinate string
 */
export function formatCoordinates(coordinates: Coordinates): string {
    return `${coordinates.latitude},${coordinates.longitude}`;
}

/**
 * Extracts unique stations from a list of vehicles
 * 
 * Multiple vehicles can be stationed at the same location. This function
 * deduplicates stations by name and returns a unique list.
 * 
 * @param vehicles Array of vehicles to extract stations from
 * @returns Array of unique stations with their coordinates
 */
export function extractStations(vehicles: Vehicle[]): Station[] {
    const stationsMap = new Map<string, Station>();
    
    vehicles.forEach(vehicle => {
        if (!stationsMap.has(vehicle.station.name)) {
            stationsMap.set(vehicle.station.name, vehicle.station);
        }
    });
    
    return Array.from(stationsMap.values());
}
