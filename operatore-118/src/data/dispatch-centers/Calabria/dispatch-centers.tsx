import type { DispatchCenter } from '../../../model/region';
import { DC_CALABRIA_NORD } from './NORD/dispatch-center';
import { DC_CALABRIA_SUD } from './SUD/dispatch-center';

/**
 * Dispatch centers for Calabria region
 */
export const CALABRIA_DISPATCH_CENTERS: DispatchCenter[] = [
    DC_CALABRIA_NORD,
    DC_CALABRIA_SUD
];
