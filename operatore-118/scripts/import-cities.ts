#!/usr/bin/env node
/// <reference types="node" />
/**
 * CLI tool to import cities from popolazione.csv into a dispatch center's cities.tsx file
 * 
 * Usage:
 *   npm run import-cities -- <dispatch-center-path> <province1> [province2] [province3] ...
 *   
 * Example:
 *   npm run import-cities -- Lombardia/SRL COMO VARESE
 *   npm run import-cities -- Veneto/Padova PADOVA
 * 
 * The script loads popolazione.csv and filters cities by the specified province names.
 */

import { readFile, writeFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Base directory for dispatch centers */
const DISPATCH_CENTERS_DIR = join(__dirname, '..', 'src', 'data', 'dispatch-centers');

/** Path to popolazione.csv */
const POPOLAZIONE_CSV_PATH = join(__dirname, '..', 'popolazione.csv');

interface CityRow {
  name: string;
  istat: string;
  population: number;
}

/**
 * Validates that the dispatch center path exists
 * 
 * @param dcPath - Relative path to dispatch center (e.g., "Lombardia/SRL")
 * @returns Absolute path to the dispatch center directory
 * @throws Error if path doesn't exist
 */
async function validateDispatchCenterPath(dcPath: string): Promise<string> {
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
  
  return fullPath;
}

/**
 * Reads and parses popolazione.csv file, filtering by provinces
 * 
 * @param provinces - Array of province names to filter by (case-insensitive)
 * @returns Array of city rows matching the provinces
 * @throws Error if file cannot be read or parsed or if provinces don't exist
 */
async function readCitiesFromPopolazione(provinces: string[]): Promise<CityRow[]> {
  try {
    const content = await readFile(POPOLAZIONE_CSV_PATH, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Normalize province names for comparison
    const normalizedProvinces = provinces.map(p => p.toUpperCase());
    
    // First pass: collect all provinces in the CSV to validate requested provinces
    const availableProvinces = new Set<string>();
    for (const record of records) {
      const row = record as any;
      const provincia = row.PROVINCIA?.toUpperCase();
      if (provincia) {
        availableProvinces.add(provincia);
      }
    }
    
    // Validate that all requested provinces exist
    const missingProvinces = normalizedProvinces.filter(p => !availableProvinces.has(p));
    if (missingProvinces.length > 0) {
      throw new Error(
        `Province(s) not found in popolazione.csv: ${missingProvinces.join(', ')}\n` +
        `Available provinces: ${Array.from(availableProvinces).sort().join(', ')}`
      );
    }
    
    const cities: CityRow[] = [];
    
    for (const record of records) {
      const row = record as any;
      
      // The CSV has: DATA_ELABORAZIONE,REGIONE,PROVINCIA,COD_ISTAT_COMUNE,COMUNE,RESIDENTI
      const provincia = row.PROVINCIA?.toUpperCase();
      const comune = row.COMUNE;
      const codIstat = row.COD_ISTAT_COMUNE;
      const residenti = row.RESIDENTI;
      
      if (!provincia || !comune || !codIstat || !residenti) {
        continue; // Skip malformed rows
      }
      
      // Filter by province
      if (!normalizedProvinces.includes(provincia)) {
        continue;
      }
      
      // Validate ISTAT code
      if (!/^\d+$/.test(codIstat)) {
        console.warn(`⚠️  Skipping ${comune}: Invalid ISTAT code ${codIstat}`);
        continue;
      }
      
      // Pad ISTAT code to 6 digits
      const istat = codIstat.padStart(6, '0');
      
      // Parse population
      const population = parseInt(residenti, 10);
      if (isNaN(population) || population < 0) {
        console.warn(`⚠️  Skipping ${comune}: Invalid population ${residenti}`);
        continue;
      }
      
      cities.push({
        name: comune,
        istat,
        population
      });
    }
    
    if (cities.length === 0) {
      throw new Error(`No cities found for provinces: ${provinces.join(', ')}`);
    }
    
    return cities;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read popolazione.csv: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Reads existing cities file and extracts city definitions
 * 
 * @param citiesFilePath - Path to cities.tsx file
 * @returns Content of the file and existing ISTAT codes
 */
async function readExistingCitiesFile(citiesFilePath: string): Promise<{
  content: string;
  existingIstats: Set<string>;
  exportArrayName: string;
}> {
  const content = await readFile(citiesFilePath, 'utf-8');
  
  // Extract existing ISTAT codes
  const istatMatches = content.matchAll(/istat:\s*['"](\d{6})['"]/g);
  const existingIstats = new Set<string>();
  for (const match of istatMatches) {
    existingIstats.add(match[1]);
  }
  
  // Extract export array name (e.g., "SRL_CITIES")
  const exportMatch = content.match(/export const (\w+_CITIES):/);
  if (!exportMatch) {
    throw new Error('Could not find cities array export in cities.tsx');
  }
  
  return {
    content,
    existingIstats,
    exportArrayName: exportMatch[1]
  };
}

/**
 * Generates new cities file content with imported cities
 * 
 * @param existing - Existing file info
 * @param cities - Cities to import
 * @param dcId - Dispatch center ID (not used, kept for compatibility)
 * @returns New file content
 */
function generateNewCitiesFileContent(
  existing: { content: string; existingIstats: Set<string>; exportArrayName: string },
  cities: CityRow[],
  dcId: string
): string {
  // Filter out cities that already exist
  const citiesToAdd = cities.filter(city => !existing.existingIstats.has(city.istat));
  
  if (citiesToAdd.length === 0) {
    console.log('ℹ All cities already exist in the file. No changes made.');
    return existing.content;
  }
  
  // Find the cities array in the existing content
  const arrayMatch = existing.content.match(/export const (\w+_CITIES): City\[\] = \[([\s\S]*?)\];/);
  if (!arrayMatch) {
    throw new Error('Could not parse cities array');
  }
  
  const arrayName = arrayMatch[1];
  const existingArrayContent = arrayMatch[2].trim();
  
  // Parse existing city objects from the array
  const existingCities: string[] = [];
  if (existingArrayContent) {
    // Match city objects in the array
    const cityObjectRegex = /\{\s*name:\s*"[^"]*"\s*,\s*istat:\s*"\d{6}"(?:\s*,\s*population:\s*\d+)?\s*\}/g;
    const matches = existingArrayContent.matchAll(cityObjectRegex);
    for (const match of matches) {
      existingCities.push(match[0]);
    }
  }
  
  // Generate new city objects
  const newCityObjects: string[] = [];
  for (const city of citiesToAdd) {
    const escapedName = city.name.replace(/"/g, '\\"');
    newCityObjects.push(
      `{ name: "${escapedName}", istat: "${city.istat}", population: ${city.population} }`
    );
  }
  
  // Combine all cities
  const allCities = [...existingCities, ...newCityObjects];
  
  // Generate new array content
  const newArrayContent = allCities.length > 0
    ? `export const ${arrayName}: City[] = [\n  ${allCities.join(',\n  ')}\n];`
    : `export const ${arrayName}: City[] = [];`;
  
  // Replace the array in the content
  const newContent = existing.content.replace(
    /export const \w+_CITIES: City\[\] = \[[\s\S]*?\];/,
    newArrayContent
  );
  
  return newContent;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: npm run import-cities -- <dispatch-center-path> <comma-separated-provinces>');
    console.error('');
    console.error('Provinces must be comma-separated to support names with spaces.');
    console.error('');
    console.error('Examples:');
    console.error('  npm run import-cities -- Lombardia/SRL "COMO,VARESE,LECCO,MONZA E DELLA BRIANZA"');
    console.error('  npm run import-cities -- Veneto/Padova "PADOVA"');
    console.error('  npm run import-cities -- Lazio/Roma "ROMA"');
    console.error('');
    console.error('The script loads popolazione.csv and filters by province names.');
    process.exit(1);
  }
  
  const [dcPath, provincesArg] = args;
  
  // Parse comma-separated provinces
  const provinces = provincesArg.split(',').map(p => p.trim()).filter(p => p);
  
  if (provinces.length === 0) {
    console.error('❌ Error: No provinces specified');
    process.exit(1);
  }
  
  try {
    console.log(`🔍 Validating dispatch center: ${dcPath}`);
    const dcFullPath = await validateDispatchCenterPath(dcPath);
    
    console.log(`📖 Reading popolazione.csv for provinces: ${provinces.join(', ')}`);
    const cities = await readCitiesFromPopolazione(provinces);
    console.log(`   Found ${cities.length} cities in specified provinces`);
    
    const citiesFilePath = join(dcFullPath, 'cities.tsx');
    console.log(`📝 Reading existing cities file: ${citiesFilePath}`);
    const existing = await readExistingCitiesFile(citiesFilePath);
    console.log(`   Found ${existing.existingIstats.size} existing cities`);
    
    console.log(`✏️  Generating new cities file content`);
    const newContent = generateNewCitiesFileContent(existing, cities, dcPath);
    
    if (newContent === existing.content) {
      console.log('✅ No changes needed');
      return;
    }
    
    console.log(`💾 Writing updated cities file`);
    await writeFile(citiesFilePath, newContent, 'utf-8');
    
    const newCitiesCount = cities.filter((c: CityRow) => !existing.existingIstats.has(c.istat)).length;
    console.log(`✅ Successfully imported ${newCitiesCount} new cities to ${dcPath}/cities.tsx`);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error(`❌ Unknown error:`, error);
    }
    process.exit(1);
  }
}

main();
