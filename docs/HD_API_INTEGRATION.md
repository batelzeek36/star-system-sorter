# Human Design API Integration Guide

## Current Status

The app currently uses **mock HD chart data** for development. To get accurate Human Design charts, you need to integrate with an HD chart calculation API.

## Why Use an API?

Human Design chart calculation requires:
- **Ephemeris data** (planetary positions for any date/time)
- **Complex astronomical calculations** (sidereal vs tropical, precession, etc.)
- **HD-specific logic** (type determination, authority, channels, centers)

Building this from scratch would take months. Using an established API gives you:
- ✅ Accurate calculations
- ✅ Maintained ephemeris data
- ✅ Professional-grade results
- ✅ Much faster development

## Recommended APIs

### 1. MyBodyGraph API (Recommended)
- **Website**: https://www.mybodygraph.com/
- **Status**: Most popular HD service
- **API**: Contact them for developer API access
- **Pros**: Established, accurate, widely used
- **Cons**: May require paid plan

### 2. Genetic Matrix API
- **Website**: https://www.geneticmatrix.com/
- **Status**: Another major HD service
- **API**: Check if they offer developer API
- **Pros**: Professional service
- **Cons**: API availability unclear

### 3. JovianArchive
- **Website**: https://www.jovianarchive.com/
- **Status**: Official HD organization (Ra Uru Hu's legacy)
- **API**: May have developer access
- **Pros**: Most authoritative source
- **Cons**: May be more restrictive

### 4. Build Your Own (Not Recommended for MVP)
- Use Swiss Ephemeris library
- Implement HD calculation logic
- **Time**: 2-3 months of development
- **Complexity**: High
- **Recommendation**: Only if you can't find an API

## Integration Steps

### Step 1: Choose an API

Research and sign up for one of the APIs above. You'll need:
- API endpoint URL
- API key or authentication credentials
- API documentation

### Step 2: Configure Environment Variables

Add to your `.env` file (create if it doesn't exist):

```bash
# Human Design API Configuration
HD_API_BASE_URL=https://api.example.com/v1
HD_API_KEY=your_api_key_here
```

### Step 3: Update API Client

Edit `src/hd/api-client.ts` to match your API's structure:

```typescript
// Example for MyBodyGraph-style API
export async function callHDChartAPI(
  dateISO: string,
  time: string,
  timeZone: string,
  lat?: number,
  lon?: number
): Promise<HDExtract | null> {
  const response = await fetch(`${API_CONFIG.baseURL}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_CONFIG.apiKey,
    },
    body: JSON.stringify({
      birthDate: dateISO,
      birthTime: time,
      timezone: timeZone,
      latitude: lat,
      longitude: lon,
    }),
  });
  
  const data = await response.json();
  
  // Transform to HDExtract format
  return {
    type: data.design.type,
    authority: data.design.authority,
    profile: data.design.profile,
    centers: data.design.definedCenters,
    channels: data.design.channels,
    gates: data.design.gates,
  };
}
```

### Step 4: Enable API in Adapter

Uncomment the API call in `src/hd/hdkit-adapter.ts`:

```typescript
// Strategy 2: Call HD chart API
const apiResult = await callHDChartAPI(dateISO, time, timeZone, lat, lon);
if (apiResult) return apiResult;
```

### Step 5: Test with Known Data

Test with your birth data:
- Date: October 3, 1992
- Time: 12:03 AM (00:03)
- Location: Attleboro, MA
- Timezone: America/New_York

Expected result:
- Type: Manifesting Generator
- Authority: Sacral
- Profile: 1/3

## Current Workaround: Known Charts

Until you integrate an API, the app uses a lookup table in `src/hd/known-charts.ts`:

```typescript
export const KNOWN_CHARTS: Record<string, HDExtract> = {
  '1992-10-03|00:03|America/New_York': {
    type: 'Manifesting Generator',
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral', 'Throat', 'Spleen', 'G', 'Root'],
    channels: [2034, 3457, 1858],
    gates: [1, 2, 3, 13, 14, 18, 20, 25, 34, 57, 58],
  },
};
```

To add more charts for testing:
1. Calculate the chart using a trusted HD service
2. Add it to `KNOWN_CHARTS` in the same format
3. The app will use it automatically

## API Response Mapping

Most HD APIs return similar data. Here's how to map it to `HDExtract`:

| HDExtract Field | Common API Fields |
|----------------|-------------------|
| `type` | `type`, `design.type`, `bodygraph.type` |
| `authority` | `authority`, `innerAuthority`, `strategy` |
| `profile` | `profile`, `profileLine` |
| `centers` | `definedCenters`, `centers.defined`, `activeCenters` |
| `channels` | `channels`, `activeChannels`, `definedChannels` |
| `gates` | `gates`, `activeGates`, `activations` |

## Testing the Integration

1. **Add console logging** to see API responses:
```typescript
console.log('[HD API] Response:', data);
```

2. **Test with known birth data** and verify results match

3. **Check error handling** for invalid inputs

4. **Monitor API rate limits** and costs

## Cost Considerations

- Most HD APIs charge per calculation
- Typical costs: $0.01 - $0.10 per chart
- For MVP: Budget ~$50-100 for testing
- For production: Implement caching to reduce costs

## Caching Strategy

To reduce API costs:

1. **Cache calculated charts** by birth data hash
2. **Store in local database** (SQLite for mobile)
3. **Only recalculate** if birth data changes

Example:
```typescript
// Check cache first
const cached = await getCachedChart(dateISO, time, timeZone);
if (cached) return cached;

// Call API if not cached
const result = await callHDChartAPI(...);

// Cache the result
await cacheChart(dateISO, time, timeZone, result);
```

## Next Steps

1. **Research APIs**: Contact MyBodyGraph or Genetic Matrix
2. **Get API access**: Sign up and get credentials
3. **Update `api-client.ts`**: Implement the actual API call
4. **Test thoroughly**: Verify accuracy with known charts
5. **Implement caching**: Reduce costs and improve performance

## Questions?

If you need help:
1. Check the API's documentation
2. Test with their examples first
3. Verify the response format matches `HDExtract`
4. Add logging to debug transformation issues

## Alternative: Temporary Solution

For MVP testing without an API:
1. Use https://www.mybodygraph.com/ to calculate charts manually
2. Add them to `known-charts.ts`
3. This works for demos and testing
4. Integrate real API before launch
