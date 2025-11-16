# Address Generator Refactoring Summary

## Overview

The AddressGenerator has been refactored to use pre-generated address data files instead of making API calls at runtime. This improves performance, reliability, and allows offline operation.

## What Changed

### Before
- AddressGenerator fetched addresses from Overpass API at runtime
- First call was slow while waiting for API response
- Required internet connection
- Risk of API rate limiting or failures

### After
- AddressGenerator loads addresses from local JSON files
- Instant initialization (just file loading)
- Works completely offline
- No API dependencies at runtime

## New Architecture

### 1. CLI Tool (`scripts/fetch-addresses.ts`)
- Standalone Node.js script to fetch addresses from OpenStreetMap
- Queries Overpass API with proper rate limiting
- Deduplicates addresses for better spatial diversity
- Saves clean JSON files to `src/data/addresses/`

### 2. Data Files (`src/data/addresses/`)
- One JSON file per city (e.g., `como.json`, `varese.json`)
- Contains array of Address objects with complete data
- Version controlled for consistent development

### 3. Refactored AddressGenerator
- Loads addresses from JSON files via dynamic imports
- Synchronous `getRandomAddress()` after initialization
- No network dependencies

## File Structure

```
operatore-118/
├── scripts/
│   └── fetch-addresses.ts          # CLI tool to fetch addresses
├── src/
│   ├── data/
│   │   └── addresses/
│   │       ├── README.md           # Documentation
│   │       ├── .gitkeep
│   │       ├── como.json           # Address data for Como
│   │       └── varese.json         # Address data for Varese
│   └── core/
│       └── AddressGenerator.ts     # Refactored to load from files
└── package.json                    # Added fetch-addresses script
```

## How to Use

### 1. Generate Address Data (One-Time Setup)

```bash
cd operatore-118
npm run fetch-addresses -- Como Varese Milano
```

This creates JSON files in `src/data/addresses/`.

### 2. Use in Application

```typescript
const generator = new AddressGenerator({ cities: ['Como', 'Varese'] });
await generator.initialize();  // Load JSON files
const address = generator.getRandomAddress();  // Synchronous!
```

### 3. Console Debugging

When running in development mode, you can inspect addresses in the browser console:

```javascript
__addressGenerator.getCachedAddresses('Como')
__addressGenerator.getAllCachedAddresses()
__addressGenerator.getTotalCachedAddressCount()
```

## Benefits

1. **Performance**: No API latency, instant address generation
2. **Reliability**: No network failures or rate limiting
3. **Offline**: Works without internet connection
4. **Reproducibility**: Same addresses across all environments
5. **Control**: Full control over address quality and quantity

## Migration Notes

### Code Changes Required

The main code change is that `initialize()` must be called before using the generator:

```typescript
// Before
const address = await generator.getRandomAddress();

// After
await generator.initialize();  // Call once
const address = generator.getRandomAddress();  // Now synchronous
```

### Data Generation

Before deploying or developing, generate address files:

```bash
npm run fetch-addresses -- Como Varese
```

Commit the generated JSON files to git so all developers have the same data.

## CLI Tool Details

### Usage

```bash
npm run fetch-addresses -- <city1> <city2> ...
```

### Example

```bash
npm run fetch-addresses -- Como Varese Milano Roma
```

### Output

```
Fetching addresses for Como...
  Received 100 elements
  Processed: 100 valid, 0 skipped, 3 duplicates removed, 97 unique
  Saved to como.json
  ✓ Successfully fetched 97 addresses for Como
```

### Features

- Fetches from OpenStreetMap Overpass API
- Deduplicates by coordinates (removes 5a, 5b, 5c at same building)
- Deduplicates by address string (removes duplicate city/street/number)
- Prefers simple numeric house numbers
- 2-second delay between requests (rate limiting)
- Pretty JSON formatting

## Deduplication Logic

The tool applies two levels of deduplication:

1. **Coordinate-based**: Removes addresses at the same location (e.g., 5a, 5b, 5c)
2. **Address string-based**: Removes duplicate city/street/number combinations

This ensures better spatial diversity when generating random addresses.

## Dependencies Added

- `tsx`: TypeScript execution for the CLI tool (added to devDependencies)

## Files Modified

1. `src/core/AddressGenerator.ts` - Refactored to load from files
2. `src/core/CallGenerator.ts` - Updated to use synchronous getRandomAddress()
3. `src/components/game/Game.tsx` - Added initialize() call
4. `package.json` - Added tsx dependency and fetch-addresses script
5. `docs/AddressGenerator.md` - Updated documentation

## Files Created

1. `scripts/fetch-addresses.ts` - CLI tool
2. `src/data/addresses/README.md` - Data directory documentation
3. `src/data/addresses/como.json` - Sample address data
