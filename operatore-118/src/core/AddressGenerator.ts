import type { Address, City } from '../model/location';

/**
 * Configuration options for AddressGenerator.
 */
export interface AddressGeneratorConfig {
  /** List of cities (with ISTAT codes) to load addresses for */
  cities: City[];
  /** Path to the dispatch center's addresses directory */
  addressesPath: string;
  /** Initial buffer size (default: 10) */
  initialBufferSize?: number;
  /** Refill threshold - refill when buffer drops below this (default: 5) */
  refillThreshold?: number;
  /** Number of addresses to add when refilling (default: 10) */
  refillAmount?: number;
}

/**
 * City weight information for weighted random selection.
 */
interface CityWeight {
  /** The city information */
  city: City;
  /** Number of addresses available for this city */
  addressCount: number;
  /** Computed weight for random selection (1, 2, or 4) */
  weight: number;
}

/**
 * Generates random addresses from address data files using weighted random selection.
 * 
 * AddressGenerator uses a memory-efficient buffering approach:
 * 1. Pre-loads a buffer of addresses (default: 10) during initialization
 * 2. Returns addresses from the buffer (instant, no file I/O)
 * 3. Automatically refills buffer in background when it drops below threshold (default: 5)
 * 
 * This provides:
 * - Fast synchronous address access (no await needed after initialization)
 * - Weighted random selection (cities with more addresses picked more often)
 * - Automatic background refilling for continuous operation
 * 
 * Usage:
 * ```typescript
 * const generator = new AddressGenerator({ 
 *   cities: [COMO, VARESE],
 *   addressesPath: '../data/dispatch-centers/Lombardia/SRL/addresses'
 * });
 * 
 * await generator.initialize();
 * const address = generator.getRandomAddress(); // synchronous!
 * ```
 * 
 * Address files are generated using the fetch-addresses CLI tool:
 * ```bash
 * npm run fetch-addresses -- Lombardia/SRL
 * ```
 */
export class AddressGenerator {
  /** Configuration for address generation */
  private config: AddressGeneratorConfig;
  
  /** Weighted city information for random selection */
  private cityWeights: CityWeight[] = [];
  
  /** Total sum of all weights */
  private totalWeight: number = 0;
  
  /** Whether the generator has been initialized */
  private initialized: boolean = false;

  /** Buffer of pre-loaded addresses */
  private addressBuffer: Address[] = [];

  /** Whether a refill operation is currently in progress */
  private isRefilling: boolean = false;

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
    
