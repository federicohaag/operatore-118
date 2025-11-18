import type { DispatchCenter } from '../../../../model/region';
import { SRA_CITIES } from './cities';

/**
 * SOREU Alpina dispatch center
 */
export const DC_SOREU_ALPINA: DispatchCenter = {
    id: 'SRA',
    label: 'SOREU Alpina',
    latitude: 45.4642,
    longitude: 9.1900,
    cities: SRA_CITIES
};
