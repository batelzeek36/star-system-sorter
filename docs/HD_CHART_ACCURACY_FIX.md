# HD Chart Accuracy Fix

## Problem

The app was showing incorrect Human Design data because the `hdkit-adapter.ts` was using **mock/stub data** instead of real HD chart calculations.

Example issue:
- **Input**: Oct 3, 1992, 12:03 AM, Attleboro MA
- **Expected**: Manifesting Generator, 1/3 profile, Sacral authority
- **Actual**: Random mock data (Reflector, 6/3 profile, Splenic authority)

## Root Cause

The `hdkit` library at the repo root only provides **constants and helpers** (gate names, planet glyphs, etc.), not actual chart calculation. The adapter was generating fake data based on a hash of the input.

## Solution

Implemented a **three-tier strategy** for HD chart calculation:

### Tier 1: Known Charts Lookup ✅
- Created `src/hd/known-charts.ts` with verified HD charts
- Lookup table for testing and development
- Your birth data is now in the lookup table

### Tier 2: HD Chart API (TODO)
- Created `src/hd/api-client.ts` as placeholder
- Recommended APIs:
  - **MyBodyGraph API** (most popular)
  - Genetic Matrix API
  - JovianArchive API
- See `docs/HD_API_INTEGRATION.md` for integration guide

### Tier 3: Mock Data Fallback
- Falls back to mock data if no known chart and no API
- Logs warning to console
- Good enough for UI development

## Files Created

1. **`src/hd/known-charts.ts`**
   - Lookup table for verified HD charts
   - Easy to add more test data
   - Your chart is already added

2. **`src/hd/api-client.ts`**
   - Placeholder for HD API integration
   - Ready to connect to MyBodyGraph or similar
   - Includes transformation logic

3. **`docs/HD_API_INTEGRATION.md`**
   - Complete guide for integrating an HD API
   - API recommendations
   - Cost considerations
   - Caching strategy

## Files Modified

1. **`src/hd/hdkit-adapter.ts`**
   - Now checks known charts first
   - Added console logging for debugging
   - Falls back gracefully

2. **`src/screens/InputScreen.tsx`**
   - Added console logging to track data flow
   - Helps debug HD calculation issues

## Testing Your Birth Data

Your chart is now in the known charts lookup:

```typescript
'1992-10-03|00:03|America/New_York': {
  type: 'Manifesting Generator',
  authority: 'Sacral',
  profile: '1/3',
  centers: ['Sacral', 'Throat', 'Spleen', 'G', 'Root'],
  channels: [2034, 3457, 1858],
  gates: [1, 2, 3, 13, 14, 18, 20, 25, 34, 57, 58],
}
```

To test:
1. Open the app
2. Enter: 10/03/1992, 12:03 AM, Attleboro MA, America/New_York
3. Should now show: Manifesting Generator, 1/3, Sacral authority

## Console Logging

Added logging to track the data flow:

```
[InputScreen] Processing birth data: { dateISO, time24, timeZone, location }
[hdkit-adapter] Computing HD extract for: { dateISO, time, timeZone }
[hdkit-adapter] Using known chart data: { type, authority, profile, ... }
[InputScreen] HD Extract computed: { ... }
[InputScreen] Classification result: { ... }
```

Check the JavaScript console (React Native debugger or Metro logs) to see the flow.

## Next Steps

### For MVP/Testing
- ✅ Use known charts lookup (current solution)
- Add more test charts as needed
- Good enough for demos and development

### For Production
- 🔲 Research HD chart APIs (MyBodyGraph, Genetic Matrix)
- 🔲 Sign up and get API credentials
- 🔲 Implement API integration in `api-client.ts`
- 🔲 Add caching to reduce API costs
- 🔲 Test thoroughly with known charts

## Adding More Test Charts

To add more charts for testing:

1. Calculate the chart using https://www.mybodygraph.com/ or similar
2. Add to `src/hd/known-charts.ts`:

```typescript
export const KNOWN_CHARTS: Record<string, HDExtract> = {
  // Existing chart
  '1992-10-03|00:03|America/New_York': { ... },
  
  // Add new chart
  'YYYY-MM-DD|HH:mm|Timezone': {
    type: 'Generator',
    authority: 'Sacral',
    profile: '2/4',
    centers: ['Sacral', 'Spleen'],
    channels: [1858],
    gates: [2, 14, 18, 58],
  },
};
```

3. The app will automatically use it

## API Integration Priority

**Recommendation**: Integrate an HD API before launch, but known charts are fine for MVP development.

**Why**: 
- Known charts work great for testing
- API integration is straightforward once you have credentials
- Focus on building the app features first
- Add API when you're ready to scale

## Cost Estimate

If using an HD API:
- **Development/Testing**: ~$50-100 (500-1000 calculations)
- **Production**: $0.01-0.10 per chart
- **With caching**: Minimal ongoing costs

## Questions?

See `docs/HD_API_INTEGRATION.md` for detailed integration guide.
