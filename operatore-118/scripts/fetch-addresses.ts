#!/usr/bin/env node
/// <reference types="node" />
/**
 * CLI tool to fetch addresses from OpenStreetMap Overpass API
 * and save them to JSON files for offline use.
 * 
 * Usage:
 *   npm run fetch-addresses -- Como Varese Milano
 *   npm run fetch-addresses -- --all
 */

import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Address } from '../src/model/location';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Overpass API endpoint */
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';

/** Timeout for API requests (30 seconds) */
const TIMEOUT_MS = 30000;

/** Output directory for address JSON files */
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data', 'addresses');

/**
 * Builds an Overpass QL query to fetch addresses for a single city.
 * 
 * @param city - City name (Italian comune) to query
 * @returns Overpass QL query string
 */
function buildOverpassQuery(city: string): string {
  const safeCityName = city.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `
    [out:json][timeout:25];
    // Search for ${city} comune (municipality) boundary
    (
      area["name"="${city}"]["admin_level"="8"]["boundary"="administrative"];
      area["name:it"="${city}"]["admin_level"="8"]["boundary"="administrative"];
    )->.searchArea_${safeCityName};
    // Get addresses within the comune boundary
    (
      node(area.searchArea_${safeCityName})["addr:street"]["addr:housenumber"];
      way(area.searchArea_${safeCityName})["addr:street"]["addr:housenumber"];
    );
    out center 100;
  `;
}

/**
 * Fetches addresses for a single city from the Overpass API.
 * 
 * @param city - City name to fetch addresses for
 * @returns Array of addresses
 */
async function fetchAddressesForCity(city: string): Promise<Address[]> {
  const query = buildOverpassQuery(city);
  
  console.log(`Fetching addresses for ${city}...`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Overpass API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`  Received ${data.elements?.length || 0} elements`);
    
    const addresses = parseOverpassResponse(data, city);
    
    console.log(`  Parsed ${addresses.length} unique addresses`);
    
    return addresses;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Overpass API request timed out for city: ${city}`);
      }
      throw new Error(`Failed to fetch addresses for ${city}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Parses the Overpass API JSON response into Address objects.
 * 
 * @param data - Raw JSON response from Overpass API
 * @param city - City name to use for all addresses
 * @returns Array of parsed and deduplicated Address objects
 */
function parseOverpassResponse(data: any, city: string): Address[] {
  if (!data.elements || !Array.isArray(data.elements)) {
    console.warn(`  No elements in API response for ${city}`);
    return [];
  }
  
  const addresses: Address[] = [];
  let skippedDueToMissingData = 0;
  
  for (const element of data.elements) {
    const tags = element.tags || {};
    
    const street = tags['addr:street'];
    const number = tags['addr:housenumber'];
    
    // Get coordinates from node or way center
    let lat = element.lat;
    let lon = element.lon;
    
    // For ways, coordinates are in the center object
    if (!lat && element.center) {
      lat = element.center.lat;
      lon = element.center.lon;
    }
    
    // Only include if we have all required fields
    if (street && number && lat !== undefined && lon !== undefined) {
      addresses.push({
        street,
        number,
        city,
        latitude: lat,
        longitude: lon,
      });
    } else {
      skippedDueToMissingData++;
    }
  }
  
  // Deduplicate addresses
  const deduplicated = deduplicateAddresses(addresses);
  const duplicatesRemoved = addresses.length - deduplicated.length;
  
  console.log(
    `  Processed: ${addresses.length} valid, ${skippedDueToMissingData} skipped, ` +
    `${duplicatesRemoved} duplicates removed, ${deduplicated.length} unique`
  );
  
  return deduplicated;
}

/**
 * Deduplicates addresses by their coordinates and street/number combination.
 * 
 * @param addresses - Array of addresses to deduplicate
 * @returns Array of unique addresses
 */
function deduplicateAddresses(addresses: Address[]): Address[] {
  const coordinateMap = new Map<string, Address>();
  const addressMap = new Map<string, Address>();
  
  for (const address of addresses) {
    // Round coordinates to 6 decimal places (~11cm precision)
    const lat = address.latitude.toFixed(6);
    const lon = address.longitude.toFixed(6);
    const coordKey = `${lat},${lon}`;
    
    // Check for duplicate city/street/number combinations
    const addressKey = `${address.city}|${address.street}|${address.number}`;
    
    const existingByCoord = coordinateMap.get(coordKey);
    const existingByAddress = addressMap.get(addressKey);
    
    // Skip if we already have this exact address (city/street/number)
    if (existingByAddress) {
      continue;
    }
    
    if (!existingByCoord) {
      coordinateMap.set(coordKey, address);
      addressMap.set(addressKey, address);
    } else {
      // If we have duplicates by coordinates, prefer simpler house numbers
      const currentIsNumeric = /^\d+$/.test(address.number);
      const existingIsNumeric = /^\d+$/.test(existingByCoord.number);
      
      if (currentIsNumeric && !existingIsNumeric) {
        // Prefer numeric over letters
        const oldAddressKey = `${existingByCoord.city}|${existingByCoord.street}|${existingByCoord.number}`;
        addressMap.delete(oldAddressKey);
        coordinateMap.set(coordKey, address);
        addressMap.set(addressKey, address);
      }
    }
  }
  
  return Array.from(addressMap.values());
}

/**
 * Saves addresses to a JSON file.
 * 
 * @param city - City name
 * @param addresses - Array of addresses to save
 */
async function saveAddressesToFile(city: string, addresses: Address[]): Promise<void> {
  // Create safe filename
  const filename = city.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.json';
  const filepath = join(OUTPUT_DIR, filename);
  
  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });
  
  // Write JSON file with nice formatting
  await writeFile(filepath, JSON.stringify(addresses, null, 2), 'utf-8');
  
  console.log(`  Saved to ${filename}`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npm run fetch-addresses -- <city1> <city2> ...');
    console.error('Example: npm run fetch-addresses -- Como Varese Milano');
    process.exit(1);
  }
  
  const cities = args;
  
  console.log(`Fetching addresses for ${cities.length} cities: ${cities.join(', ')}\n`);
  
  for (const city of cities) {
    try {
      const addresses = await fetchAddressesForCity(city);
      
      if (addresses.length === 0) {
        console.error(`  ⚠️  No addresses found for ${city}`);
      } else {
        await saveAddressesToFile(city, addresses);
        console.log(`  ✓ Successfully fetched ${addresses.length} addresses for ${city}`);
      }
    } catch (error) {
      console.error(`  ✗ Error fetching ${city}:`, error instanceof Error ? error.message : error);
    }
    
    console.log('');
    
    // Add delay between requests to be respectful to the API
    if (cities.indexOf(city) < cities.length - 1) {
      console.log('  Waiting 2 seconds before next request...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
