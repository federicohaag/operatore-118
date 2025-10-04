import type { Hospital, Region } from "./types";
import * as regions from './regions';
import * as hospitals from './hospitals';

export const REGIONS: Region[] = Object.values(regions);

export const HOSPITALS: Hospital[] = Object.values(hospitals);
