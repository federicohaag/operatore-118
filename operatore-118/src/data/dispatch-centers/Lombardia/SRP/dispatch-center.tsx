import type { DispatchCenter } from '../../../../model/region';
import { SRP_CITIES } from './cities';

/**
 * SOREU Pianura dispatch center
 */
export const DC_SOREU_PIANURA: DispatchCenter = {
    id: 'SRP',
    label: 'SOREU Pianura',
    latitude: 45.4642,
    longitude: 9.1900,
    cities: SRP_CITIES
};
