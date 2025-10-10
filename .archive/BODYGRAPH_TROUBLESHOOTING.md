# BodyGraph API Troubleshooting

## Common Issues

### "Server misconfiguration" Error

**Cause**: API key not set on server

**Solution**:
```bash
# Set BODYGRAPH_API_KEY in server environment
cd apps/server
echo "BODYGRAPH_API_KEY=your_key_here" > .env
npm start
```

### "No internet connection" Error

**Cause**: Network unavailable or server not running

**Solution**:
1. Check device/emulator network connection
2. Verify server is running: `curl http://localhost:3000/internal/hd`
3. For Android emulator, use `http://10.0.2.2:3000`
4. For iOS simulator, use `http://localhost:3000`

### "Invalid input" Error

**Cause**: Malformed date, time, or timezone

**Solution**:
- Date must be YYYY-MM-DD format
- Time must be HH:mm format (24-hour)
- Timezone must be valid IANA identifier (e.g., "America/New_York")

### Cache Not Working

**Symptoms**: Every request hits the API

**Debug**:
```typescript
import { getCached, getCacheKey } from '@/hd/cache';

const key = {
  utcTimestamp: '1992-10-03 00:03',
  lat: undefined,
  lon: undefined,
};
const cached = await getCached(key);
console.log('Cache key:', getCacheKey(key));
console.log('Cached data:', cached);
```

**Solutions**:
1. Check AsyncStorage permissions
2. Verify cache TTL hasn't expired (30 days)
3. Clear cache and retry: `await clearCache()`

### Rate Limit Exceeded

**Cause**: Too many API calls in short time

**Solution**:
1. Verify caching is working
2. Check for request loops
3. Implement request throttling
4. Contact BodyGraph support for limit increase

## Performance Issues

### Slow Response Times

**Expected Times**:
- Cache hit (in-memory): <10ms
- Cache hit (AsyncStorage): 20-50ms
- Cache miss (API call): 500-2000ms
- Network error: 5000-10000ms (timeout)

**Optimization Tips**:
1. **Preload common charts**: Cache celebrity/example charts on app start
2. **Debounce input**: Wait for user to finish typing before calling API
3. **Show loading states**: Use skeleton screens during API calls
4. **Handle errors gracefully**: Show retry button on failures

## Testing

### Manual Testing

Test the server proxy directly:

```bash
# Start the server
cd apps/server
npm start

# Test the endpoint
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1992-10-03 00:03",
    "timezone": "America/New_York"
  }'
```

### Test Data

Use these known birth data points for testing:

**Test Case 1: Manifesting Generator**
```typescript
{
  dateISO: '1992-10-03',
  time: '00:03',
  timeZone: 'America/New_York'
}
// Expected: Manifesting Generator, 1/3, Sacral authority
```

**Test Case 2: Emotional Authority**
```typescript
{
  dateISO: '2019-05-05',
  time: '10:10',
  timeZone: 'Europe/London'
}
// Expected: Manifesting Generator, 2/4, Emotional authority
```

## Monitoring

### Client Logs

```typescript
// Cache hits/misses
console.log('[HD API] Cache HIT:', cacheKey);
console.log('[HD API] Cache MISS:', cacheKey);

// Request coalescing
console.log('[HD API] Coalescing request:', cacheKey);
```

### Server Logs

```typescript
// Cache operations
console.log(`[HD] Cache HIT: ${cacheKey}`);
console.log(`[HD] Cache MISS: ${cacheKey}`);

// Errors
console.error('[HD] Unexpected error:', error);
```

### Metrics to Track

- API call count per day
- Cache hit rate (target: >80%)
- Average response time
- Error rate by type (400, 401, 429, 500)
- Most requested birth dates

## Related Documentation

- [API Reference](./BODYGRAPH_API_REFERENCE.md) - Endpoints and payloads
- [Error Handling](./BODYGRAPH_ERROR_HANDLING.md) - Error codes
- [Caching](./HD_API_CACHING.md) - Cache implementation
