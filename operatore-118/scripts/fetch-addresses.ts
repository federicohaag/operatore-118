#!/usr/bin/env node
/// <reference types="node" />
/**
 * CLI tool to fetch addresses from OpenStreetMap Overpass API
 * and save them to JSON files for offline use.
 * 
 * Usage:
 *   npm run fetch-addresses -- <dispatch-center-path>
 *   npm run fetch-addresses -- Lombardia/SRL
 *   npm run fetch-addresses -- Veneto/Padova
 * 
 * Features:
 * - Skips cities that already have address files
 * - 5-second delay between API calls to respect rate limits
 * - Can be stopped and resumed without losing progress
 */

import { writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Address, City } from '../src/model/location';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Overpass API endpoint */
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';

/** Timeout for API requests (30 seconds) */
const TIMEOUT_MS = 30000;

/** Delay between API calls (5 seconds) */
const API_DELAY_MS = 5000;

/** Base directory for dispatch centers */
const DISPATCH_CENTERS_DIR = join(__dirname, '..', 'src', 'data', 'dispatch-centers');

/** Directory for addresses (now global, not per dispatch center) */
const ADDRESSES_DIR = join(__dirname, '..', 'src', 'data', 'addresses');

/**
 * Validates that the dispatch center path exists and has cities
 * 
 * @param dcPath - Relative path to dispatch center (e.g., "Lombardia/SRL")
 * @returns Object with dispatch center info
 * @throws Error if path doesn't exist or has no cities
 */
async function validateAndLoadDispatchCenter(dcPath: string): Promise<{
  fullPath: string;
  cities: City[];
}> {
  const fullPath = join(DISPATCH_CENTERS_DIR, dcPath);
  try {
    await access(fullPath);
  } catch {
    throw new Error(`Dispatch center path not found: ${dcPath}\nPath checked: ${fullPath}`);
  }
  // Check that cities.tsx exists
  const citiesFilePath = join(fullPath, 'cities.tsx');
  try {
    await access(citiesFilePath);
  } catch {
    throw new Error(`cities.tsx not found in dispatch center: ${dcPath}`);
  }
  // Dynamically import cities
  const citiesModule = await import(citiesFilePath);
  // Find the cities array export
  const citiesArrayKey = Object.keys(citiesModule).find(key => key.endsWith('_CITIES'));
  if (!citiesArrayKey) {
    throw new Error(`No cities array found in ${dcPath}/cities.tsx`);
  }
  const cities: City[] = citiesModule[citiesArrayKey];
  if (!Array.isArray(cities) || cities.length === 0) {
    throw new Error(`No cities found in ${dcPath}/cities.tsx`);
  }
  // Ensure addresses directory exists
  await mkdir(ADDRESSES_DIR, { recursive: true });
  return { fullPath, cities };
}

/**
 * Checks if address file already exists for a city
 * 
 * @param addressesDir - Path to addresses directory
 * @param istatCode - ISTAT code of the city
 * @returns True if file exists, false otherwise
 */
