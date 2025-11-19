# Dispatch Centers Data Management

This directory contains data for Italian emergency dispatch centers (118), organized by region and dispatch center.

## Directory Structure

```
dispatch-centers/
├── Calabria/
│   ├── Catanzaro/
│   │   ├── dispatch-center.tsx
│   │   ├── cities.tsx
│   │   └── [moved: see src/data/addresses/]
│   └── Cosenza/
│       ├── dispatch-center.tsx
│       ├── cities.tsx
│       └── [moved: see src/data/addresses/]
├── Lombardia/
│   ├── SRL/
│   │   ├── dispatch-center.tsx
│   │   ├── cities.tsx
│   │   └── [moved: see src/data/addresses/]
│   │       ├── 012001.json
│   │       ├── 012002.json
│   │       └── ...
│   └── ...
└── ...
```

Each dispatch center folder contains:
- **`dispatch-center.tsx`** - Dispatch center configuration (name, coordinates, etc.)
- **`cities.tsx`** - List of cities served by this dispatch center
- **`addresses/`** - Address data for each city (JSON files named by ISTAT code) now located at `src/data/addresses/`

## Adding/Updating Cities

To add or update cities for a dispatch center, use the `import-cities` script:

```bash
npm run import-cities -- <RegionName>/<DispatchCenterName> <csv-file>
```

### CSV File Format

The CSV file must have the following columns (column names are case-insensitive):
- **Name** (or Nome, Comune, etc.) - City name
- **ISTAT** (or Codice ISTAT, etc.) - ISTAT code (5 or 6 digits)

Example CSV:
```csv
Nome,Codice ISTAT
Como,13075
Varese,12133
Lecco,97042
```

### Example

```bash
npm run import-cities -- Lombardia/SRL cities.csv
```

This will:
1. Validate the dispatch center exists
2. Parse the CSV file
3. Validate ISTAT codes (pad to 6 digits if needed)
4. Check for duplicates
5. Generate `cities.tsx` with proper TypeScript format
6. Use double quotes to handle apostrophes in city names

### Notes
- ISTAT codes shorter than 6 digits are automatically padded with leading zeros
- Duplicate ISTAT codes are detected and reported
- City names with apostrophes (e.g., "Campione d'Italia") are properly escaped
- The script creates constant names from city names (e.g., `SRL_COMO`, `SRL_CAMPIONE_D_ITALIA`)

## Fetching/Updating Addresses

To fetch or update address data for all cities in a dispatch center, use the `fetch-addresses` script:

```bash
npm run fetch-addresses -- <RegionName>/<DispatchCenterName>
```

### How It Works

The script will:
1. Load all cities from the dispatch center's `cities.tsx` file
2. For each city, query the Overpass API for street addresses
3. Save addresses to `src/data/addresses/<istat-code>.json`
4. Skip cities that already have address files
5. Wait 5 seconds between API calls to avoid overwhelming the API

### Example

```bash
npm run fetch-addresses -- Lombardia/SRL
```

This will fetch addresses for all 422 cities in the SRL dispatch center, creating JSON files like:
- `src/data/addresses/012001.json` - Addresses for ISTAT code 012001
- `src/data/addresses/012002.json` - Addresses for ISTAT code 012002
- etc.

### Features

- **Resumable**: If the script is interrupted, you can restart it and it will skip cities that already have address files
- **Progress tracking**: Shows detailed progress with counts of successful, skipped, and failed operations
- **API-friendly**: 5-second delay between requests to respect Overpass API rate limits
- **Error handling**: Continues processing even if individual cities fail

### Notes

- Address fetching can take a long time for dispatch centers with many cities (e.g., SRL has 422 cities = ~35 minutes)
- The script can be stopped with Ctrl+C and resumed later without losing progress
- Empty address files (zero addresses found) are still saved to mark the city as processed
- Failed cities are reported in the summary and can be retried by deleting their JSON files and re-running

## Adding New Dispatch Centers

**Currently unsupported** - Manual creation required.

To add a new dispatch center:

1. **Create folder structure**:
   ```
   src/data/dispatch-centers/<RegionName>/<DispatchCenterName>/
   ```

2. **Create `dispatch-center.tsx`**:
   ```typescript
   import { DispatchCenter } from "../../../model/dispatchCenter";
   
   export const DISPATCH_CENTER_NAME: DispatchCenter = {
     name: "Dispatch Center Name",
     coordinates: { lat: 45.4642, lng: 9.1900 }
   };
   ```

3. **Create empty `cities.tsx`**:
   ```typescript
   import { City } from "../../../model/city";
   
   export const CITIES: Record<string, City> = {};
   ```

4. **Update region's dispatch centers file** to import and reference the new dispatch center

5. **Use `import-cities` script** to populate cities from a CSV file

6. **Use `fetch-addresses` script** to download address data

### Future Enhancement

A script to automate dispatch center creation is planned but not yet implemented.
