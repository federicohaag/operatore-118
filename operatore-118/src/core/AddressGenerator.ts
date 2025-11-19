import type { Address, City } from '../model/location';

export interface AddressGeneratorConfig {
  cities: City[];
  addressesPath: string;
  initialBufferSize?: number; // default: 10
  refillThreshold?: number; // default: 5
  refillAmount?: number; // default: 10
}

interface CityWithWeight {
  city: City;
  weight: number;
}

/**
 * Generates random addresses using population-weighted selection with buffering.
 * 
 * - Weights cities by population (higher population = higher selection probability)
 * - Pre-loads buffer for fast synchronous access
 * - Auto-refills buffer in background
 * 
 * Usage: await generator.initialize(); const addr = generator.getRandomAddress();
 */
export class AddressGenerator {
  private config: AddressGeneratorConfig;
  private cityWeights: CityWithWeight[] = [];
  private totalWeight = 0;
  private initialized = false;
  private addressBuffer: Address[] = [];
  private isRefilling = false;

  constructor(config: AddressGeneratorConfig) {
    this.config = config;
    if (!config.cities?.length) throw new Error('At least one city required');
    if (!config.addressesPath) throw new Error('addressesPath required');
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const cityInfos = await Promise.all(
      this.config.cities.map(async city => ({ city, count: await this.getAddressCountForCity(city) }))
    );
    
    const valid = cityInfos.filter(i => i.count > 0);
    const skipped = cityInfos.filter(i => i.count === 0);
    
    if (skipped.length) {
      console.warn(`Skipped ${skipped.length} cities with no addresses:`, skipped.map(c => c.city.name).join(', '));
    }
    if (!valid.length) {
      throw new Error('No addresses found. Run fetch-addresses to populate data.');
    }
    
    const totalPop = valid.reduce((sum, i) => sum + i.city.population, 0);
    if (!totalPop) throw new Error('Cities must have population data');
    
    const minPop = Math.min(...valid.map(i => i.city.population));
    this.cityWeights = valid.map(({ city }) => ({
      city,
      weight: Math.max(1, Math.round(city.population / minPop))
    }));
    
    this.totalWeight = this.cityWeights.reduce((sum, w) => sum + w.weight, 0);
    
    await this.refillBuffer(this.config.initialBufferSize ?? 10);
    this.initialized = true;
  }

  private async getAddressCountForCity(city: City): Promise<number> {
    try {
      const module = await import(/* @vite-ignore */ `${this.config.addressesPath}/${city.istat}.json`);
      return (module.default as Address[]).length;
    } catch {
      return 0;
    }
  }
  
  private async loadAddressAtIndex(city: City, index: number): Promise<Address> {
    const module = await import(/* @vite-ignore */ `${this.config.addressesPath}/${city.istat}.json`);
    const addresses = module.default as Address[];
    if (index < 0 || index >= addresses.length) {
      throw new Error(`Index ${index} out of bounds for ${city.name}`);
    }
    return addresses[index];
  }

  private async generateRandomAddress(): Promise<Address> {
    let random = Math.random() * this.totalWeight;
    let selected = this.cityWeights[this.cityWeights.length - 1];
    
    for (const cw of this.cityWeights) {
      if (random < cw.weight) {
        selected = cw;
        break;
      }
      random -= cw.weight;
    }
    
    const count = await this.getAddressCountForCity(selected.city);
    const index = Math.floor(Math.random() * count);
    return this.loadAddressAtIndex(selected.city, index);
  }

  private async refillBuffer(count: number): Promise<void> {
    const addresses = await Promise.all(Array(count).fill(0).map(() => this.generateRandomAddress()));
    this.addressBuffer.push(...addresses);
  }

  private checkAndRefillBuffer(): void {
    const threshold = this.config.refillThreshold ?? 5;
    const amount = this.config.refillAmount ?? 10;
    
    if (!this.isRefilling && this.addressBuffer.length < threshold) {
      this.isRefilling = true;
      this.refillBuffer(amount)
        .then(() => this.isRefilling = false)
        .catch(err => {
          this.isRefilling = false;
          console.error('Buffer refill failed:', err);
        });
    }
  }

  getRandomAddress(): Address {
    if (!this.initialized) throw new Error('Call initialize() first');
    if (!this.addressBuffer.length) throw new Error('Buffer empty');
    
    const address = this.addressBuffer.shift()!;
    this.checkAndRefillBuffer();
    return address;
  }

  reset(): void {
    Object.assign(this, { cityWeights: [], totalWeight: 0, addressBuffer: [], isRefilling: false, initialized: false });
  }

  getBufferSize(): number {
    return this.addressBuffer.length;
  }

  async getAddressCount(istatCode: string): Promise<number> {
    const city = this.cityWeights.find(w => w.city.istat === istatCode)?.city;
    return city ? this.getAddressCountForCity(city) : 0;
  }

  getTotalAddressCount(): number {
    return this.totalWeight;
  }

  getCityWeights(): ReadonlyArray<Readonly<CityWithWeight>> {
    return this.cityWeights;
  }
}
