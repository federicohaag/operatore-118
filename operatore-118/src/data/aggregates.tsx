import type { Region } from "../model/region";
import type { Hospital } from "../model/hospital";
import * as regions from './regions';
import * as hospitals from './dispatch-centers/Lombardia/hospitals';

export const REGIONS: Region[] = Object.values(regions);

export const HOSPITALS: Hospital[] = Object.values(hospitals);
