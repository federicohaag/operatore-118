import type { Address } from '../model/location';

/**
 * Configuration options for AddressGenerator.
 */
export interface AddressGeneratorConfig {
  /** List of city names to load addresses for */
  cities: string[];
}

/**
 * Generates random addresses from pre-loaded address data files.
 * 
 * AddressGenerator loads real street addresses from JSON files in the
 * data/addresses directory. Each city has its own JSON file containing
 * addresses fetched from OpenStreetMap.
 * 
 * Usage:
 * ```typescript
 * const generator = new AddressGenerator({ 
 *   cities: ['Como', 'Varese'] 
 * });
 * 
 * await generator.initialize();
 * const address = generator.getRandomAddress();
 * ```
 * 
 * Address files are generated using the fetch-addresses CLI tool:
 * ```bash
 * npm run fetch-addresses -- Como Varese
 * ```
 * 
 * The generator provides random selection from the loaded addresses,
 * with addresses distributed across all configured cities.
 */
export class AddressGenerator {
  /** Configuration for address generation */
  private config: AddressGeneratorConfig;
  
  /** Cache of addresses by city name */
  private addressCache: Map<string, Address[]> = new Map();
  
  /** Whether the generator has been initialized */
  private initialized: boolean = false;

  /**
   * Creates a new AddressGenerator instance.
   * 
   * @param config - Configuration for address generation
   */
  constructor(config: AddressGeneratorConfig) {
    this.config = config;
    
    if (!this.config.cities || this.config.cities.length === 0) {
      throw new Error('AddressGenerator requires at least one city');
    }
  }

  /**
   * Initializes the generator by loading address data files.
   * 
   * Must be called before getRandomAddress(). Loads JSON files for each
   * configured city from the data/addresses directory.
   * 
   * @throws Error if any address file fails to load
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log(`AddressGenerator: Loading addresses for cities: ${this.config.cities.join(', ')}`);
    
    await Promise.all(
      this.config.cities.map(city => this.loadAddressesForCity(city))
    );
    
    const totalLoaded = this.getTotalCachedAddressCount();
    console.log(`AddressGenerator: Loaded ${totalLoaded} addresses from ${this.config.cities.length} cities`);
    
    this.initialized = true;
  }

  /**
   * Loads addresses for a single city from its JSON file.
   * 
   * @param city - City name to load addresses for
   * @throws Error if the file doesn't exist or can't be parsed
   */
  private async loadAddressesForCity(city: string): Promise<void> {
    const filename = city.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.json';
    
    try {
      // Dynamic import of the JSON file
      const module = await import(`../data/addresses/${filename}`);
      const addresses: Address[] = module.default;
      
      if (!Array.isArray(addresses)) {
        throw new Error(`Invalid address file format for ${city}`);
      }
      
      this.addressCache.set(city, addresses);
      console.log(`AddressGenerator: Loaded ${addresses.length} addresses for ${city}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to load addresses for ${city}. ` +
          `Make sure the file src/data/addresses/${filename} exists. ` +
          `Run "npm run fetch-addresses -- ${city}" to generate it. ` +
          `Original error: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Gets a random address from the configured cities.
   * 
   * Randomly selects one address from all loaded addresses across all cities.
   * You must call initialize() before using this method.
   * 
   * @returns A randomly selected Address
   * @throws Error if generator is not initialized or no addresses are available
   */
  getRandomAddress(): Address {
    if (!this.initialized) {
      throw new Error('AddressGenerator must be initialized before use. Call initialize() first.');
    }

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
          `No addresses available. The following cities have empty address files: ${citiesWithNoAddresses.join(', ')}. ` +
          `Run "npm run fetch-addresses -- ${citiesWithNoAddresses.join(' ')}" to fetch addresses.`
        );
      }
      
      throw new Error('No addresses available in cache');
    }
    
    // Select a random address
    const randomIndex = Math.floor(Math.random() * allAddresses.length);
    return allAddresses[randomIndex];
  }

  /**
   * Clears the address cache.
   * 
   * Removes all loaded addresses. After calling this, you'll need to call
   * initialize() again to reload the data. Useful for testing.
   */
  clearCache(): void {
    this.addressCache.clear();
    this.initialized = false;
  }

  /**
   * Gets the number of loaded addresses for a specific city.
   * 
   * @param city - City name to check
   * @returns Number of loaded addresses, or 0 if city not loaded
   */
  getCachedAddressCount(city: string): number {
    return this.addressCache.get(city)?.length || 0;
  }

  /**
   * Gets the total number of loaded addresses across all cities.
   * 
   * @returns Total number of loaded addresses
   */
  getTotalCachedAddressCount(): number {
    let total = 0;
    for (const addresses of this.addressCache.values()) {
      total += addresses.length;
    }
    return total;
  }

  /**
   * Gets all loaded addresses for a specific city.
   * 
   * @param city - City name to retrieve addresses for
   * @returns Array of loaded addresses, or empty array if city not loaded
   */
  getCachedAddresses(city: string): Address[] {
    return this.addressCache.get(city) || [];
  }

  /**
   * Gets all loaded addresses across all cities.
   * 
   * @returns Map of city names to their loaded addresses
   */
  getAllCachedAddresses(): Map<string, Address[]> {
    return new Map(this.addressCache);
  }
}
