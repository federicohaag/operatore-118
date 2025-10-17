/**
 * Type of location where the emergency occurred
 * 
 * Categorizes emergencies by their location type to help with resource
 * allocation and response planning.
 */
export const LocationType = {
    /** Emergency at a residential location (home, apartment) */
    House: 'house',
    
    /** Emergency on a street or roadway */
    Street: 'street',
    
    /** Emergency in a public place (school, office, commercial area, etc.) */
    PublicPlace: 'public-place'
} as const;

export type LocationType = typeof LocationType[keyof typeof LocationType];

/**
 * Represents an emergency call received by the dispatch center
 * 
 * Each call contains the caller's description, the correct medical assessment
 * codes (feedback), and the simulation time when it was received.
 */
export type Call = {
    /** Unique identifier for the call */
    id: string;
    
    /** Text description of the emergency as reported by the caller */
    text: string;
    
    /** Type of location where the emergency occurred */
    locationType: LocationType;
    
    /** Geographic latitude of the emergency location */
    latitude: number;
    
    /** Geographic longitude of the emergency location */
    longitude: number;
    
    /** Correct medical assessment codes for this emergency */
    feedback: Feedback;
    
    /** Simulation time in milliseconds when the call was received */
    receivedAt: number;
}

/**
 * Medical assessment for an emergency call
 */
export type Feedback = {
    msb: string;
    msa1: string;
    msa2: string;
}

/**
 * Template for generating emergency calls with varying severity levels
 * 
 * Contains the base emergency description and three sets of feedback codes
 * corresponding to different severity scenarios (stable, medium, critical).
 * The game randomly selects which severity to use when generating a call.
 */
export type CallTemplate = {
    /** Description of the emergency scenario */
    text: string;
    
    /** Type of location where the emergency occurs */
    locationType: LocationType;
    
    /** Medical assessment codes for a stable/non-urgent case */
    stableCaseFeedback: Feedback;
    
    /** Medical assessment codes for a medium urgency case */
    mediumCaseFeedback: Feedback;
    
    /** Medical assessment codes for a critical/high urgency case */
    criticalCaseFeedback: Feedback;
}
