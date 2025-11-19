#!/usr/bin/env node
/// <reference types="node" />
/**
 * CLI tool to import vehicles from a JSON file into a dispatch center's vehicles.tsx file
 * 
 * Usage:
 *   npm run import-vehicles -- <json-file-path> <dispatch-center-path>
 *   
 * Example:
 *   npm run import-vehicles -- ../Lombardia/src/data/mezzi_srl.json Lombardia/SRL
 * 
 * The script loads the JSON file and converts it to TypeScript Vehicle objects.
 */

import { readFile, writeFile, access } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Base directory for dispatch centers */
const DISPATCH_CENTERS_DIR = join(__dirname, '..', 'src', 'data', 'dispatch-centers');

interface VehicleJson {
  "Nome Postazione": string;
  "Coordinate Postazione": string;
  "Mezzo": string;
  "Nome radio": string;
  "Convenzione": string;
  "Orario di lavoro": string;
  "Giorni": string;
}

interface VehicleData {
  stationName: string;
  stationCoordinatesString: string;
  vehicleType: string;
  radioName: string;
  convention: string;
  workingHours: string;
  days: string;
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
  
  // Check that vehicles.tsx exists
  const vehiclesFilePath = join(fullPath, 'vehicles.tsx');
  try {
    await access(vehiclesFilePath);
  } catch {
    throw new Error(`vehicles.tsx not found in dispatch center: ${dcPath}`);
  }
  
  return fullPath;
}

/**
 * Reads and parses the vehicles JSON file
 * 
 * @param jsonFilePath - Path to the JSON file (can be relative or absolute)
 * @returns Array of vehicle data
 * @throws Error if file cannot be read or parsed
 */
