# BodyGraph API Reference

## Provider Information

**Provider**: BodyGraph Chart API  
**Base URL**: `https://api.bodygraphchart.com/v221006`  
**Product Page**: https://bodygraph.com/feature/human-design-api/  
**Help Centre**: https://bodygraph.com/help/human-design-api/

## Client Endpoint (React Native → Server)

### POST /internal/hd

**Method**: POST  
**URL**: `http://localhost:3000/internal/hd` (dev)  
**Content-Type**: `application/json`

**Request Body**:
```typescript
{
  date: string;     // Format: "YYYY-MM-DD HH:mm"
  timezone: string; // IANA timezone (e.g., "America/New_York")
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date": "1992-10-03 00:03", "timezone": "America/New_York"}'
```

## Server Endpoint (Server → BodyGraph)

### GET /hd-data

**Method**: GET  
**URL**: `https://api.bodygraphchart.com/v221006/hd-data`

**Query Parameters**:
- `api_key` (required): API key from `BODYGRAPH_API_KEY` env var
- `date` (required): Birth date/time in format `YYYY-MM-DD HH:mm`
- `timezone` (required): IANA timezone

## Response Format

### Raw BodyGraph Response

```json
{
  "Properties": {
    "Type": {"option": "Manifesting Generator"},
    "InnerAuthority": {"option": "Emotional - Solar Plexus"},
    "Profile": {"option": "2 / 4"},
    "Gates": {
      "list": [
        {"option": 2},
        {"option": 1}
      ]
    }
  }
}
```

### Transformed HDExtract

```typescript
interface HDExtract {
  type: string;       // "Manifesting Generator"
  authority: string;  // "Emotional"
  profile: string;    // "2/4"
  centers: string[];  // [] (TODO)
  channels: number[]; // [] (TODO)
  gates: number[];    // [1, 2]
}
```

## Usage

```typescript
import { computeHDExtract } from '@/hd/api-client';

const result = await computeHDExtract({
  dateISO: '1992-10-03',
  time: '00:03',
  timeZone: 'America/New_York',
});
```

## Related Documentation

- [Field Mapping](./BODYGRAPH_FIELD_MAPPING.md) - Data transformations
- [Error Handling](./BODYGRAPH_ERROR_HANDLING.md) - Error codes
- [Troubleshooting](./BODYGRAPH_TROUBLESHOOTING.md) - Common issues
