# AddressGenerator

A utility for generating random addresses from Italian cities using pre-loaded OpenStreetMap data.

## Overview

The `AddressGenerator` class loads real street addresses with geographic coordinates from JSON files. The address data is fetched from OpenStreetMap using a separate CLI tool, allowing the app to work offline and load instantly without API calls.

## Features

- ✅ Loads addresses from pre-generated JSON files
- ✅ Returns complete address information (street, number, city, coordinates)
- ✅ Fast initialization with no API calls
- ✅ Works offline
- ✅ Deduplication for better spatial diversity
- ✅ TypeScript support with full type definitions

## Installation

The AddressGenerator is part of the core utilities in `/src/core/AddressGenerator.ts`.

Address data files are stored in `/src/data/addresses/` and must be generated using the CLI tool.

## Generating Address Data

Before using the AddressGenerator, you need to fetch address data from OpenStreetMap:

```bash
# Fetch addresses for one or more cities
npm run fetch-addresses -- Como Varese Milano

# The script will create JSON files in src/data/addresses/
# como.json, varese.json, milano.json
```

The fetch script:
- Queries OpenStreetMap's Overpass API
- Deduplicates addresses (by coordinates and address string)
- Saves clean JSON files ready for use
- Adds a 2-second delay between requests to respect API rate limits

## Usage

### Basic Usage

```typescript
import { AddressGenerator } from './src/core/AddressGenerator';

// Create a generator for one or more cities
const generator = new AddressGenerator({
  cities: ['Como', 'Varese']
});

// Initialize (loads JSON files)
await generator.initialize();

// Get a random address (synchronous after initialization)
const address = generator.getRandomAddress();

console.log(address);
// Output:
// {
//   street: "Via Giuseppe Garibaldi",
//   number: "15",
//   city: "Como",
//   latitude: 45.8094,
//   longitude: 9.0859
// }
```

### Configuration Options

```typescript
const generator = new AddressGenerator({
  cities: ['Como', 'Varese']           // Required: array of city names
});

// Must call initialize() before using
await generator.initialize();
```

**Important**: You must call `initialize()` once before calling `getRandomAddress()`. After initialization, `getRandomAddress()` is synchronous.

### Cache Management

```typescript
// Check loaded address statistics
const totalLoaded = generator.getTotalCachedAddressCount();
const comoLoaded = generator.getCachedAddressCount('Como');

console.log(`Total addresses loaded: ${totalLoaded}`);
console.log(`Como addresses: ${comoLoaded}`);

// Get all addresses for a city
const comoAddresses = generator.getCachedAddresses('Como');

// Clear cache (requires re-initialization)
generator.clearCache();
```

### Integration with Simulation

The AddressGenerator is integrated with the game simulation to generate realistic emergency locations:

```typescript
import { AddressGenerator } from './src/core/AddressGenerator';
import type { Location } from './src/model/location';

const generator = new AddressGenerator({
  cities: ['Milano', 'Roma', 'Torino']
});

// Generate a random emergency location
async function generateEmergencyLocation(): Promise<Location> {
  const address = await generator.getRandomAddress();
  
  return {
    address,
    type: Math.random() > 0.5 ? 'house' : 'street'
  };
}
```

## API Reference

### Constructor

```typescript
constructor(config: AddressGeneratorConfig)
```

Creates a new AddressGenerator instance.

**Parameters:**
- `config.cities` (string[]): **Required**. Array of city names to fetch addresses from
- `config.overpassEndpoint` (string): Optional. Custom Overpass API endpoint URL (default: `https://overpass-api.de/api/interpreter`)
- `config.timeoutMs` (number): Optional. Request timeout in milliseconds (default: 30000)

**Throws:**
- `Error` if cities array is empty or not provided

### Methods

#### `getRandomAddress(): Promise<Address>`

Gets a random address from the configured cities.

**Returns:** Promise resolving to an `Address` object

**Throws:**
- `Error` if API request fails
- `Error` if no addresses are found
- `Error` if request times out

**Example:**
```typescript
const address = await generator.getRandomAddress();
```

#### `getCachedAddressCount(city: string): number`

Gets the number of cached addresses for a specific city.

**Parameters:**
- `city` (string): City name to check

**Returns:** Number of cached addresses for the city, or 0 if not cached

**Example:**
```typescript
const count = generator.getCachedAddressCount('Milano');
console.log(`Milano has ${count} cached addresses`);
```

#### `getTotalCachedAddressCount(): number`

Gets the total number of cached addresses across all cities.

**Returns:** Total number of cached addresses

**Example:**
```typescript
const total = generator.getTotalCachedAddressCount();
console.log(`Total cached: ${total}`);
```

#### `clearCache(): void`

Clears all cached addresses, forcing fresh API requests on the next call to `getRandomAddress()`.

**Example:**
```typescript
generator.clearCache();
```

## Address Type

The `Address` type (from `/src/model/location.tsx`) has the following structure:

```typescript
type Address = {
  street: string;      // Street name (e.g., "Via Roma")
  number: string;      // House/building number (e.g., "10")
  city: string;        // City name (e.g., "Milano")
  latitude: number;    // Geographic latitude
  longitude: number;   // Geographic longitude
}
```

## How It Works

1. **Query Construction**: The generator builds an Overpass QL query to search for addresses in the specified city
2. **API Request**: Sends a POST request to the Overpass API endpoint
3. **Response Parsing**: Extracts address data (street, number, coordinates) from the API response
4. **Caching**: Stores addresses in memory to avoid repeated API calls
5. **Random Selection**: Randomly selects one address from all cached addresses

### Overpass Query

The generator uses the following Overpass QL query structure:

```
[out:json][timeout:25];
area["name"="<CITY>"]["place"~"city|town"]["admin_level"="8"]->.searchArea;
(
  node(area.searchArea)["addr:street"]["addr:housenumber"];
);
out body 100;
```

This query:
- Finds the city boundary area
- Searches for nodes (points) with address tags
- Returns up to 100 results with coordinates

## Error Handling

The generator handles various error conditions:

- **No cities provided**: Throws error during construction
- **API errors**: Throws descriptive error with HTTP status
- **Timeout**: Throws timeout error after configured duration
- **No addresses found**: Logs warning and throws error if no addresses available

## Limitations

- **API Rate Limits**: The Overpass API has rate limits. The caching mechanism helps minimize requests
- **Result Limit**: Fetches maximum 100 addresses per city to keep response sizes manageable
- **City Name Matching**: City names must match OpenStreetMap data exactly (e.g., "Milano" not "Milan")
- **Data Availability**: Address availability depends on OpenStreetMap coverage in the city

## Testing

The AddressGenerator includes comprehensive tests in `/tests/AddressGenerator.test.ts`:

```bash
npm test -- AddressGenerator.test.ts
```

Tests cover:
- Constructor validation
- Address fetching and caching
- Parallel city fetching
- Error handling
- Cache management
- Response parsing

## Example

See `/address-generator-example.ts` for a complete working example.

## Related

- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Overpass QL Language Guide](https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide)
- OpenStreetMap [addr:* tags](https://wiki.openstreetmap.org/wiki/Key:addr)
