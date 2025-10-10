# Star System Sorter Server

Node.js HTTP server for Star System Sorter (S³) with BodyGraph Chart API proxy.

## Features

- **BodyGraph Proxy**: Forwards requests to BodyGraph Chart API with caching
- **In-memory caching**: 30-day TTL for HD chart data
- **Error mapping**: Clean error messages for upstream failures
- **CORS support**: Permissive headers for development

## Setup

```bash
# Install dependencies
npm install

# Set environment variables in ../../.env
BODYGRAPH_API_KEY=your-api-key-here
PORT=3000
```

## Development

```bash
# Start server with auto-reload
npm run dev

# Server will be available at:
# - http://localhost:3000 (iOS simulator, desktop)
# - http://10.0.2.2:3000 (Android emulator)
# - http://<YOUR_LAN_IP>:3000 (physical devices)
```

## Production

```bash
# Start server
npm start
```

## Testing

```bash
# Run tests
npm test

# Type check
npm run typecheck
```

## API Endpoints

### POST /internal/hd

Proxy endpoint for BodyGraph Chart API.

**Request:**
```json
{
  "date": "1990-01-15 14:30",
  "timezone": "America/New_York"
}
```

**Response (200):**
```json
{
  "type": "Manifestor",
  "authority": "Emotional",
  "profile": "1/3",
  "centers": ["Sacral", "Solar Plexus"],
  "channels": [34, 57],
  "gates": [1, 2, 3]
}
```

**Error Responses:**
- `400`: Invalid request format or birth data
- `401`: API authentication failed
- `429`: Rate limit exceeded
- `500`: Server misconfiguration
- `503`: BodyGraph service unavailable

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Caching

The proxy caches responses based on:
- Date and time (YYYY-MM-DD HH:mm format)
- Timezone

Cache entries are valid for 30 days. Cache hits and misses are logged to console.

## Environment Variables

- `BODYGRAPH_API_KEY` (required): API key for BodyGraph Chart API
- `PORT` (optional): Server port, defaults to 3000

## Architecture

- **node:http**: Native HTTP server (no Express)
- **Zod**: Request validation
- **In-memory cache**: Map-based cache with TTL

## File Structure

```
apps/server/
├── src/
│   ├── routes/
│   │   └── hd.ts          # BodyGraph proxy handler
│   ├── http.ts            # HTTP server setup
│   └── index.ts           # Server entry point
├── __tests__/
│   └── hd.test.ts         # Comprehensive tests
├── package.json
├── tsconfig.json
└── README.md
```

## Testing Coverage

Tests cover:
- ✅ Happy path (valid requests)
- ✅ Caching (30-day TTL)
- ✅ Cache key generation
- ✅ Validation errors (400)
- ✅ Authentication errors (401)
- ✅ Rate limiting (429)
- ✅ Server errors (5xx)
- ✅ Method validation
- ✅ Cache logging

Target coverage: ≥80% for all metrics.
