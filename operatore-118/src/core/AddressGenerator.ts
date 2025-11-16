import type { Address } from '../model/location';

/**
 * Configuration options for AddressGenerator.
 */
export interface AddressGeneratorConfig {
  /** List of city names to search for addresses */
  cities: string[];
  
  /** Overpass API endpoint URL */
  overpassEndpoint?: string;
  
  /** Timeout for Overpass API requests in milliseconds */
  timeoutMs?: number;
}

/**
 * Generates random addresses using OpenStreetMap's Overpass API.
 * 
 * AddressGenerator queries the Overpass API to fetch real street addresses
 * from specified Italian cities. It caches results to minimize API calls
 * and provides random selection from the cached addresses.
 * 
 * Usage:
 * ```typescript
 * const generator = new AddressGenerator({ 
 *   cities: ['Milano', 'Roma', 'Napoli'] 
 * });
 * 
 * const address = await generator.getRandomAddress();
 * ```
 * 
 * The generator fetches addresses from OpenStreetMap data, which includes:
 * - Street name
 * - House number
 * - City name
 * - Geographic coordinates (latitude/longitude)
 * 
 * Caching behavior:
 * - Addresses are cached per city to reduce API calls
 * - Cache is populated on first request for each city
 * - Cache persists for the lifetime of the generator instance
 */
export class AddressGenerator {
  /** Configuration for address generation */
  private config: AddressGeneratorConfig;
  
  /** Cache of addresses by city name */
  private addressCache: Map<string, Address[]> = new Map();
  
  /** Default Overpass API endpoint */
  private static readonly DEFAULT_OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
  
  /** Default timeout for API requests (30 seconds) */
  private static readonly DEFAULT_TIMEOUT_MS = 30000;

  /**
   * Creates a new AddressGenerator instance.
   * 
   * @param config - Configuration for address generation
   */
  constructor(config: AddressGeneratorConfig) {
    this.config = {
      overpassEndpoint: AddressGenerator.DEFAULT_OVERPASS_ENDPOINT,
      timeoutMs: AddressGenerator.DEFAULT_TIMEOUT_MS,
      ...config
    };
    
    if (!this.config.cities || this.config.cities.length === 0) {
      throw new Error('AddressGenerator requires at least one city');
    }
  }

  /**
   * Gets a random address from the configured cities.
   * 
   * If the address cache is empty or needs refreshing, fetches new addresses
   * from the Overpass API. Then randomly selects one address from all cached
   * addresses across all cities.
   * 
   * @returns Promise resolving to a randomly selected Address
   * @throws Error if API request fails or no addresses are found
   */
  async getRandomAddress(): Promise<Address> {
    // Ensure we have addresses cached for all cities
    await this.ensureAddressesCached();
    
    // Collect all addresses from all cities
    const allAddresses: Address[] = [];
    for (const addresses of this.addressCache.values()) {
      allAddresses.push(...addresses);
    }
    
    if (allAddresses.length === 0) {
      const citiesWithNoAddresses = this.config.cities.filter(
        city => this.addressCache.has(city) && this.addressCache.get(city)!.length === 0
      );
      
      if (citiesWithNoAddresses.length > 0) {
        throw new Error(
          `No addresses available. The following cities returned 0 addresses from OpenStreetMap: ${citiesWithNoAddresses.join(', ')}. ` +
          `This likely means the city names don't match OpenStreetMap data or the areas don't have tagged addresses. ` +
          `Consider using different city names or checking OpenStreetMap data availability.`
        );
      }
      
      throw new Error('No addresses available in cache');
    }
    
    // Select a random address
    const randomIndex = Math.floor(Math.random() * allAddresses.length);
    return allAddresses[randomIndex];
  }

