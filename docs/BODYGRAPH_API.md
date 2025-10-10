# BodyGraph Chart API Integration

## API Information

**Provider**: BodyGraph Chart API  
**Base URL**: `https://api.bodygraphchart.com/latest` <br>
&nbsp;&nbsp;• Latest alias confirmed 2025-10-09; pin to a dated version (e.g. `v250101`) if you need immutable behaviour.  
**API Key**: store in `BODYGRAPH_API_KEY` (see [Security](#security))  
**Product Page**: https://bodygraph.com/feature/human-design-api/  
**Help Centre**: https://bodygraph.com/help/human-design-api/

## Endpoint

### Get HD Data

**Method**: GET  
**URL**: `https://api.bodygraphchart.com/v221006/hd-data`

**Query Parameters**:
- `api_key` (required): Your API key
- `date` (required): Birth date and time in format `YYYY-MM-DD HH:mm`
- `timezone` (required): IANA timezone (e.g., `Europe/London`, `America/New_York`)

## Example Request

```bash
curl --get "https://api.bodygraphchart.com/v221006/hd-data" \
  --data-urlencode "api_key=${BODYGRAPH_API_KEY}" \
  --data-urlencode "date=2019-05-05 10:10" \
  --data-urlencode "timezone=Europe/London"
```

## Example Response

> The structure below reflects the fields documented for recent API versions. We confirmed the `hd-data` endpoint is still live on `v250101` (2025-10-09), but you should re-validate the exact schema with a valid key in your environment.

```json
{
  "Properties": {
    "BirthDateLocal": "5th May 2019 @ 10:10",
    "BirthDateLocal12": "5th May 2019 @ 10:10 AM",
    "BirthDateUtc": "5th May 2019 @ 09:10",
    "BirthDateUtc12": "5th May 2019 @ 09:10 AM",
    "Age": 3,
    "DesignDateUtc": "5th February 2019 @ 17:07",
    "DesignDateUtc12": "5th February 2019 @ 05:07 PM",
    "Type": {
      "name": "Type",
      "id": "Manifesting Generator",
      "option": "Manifesting Generator",
      "description": "",
      "link": ""
    },
    "Strategy": {
      "name": "Strategy",
      "id": "To Respond",
      "option": "To Respond",
      "description": "",
      "link": ""
    },
    "InnerAuthority": {
      "name": "Inner Authority",
      "id": "Emotional - Solar Plexus",
      "option": "Emotional - Solar Plexus",
      "description": "",
      "link": ""
    },
    "Definition": {
      "name": "Definition",
      "id": "Split Definition",
      "option": "Split Definition",
      "description": "",
      "link": ""
    },
    "Profile": {
      "name": "Profile",
      "id": "2 / 4",
      "option": "2 / 4",
      "description": "",
      "link": ""
    },
    "IncarnationCross": {
      "name": "Incarnation Cross",
      "id": "Right Angle Cross of The Sphinx  (2/1 | 13/7)",
      "option": "Right Angle Cross of The Sphinx  (2/1 | 13/7)",
      "description": "",
      "link": ""
    },
    "Signature": {
      "name": "Signature",
      "id": "Satisfaction",
      "option": "Satisfaction",
      "description": "",
      "link": ""
    },
    "NotSelfTheme": {
      "name": "Not-Self Theme",
      "id": "Frustration",
      "option": "Frustration",
      "description": "",
      "link": ""
    },
    "Digestion": {
      "name": "Digestion",
      "id": "Calm",
      "option": "Calm",
      "description": "",
      "link": ""
    },
    "Sense": {
      "name": "Sense",
      "id": "Meditation",
      "option": "Meditation",
      "description": "",
      "link": ""
    },
    "DesignSense": {
      "name": "Design Sense",
      "id": "Outer Vision",
      "option": "Outer Vision",
      "description": "",
      "link": ""
    },
    "Motivation": {
      "name": "Motivation",
      "id": "Desire",
      "option": "Desire",
      "description": "",
      "link": ""
    },
    "Perspective": {
      "name": "Perspective",
      "id": "Personal",
      "option": "Personal",
      "description": "",
      "link": ""
    },
    "Environment": {
      "name": "Environment",
      "id": "Kitchens",
      "option": "Kitchens",
      "description": "",
      "link": ""
    },
    "Miljø": {
      "name": "Miljø",
      "id": "Kitchen Dry",
      "option": "Kitchen Dry",
      "description": "",
      "link": ""
    },
    "Gates": {
      "name": "Gates",
      "id": "Gates",
      "list": [
        {
          "option": 2,
          "description": "",
          "link": ""
        },
        {
          "option": 1,
          "description": "",
          "link": ""
        },
        {
          "option": 53,
          "description": "",
          "link": ""
        },
        {
          "option": 54,
          "description": "",
          "link": ""
        },
        {
          "option": 23,
          "description": "",
          "link": ""
        }
      ]
    }
  }
}
```

## Response Field Mapping to HDExtract

| HDExtract Field | API Response Path | Notes |
|----------------|-------------------|-------|
| `type` | `Properties.Type.option` | e.g., "Manifesting Generator" |
| `authority` | `Properties.InnerAuthority.option` | e.g., "Emotional - Solar Plexus" → "Emotional" |
| `profile` | `Properties.Profile.option` | e.g., "2 / 4" → "2/4" |
| `centers` | Need to parse from channels/gates | Not directly provided |
| `channels` | Need to derive from gates | Not directly provided |
| `gates` | `Properties.Gates.list[].option` | Array of gate numbers |

## Implementation Notes

### Authority Mapping

The API returns detailed authority names. Map to simplified versions:

```typescript
const authorityMap: Record<string, string> = {
  'Emotional - Solar Plexus': 'Emotional',
  'Sacral': 'Sacral',
  'Splenic': 'Splenic',
  'Ego Manifested': 'Ego',
  'Ego Projected': 'Ego',
  'Self Projected': 'Self-Projected',
  'Mental Projector': 'Mental',
  'Lunar': 'Lunar',
};
```

### Profile Formatting

The API returns profiles with spaces (e.g., "2 / 4"). Remove spaces:

```typescript
const profile = apiProfile.replace(/\s+/g, ''); // "2 / 4" → "2/4"
```

### Centers Derivation

Centers are not directly provided. Options:
1. Derive from gates (complex, requires HD logic)
2. Make a second API call if available
3. Use a lookup table for common gate→center mappings

### Channels Derivation

Channels are pairs of gates. Options:
1. Derive from gates using HD channel definitions
2. Use hdkit constants to map gates to channels
3. Make a second API call if available

### Versioning

- Use the `latest` alias unless you need immutable behaviour.  
- Confirmed that `v200101`, `v210101`, `v220101`, `v221006`, `v230101`, `v230915`, `v240101`, `v240701`, `v241201`, and `v250101` all return `Invalid API key` (meaning the route exists) as of 2025-10-09.  
- Pin to a dated version and monitor BodyGraph release announcements if backward compatibility is critical.

## Date Format Conversion

The API expects `YYYY-MM-DD HH:mm` format. Convert from our internal format:

```typescript
// From: dateISO = "1992-10-03", time = "00:03"
// To: "1992-10-03 00:03"
const apiDate = `${dateISO} ${time}`;
```

## Error Handling

Handle these potential errors:
- Invalid API key (401)
- Invalid date format (400)
- Invalid timezone (400)
- Rate limiting (429)
- Server errors (500)

## Rate Limits

Check with BodyGraph Chart API for rate limits. Implement:
- Request throttling
- Caching of results
- Retry logic with exponential backoff

## Testing

Test with known birth data:
- Oct 3, 1992, 00:03, America/New_York
- Expected: Manifesting Generator, 1/3, Sacral authority

## Security

**Important**: Keep `BODYGRAPH_API_KEY` outside of source control.

Recommended storage:
1. Environment variables via `react-native-config` (preferred)
2. A secure, gitignored config file for local development
3. A backend token exchange so mobile clients never see the raw key

## Cost Considerations

- Check pricing with BodyGraph Chart API
- Implement caching to reduce API calls
- Cache charts by birth data hash
- Consider storing in local database (SQLite)

## Next Steps

1. Implement API client in `src/hd/api-client.ts`
2. Add response transformation logic
3. Implement center/channel derivation
4. Add error handling and retry logic
5. Test with known birth data
6. Implement caching strategy

## References

- Bodygraph.com Human Design API overview (retrieved 2025-10-09): https://bodygraph.com/feature/human-design-api/
- Bodygraph.com Help Centre – Human Design API article (retrieved 2025-10-09): https://bodygraph.com/help/human-design-api/
- Endpoint availability check (returns `{"error":"Invalid API key"}` as of 2025-10-09): https://api.bodygraphchart.com/latest/hd-data
