#!/usr/bin/env node
/// <reference types="node" />
/**
 * CLI tool to import cities from a CSV file into a dispatch center's cities.tsx file
 * 
 * Usage:
 *   npm run import-cities -- <dispatch-center-path> <csv-file>
 *   
 * Example:
 *   npm run import-cities -- Lombardia/SRL cities.csv
 *   npm run import-cities -- Veneto/Padova cities.csv
 * 
 * CSV Format:
 *   name,istat
 *   Como,013075
 *   Varese,012133
 */

import { readFile, writeFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Base directory for dispatch centers */
const DISPATCH_CENTERS_DIR = join(__dirname, '..', 'src', 'data', 'dispatch-centers');

interface CityRow {
  name: string;
  istat: string;
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
 * Reads and parses CSV file
 * 
 * @param csvPath - Path to CSV file
 * @returns Array of city rows
 * @throws Error if file cannot be read or parsed
 */
async function readCsvFile(csvPath: string): Promise<CityRow[]> {
  try {
    const content = await readFile(csvPath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Validate required columns and normalize ISTAT codes
    for (const record of records) {
      const row = record as any;
      // Handle potential BOM or whitespace in column names
      const nameKey = Object.keys(row).find(k => k.trim().toLowerCase().includes('name'));
      const istatKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'istat');
      
      if (!nameKey || !istatKey || !row[nameKey] || !row[istatKey]) {
        throw new Error('CSV must have "name" and "istat" columns');
      }
      
      // Normalize the keys if needed
      if (nameKey !== 'name') {
        row.name = row[nameKey];
        delete row[nameKey];
      }
      if (istatKey !== 'istat') {
        row.istat = row[istatKey];
        delete row[istatKey];
      }
      
      if (!/^\d+$/.test(row.istat)) {
        throw new Error(`Invalid ISTAT code: ${row.istat} (must contain only digits)`);
      }
      if (row.istat.length > 6) {
        throw new Error(`Invalid ISTAT code: ${row.istat} (must be 6 digits or less)`);
      }
      // Pad ISTAT code with leading zeros to make it 6 digits
      row.istat = row.istat.padStart(6, '0');
    }
    
    return records as CityRow[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read CSV file: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Extracts dispatch center ID from path
 * 
 * @param dcPath - Dispatch center path (e.g., "Lombardia/SRL")
 * @returns Dispatch center ID (e.g., "SRL")
 */
function getDispatchCenterId(dcPath: string): string {
  const parts = dcPath.split('/');
  return parts[parts.length - 1];
}

/**
 * Generates city constant name from city name and dispatch center ID
 * 
 * @param cityName - Name of the city
 * @param dcId - Dispatch center ID
 * @returns Constant name (e.g., "SRL_COMO")
 */
function generateCityConstantName(cityName: string, dcId: string): string {
  // Convert city name to uppercase and replace spaces/special chars with underscore
  const sanitizedName = cityName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  return `${dcId}_${sanitizedName}`;
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
 * @param dcId - Dispatch center ID
 * @returns New file content
 */
function generateNewCitiesFileContent(
  existing: { content: string; existingIstats: Set<string>; exportArrayName: string },
  cities: CityRow[],
  dcId: string
): string {
  const newCities: string[] = [];
  const cityConstants: string[] = [];
  
  // Filter out cities that already exist
  const citiesToAdd = cities.filter(city => !existing.existingIstats.has(city.istat));
  
  if (citiesToAdd.length === 0) {
    console.log('ℹ All cities already exist in the file. No changes made.');
    return existing.content;
  }
  
  // Generate city constant definitions
  for (const city of citiesToAdd) {
    const constName = generateCityConstantName(city.name, dcId);
    cityConstants.push(constName);
    // Use double quotes and escape any double quotes in the city name
    const escapedName = city.name.replace(/"/g, '\\"');
    newCities.push(
      `export const ${constName}: City = { name: "${escapedName}", istat: "${city.istat}" };`
    );
  }
  
  // Find where to insert new city definitions (before the cities array export)
  const arrayExportMatch = existing.content.match(new RegExp(`export const ${existing.exportArrayName}:`));
  if (!arrayExportMatch || arrayExportMatch.index === undefined) {
    throw new Error('Could not find cities array export location');
  }
  
  // Split content at the array export
  const beforeArray = existing.content.substring(0, arrayExportMatch.index);
  const arrayAndAfter = existing.content.substring(arrayExportMatch.index);
  
  // Insert new city definitions
  let newContent = beforeArray.trimEnd() + '\n';
  if (newCities.length > 0) {
    newContent += '\n' + newCities.join('\n') + '\n';
  }
  
  // Update the cities array to include new cities
  // Find the array content
  const arrayMatch = arrayAndAfter.match(/export const \w+_CITIES: City\[\] = \[([\s\S]*?)\];/);
  if (!arrayMatch) {
    throw new Error('Could not parse cities array');
  }
  
  const existingArrayContent = arrayMatch[1].trim();
  const existingCityRefs = existingArrayContent
    ? existingArrayContent.split(',').map(s => s.trim()).filter(s => s)
    : [];
  
  const allCityRefs = [...existingCityRefs, ...cityConstants];
  
  // Generate new array
  const newArray = allCityRefs.length > 0
    ? `export const ${existing.exportArrayName}: City[] = [\n  ${allCityRefs.join(',\n  ')}\n];`
    : `export const ${existing.exportArrayName}: City[] = [];`;
  
  newContent += '\n' + newArray + '\n';
  
  return newContent;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: npm run import-cities -- <dispatch-center-path> <csv-file>');
    console.error('');
    console.error('Example:');
    console.error('  npm run import-cities -- Lombardia/SRL cities.csv');
    console.error('  npm run import-cities -- Veneto/Padova cities.csv');
    process.exit(1);
  }
  
  const [dcPath, csvPath] = args;
  
  try {
    console.log(`🔍 Validating dispatch center: ${dcPath}`);
    const dcFullPath = await validateDispatchCenterPath(dcPath);
    const dcId = getDispatchCenterId(dcPath);
    
    console.log(`📖 Reading CSV file: ${csvPath}`);
    const cities = await readCsvFile(csvPath);
    console.log(`   Found ${cities.length} cities in CSV`);
    
    const citiesFilePath = join(dcFullPath, 'cities.tsx');
    console.log(`📝 Reading existing cities file: ${citiesFilePath}`);
    const existing = await readExistingCitiesFile(citiesFilePath);
    console.log(`   Found ${existing.existingIstats.size} existing cities`);
    
    console.log(`✏️  Generating new cities file content`);
    const newContent = generateNewCitiesFileContent(existing, cities, dcId);
    
    if (newContent === existing.content) {
      console.log('✅ No changes needed');
      return;
    }
    
    console.log(`💾 Writing updated cities file`);
    await writeFile(citiesFilePath, newContent, 'utf-8');
    
    const newCitiesCount = cities.filter(c => !existing.existingIstats.has(c.istat)).length;
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
