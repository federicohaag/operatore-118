import type { DispatchCenter } from '../../../../model/region';
import { NORD_CITIES } from './cities';

/**
 * CORES NORD dispatch center
 */
export const DC_CORES_NORD: DispatchCenter = {
    id: 'NORD',
    label: 'CORES NORD',
    latitude: 41.9028,
    longitude: 12.4964,
    cities: NORD_CITIES
};
