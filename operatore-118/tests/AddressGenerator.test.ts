import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AddressGenerator } from '../src/core/AddressGenerator';
import type { Address } from '../src/model/location';

describe('AddressGenerator', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    // Mock global fetch
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with valid config', () => {
      const generator = new AddressGenerator({ cities: ['Milano'] });
      expect(generator).toBeInstanceOf(AddressGenerator);
    });

    it('should throw error if cities array is empty', () => {
      expect(() => new AddressGenerator({ cities: [] })).toThrow(
        'AddressGenerator requires at least one city'
      );
    });

    it('should throw error if cities is not provided', () => {
      expect(() => new AddressGenerator({} as any)).toThrow(
        'AddressGenerator requires at least one city'
      );
    });

    it('should use custom overpass endpoint if provided', () => {
      const customEndpoint = 'https://custom.overpass.api/interpreter';
      const generator = new AddressGenerator({
        cities: ['Roma'],
        overpassEndpoint: customEndpoint,
      });
      expect(generator).toBeInstanceOf(AddressGenerator);
    });
  });

  describe('getRandomAddress', () => {
    it('should fetch and return a random address', async () => {
      const mockResponse = {
        elements: [
          {
            type: 'node',
            id: 1,
            lat: 45.4642,
            lon: 9.1900,
            tags: {
              'addr:street': 'Via Roma',
              'addr:housenumber': '10',
            },
          },
          {
            type: 'node',
            id: 2,
            lat: 45.4643,
            lon: 9.1901,
            tags: {
              'addr:street': 'Via Milano',
              'addr:housenumber': '20',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const generator = new AddressGenerator({ cities: ['Milano'] });
      const address = await generator.getRandomAddress();

      expect(address).toMatchObject({
        street: expect.any(String),
        number: expect.any(String),
        city: 'Milano',
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      });

      expect(['Via Roma', 'Via Milano']).toContain(address.street);
      expect(['10', '20']).toContain(address.number);
    });

    it('should cache addresses and not refetch on subsequent calls', async () => {
      const mockResponse = {
        elements: [
          {
            type: 'node',
            id: 1,
            lat: 41.9028,
            lon: 12.4964,
            tags: {
              'addr:street': 'Via del Corso',
              'addr:housenumber': '5',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const generator = new AddressGenerator({ cities: ['Roma'] });
      
      await generator.getRandomAddress();
      await generator.getRandomAddress();

      // Should only call fetch once because of caching
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should fetch addresses for multiple cities in parallel', async () => {
      const mockResponse1 = {
        elements: [
          {
            lat: 45.4642,
            lon: 9.1900,
            tags: { 'addr:street': 'Via Milano', 'addr:housenumber': '1' },
          },
        ],
      };

      const mockResponse2 = {
        elements: [
          {
            lat: 41.9028,
            lon: 12.4964,
            tags: { 'addr:street': 'Via Roma', 'addr:housenumber': '2' },
          },
        ],
      };

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2,
        });

      const generator = new AddressGenerator({ cities: ['Milano', 'Roma'] });
      await generator.getRandomAddress();

      // Should fetch for both cities
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should throw error if API request fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const generator = new AddressGenerator({ cities: ['Milano'] });

      await expect(generator.getRandomAddress()).rejects.toThrow(
        'Overpass API returned 500'
      );
    });

    it('should throw error if no addresses are found', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ elements: [] }),
      });

      const generator = new AddressGenerator({ cities: ['UnknownCity'] });

      await expect(generator.getRandomAddress()).rejects.toThrow(
        'No addresses available in cache'
      );
    });

    it('should filter out incomplete addresses', async () => {
      const mockResponse = {
        elements: [
          {
            lat: 45.4642,
            lon: 9.1900,
            tags: {
              'addr:street': 'Via Roma',
              'addr:housenumber': '10',
            },
          },
          {
            // Missing housenumber
            lat: 45.4643,
            lon: 9.1901,
            tags: {
              'addr:street': 'Via Milano',
            },
          },
          {
            // Missing coordinates
            tags: {
              'addr:street': 'Via Torino',
              'addr:housenumber': '30',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const generator = new AddressGenerator({ cities: ['Milano'] });
      await generator.getRandomAddress();

      // Should only cache 1 complete address
      expect(generator.getCachedAddressCount('Milano')).toBe(1);
    });
  });

  describe('clearCache', () => {
    it('should clear cached addresses', async () => {
      const mockResponse = {
        elements: [
          {
            lat: 45.4642,
            lon: 9.1900,
            tags: {
              'addr:street': 'Via Roma',
              'addr:housenumber': '10',
            },
          },
        ],
      };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const generator = new AddressGenerator({ cities: ['Milano'] });
      
      await generator.getRandomAddress();
      expect(generator.getCachedAddressCount('Milano')).toBeGreaterThan(0);
      
      generator.clearCache();
      expect(generator.getCachedAddressCount('Milano')).toBe(0);
      
      // Should refetch after clearing cache
      await generator.getRandomAddress();
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCachedAddressCount', () => {
    it('should return 0 for uncached city', () => {
      const generator = new AddressGenerator({ cities: ['Milano'] });
      expect(generator.getCachedAddressCount('Milano')).toBe(0);
    });

    it('should return correct count after fetching', async () => {
      const mockResponse = {
        elements: [
          {
            lat: 45.4642,
            lon: 9.1900,
            tags: { 'addr:street': 'Via Roma', 'addr:housenumber': '10' },
          },
          {
            lat: 45.4643,
            lon: 9.1901,
            tags: { 'addr:street': 'Via Milano', 'addr:housenumber': '20' },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const generator = new AddressGenerator({ cities: ['Milano'] });
      await generator.getRandomAddress();
      
      expect(generator.getCachedAddressCount('Milano')).toBe(2);
    });
  });

  describe('getTotalCachedAddressCount', () => {
    it('should return 0 when cache is empty', () => {
      const generator = new AddressGenerator({ cities: ['Milano', 'Roma'] });
      expect(generator.getTotalCachedAddressCount()).toBe(0);
    });

    it('should return total across all cities', async () => {
      const mockResponse1 = {
        elements: [
          {
            lat: 45.4642,
            lon: 9.1900,
            tags: { 'addr:street': 'Via Milano', 'addr:housenumber': '1' },
          },
          {
            lat: 45.4643,
            lon: 9.1901,
            tags: { 'addr:street': 'Via Milano 2', 'addr:housenumber': '2' },
          },
        ],
      };

      const mockResponse2 = {
        elements: [
          {
            lat: 41.9028,
            lon: 12.4964,
            tags: { 'addr:street': 'Via Roma', 'addr:housenumber': '10' },
          },
        ],
      };

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2,
        });

      const generator = new AddressGenerator({ cities: ['Milano', 'Roma'] });
      await generator.getRandomAddress();
      
      expect(generator.getTotalCachedAddressCount()).toBe(3);
    });
  });

});
