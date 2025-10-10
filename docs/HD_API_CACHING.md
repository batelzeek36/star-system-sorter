# BodyGraph API Caching

## Overview

The BodyGraph API client implements a two-tier caching strategy to minimize network requests and improve performance.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   computeHDExtract()                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Check Memory Cache (Map)                   │
│              • Instant access (<1ms)                    │
│              • Cleared on app restart                   │
└─────────────────────────────────────────────────────────┘
                          ↓ (miss)
┌─────────────────────────────────────────────────────────┐
│           Check AsyncStorage Cache                      │
│           • Persistent across restarts                  │
│           • ~10ms access time                           │
│           • 30-day TTL                                  │
└─────────────────────────────────────────────────────────┘
                          ↓ (miss)
┌─────────────────────────────────────────────────────────┐
│         Check In-Flight Requests (Coalescing)           │
│         • Prevents duplicate network calls              │
│         • Shares promise across simultaneous requests   │
└─────────────────────────────────────────────────────────┘
                          ↓ (not in-flight)
┌─────────────────────────────────────────────────────────┐
│              Network Request to Server                  │
│              POST /internal/hd                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         Store in Memory + AsyncStorage                  │
│         • Memory: immediate access                      │
│         • AsyncStorage: survives restart                │
└─────────────────────────────────────────────────────────┘
```

## Cache Key Format

Cache keys are generated from the request parameters:

```typescript
{utcTimestamp}|{lat}|{lon}
```

### Examples

```typescript
// Without coordinates
"1992-10-03 00:03|none|none"

// With coordinates (4 decimal precision)
"1992-10-03 00:03|40.7128|-74.0060"
```

### Precision

- Coordinates are rounded to 4 decimal places (~11 meters precision)
- This balances cache efficiency with location accuracy

## Cache Behavior

### What Gets Cached

✅ Successful API responses (200 OK)
✅ Transformed HDExtract data
✅ Stored with timestamp for TTL checking

### What Doesn't Get Cached

❌ Error responses (4xx, 5xx)
❌ Network failures
❌ Invalid data

### TTL (Time To Live)

- **Duration**: 30 days
- **Check**: On every cache retrieval
- **Cleanup**: Expired entries removed automatically

## Request Coalescing

When multiple identical requests are made simultaneously:

1. First request starts network call
2. Subsequent requests wait for the same promise
3. All requests receive the same result
4. Only one network call is made

### Example

```typescript
// Three simultaneous identical requests
const [result1, result2, result3] = await Promise.all([
  computeHDExtract(params),
  computeHDExtract(params),
  computeHDExtract(params),
]);

// Only ONE network request is made
// All three results are identical
```

## Logging

Cache operations are logged for debugging:

```typescript
// Cache miss
[HD Cache] Miss: 1992-10-03 00:03|none|none

// Memory cache hit
[HD Cache] Memory hit: 1992-10-03 00:03|none|none

// AsyncStorage cache hit
[HD Cache] Storage hit: 1992-10-03 00:03|none|none

// Cache stored
[HD Cache] Stored: 1992-10-03 00:03|none|none

// Request coalescing
[HD API] Coalescing request: 1992-10-03 00:03|none|none

// Cache cleared
[HD Cache] Cleared all cache entries
[HD Cache] Cleared memory cache
```

## API Reference

### getCached(key: CacheKey)

Retrieves cached data if available and not expired.

```typescript
const cached = await getCached({
  utcTimestamp: '1992-10-03 00:03',
  lat: 40.7128,
  lon: -74.0060,
});

if (cached) {
  // Use cached data
} else {
  // Make network request
}
```

### setCached(key: CacheKey, data: HDExtract)

Stores data in both memory and AsyncStorage.

```typescript
await setCached(
  {
    utcTimestamp: '1992-10-03 00:03',
    lat: 40.7128,
    lon: -74.0060,
  },
  hdExtractData
);
```

### clearCache()

Clears both memory cache and AsyncStorage.

```typescript
await clearCache();
```

### clearMemoryCache()

Clears only the memory cache (useful for testing).

```typescript
clearMemoryCache();
```

## Performance Impact

### Before Caching

- Every request: ~200-500ms (network latency)
- Bandwidth: ~2-5 KB per request
- Server load: High for repeated queries

### After Caching

- Memory hit: <1ms
- AsyncStorage hit: ~10ms
- Network requests reduced by 80-90%
- Bandwidth savings: Significant
- Server load: Reduced

## Testing

The caching implementation includes comprehensive tests:

```bash
npm test -- __tests__/api-client.test.ts
```

### Test Coverage

- ✅ Cache successful responses
- ✅ Cache with different coordinates
- ✅ Request coalescing
- ✅ AsyncStorage persistence
- ✅ Memory cache clearing
- ✅ Error responses not cached
- ✅ Different cache keys for different params

## Best Practices

### When to Clear Cache

```typescript
// User logs out
await clearCache();

// User changes settings that affect HD data
await clearCache();

// Testing/debugging
await clearCache();
```

### Cache Invalidation

The cache automatically expires after 30 days. For manual invalidation:

```typescript
// Clear all caches
await clearCache();

// Or just memory (AsyncStorage persists)
clearMemoryCache();
```

## Troubleshooting

### Cache Not Working

1. Check logs for cache hits/misses
2. Verify AsyncStorage permissions
3. Check if cache was cleared
4. Verify cache key generation

### Stale Data

- Cache TTL is 30 days
- Clear cache manually if needed
- Check timestamp in cached entry

### Memory Issues

- Memory cache is bounded by app lifecycle
- AsyncStorage has device storage limits
- Cache entries are small (~1-2 KB each)

## Future Enhancements

Potential improvements for later:

- [ ] Cache size limits (LRU eviction)
- [ ] Compression for AsyncStorage
- [ ] Cache warming on app start
- [ ] Background cache refresh
- [ ] Cache statistics/metrics
