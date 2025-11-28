import type { Event } from '../model/event';

type ColorPriority = 'ROSSO' | 'GIALLO' | 'VERDE';

const COLOR_PRIORITY: Record<ColorPriority, number> = {
    'ROSSO': 0,
    'GIALLO': 1,
    'VERDE': 2
};

/**
 * Sorts events by priority code (ROSSO > GIALLO > VERDE) and creation time
 * 
 * Events with higher priority codes (red) come first.
 * Within the same priority, older events come first.
 * 
 * @param events Array of events to sort
 * @returns Sorted array of events
 */
export function sortEventsByPriority(events: Event[]): Event[] {
    return [...events].sort((a, b) => {
        const priorityA = COLOR_PRIORITY[a.details.codice as ColorPriority] ?? 999;
        const priorityB = COLOR_PRIORITY[b.details.codice as ColorPriority] ?? 999;
        
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        
        return a.createdAt - b.createdAt;
    });
}

/**
 * Gets the color for a priority code
 * 
 * @param codice Priority code (ROSSO, GIALLO, VERDE)
 * @returns CSS color value
 */
export function getColorForCodice(codice: string): string {
    switch (codice) {
        case 'ROSSO': return '#e53935';
        case 'GIALLO': return '#ffb300';
        case 'VERDE': return '#4caf50';
        default: return '#888';
    }
}

/**
 * Gets the initial letter for a priority code
 * 
 * @param codice Priority code (ROSSO, GIALLO, VERDE)
 * @returns Single letter code (R, G, V)
 */
export function getCodiceInitial(codice: string): string {
    switch (codice) {
        case 'ROSSO': return 'R';
        case 'GIALLO': return 'G';
        case 'VERDE': return 'V';
        default: return '?';
    }
}
