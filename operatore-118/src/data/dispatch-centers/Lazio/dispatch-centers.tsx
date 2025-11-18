import type { DispatchCenter } from '../../../model/region';
import { DC_CORES_NORD } from './NORD/dispatch-center';
import { DC_CORES_METRO } from './METRO/dispatch-center';
import { DC_CORES_SUD } from './SUD/dispatch-center';

/**
 * Dispatch centers for Lazio region
 */
export const LAZIO_DISPATCH_CENTERS: DispatchCenter[] = [
    DC_CORES_NORD,
    DC_CORES_METRO,
    DC_CORES_SUD
];
