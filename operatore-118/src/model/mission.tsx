/**
 * Represents an emergency mission with assigned resources and operational status
 * 
 * A Mission is created from an Event and tracks the operational response,
 * including assigned vehicle, personnel, and mission lifecycle status.
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
};
