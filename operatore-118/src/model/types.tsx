export const RegionStatus = {
    Available: 'available',
    Unavailable: 'unavailable',
    WorkInProgress: 'work-in-progress'
} as const;

export type RegionStatus = typeof RegionStatus[keyof typeof RegionStatus];

export type Region = {
    id: string;
    label: string;
    status: RegionStatus;
    dispatchCenters?: DispatchCenter[];
}

export type DispatchCenter = {
    id: string;
    label: string;
}