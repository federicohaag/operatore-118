import type { DispatchCenter } from '../../../model/region';
import { DC_118_FOGGIA } from './FG/dispatch-center';
import { DC_118_BARI } from './BA/dispatch-center';
import { DC_118_BRINDISI } from './BR/dispatch-center';
import { DC_118_LECCE } from './LE/dispatch-center';

/**
 * Dispatch centers for Puglia region
 */
export const PUGLIA_DISPATCH_CENTERS: DispatchCenter[] = [
    DC_118_FOGGIA,
    DC_118_BARI,
    DC_118_BRINDISI,
    DC_118_LECCE
];
