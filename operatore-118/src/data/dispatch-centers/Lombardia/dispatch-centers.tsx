import type { DispatchCenter } from '../../../model/region';
import { DC_SOREU_ALPINA } from './SRA/dispatch-center';
import { DC_SOREU_LAGHI } from './SRL/dispatch-center';
import { DC_SOREU_METROPOLITANA } from './SRM/dispatch-center';
import { DC_SOREU_PIANURA } from './SRP/dispatch-center';

/**
 * Dispatch centers for Lombardia region
 */
export const LOMBARDIA_DISPATCH_CENTERS: DispatchCenter[] = [
    DC_SOREU_ALPINA,
    DC_SOREU_LAGHI,
    DC_SOREU_METROPOLITANA,
    DC_SOREU_PIANURA
];