async function readVehiclesFromJson(jsonFilePath: string): Promise<VehicleData[]> {
  try {
    const resolvedPath = resolve(jsonFilePath);
    const content = await readFile(resolvedPath, 'utf-8');
    const records = JSON.parse(content) as VehicleJson[];
    
    if (!Array.isArray(records)) {
      throw new Error('JSON file must contain an array of vehicles');
    }
    
    const vehicles: VehicleData[] = [];
    
    for (const record of records) {
      if (!record["Nome Postazione"] || !record["Coordinate Postazione"] || 
          !record["Mezzo"] || !record["Nome radio"] || !record["Convenzione"] ||
          !record["Orario di lavoro"] || !record["Giorni"]) {
        console.warn(`⚠️  Skipping incomplete vehicle record:`, record);
        continue;
      }
      
      // Validate vehicle type
      const vehicleType = record["Mezzo"].toUpperCase();
      if (!['MSB', 'MSA1', 'MSA2'].includes(vehicleType)) {
        console.warn(`⚠️  Skipping vehicle with invalid type: ${vehicleType}`);
        continue;
      }
      
      // Validate convention type
      const convention = record["Convenzione"].toUpperCase();
      if (!['H24', 'H12', 'H8', 'GET', 'AGG'].includes(convention)) {
        console.warn(`⚠️  Skipping vehicle with invalid convention: ${convention}`);
        continue;
      }
      
      vehicles.push({
        stationName: record["Nome Postazione"].trim(),
        stationCoordinatesString: record["Coordinate Postazione"].trim(),
        vehicleType,
        radioName: record["Nome radio"].trim(),
        convention,
        workingHours: record["Orario di lavoro"].trim(),
        days: record["Giorni"].trim()
      });
    }
    
    if (vehicles.length === 0) {
      throw new Error('No valid vehicles found in JSON file');
    }
    
    return vehicles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read vehicles JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Reads existing vehicles file and extracts vehicle definitions
 * 
 * @param vehiclesFilePath - Path to vehicles.tsx file
 * @returns Content of the file and existing radio names
 */
async function readExistingVehiclesFile(vehiclesFilePath: string): Promise<{
  content: string;
  existingRadioNames: Set<string>;
  exportArrayName: string;
}> {
  const content = await readFile(vehiclesFilePath, 'utf-8');
  
  // Extract existing radio names
  const radioMatches = content.matchAll(/radioName:\s*['"]([^'"]+)['"]/g);
  const existingRadioNames = new Set<string>();
  for (const match of radioMatches) {
    existingRadioNames.add(match[1]);
  }
  
  // Extract export array name (e.g., "SRL_VEHICLES")
  const exportMatch = content.match(/export const (\w+_VEHICLES):/);
  if (!exportMatch) {
    throw new Error('Could not find vehicles array export in vehicles.tsx');
  }
  
  return {
    content,
    existingRadioNames,
    exportArrayName: exportMatch[1]
  };
}

/**
 * Generates new vehicles file content with imported vehicles
 * 
 * @param existing - Existing file info
 * @param vehicles - Vehicles to import
 * @returns New file content
 */
function generateNewVehiclesFileContent(
  existing: { content: string; existingRadioNames: Set<string>; exportArrayName: string },
  vehicles: VehicleData[]
): string {
  // Filter out vehicles that already exist (based on radio name)
  const vehiclesToAdd = vehicles.filter(vehicle => !existing.existingRadioNames.has(vehicle.radioName));
  
  if (vehiclesToAdd.length === 0) {
    console.log('ℹ All vehicles already exist in the file. No changes made.');
    return existing.content;
  }
  
  // Find the vehicles array in the existing content
  const arrayMatch = existing.content.match(/export const (\w+_VEHICLES): Vehicle\[\] = \[([\s\S]*?)\];/);
  if (!arrayMatch) {
    throw new Error('Could not parse vehicles array');
  }
  
  const arrayName = arrayMatch[1];
  const existingArrayContent = arrayMatch[2].trim();
  
  // Parse existing vehicle objects from the array
  const existingVehicles: string[] = [];
  if (existingArrayContent) {
    // Match vehicle objects in the array (simplified pattern)
    const vehicleObjectRegex = /\{[\s\S]*?radioName:\s*['"][^'"]+['"][\s\S]*?\}/g;
    const matches = existingArrayContent.matchAll(vehicleObjectRegex);
    for (const match of matches) {
      existingVehicles.push(match[0]);
    }
  }
  
  // Generate new vehicle objects
  const newVehicleObjects: string[] = [];
  for (const vehicle of vehiclesToAdd) {
    const escapedStationName = vehicle.stationName.replace(/"/g, '\\"');
    const escapedRadioName = vehicle.radioName.replace(/"/g, '\\"');
    const escapedWorkingHours = vehicle.workingHours.replace(/"/g, '\\"');
    const escapedDays = vehicle.days.replace(/"/g, '\\"');
    
    // Parse coordinates
    const [lat, lon] = vehicle.stationCoordinatesString.split(',').map(s => s.trim());
    
    const vehicleObj = `{
    stationName: "${escapedStationName}",
    stationCoordinates: { latitude: ${lat}, longitude: ${lon} },
    vehicleType: "${vehicle.vehicleType}" as const,
    radioName: "${escapedRadioName}",
    convention: "${vehicle.convention}" as const,
    schedule: {
      workingHours: "${escapedWorkingHours}",
      days: "${escapedDays}"
    }
  }`;
    
    newVehicleObjects.push(vehicleObj);
  }
  
  // Combine all vehicles
  const allVehicles = [...existingVehicles, ...newVehicleObjects];
  
  // Generate new array content
  const newArrayContent = allVehicles.length > 0
    ? `export const ${arrayName}: Vehicle[] = [\n  ${allVehicles.join(',\n  ')}\n];`
    : `export const ${arrayName}: Vehicle[] = [];`;
  
  // Replace the array in the content
  const newContent = existing.content.replace(
    /export const \w+_VEHICLES: Vehicle\[\] = \[[\s\S]*?\];/,
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
    console.error('Usage: npm run import-vehicles -- <json-file-path> <dispatch-center-path>');
    console.error('');
    console.error('Examples:');
    console.error('  npm run import-vehicles -- ../Lombardia/src/data/mezzi_srl.json Lombardia/SRL');
    console.error('  npm run import-vehicles -- ./vehicles.json Veneto/Padova');
    console.error('');
    console.error('The JSON file should have the following structure:');
    console.error('[');
    console.error('  {');
    console.error('    "Nome Postazione": "Station Name",');
    console.error('    "Coordinate Postazione": "45.123,9.456",');
    console.error('    "Mezzo": "MSB",');
    console.error('    "Nome radio": "RADIO_001",');
    console.error('    "Convenzione": "H24",');
    console.error('    "Orario di lavoro": "00:00-00:00",');
    console.error('    "Giorni": "LUN-DOM"');
    console.error('  }');
    console.error(']');
    process.exit(1);
  }
  
  const [jsonFilePath, dcPath] = args;
  
  try {
    console.log(`🔍 Validating dispatch center: ${dcPath}`);
    const dcFullPath = await validateDispatchCenterPath(dcPath);
    
    console.log(`📖 Reading vehicles from JSON file: ${jsonFilePath}`);
    const vehicles = await readVehiclesFromJson(jsonFilePath);
    console.log(`   Found ${vehicles.length} vehicles in JSON file`);
    
    const vehiclesFilePath = join(dcFullPath, 'vehicles.tsx');
    console.log(`📝 Reading existing vehicles file: ${vehiclesFilePath}`);
    const existing = await readExistingVehiclesFile(vehiclesFilePath);
    console.log(`   Found ${existing.existingRadioNames.size} existing vehicles`);
    
    console.log(`✏️  Generating new vehicles file content`);
    const newContent = generateNewVehiclesFileContent(existing, vehicles);
    
    if (newContent === existing.content) {
      console.log('✅ No changes needed');
      return;
    }
    
    console.log(`💾 Writing updated vehicles file`);
    await writeFile(vehiclesFilePath, newContent, 'utf-8');
    
    const newVehiclesCount = vehicles.filter((v: VehicleData) => !existing.existingRadioNames.has(v.radioName)).length;
    console.log(`✅ Successfully imported ${newVehiclesCount} new vehicles to ${dcPath}/vehicles.tsx`);
    
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