  /**
   * Ensures addresses are cached for all configured cities.
   * 
   * Checks which cities don't have cached addresses and fetches them
   * from the Overpass API in a single request to avoid rate limiting.
   * Does not retry fetching for cities that are already cached (even if empty).
   * 
   * @throws Error if any API request fails
   */
  private async ensureAddressesCached(): Promise<void> {
    const citiesToFetch = this.config.cities.filter(
      city => !this.addressCache.has(city)
    );
    
    const cachedCities = this.config.cities.filter(
      city => this.addressCache.has(city)
    );
    
    if (cachedCities.length > 0) {
      console.log(`AddressGenerator: Using cached addresses for cities: ${cachedCities.join(', ')}`);
    }
    
    if (citiesToFetch.length === 0) {
      console.log('AddressGenerator: All cities already cached, no API request needed');
      return;
    }
    
    console.log(`AddressGenerator: Fetching addresses for cities: ${citiesToFetch.join(', ')}`);
    // Fetch addresses for all missing cities in a single request to avoid rate limiting
    await this.fetchAddressesForCities(citiesToFetch);
  }

  /**
   * Fetches addresses for multiple cities from the Overpass API.
   * 
   * Makes separate API requests for each city to ensure addresses are correctly
   * attributed to their source city. Requests are made in parallel to maintain
   * performance while avoiding the issue of mixed results from multi-city queries.
   * 
   * @param cities - Array of city names to fetch addresses for
   * @throws Error if any API request fails or returns invalid data
   */
  private async fetchAddressesForCities(cities: string[]): Promise<void> {
    console.log(`AddressGenerator: Fetching addresses for ${cities.length} cities in parallel`);
    
    // Fetch all cities in parallel to maintain performance
    const fetchPromises = cities.map(city => this.fetchAddressesForCity(city));
    
    try {
      await Promise.all(fetchPromises);
      
      const totalCached = cities.reduce((sum, city) => sum + (this.addressCache.get(city)?.length || 0), 0);
      console.log(`AddressGenerator: Caching complete. Total addresses cached: ${totalCached}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch addresses: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetches addresses for a single city from the Overpass API.
   * 
   * Constructs an Overpass QL query for one city, executes the request,
   * and caches the results.
   * 
   * @param city - City name to fetch addresses for
   * @throws Error if the API request fails or returns invalid data
   */
  private async fetchAddressesForCity(city: string): Promise<void> {
    const query = this.buildOverpassQueryForCity(city);
    const endpoint = this.config.overpassEndpoint!;
    const timeoutMs = this.config.timeoutMs!;
    
    console.log(`AddressGenerator: Fetching addresses for ${city}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(endpoint, {
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
      
      console.log(`AddressGenerator: Received ${data.elements?.length || 0} elements for ${city}`);
      
      const addresses = this.parseOverpassResponse(data, city);
      
      if (addresses.length === 0) {
        console.error(`AddressGenerator: No addresses found for city: ${city}. The city name may not match OpenStreetMap data.`);
      } else {
        console.log(`AddressGenerator: Cached ${addresses.length} addresses for ${city}`);
      }
      
      this.addressCache.set(city, addresses);
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
   * Builds an Overpass QL query to fetch addresses for a single city.
   * 
   * For Italian municipalities (comuni), searches specifically for admin_level=8
   * boundaries to ensure precise matching and avoid broader areas.
   * 
   * @param city - City name (Italian comune) to query
   * @returns Overpass QL query string
   */
  private buildOverpassQueryForCity(city: string): string {
    // Italian comuni are admin_level=8, we search for this specifically
    // to avoid matching broader areas (provinces=6, regions=4)
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
   * Parses the Overpass API JSON response into Address objects.
   * 
   * Extracts relevant address information from the response elements:
   * - addr:street for street name
   * - addr:housenumber for house number
   * - lat/lon for coordinates (from node or center of way)
   * - Uses the provided city name for all addresses
   * 
   * Since the query already filters by comune boundaries (admin_level=8),
   * all returned elements are within the municipality and don't need additional
   * city filtering. The addr:city tag is often inconsistent or missing in OSM data.
   * 
   * @param data - Raw JSON response from Overpass API for a single city
   * @param city - City name (comune) to use for all addresses
   * @returns Array of parsed Address objects
   */
  private parseOverpassResponse(data: any, city: string): Address[] {
    if (!data.elements || !Array.isArray(data.elements)) {
      console.warn(`AddressGenerator: No elements in API response for ${city}`);
      return [];
    }
    
    const addresses: Address[] = [];
    let skippedDueToMissingData = 0;
    
    for (const element of data.elements) {
      const tags = element.tags || {};
      
      // Since we're querying by precise comune boundaries, accept all elements
      // The addr:city tag is often inconsistent or missing in Italian OSM data
      
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
    
    // Deduplicate addresses by coordinates to avoid multiple unit numbers (5a, 5b, 5c)
    // at the same location, which reduces spatial diversity
    const deduplicatedAddresses = this.deduplicateByCoordinates(addresses);
    const duplicatesRemoved = addresses.length - deduplicatedAddresses.length;
    
    console.log(
      `AddressGenerator: Parsed ${data.elements.length} elements for ${city}: ` +
      `${addresses.length} valid, ${skippedDueToMissingData} skipped (missing street/number/coordinates), ` +
      `${duplicatesRemoved} duplicates removed, ${deduplicatedAddresses.length} unique locations`
    );
    
    return deduplicatedAddresses;
  }

  /**
   * Deduplicates addresses by their coordinates.
   * 
   * Buildings with multiple units (e.g., 5a, 5b, 5c) share the same coordinates
   * but have different house numbers. This reduces spatial diversity when generating
   * random addresses. This method keeps only one address per coordinate pair to
   * ensure better geographic distribution.
   * 
   * When multiple addresses share coordinates, preference is given to simpler
   * house numbers (numeric only) over those with letters/suffixes.
   * 
   * @param addresses - Array of addresses to deduplicate
   * @returns Array of addresses with unique coordinate pairs
   */
  private deduplicateByCoordinates(addresses: Address[]): Address[] {
    const coordinateMap = new Map<string, Address>();
    
    for (const address of addresses) {
      // Round coordinates to 6 decimal places (~11cm precision)
      // to handle minor floating point differences
      const lat = address.latitude.toFixed(6);
      const lon = address.longitude.toFixed(6);
      const key = `${lat},${lon}`;
      
      const existing = coordinateMap.get(key);
      
      if (!existing) {
        coordinateMap.set(key, address);
      } else {
        // If we have duplicates, prefer simpler house numbers (without letters)
        const currentIsNumeric = /^\d+$/.test(address.number);
        const existingIsNumeric = /^\d+$/.test(existing.number);
        
        if (currentIsNumeric && !existingIsNumeric) {
          // Prefer current (numeric) over existing (has letters)
          coordinateMap.set(key, address);
        }
        // Otherwise keep the first one we found
      }
    }
    
    return Array.from(coordinateMap.values());
  }

  /**
   * Clears the address cache.
   * 
   * Removes all cached addresses, forcing fresh API requests on the next
   * call to getRandomAddress(). Useful for testing or when you want to
   * refresh the address pool.
   */
  clearCache(): void {
    this.addressCache.clear();
  }

  /**
   * Gets the number of cached addresses for a specific city.
   * 
   * @param city - City name to check
   * @returns Number of cached addresses, or 0 if city not cached
   */
  getCachedAddressCount(city: string): number {
    return this.addressCache.get(city)?.length || 0;
  }

  /**
   * Gets the total number of cached addresses across all cities.
   * 
   * @returns Total number of cached addresses
   */
  getTotalCachedAddressCount(): number {
    let total = 0;
    for (const addresses of this.addressCache.values()) {
      total += addresses.length;
    }
    return total;
  }

  /**
   * Gets all cached addresses for a specific city.
   * 
   * @param city - City name to retrieve addresses for
   * @returns Array of cached addresses, or empty array if city not cached
   */
  getCachedAddresses(city: string): Address[] {
    return this.addressCache.get(city) || [];
  }

  /**
   * Gets all cached addresses across all cities.
   * 
   * @returns Map of city names to their cached addresses
   */
  getAllCachedAddresses(): Map<string, Address[]> {
    return new Map(this.addressCache);
  }
}
