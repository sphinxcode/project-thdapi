# THD API - Human Design Chart Calculator

A high-performance Human Design chart calculation API powered by Swiss Ephemeris with enterprise-ready V1/V2 endpoints.

## Features

- **Complete Human Design Charts** - Type, Strategy, Authority, Profile, Definition, Incarnation Cross
- **Planetary Activations** - All 13 planets for Personality & Design calculations
- **Advanced Astrology** - Chart angles (AC/MC/IC/DC), asteroids (Chiron, Ceres, Pallas, Juno, Vesta)
- **PHS & Rave Psychology** - Digestion, Environment, Motivation, Perspective
- **Gate Analysis** - Defined, hanging open/closed, and open gates
- **Genetic Data** - I Ching glyphs, amino acids, codon rings, codons
- **Multiple API Versions** - V1 (lean) and V2 (full) with optional tooltips

## Tech Stack

- **Node.js** + Express.js
- **Swiss Ephemeris** (swisseph) for astronomical calculations
- **MCP Protocol** support for AI integrations

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check (public) |
| `POST /api/v1/data` | Lean enterprise format (empty tooltips) |
| `POST /api/v1/data-tooltip` | Lean enterprise + full tooltips |
| `POST /api/v2/data` | Full featured format (empty tooltips) |
| `POST /api/v2/data-tooltip` | Full featured + full tooltips |
| `POST /api/human-design` | Legacy format |

## Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer YOUR_API_KEY
```

## Request Format

```json
{
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "birthLocation": "New York, NY"
}
```

Or with explicit coordinates:

```json
{
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "birthLocation": "Custom Location",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

## Response Structure

### V1 (Lean Enterprise)
```json
{
  "success": true,
  "meta": { "version": "1.0.0", "endpoint": "v1" },
  "data": {
    "birthInfo": { ... },
    "chart": { "type": { "id": "generator", "value": "Generator" }, ... },
    "personality": {
      "Sun": {
        "activation": { "gate": 38, "line": 3, "color": 3, "tone": 2, "base": 3, "fixingState": null, "isRetrograde": false },
        "sign": "Capricorn"
      }
    },
    "design": { ... },
    "centers": { ... },
    "channels": [ ... ],
    "gates": { "defined": [...], "hangingOpen": [...], "hangingClosed": [...], "open": [...] },
    "tooltips": { ... }
  }
}
```

### V2 (Full Featured)
```json
{
  "data": {
    "personality": {
      "Sun": {
        "activation": { "gate": 38, "line": 3, "color": 3, "tone": 2, "base": 3, "fixingState": null, "isRetrograde": false },
        "astrology": { "sign": "Capricorn", "house": 10 },
        "genetics": { "iChingGlyph": "䷥", "aminoAcid": "Arginine", "codonRing": "The Ring of Humanity", "codon": "CAC" }
      }
    },
    "extras": {
      "ascendant": { ... },
      "midheaven": { ... },
      "ic": { ... },
      "descendant": { ... },
      "partOfFortune": { ... },
      "blackMoonLilith": { ... },
      "chiron": { ... },
      "ceres": { ... },
      "pallas": { ... },
      "juno": { ... },
      "vesta": { ... }
    },
    "tooltips": { ... }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `API_KEY` | Authentication token for protected endpoints |
| `GOOGLE_MAPS_API_KEY` | (Optional) For geocoding unknown locations |
| `PORT` | Server port (default: 3000) |

## Deployment

Optimized for Railway deployment:

```bash
npm install
npm start
```

## Ephemeris Files

The `ephe/` directory contains Swiss Ephemeris data files:
- `seas_18.se1` - Asteroid ephemeris (Chiron, Ceres, Pallas, Juno, Vesta)

## License

Private - All rights reserved.
