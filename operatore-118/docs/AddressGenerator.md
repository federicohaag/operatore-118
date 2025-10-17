# AddressGenerator

A utility for generating random addresses from Italian cities using OpenStreetMap's Overpass API.

## Overview

The `AddressGenerator` class fetches real street addresses with geographic coordinates from specified Italian cities using the [Overpass API](https://overpass-api.de/). It provides intelligent caching to minimize API calls and supports multiple cities in parallel.

## Features

- ✅ Fetches real addresses from OpenStreetMap data
- ✅ Returns complete address information (street, number, city, coordinates)
- ✅ Intelligent caching to minimize API requests
- ✅ Parallel fetching for multiple cities
- ✅ Configurable timeout settings
- ✅ TypeScript support with full type definitions

## Installation

The AddressGenerator is part of the core utilities in `/src/core/AddressGenerator.ts`.

## Usage

### Basic Usage

```typescript
import { AddressGenerator } from './src/core/AddressGenerator';

// Create a generator for one or more cities
const generator = new AddressGenerator({
  cities: ['Milano', 'Roma', 'Napoli']
});

// Get a random address
const address = await generator.getRandomAddress();

console.log(address);
// Output:
// {
//   street: "Via Roma",
//   number: "10",
//   city: "Milano",
//   latitude: 45.4642,
//   longitude: 9.1900
// }
```

### Configuration Options

```typescript
const generator = new AddressGenerator({
  cities: ['Milano', 'Roma'],           // Required: array of city names
  overpassEndpoint: 'https://...',      // Optional: custom Overpass API endpoint
  timeoutMs: 30000                      // Optional: request timeout in milliseconds (default: 30000)
});
```

### Cache Management

```typescript
// Check cache statistics
const totalCached = generator.getTotalCachedAddressCount();
const milanoCached = generator.getCachedAddressCount('Milano');

console.log(`Total addresses cached: ${totalCached}`);
console.log(`Milano addresses: ${milanoCached}`);

// Clear cache to force refresh
generator.clearCache();
```

### Integration with Simulation

The AddressGenerator can be integrated with the game simulation to generate realistic emergency locations:

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
