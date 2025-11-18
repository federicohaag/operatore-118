import type { DispatchCenter } from '../../../../model/region';
import { METRO_CITIES } from './cities';

/**
 * CORES METROPOLITANA dispatch center
 */
export const DC_CORES_METRO: DispatchCenter = {
    id: 'METRO',
    label: 'CORES METROPOLITANA',
    latitude: 41.9028,
    longitude: 12.4964,
    cities: METRO_CITIES
};
