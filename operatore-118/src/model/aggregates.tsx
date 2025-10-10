import type { Region } from "./region";
import * as regions from '../data/regions';
import * as hospitals from '../data/hospitals';
import type { Hospital } from "./hospital";

export const REGIONS: Region[] = Object.values(regions);

export const HOSPITALS: Hospital[] = Object.values(hospitals);
