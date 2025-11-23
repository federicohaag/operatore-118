/**
 * Valid event types for simulation events
 */
export const EventType = {
  /** Emergency call received */
  CALL_RECEIVED: "CALL_RECEIVED",
  /** Mission dispatch (vehicle starts traveling) */
  MISSION_DISPATCH: "MISSION_DISPATCH"
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

/**
 * Persisted scheduled event for page reload recovery
 * 
 * Stores minimal data needed to recreate a SimEvent after page reload.
 * The handler function is not persisted - it's recreated based on type.
 */
export interface PersistedSimEvent {
  id: string;
  scheduledTime: number;
  type: EventType;
  payload: any;
}