    if (!this.config.addressesPath) {
      throw new Error('AddressGenerator requires addressesPath');
    }
  }

  /**
   * Initializes the generator by computing city weights and pre-loading address buffer.
   * 
   * Must be called before getRandomAddress(). Reads each city's address file
   * to count addresses, compute weights, and pre-load initial buffer.
   * 
   * @throws Error if any address file fails to load or has no addresses
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log(`AddressGenerator: Computing weights for ${this.config.cities.length} cities...`);
    
    // Load address counts for all cities
    const cityInfos = await Promise.all(
      this.config.cities.map(async (city) => {
        const count = await this.getAddressCountForCity(city);
        return { city, count };
      })
    );
    
    // Filter out cities with no addresses
    const citiesWithAddresses = cityInfos.filter(info => info.count > 0);
    const citiesWithNoAddresses = cityInfos.filter(info => info.count === 0);
    
    if (citiesWithNoAddresses.length > 0) {
      console.warn(
        `AddressGenerator: Skipped ${citiesWithNoAddresses.length} cities with no addresses: ${citiesWithNoAddresses.map(c => `${c.city.name} (${c.city.istat})`).join(', ')}`
      );
    }
    
    if (citiesWithAddresses.length === 0) {
      throw new Error(
        `No addresses available. All ${cityInfos.length} cities have empty or missing address files. ` +
        `Run "npm run fetch-addresses -- <dispatch-center-path>" to fetch addresses.`
      );
    }
    
    // Build city weights with address counts
    const cityWeightsWithCounts = citiesWithAddresses.map(({ city, count }) => ({
      city,
      addressCount: count
    }));
    
    // Calculate total population
    const totalPopulation = cityWeightsWithCounts.reduce((sum, cityInfo) => sum + cityInfo.city.population, 0);
    
    if (totalPopulation === 0) {
      throw new Error('Total population is 0. Cities must have population data.');
    }
    
    // Assign weights based on population ratio
    // Weight is proportional to population, normalized so smallest city has weight ~1
    const minPopulation = Math.min(...cityWeightsWithCounts.map(c => c.city.population));
    
    this.cityWeights = cityWeightsWithCounts.map((cityInfo) => {
      // Calculate weight as population ratio relative to minimum population
      // This ensures smallest city gets weight ~1 and others are proportionally higher
      const weight = Math.max(1, Math.round(cityInfo.city.population / minPopulation));
      
      return {
        city: cityInfo.city,
        addressCount: cityInfo.addressCount,
        weight
      };
    });
    
    // Calculate total weight
    this.totalWeight = this.cityWeights.reduce((sum, w) => sum + w.weight, 0);
    
    console.log(`AddressGenerator: Initialized with ${this.cityWeights.length} cities, ${this.totalWeight} total weight`);
    console.log(`  Total population: ${totalPopulation.toLocaleString()}`);
    console.log(`  Weights by population: ${this.cityWeights.map(w => `${w.city.name}=${w.weight} (pop: ${w.city.population.toLocaleString()}, ${w.addressCount} addrs)`).join(', ')}`);
    
    // Pre-load initial buffer
    const bufferSize = this.config.initialBufferSize ?? 10;
    console.log(`AddressGenerator: Pre-loading ${bufferSize} addresses...`);
    await this.refillBuffer(bufferSize);
    
    this.initialized = true;
    console.log(`AddressGenerator: Ready with ${this.addressBuffer.length} addresses in buffer`);
  }

  /**
   * Gets the number of addresses available for a city by reading its JSON file.
   * 
   * @param city The city to count addresses for
   * @returns Number of addresses in the city's JSON file, or 0 if file cannot be loaded
   */
  private async getAddressCountForCity(city: City): Promise<number> {
    const fileName = `${city.istat}.json`;
    const filePath = `${this.config.addressesPath}/${fileName}`;
    
    try {
      // Dynamically import the JSON file to get the count
      const module = await import(/* @vite-ignore */ filePath);
      const addresses = module.default as Address[];
      return addresses.length;
    } catch (error) {
      // Silently return 0 - summary warning will be logged during initialization
      return 0;
    }
  }
  
  /**
   * Loads a specific address from a city's JSON file.
   * 
   * @param city The city to load the address from
   * @param index The index of the address to load
   * @returns The address at the specified index
   * @throws Error if the JSON file cannot be loaded or index is out of bounds
   */
  private async loadAddressAtIndex(city: City, index: number): Promise<Address> {
    const fileName = `${city.istat}.json`;
    const filePath = `${this.config.addressesPath}/${fileName}`;
    
    try {
      // Dynamically import the JSON file
      const module = await import(/* @vite-ignore */ filePath);
      const addresses = module.default as Address[];
      
      if (index < 0 || index >= addresses.length) {
        throw new Error(`Index ${index} out of bounds for ${addresses.length} addresses`);
      }
      
      return addresses[index];
    } catch (error) {
      throw new Error(
        `Failed to load address at index ${index} for city ${city.name} (ISTAT: ${city.istat}) from ${filePath}: ${error}`
      );
    }
  }

  /**
   * Generates a random address using weighted selection and loads it.
   * 
   * Uses the assigned weight (1, 2, or 4) for weighted random selection,
   * then randomly picks an address from the selected city.
   * 
   * @returns A randomly selected address
   */
  private async generateRandomAddress(): Promise<Address> {
    // Pick a random weight value across all cities
    const randomWeight = Math.random() * this.totalWeight;
    
    // Find which city this weight value belongs to
    let currentWeight = 0;
    let selectedCity: CityWeight | null = null;
    
    for (const cityWeight of this.cityWeights) {
      if (randomWeight < currentWeight + cityWeight.weight) {
        selectedCity = cityWeight;
        break;
      }
      currentWeight += cityWeight.weight;
    }
    
    // Fallback to last city (should never happen, but ensures type safety)
    if (!selectedCity) {
      selectedCity = this.cityWeights[this.cityWeights.length - 1];
    }
    
    // Randomly pick an address index from the selected city
    const addressIndexInCity = Math.floor(Math.random() * selectedCity.addressCount);
    
    // Load only the specific address from the JSON file
    return await this.loadAddressAtIndex(selectedCity.city, addressIndexInCity);
  }

  /**
   * Refills the address buffer with random addresses.
   * 
   * @param count Number of addresses to add to the buffer
   */
  private async refillBuffer(count: number): Promise<void> {
    const addresses = await Promise.all(
      Array.from({ length: count }, () => this.generateRandomAddress())
    );
    this.addressBuffer.push(...addresses);
  }

  /**
   * Checks if buffer needs refilling and triggers background refill if needed.
   */
  private checkAndRefillBuffer(): void {
    const threshold = this.config.refillThreshold ?? 5;
    const refillAmount = this.config.refillAmount ?? 10;
    
    if (!this.isRefilling && this.addressBuffer.length < threshold) {
      this.isRefilling = true;
      console.log(`AddressGenerator: Buffer low (${this.addressBuffer.length}), refilling with ${refillAmount} addresses...`);
      
      this.refillBuffer(refillAmount)
        .then(() => {
          this.isRefilling = false;
          console.log(`AddressGenerator: Buffer refilled, now has ${this.addressBuffer.length} addresses`);
        })
        .catch(error => {
          this.isRefilling = false;
          console.error('AddressGenerator: Failed to refill buffer:', error);
        });
    }
  }

  /**
   * Gets a random address from the buffer.
   * 
   * Returns an address instantly from the pre-loaded buffer. Automatically
   * triggers background refill when buffer drops below threshold.
   * 
   * You must call initialize() before using this method.
   * 
   * @returns A randomly selected Address from the buffer
   * @throws Error if generator is not initialized or buffer is empty
   */
  getRandomAddress(): Address {
    if (!this.initialized) {
      throw new Error('AddressGenerator must be initialized before use. Call initialize() first.');
    }

    if (this.addressBuffer.length === 0) {
      throw new Error('Address buffer is empty. This should not happen after initialization.');
    }
    
    // Pop address from buffer (FIFO)
    const address = this.addressBuffer.shift()!;
    
    // Check if we need to refill (async, non-blocking)
    this.checkAndRefillBuffer();
    
    return address;
  }

  /**
   * Resets the generator state.
   * 
   * Clears all weights, buffer, and initialization state. After calling this,
   * you'll need to call initialize() again. Useful for testing.
   */
  reset(): void {
    this.cityWeights = [];
    this.totalWeight = 0;
    this.addressBuffer = [];
    this.isRefilling = false;
    this.initialized = false;
  }

  /**
   * Gets the current buffer size.
   * 
   * @returns Number of addresses currently in the buffer
   */
  getBufferSize(): number {
    return this.addressBuffer.length;
  }

  /**
   * Gets the number of addresses for a specific city.
   * 
   * @param istatCode - ISTAT code of the city to check
   * @returns Number of addresses, or 0 if city not found
   */
  getAddressCount(istatCode: string): number {
    const weight = this.cityWeights.find(w => w.city.istat === istatCode);
    return weight?.addressCount || 0;
  }

  /**
   * Gets the total number of addresses across all cities.
   * 
   * @returns Total number of addresses
   */
  getTotalAddressCount(): number {
    return this.totalWeight;
  }

  /**
   * Gets the list of cities with their address counts.
   * 
   * @returns Array of city weights
   */
  getCityWeights(): ReadonlyArray<Readonly<CityWeight>> {
    return this.cityWeights;
  }
}
