/**
 * Example usage of AddressGenerator with OpenStreetMap Overpass API
 * 
 * This example demonstrates how to use the AddressGenerator to fetch
 * random addresses from Italian cities using real OpenStreetMap data.
 */

import { AddressGenerator } from './src/core/AddressGenerator';

async function main() {
  // Create a generator for multiple Italian cities
  const generator = new AddressGenerator({
    cities: ['Milano', 'Roma', 'Napoli', 'Torino', 'Bologna'],
  });

  console.log('Fetching random addresses from Italian cities...\n');

  try {
    // Get 5 random addresses
    for (let i = 0; i < 5; i++) {
      const address = await generator.getRandomAddress();
      console.log(`Address ${i + 1}:`);
      console.log(`  Street: ${address.street} ${address.number}`);
      console.log(`  City: ${address.city}`);
      console.log(`  Coordinates: ${address.latitude}, ${address.longitude}`);
      console.log();
    }

    // Show cache statistics
    console.log('Cache Statistics:');
    console.log(`  Total cached addresses: ${generator.getTotalCachedAddressCount()}`);
    console.log('\nPer city:');
    const cities = ['Milano', 'Roma', 'Napoli', 'Torino', 'Bologna'];
    for (const city of cities) {
      const count = generator.getCachedAddressCount(city);
      if (count > 0) {
        console.log(`  ${city}: ${count} addresses`);
      }
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
}

// Run the example
main();
