import type { DispatchCenter } from '../../../../model/region';
import { SRM_CITIES } from './cities';
import { SRM_VEHICLES } from './vehicles';

/**
 * SOREU Metropolitana dispatch center
 */
export const DC_SOREU_METROPOLITANA: DispatchCenter = {
    id: 'SRM',
    label: 'SOREU Metropolitana',
    latitude: 45.4642,
    longitude: 9.1900,
    cities: SRM_CITIES,
    vehicles: SRM_VEHICLES
};
