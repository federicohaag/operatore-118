/**
 * Type of location where the emergency occurred
 */
export const LocationType = {
    /** Emergency at a residential location (home, apartment) */
    House: 'house',
    
    /** Emergency on a street or roadway */
    Street: 'street',
} as const;

export type LocationType = typeof LocationType[keyof typeof LocationType];

/**
 * Italian city/comune identification
 */
export type City = {
    /** City name */
    name: string;
    /** ISTAT code (Italian National Institute of Statistics) */
    istat: string;
    /** Population of the city */
    population: number;
}

export type Address = {
    street: string;
    number: string;
    city: City;
    latitude: number;
    longitude: number;
}

export type Location = {
    address: Address;
    type: LocationType;
}

