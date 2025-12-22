# Composite Chart API Documentation

## POST /api/v1/composite

Returns two individual charts and a merged composite chart showing relationship dynamics between two individuals. Useful for compatibility analysis and relationship coaching tools.

### Parameters

| Parameter       | Type   | Required | Description                          |
|-----------------|--------|----------|--------------------------------------|
| birthDate       | string | Yes      | Person A birth date (YYYY-MM-DD)     |
| birthTime       | string | Yes      | Person A birth time (HH:MM)          |
| birthLocation   | string | Yes      | Person A birth location              |
| latitude        | number | No       | Person A latitude (if no location)   |
| longitude       | number | No       | Person A longitude (if no location)  |
| birthDate1      | string | Yes      | Person B birth date (YYYY-MM-DD)     |
| birthTime1      | string | Yes      | Person B birth time (HH:MM)          |
| birthLocation1  | string | Yes      | Person B birth location              |
| latitude1       | number | No       | Person B latitude (if no location)   |
| longitude1      | number | No       | Person B longitude (if no location)  |

### Example Request

```bash
curl -X POST https://your-api-url/api/v1/composite \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1993-02-05",
    "birthTime": "11:53",
    "birthLocation": "Manila, Philippines",
    "birthDate1": "1994-07-26",
    "birthTime1": "23:30",
    "birthLocation1": "Manila, Philippines"
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
    "personA": { /* Full V1 chart data */ },
    "personB": { /* Full V1 chart data */ },
    "Combined": {
      "DefinedCenters": ["center1", "center2", ...],
      "OpenCenters": ["center1", ...],
      "Properties": {
        "Definition": { /* Combined definition */ },
        "ConnectionTheme": { /* Relationship theme */ },
        "RelationshipChannels": {
          "Companionship": { "List": [...] },
          "Dominance": { "List": [...] },
          "Compromise": { "List": [...] },
          "Electromagnetic": { "List": [...] }
        }
      }
    }
  }
}
```

## Relationship Channel Types

| Type | Description |
|------|-------------|
| **Electromagnetic** | A has one gate, B has the other - creates magnetic attraction |
| **Compromise** | Both share gate(s) creating the channel - potential friction |
| **Dominance** | One person has the complete channel - they "dominate" this energy |
| **Companionship** | Both share the same complete channel - deep understanding |

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/v1/composite` | Composite chart (empty tooltips) |
| `/api/v1/composite-tooltip` | Composite chart (full tooltips) |
