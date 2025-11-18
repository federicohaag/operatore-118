import type { City } from '../../../../model/location';

/**
 * City definitions with ISTAT codes for SOREU Laghi
 */

export const COMO: City = { name: 'Como', istat: '013075' };
export const VARESE: City = { name: 'Varese', istat: '012133' };

/**
 * Cities covered by SOREU Laghi dispatch center
 */
export const SRL_CITIES: City[] = [COMO, VARESE];
