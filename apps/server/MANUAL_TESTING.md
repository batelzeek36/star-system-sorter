# Manual Testing Guide for BodyGraph Proxy

This guide walks through manual testing of the BodyGraph proxy server.

## Prerequisites

1. Valid `BODYGRAPH_API_KEY` in `.env` file at project root
2. Server dependencies installed: `npm install --prefix ./apps/server`

## Start the Server

```bash
# From project root
npm run dev --prefix ./apps/server
```

You should see:

```
[Server] Listening on http://localhost:3000
[Server] BodyGraph proxy: POST /internal/hd
[Server] Health check: GET /health
```

## Test 1: Valid Request → 200 JSON with Expected Fields

**Test a valid birth date:**

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2019-05-05 10:10",
    "timezone": "Europe/London"
  }' | jq
```

**Expected Result:**

- HTTP Status: `200`
- Response contains JSON with `Properties` object
- Properties include: `Type`, `InnerAuthority`, `Profile`, `Gates`, etc.
- Server logs show: `[HD] Cache MISS: 2019-05-05 10:10|Europe/London`

**Example Response:**

```json
{
  "Properties": {
    "Type": {
      "option": "Manifesting Generator"
    },
    "InnerAuthority": {
      "option": "Emotional - Solar Plexus"
    },
    "Profile": {
      "option": "2 / 4"
    },
    "Gates": {
      "list": [{ "option": 2 }, { "option": 1 }]
    }
  }
}
```

## Test 2: Same Payload Twice → Cache Hit

**Send the exact same request again:**

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2019-05-05 10:10",
    "timezone": "Europe/London"
  }' | jq
```

**Expected Result:**

- HTTP Status: `200`
- Same JSON response as Test 1
- Server logs show: `[HD] Cache HIT: 2019-05-05 10:10|Europe/London`
- **No upstream API call made** (check network logs or API usage dashboard)

## Test 3: Remove/Alter API Key → 401/500 with Helpful Message

### Test 3a: Missing API Key

**Temporarily remove `BODYGRAPH_API_KEY` from `.env` and restart server:**

```bash
# Remove or comment out BODYGRAPH_API_KEY in .env
# Restart server
npm run dev --prefix ./apps/server
```

**Make a request:**

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2019-05-05 10:10",
    "timezone": "Europe/London"
  }'
```

**Expected Result:**

- HTTP Status: `500`
- Response: `{"error":"Server misconfiguration"}`
- Server logs show: `BODYGRAPH_API_KEY not configured`

### Test 3b: Invalid API Key

**Set an invalid API key in `.env` and restart:**

```bash
BODYGRAPH_API_KEY=invalid-key-12345
```

**Make a request with a NEW date (to avoid cache):**

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1990-01-15 14:30",
    "timezone": "America/New_York"
  }'
```

**Expected Result:**

- HTTP Status: `401`
- Response: `{"error":"API authentication failed"}`

**Restore valid API key before continuing!**

## Test 4: Invalid Request Format → 400 with Validation Errors

### Test 4a: Invalid Date Format

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "05/05/2019 10:10",
    "timezone": "Europe/London"
  }'
```

**Expected Result:**

- HTTP Status: `400`
- Response includes validation errors:

```json
{
  "error": "Invalid request format",
  "details": [
    {
      "code": "invalid_string",
      "path": ["date"],
      "message": "Invalid"
    }
  ]
}
```

### Test 4b: Missing Required Field

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2019-05-05 10:10"
  }'
```

**Expected Result:**

- HTTP Status: `400`
- Response shows missing `timezone` field

### Test 4c: Wrong HTTP Method

```bash
curl -X GET http://localhost:3000/internal/hd
```

**Expected Result:**

- HTTP Status: `405`
- Response: `{"error":"Method not allowed"}`

## Test 5: Simulate Upstream Errors

**Note:** These tests require mocking or actual upstream failures. For production testing, you can:

1. Use a network proxy to simulate upstream errors
2. Temporarily modify the code to force error responses
3. Wait for actual rate limiting (not recommended)

### Expected Behaviors:

**Upstream 429 (Rate Limit):**

- Proxy returns: HTTP `429`
- Response: `{"error":"Rate limit exceeded"}`

**Upstream 500 (Server Error):**

- Proxy returns: HTTP `503`
- Response: `{"error":"BodyGraph service unavailable"}`

**Upstream 503 (Service Unavailable):**

- Proxy returns: HTTP `503`
- Response: `{"error":"BodyGraph service unavailable"}`

## Test 6: Health Check

```bash
curl http://localhost:3000/health
```

**Expected Result:**

- HTTP Status: `200`
- Response: `{"status":"ok"}`

## Test 7: CORS Headers

```bash
curl -X OPTIONS http://localhost:3000/internal/hd -v
```

**Expected Result:**

- HTTP Status: `204`
- Headers include:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: GET, POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type, Authorization`

## Test 8: Cache Expiration

**Note:** Cache TTL is 30 days, so this test requires either:

1. Modifying the TTL to a shorter duration (e.g., 10 seconds) for testing
2. Waiting 30 days (not practical)

**To test cache expiration:**

1. Modify `CACHE_TTL_MS` in `src/routes/hd.ts` to `10000` (10 seconds)
2. Restart server
3. Make a request
4. Wait 11 seconds
5. Make the same request again
6. Should see `Cache MISS` (cache expired)

## Test 9: Different Cache Keys

**Test that different parameters create different cache entries:**

```bash
# Request 1
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"2019-05-05 10:10","timezone":"Europe/London"}'

# Request 2 - Different time
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"2019-05-05 10:11","timezone":"Europe/London"}'

# Request 3 - Different timezone
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"2019-05-05 10:10","timezone":"America/New_York"}'
```

**Expected Result:**

- All three requests should show `Cache MISS` (different cache keys)
- Each should make an upstream API call

## Cleanup

```bash
# Stop the server with Ctrl+C
# Or kill by port:
lsof -ti:3000 | xargs kill -9
```

## Troubleshooting

**Server won't start:**

- Check if port 3000 is already in use: `lsof -i:3000`
- Verify `.env` file exists at project root
- Check Node.js version: `node --version` (should be ≥20)

**401 errors:**

- Verify `BODYGRAPH_API_KEY` is set correctly in `.env`
- Check API key is valid on BodyGraph dashboard
- Ensure no extra spaces or quotes in `.env` file

**Connection refused:**

- Ensure server is running
- Check firewall settings
- Verify correct URL (localhost vs 127.0.0.1)

## Success Criteria

All tests should pass with expected results:

- ✅ Valid requests return 200 with proper JSON structure
- ✅ Cache hits are logged and don't make upstream calls
- ✅ Missing/invalid API key returns 401/500 with clear error
- ✅ Invalid requests return 400 with validation details
- ✅ Upstream errors are properly mapped to normalized responses
- ✅ CORS headers are present
- ✅ Health check works
- ✅ Different parameters create different cache entries
