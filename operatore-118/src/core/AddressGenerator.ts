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
   * from the Overpass API. Requests are made in parallel for efficiency.
   * 
   * @throws Error if any API request fails
   */
  private async ensureAddressesCached(): Promise<void> {
    const citiesToFetch = this.config.cities.filter(
      city => !this.addressCache.has(city)
    );
    
    if (citiesToFetch.length === 0) {
      return;
    }
    
    // Fetch addresses for all missing cities in parallel
    const fetchPromises = citiesToFetch.map(city => this.fetchAddressesForCity(city));
    await Promise.all(fetchPromises);
  }

  /**
   * Fetches addresses for a specific city from the Overpass API.
   * 
   * Constructs an Overpass QL query to find streets with house numbers
   * in the specified city. Parses the response and caches the results.
   * 
   * The query searches for nodes with addr:street and addr:housenumber tags
   * within the city boundary, limiting results to 100 addresses per city
   * to keep response sizes manageable.
   * 
   * @param city - Name of the city to fetch addresses for
   * @throws Error if the API request fails or returns invalid data
   */
  private async fetchAddressesForCity(city: string): Promise<void> {
    const query = this.buildOverpassQuery(city);
    const endpoint = this.config.overpassEndpoint!;
    const timeoutMs = this.config.timeoutMs!;
    
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
      const addresses = this.parseOverpassResponse(data, city);
      
      if (addresses.length === 0) {
        console.warn(`No addresses found for city: ${city}`);
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
   * Builds an Overpass QL query to fetch addresses for a city.
   * 
   * The query searches for nodes with address tags (addr:street, addr:housenumber)
   * within the specified city. It uses geocodeArea to find the city boundary and
   * limits results to 100 addresses to keep the response manageable.
   * 
   * @param city - Name of the city to query
   * @returns Overpass QL query string
   */
  private buildOverpassQuery(city: string): string {
    // Overpass QL query to find addresses in the city
    // We search for nodes with addr:street and addr:housenumber tags
    return `
      [out:json][timeout:25];
      area["name"="${city}"]["place"~"city|town"]["admin_level"="8"]->.searchArea;
      (
        node(area.searchArea)["addr:street"]["addr:housenumber"];
      );
      out body 100;
    `;
  }

  /**
   * Parses the Overpass API JSON response into Address objects.
   * 
   * Extracts relevant address information from the response elements:
   * - addr:street for street name
   * - addr:housenumber for house number
   * - lat/lon for coordinates
   * - Uses the provided city name
   * 
   * Filters out elements that don't have all required fields.
   * 
   * @param data - Raw JSON response from Overpass API
   * @param city - City name to use for all addresses
   * @returns Array of parsed Address objects
   */
  private parseOverpassResponse(data: any, city: string): Address[] {
    if (!data.elements || !Array.isArray(data.elements)) {
      return [];
    }
    
    const addresses: Address[] = [];
    
    for (const element of data.elements) {
      const tags = element.tags || {};
      const street = tags['addr:street'];
      const number = tags['addr:housenumber'];
      const lat = element.lat;
      const lon = element.lon;
      
      // Only include if we have all required fields
      if (street && number && lat !== undefined && lon !== undefined) {
        addresses.push({
          street,
          number,
          city,
          latitude: lat,
          longitude: lon,
        });
      }
    }
    
    return addresses;
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
}
