# Address Data Files

This directory contains JSON files with addresses for Italian cities, fetched from OpenStreetMap.

## File Format

Each city has its own JSON file named `{city-name}.json` (lowercase, hyphens for spaces).

Example: `como.json`, `varese.json`, `milano.json`

Each file contains an array of addresses:

```json
[
  {
    "street": "Via Giuseppe Garibaldi",
    "number": "15",
    "city": "Como",
    "latitude": 45.8094,
    "longitude": 9.0859
  },
  ...
]
```

## Generating Address Files

Use the `fetch-addresses` script to download address data from OpenStreetMap:

```bash
# Fetch addresses for one or more cities
npm run fetch-addresses -- Como Varese Milano

# From the project root
cd operatore-118
npm run fetch-addresses -- Como Varese
```

The script will:
1. Query OpenStreetMap's Overpass API for each city
2. Parse and deduplicate the addresses
3. Save the results to `src/data/addresses/{city}.json`

## Rate Limiting

The script adds a 2-second delay between requests to be respectful to the Overpass API.
For large batches of cities, consider running the script multiple times or increasing the delay.

## Data Quality

The addresses are sourced from OpenStreetMap and have been:
- Filtered to only include addresses with complete data (street, number, coordinates)
- Deduplicated by coordinates (removes 5a, 5b, 5c at same building)
- Deduplicated by address string (removes duplicates with different coordinates)
- Preferentially selected for simple numeric house numbers over alphanumeric ones

Typical yield: 50-100 unique addresses per small city, more for larger cities.
