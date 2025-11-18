import type { DispatchCenter } from '../../../model/region';
import { DC_118_EMILIA_OVEST } from './EmiliaOvest/dispatch-center';
import { DC_118_EMILIA_EST } from './EmiliaEst/dispatch-center';
import { DC_118_ROMAGNA } from './Romagna/dispatch-center';

/**
 * Dispatch centers for Emilia-Romagna region
 */
export const EMILIA_ROMAGNA_DISPATCH_CENTERS: DispatchCenter[] = [
    DC_118_EMILIA_OVEST,
    DC_118_EMILIA_EST,
    DC_118_ROMAGNA
];
