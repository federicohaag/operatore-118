import type { DispatchCenter } from '../../../model/region';
import { DC_118_IMPERIA } from './ASL1/dispatch-center';
import { DC_118_SAVONA } from './ASL2/dispatch-center';
import { DC_118_GENOVA } from './ASL3/dispatch-center';
import { DC_118_TIGULLIO } from './ASL4/dispatch-center';
import { DC_118_LA_SPEZIA } from './ASL5/dispatch-center';

/**
 * Dispatch centers for Liguria region
 */
export const LIGURIA_DISPATCH_CENTERS: DispatchCenter[] = [
    DC_118_IMPERIA,
    DC_118_SAVONA,
    DC_118_GENOVA,
    DC_118_TIGULLIO,
    DC_118_LA_SPEZIA
];
