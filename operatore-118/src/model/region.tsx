import type { Hospital } from './hospital';
import type { City } from './location';
import type { Vehicle } from './vehicle';

/**
 * Status of a region's implementation in the simulation
 * 
 * Indicates whether the region is fully implemented and playable ('available'),
 * not yet implemented ('unavailable'), or currently under development ('work-in-progress').
 */
export const RegionStatus = {
    /** Region is fully implemented and available for play */
    Available: 'available',
    
    /** Region is not yet implemented */
    Unavailable: 'unavailable',
    
    /** Region is currently being developed */
    WorkInProgress: 'work-in-progress'
} as const;

export type RegionStatus = typeof RegionStatus[keyof typeof RegionStatus];

/**
 * Represents an Italian region in the emergency dispatch system
 * 
 * Each region contains one or more dispatch centers (centrali operative) that
 * coordinate emergency responses, along with the hospitals within that region.
 * Regions model the territorial organization of Italy's 118 emergency medical
 * service system.
 */
export type Region = {
    /** Unique identifier for the region */
    id: string;
    
    /** Display name of the region (e.g., "Lombardia", "Lazio") */
    label: string;
    
    /** Implementation status of this region in the simulation */
    status: RegionStatus;
    
    /** 
     * Dispatch centers (centrali operative) within this region
     * 
     * Optional as some regions may not have dispatch centers configured yet.
     * Each dispatch center coordinates emergency resources for its coverage area.
     */
    dispatchCenters?: DispatchCenter[];
    
    /** Hospitals within this region available for patient transport */
    hospitals: Hospital[];
}

/**
 * Represents a 118 dispatch center (centrale operativa)
 * 
 * Dispatch centers are the coordination hubs for emergency medical services
 * within their coverage area. They receive emergency calls, dispatch ambulances
 * and other resources, and coordinate with hospitals for patient transport.
 */
export type DispatchCenter = {
    /** Unique identifier for the dispatch center */
    id: string;
    
    /** Display name of the dispatch center */
    label: string;
    
    /** Geographic latitude of the dispatch center location */
    latitude: number;
    
    /** Geographic longitude of the dispatch center location */
    longitude: number;
    
    /** List of cities covered by this dispatch center */
    cities: City[];
    
    /** List of emergency vehicles assigned to this dispatch center */
    vehicles: Vehicle[];
}
