# BodyGraph Chart API Integration

## Overview

This document provides an overview of the BodyGraph Chart API integration for retrieving Human Design chart data. The integration uses a **server-side proxy** pattern where the React Native client calls our Node.js server at `POST /internal/hd`, which then forwards requests to the BodyGraph API.

**Key Benefit**: The API key is **never** exposed in the mobile bundle.

## Architecture

```
React Native Client → Node.js Server → BodyGraph API
                      (POST /internal/hd)
```

**Benefits**:
- API key never exposed in mobile bundle
- Centralized caching reduces API calls
- Consistent error handling
- Rate limiting control
- Easy to swap providers if needed

## Quick Start

### Client Usage

```typescript
import { computeHDExtract } from '@/hd/api-client';

const result = await computeHDExtract({
  dateISO: '1992-10-03',
  time: '00:03',
  timeZone: 'America/New_York',
});

console.log(result);
// {
//   type: 'Manifesting Generator',
//   authority: 'Sacral',
//   profile: '1/3',
//   gates: [1, 2, 13, 23, 43]
// }
```

### Server Setup

```bash
# Set API key in server environment
cd apps/server
echo "BODYGRAPH_API_KEY=your_key_here" > .env
npm start
```

## Documentation

### Core Documentation

- **[Implementation Guide](./BODYGRAPH_IMPLEMENTATION_GUIDE.md)** - Build from scratch walkthrough
- **[API Reference](./BODYGRAPH_API_REFERENCE.md)** - Endpoints, payloads, and response formats
- **[Field Mapping](./BODYGRAPH_FIELD_MAPPING.md)** - Data transformation details
- **[Error Handling](./BODYGRAPH_ERROR_HANDLING.md)** - Error codes and handling strategies
- **[Troubleshooting](./BODYGRAPH_TROUBLESHOOTING.md)** - Common issues and solutions

### Implementation Documentation

- **[Client Implementation](./BODYGRAPH_CLIENT_IMPLEMENTATION.md)** - Client API code
- **[Proxy Implementation](./BODYGRAPH_PROXY_IMPLEMENTATION.md)** - Server proxy code
- **[Caching](./HD_API_CACHING.md)** - Two-tier caching strategy
- **[Integration Guide](./HD_API_INTEGRATION.md)** - End-to-end integration

### Testing Documentation

- **[API Client Tests](./API_CLIENT_TESTS.md)** - Unit test coverage
- **[Cache Verification](./CACHE_VERIFICATION.md)** - Cache testing

## Key Features

### Two-Tier Caching

1. **In-Memory Cache**: Fast access for repeated requests in the same session
2. **AsyncStorage Cache**: Persistent cache across app restarts (30-day TTL)

### Request Coalescing

Identical in-flight requests are coalesced to prevent duplicate API calls.

### Security

- API key stored **only** on server (never in mobile bundle)
- Environment variable configuration
- Input validation to prevent injection attacks

### Error Handling

- User-friendly error messages
- Network error detection
- Retry guidance for transient errors

## Implementation Status

### Completed ✅

- [x] Server proxy endpoint (`POST /internal/hd`)
- [x] Client API (`computeHDExtract`)
- [x] Two-tier caching (in-memory + AsyncStorage)
- [x] Request coalescing
- [x] Error handling and mapping
- [x] Authority normalization
- [x] Profile formatting
- [x] Gate extraction
- [x] Comprehensive test coverage
- [x] Documentation

### TODO 🚧

- [ ] Implement center derivation from gates
- [ ] Implement channel derivation from gates
- [ ] Add retry logic with exponential backoff
- [ ] Monitor rate limits and adjust caching

## External Resources

- **BodyGraph API Overview**: https://bodygraph.com/feature/human-design-api/
- **BodyGraph Help Centre**: https://bodygraph.com/help/human-design-api/
- **API Endpoint** (v221006): https://api.bodygraphchart.com/v221006/hd-data
- **IANA Timezone Database**: https://www.iana.org/time-zones

## Related Code

- `src/hd/api-client.ts` - Client implementation
- `apps/server/src/routes/hd.ts` - Server proxy implementation
- `src/hd/cache.ts` - Caching implementation
- `__tests__/api-client.test.ts` - Test suite