async function addressFileExists(istatCode: string): Promise<boolean> {
  const filepath = join(ADDRESSES_DIR, `${istatCode}.json`);
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds an Overpass QL query to fetch addresses for a city by ISTAT code.
 * 
 * @param istatCode - 6-digit ISTAT code for the city
 * @param limit - Maximum number of results (0 = no limit)
 * @returns Overpass QL query string
 */
function buildOverpassQueryByIstat(istatCode: string, limit = 0): string {
  // ISTAT comune codes are 6 digits; keep it as a string to preserve leading zeros
  if (!/^\d{6}$/.test(istatCode)) {
    throw new Error("istatCode must be a 6-digit string (leading zeros allowed).");
  }

  const ts = Date.now(); // cache buster for Overpass mirrors
  const limitClause = limit > 0 ? ` ${limit}` : "";

  return `
[out:json][timeout:60];
// ts=${ts}

// Scope to Italy to avoid collisions
area["ISO3166-1"="IT"]->.it;

// Find the admin boundary relation for the comune by ISTAT code.
// We check the most common tag and a few variants seen in the wild.
(
  rel(area.it)["boundary"="administrative"]["admin_level"="8"]["ref:ISTAT"="${istatCode}"];
  rel(area.it)["boundary"="administrative"]["admin_level"="8"]["ISTAT"="${istatCode}"];
  rel(area.it)["boundary"="administrative"]["admin_level"="8"]["istat:code"="${istatCode}"];
  rel(area.it)["boundary"="administrative"]["admin_level"="8"]["ref:ISTAT:Comune"="${istatCode}"];
)->.rels;

// Convert relation(s) to area(s) for containment queries
.rels map_to_area->.a;

// // DEBUG: verify we matched the right boundary
// .rels out tags qt;
// area.a out ids;

// Addresses inside the comune area (nodes and building ways)
(
  node(area.a)["addr:street"]["addr:housenumber"];
  way(area.a )["addr:street"]["addr:housenumber"];
)->.addr;

// Return tags + centroid; no fixed cap unless 'limit' > 0
.addr out tags center${limitClause};
`;
}

/**
 * Fetches addresses for a single city from the Overpass API.
 * 
 * @param city - City object with name and ISTAT code
 * @returns Array of addresses
 */
async function fetchAddressesForCity(city: City): Promise<Address[]> {
  const query = buildOverpassQueryByIstat(city.istat);
  
  console.log(`Fetching addresses for ${city.name} (ISTAT: ${city.istat})...`);
  
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
        throw new Error(`Overpass API request timed out for city: ${city.name}`);
      }
      throw new Error(`Failed to fetch addresses for ${city.name}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Parses the Overpass API JSON response into Address objects.
 * 
 * @param data - Raw JSON response from Overpass API
 * @param city - City object with name and ISTAT code
 * @returns Array of parsed and deduplicated Address objects
 */
function parseOverpassResponse(data: any, city: City): Address[] {
  if (!data.elements || !Array.isArray(data.elements)) {
    console.warn(`  No elements in API response for ${city.name}`);
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
    const addressKey = `${address.city.istat}|${address.street}|${address.number}`;
    
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
        const oldAddressKey = `${existingByCoord.city.istat}|${existingByCoord.street}|${existingByCoord.number}`;
        addressMap.delete(oldAddressKey);
        coordinateMap.set(coordKey, address);
        addressMap.set(addressKey, address);
      }
    }
  }
  
  return Array.from(addressMap.values());
}

/**
 * Saves addresses to a JSON file using ISTAT code as filename.
 * 
 * @param addressesDir - Directory to save addresses in
 * @param istatCode - ISTAT code for the city
 * @param addresses - Array of addresses to save
 */
async function saveAddressesToFile(istatCode: string, addresses: Address[]): Promise<void> {
  // Use ISTAT code as filename
  const filename = `${istatCode}.json`;
  const filepath = join(ADDRESSES_DIR, filename);
  
  // Write JSON file with nice formatting
  await writeFile(filepath, JSON.stringify(addresses, null, 2), 'utf-8');
  
  console.log(`  💾 Saved to ${filename}`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.error('Usage: npm run fetch-addresses -- <dispatch-center-path>');
    console.error('');
    console.error('Examples:');
    console.error('  npm run fetch-addresses -- Lombardia/SRL');
    console.error('  npm run fetch-addresses -- Veneto/Padova');
    console.error('');
    console.error('The script will:');
    console.error('  - Fetch addresses for all cities in the dispatch center');
    console.error('  - Skip cities that already have address files');
    console.error('  - Wait 5 seconds between API calls');
    console.error('  - Can be stopped and resumed without losing progress');
    process.exit(1);
  }
  
  const dcPath = args[0];
  
  try {
    console.log(`🔍 Loading dispatch center: ${dcPath}\n`);
    
    const { cities } = await validateAndLoadDispatchCenter(dcPath);
    
    console.log(`📋 Found ${cities.length} cities\n`);
    console.log(`📂 Addresses will be saved to: ${ADDRESSES_DIR}\n`);
    
    let processed = 0;
    let skipped = 0;
    let failed = 0;
    let successful = 0;
    
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      const progress = `[${i + 1}/${cities.length}]`;
      
      console.log(`${progress} ${city.name} (ISTAT: ${city.istat})`);
      
      // Check if file already exists
      const exists = await addressFileExists(city.istat);
      if (exists) {
        console.log(`  ⏭️  Skipped - address file already exists\n`);
        skipped++;
        continue;
      }
      
      try {
        const addresses = await fetchAddressesForCity(city);
        
        if (addresses.length === 0) {
          console.log(`  ⚠️  No addresses found\n`);
          // Still save empty array to mark as processed
          await saveAddressesToFile(city.istat, addresses);
        } else {
          await saveAddressesToFile(city.istat, addresses);
          console.log(`  ✅ Successfully fetched ${addresses.length} addresses\n`);
          successful++;
        }
        
        processed++;
        
        // Add delay between requests (except for last city)
        if (i < cities.length - 1) {
          console.log(`  ⏱️  Waiting ${API_DELAY_MS / 1000} seconds before next request...\n`);
          await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
        }
      } catch (error) {
        console.error(`  ❌ Error:`, error instanceof Error ? error.message : error);
        console.log('');
        failed++;
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   Total cities: ${cities.length}`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📝 Processed this run: ${processed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (failed > 0) {
      console.log('\n💡 Tip: You can re-run the script to retry failed cities.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
