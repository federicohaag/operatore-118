import type { Address, City } from '../model/location';

/**
 * Configuration options for AddressGenerator.
 */
export interface AddressGeneratorConfig {
  /** List of cities (with ISTAT codes) to load addresses for */
  cities: City[];
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
  
  /** Cache of addresses by ISTAT code */
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

    console.log(`AddressGenerator: Loading addresses for cities: ${this.config.cities.map(c => `${c.name} (${c.istat})`).join(', ')}`);
    
    await Promise.all(
      this.config.cities.map(city => this.loadAddressesForCity(city))
    );
    
    const totalLoaded = this.getTotalCachedAddressCount();
    console.log(`AddressGenerator: Loaded ${totalLoaded} addresses from ${this.config.cities.length} cities`);
    
    this.initialized = true;
  }

  /**
   * Loads addresses from JSON file for a specific city.
   * 
   * @param city The city to load addresses for
   * @returns Array of addresses for the city
   * @throws Error if the JSON file cannot be loaded or parsed
   */
  private async loadAddressesForCity(city: City): Promise<Address[]> {
    const fileName = `${city.istat}.json`;
    const filePath = `/src/data/dispatch-centers/Lombardia/SRL/addresses/${fileName}`;
    
    try {
      // Dynamically import the JSON file
      const module = await import(/* @vite-ignore */ filePath);
      const addresses = module.default as Address[];
      
      // Cache the loaded addresses by ISTAT code
      this.addressCache.set(city.istat, addresses);
      
      return addresses;
    } catch (error) {
      throw new Error(
        `Failed to load addresses for city ${city.name} (ISTAT: ${city.istat}) from ${filePath}: ${error}`
      );
    }
  }

  /**
   * Gets a random address from the configured cities.
   * 
   * Randomly selects a city first (with equal weight), then randomly selects
   * an address from that city. This ensures equal probability for each city
   * regardless of how many addresses they have.
   * 
   * You must call initialize() before using this method.
   * 
   * @returns A randomly selected Address
   * @throws Error if generator is not initialized or no addresses are available
   */
  getRandomAddress(): Address {
    if (!this.initialized) {
      throw new Error('AddressGenerator must be initialized before use. Call initialize() first.');
    }

    // Filter cities that have addresses
    const citiesWithAddresses = this.config.cities.filter(
      city => {
        const addresses = this.addressCache.get(city.istat);
        return addresses && addresses.length > 0;
      }
    );
    
    if (citiesWithAddresses.length === 0) {
      const citiesWithNoAddresses = this.config.cities.filter(
        city => this.addressCache.has(city.istat) && this.addressCache.get(city.istat)!.length === 0
      );
      
      if (citiesWithNoAddresses.length > 0) {
        throw new Error(
          `No addresses available. The following cities have empty address files: ${citiesWithNoAddresses.map(c => `${c.name} (${c.istat})`).join(', ')}. ` +
          `Run "npm run fetch-addresses -- ${citiesWithNoAddresses.map(c => c.istat).join(' ')}" to fetch addresses.`
        );
      }
      
      throw new Error('No addresses available in cache');
    }
    
    // Step 1: Randomly select a city (equal weight for each city)
    const randomCityIndex = Math.floor(Math.random() * citiesWithAddresses.length);
    const selectedCity = citiesWithAddresses[randomCityIndex];
    
    // Step 2: Randomly select an address from that city
    const cityAddresses = this.addressCache.get(selectedCity.istat)!;
    const randomAddressIndex = Math.floor(Math.random() * cityAddresses.length);
    
    return cityAddresses[randomAddressIndex];
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
   * @param istatCode - ISTAT code of the city to check
   * @returns Number of loaded addresses, or 0 if city not loaded
   */
  getCachedAddressCount(istatCode: string): number {
    return this.addressCache.get(istatCode)?.length || 0;
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
   * @param istatCode - ISTAT code of the city to retrieve addresses for
   * @returns Array of loaded addresses, or empty array if city not loaded
   */
  getCachedAddresses(istatCode: string): Address[] {
    return this.addressCache.get(istatCode) || [];
  }

  /**
   * Gets all loaded addresses across all cities.
   * 
   * @returns Map of ISTAT codes to their loaded addresses
   */
  getAllCachedAddresses(): Map<string, Address[]> {
    return new Map(this.addressCache);
  }
}
