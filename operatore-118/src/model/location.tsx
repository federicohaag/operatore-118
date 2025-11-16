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

export type Address = {
    street: string;
    number: string;
    city: string;
    latitude: number;
    longitude: number;
}

export type Location = {
    address: Address;
    type: LocationType;
}

