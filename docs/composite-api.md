# Composite Chart API Documentation

## GET /api/v1/composite

Returns two individual charts and a merged composite chart showing relationship dynamics between two individuals. Useful for compatibility analysis and relationship coaching tools.

### Parameters

| Parameter  | Type      | Required | Description                        |
|------------|-----------|----------|-------------------------------------|
| date       | ISO 8601  | Yes      | Person A birth date/time           |
| timezone   | string    | Yes      | Person A timezone                  |
| location   | string    | No       | Person A birth location            |
| latitude   | number    | No       | Person A latitude (if no location) |
| longitude  | number    | No       | Person A longitude (if no location)|
| date1      | ISO 8601  | Yes      | Person B birth date/time           |
| timezone1  | string    | Yes      | Person B timezone                  |
| location1  | string    | No       | Person B birth location            |
| latitude1  | number    | No       | Person B latitude (if no location) |
| longitude1 | number    | No       | Person B longitude (if no location)|

### Example Request

```bash
curl -X POST https://your-api-url/api/v1/composite \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1981-03-16T13:01:00+09:00",
    "timezone": "Asia/Manila",
    "location": "Manila, Philippines",
    "date1": "1990-07-21T08:30:00-04:00",
    "timezone1": "America/New_York",
    "location1": "New York, USA"
  }'
```

### Response Structure

```json
{
  "success": true,
  "meta": {
    "version": "1.0.0",
    "timestamp": "2025-12-22T07:18:48.488Z",
    "endpoint": "v1-composite"
  },
  "data": {
    "personA": {
      "birthInfo": { ... },
      "chart": { ... },
      "phs": { ... },
      "ravePsychology": { ... },
      "centers": { ... },
      "channels": [ ... ],
      "gates": { ... },
      "personality": { ... },
      "design": { ... },
      "tooltips": { ... }
    },
    "personB": {
      "birthInfo": { ... },
      "chart": { ... },
      "phs": { ... },
      "ravePsychology": { ... },
      "centers": { ... },
      "channels": [ ... ],
      "gates": { ... },
      "personality": { ... },
      "design": { ... },
      "tooltips": { ... }
    },
    "Combined": {
      "UnconsciousCenters": [],
      "ConsciousCenters": [],
      "DefinedCenters": [
        "root center",
        "sacral center",
        "solar plexus center",
        ...
      ],
      "OpenCenters": [
        "heart center",
        "crown center"
      ],
      "Properties": {
        "Definition": {
          "Name": "Definition",
          "Id": "Single Definition",
          "Option": "Single Definition",
          "Description": "",
          "Link": ""
        },
        "ConnectionTheme": {
          "ThemeDescription": "With 7 defined centers and 2 open centers, you have a strong foundation...",
          "Name": "Connection Theme",
          "Id": "7 - 2, Balanced Definition",
          "Option": "7 - 2, Balanced Definition",
          "Description": "...",
          "Link": ""
        },
        "RelationshipChannels": {
          "Companionship": {
            "Name": "Companionship Channels",
            "Id": "Companionship Channels",
            "List": []
          },
          "Dominance": {
            "Name": "Dominance Channels",
            "Id": "Dominance Channels",
            "List": [
              {
                "Option": "Channel of Mutation (3-60)",
                "Description": "",
                "Description2": null,
                "Link": "",
                "Gates": [3, 60]
              }
            ]
          },
          "Compromise": {
            "Name": "Compromise Channels",
            "Id": "Compromise Channels",
            "List": [
              {
                "Option": "Channel of The Alpha (7-31)",
                "Description": "",
                "Description2": null,
                "Link": "",
                "Gates": [7, 31]
              }
            ]
          },
          "Electromagnetic": {
            "Name": "Electromagnetic Channels",
            "Id": "Electromagnetic Channels",
            "List": [
              {
                "Option": "Channel of The Beat (2-14)",
                "Description": "",
                "Description2": null,
                "Link": "",
                "Gates": [2, 14]
              }
            ]
          }
        }
      },
      "ChartUrl": null
    }
  }
}
```

## Relationship Channel Types

### Electromagnetic Channels
Channels formed when Person A has one gate and Person B has the other. This creates strong magnetic attraction between the individuals.

### Compromise Channels  
Channels where both people share at least one gate. Creates potential friction/tension as both individuals need to navigate shared energy.

### Dominance Channels
Complete channels that belong to only one person. That person "dominates" the energy in this area of the relationship.

### Companionship Channels
Identical complete channels shared by both individuals. Creates a sense of sameness and deep understanding.

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/v1/composite` | Composite chart without tooltips (lean) |
| `/api/v1/composite-tooltip` | Composite chart with full tooltips |

## Notes

- Person A and Person B are identified as `personA` and `personB` in the response
- For Dominance channels, a `source` field indicates whose channel it is (`personA` or `personB`)
- The `Combined` section shows the merged composite analysis
- All individual V1 chart data is included for each person
