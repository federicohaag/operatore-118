import type { EventDetails } from './eventDetails';

/**
 * Event data structure representing an emergency call event
 */
export type Event = {
    id: string;
    details: EventDetails;
};
