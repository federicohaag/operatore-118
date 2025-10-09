import type { Hospital, Region } from "./types";
import * as regions from '../data/regions';
import * as hospitals from '../data/hospitals';

export const REGIONS: Region[] = Object.values(regions);

export const HOSPITALS: Hospital[] = Object.values(hospitals);
