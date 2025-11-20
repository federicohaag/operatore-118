import type { EventDetails } from './eventDetails';
import type { Mission } from './mission';
import type { Call } from './call';

/**
 * Represents a complete emergency call event with all associated details
 * 
 * An Event combines a unique identifier with comprehensive mission details
 * collected during the emergency call intake process. The details include
 * triage codes, location information, patient condition, and coordinated
 * response with other emergency services (fire brigade, police).
 */
export type Event = {
    /** Unique identifier for the emergency event */
    id: string;
    
    /** The call that originated this event */
    call: Call;
    
    /** Complete mission details including triage, location, symptoms, and coordination */
    details: EventDetails;
    
    /** Missions assigned to this event */
    missions: Mission[];
    
    /** Timestamp when the event was created (milliseconds since epoch) */
    createdAt: number;
};
