import type { Priority } from './priority';

export const EventType = {
    Medical: 'medical',
    Trauma: 'trauma'
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

export type Event = {
    id: string;
    type: EventType;
    priority: Priority;
}