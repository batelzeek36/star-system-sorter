# BodyGraph API Implementation Guide

## Overview

This guide walks you through implementing the BodyGraph Chart API integration from scratch. You'll build both the server proxy and React Native client.

## Prerequisites

- Node.js 20+
- React Native project set up
- BodyGraph API key (get from https://bodygraph.com/feature/human-design-api/)

## Step 1: Server Proxy Setup

### 1.1 Create Server Structure

```bash
mkdir -p apps/server/src/routes
cd apps/server
npm init -y
npm install zod
```

### 1.2 Environment Configuration

Create `apps/server/.env`:

```bash
BODYGRAPH_API_KEY=your_api_key_here
PORT=3000
```

Add to `.gitignore`:

```
apps/server/.env
```

### 1.3 Implement Proxy Route

Create `apps/server/src/routes/hd.ts`:

```typescript
import { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';

const HDRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/),
  timezone: z.string(),
});

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

async function fetchFromBodyGraph(
  params: { date: string; timezone: string },
  apiKey: string
): Promise<unknown> {
  const url = new URL('https://api.bodygraphchart.com/v221006/hd-data');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('date', params.date);
  url.searchParams.set('timezone', params.timezone);

  const response = await fetch(url.toString());
  if (!response.ok) {
    if (response.status === 400) throw new Error('Invalid birth data format');
    if (response.status === 401) throw new Error('API authentication failed');
    if (response.status === 429) throw new Error('Rate limit exceeded');
    throw new Error('BodyGraph service unavailable');
  }
  return response.json();
}

export async function handleHDRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const validatedData = HDRequestSchema.parse(body);

    const apiKey = process.env.BODYGRAPH_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server misconfiguration' }));
      return;
    }

    const cacheKey = `${validatedData.date}|${validatedData.timezone}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cached.data));
      return;
    }

    const data = await fetchFromBodyGraph(validatedData, apiKey);
    cache.set(cacheKey, { data, timestamp: Date.now() });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 500;
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
  }
}
```

### 1.4 Create Server Entry Point

Create `apps/server/src/index.ts`:

```typescript
import { createServer } from 'node:http';
import { handleHDRequest } from './routes/hd.js';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/internal/hd') {
    handleHDRequest(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 1.5 Test Server

```bash
# Start server
npm start

# Test endpoint
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date": "1992-10-03 00:03", "timezone": "America/New_York"}'
```

## Step 2: React Native Client

### 2.1 Create Types

Create `src/hd/types.ts`:

```typescript
export interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
}

export interface BirthData {
  dateISO: string;
  time: string;
  timeZone: string;
  lat?: number;
  lon?: number;
}
```

### 2.2 Implement Client API

Create `src/hd/api-client.ts`:

```typescript
import { Platform } from 'react-native';
import type { HDExtract } from './types';

const API_BASE =
  __DEV__ && Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : __DEV__
    ? 'http://localhost:3000'
    : 'https://api.example.com';

const AUTHORITY_MAP: Record<string, string> = {
  'Emotional - Solar Plexus': 'Emotional',
  Sacral: 'Sacral',
  Splenic: 'Splenic',
  'Ego Manifested': 'Ego',
  'Ego Projected': 'Ego',
  'Self Projected': 'Self-Projected',
  'Mental Projector': 'Mental',
  Lunar: 'Lunar',
};

export async function computeHDExtract(params: {
  dateISO: string;
  time: string;
  timeZone: string;
}): Promise<HDExtract> {
  try {
    const response = await fetch(`${API_BASE}/internal/hd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: `${params.dateISO} ${params.time}`,
        timezone: params.timeZone,
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error || 'API error');
    }

    const data = await response.json();
    const props = data.Properties || {};

    return {
      type: props.Type?.option || 'Generator',
      authority: AUTHORITY_MAP[props.InnerAuthority?.option] || 'Sacral',
      profile: props.Profile?.option?.replace(/\s+/g, '') || '1/3',
      centers: [],
      channels: [],
      gates: (props.Gates?.list || [])
        .map((g: any) => g.option)
        .filter((n: any) => typeof n === 'number'),
    };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No internet connection');
    }
    throw error;
  }
}
```

### 2.3 Usage Example

```typescript
import { computeHDExtract } from '@/hd/api-client';

async function getChart() {
  try {
    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    console.log('Type:', result.type);
    console.log('Authority:', result.authority);
    console.log('Profile:', result.profile);
    console.log('Gates:', result.gates);
  } catch (error) {
    console.error('Failed to get chart:', error.message);
  }
}
```

## Step 3: Add Caching (Optional)

For production, add AsyncStorage caching. See `docs/HD_API_CACHING.md` for details.

## Testing

### Server Test

```bash
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date": "1992-10-03 00:03", "timezone": "America/New_York"}'
```

### Client Test

```typescript
import { computeHDExtract } from '@/hd/api-client';

// Test with known data
const result = await computeHDExtract({
  dateISO: '1992-10-03',
  time: '00:03',
  timeZone: 'America/New_York',
});

expect(result.type).toBe('Manifesting Generator');
expect(result.profile).toBe('1/3');
```

## Next Steps

1. Add caching (see `docs/HD_API_CACHING.md`)
2. Add comprehensive error handling
3. Implement center/channel derivation
4. Add retry logic with exponential backoff
5. Set up monitoring and logging

## Related Documentation

- [API Reference](./BODYGRAPH_API_REFERENCE.md) - Endpoints and payloads
- [Field Mapping](./BODYGRAPH_FIELD_MAPPING.md) - Data transformations
- [Error Handling](./BODYGRAPH_ERROR_HANDLING.md) - Error codes
- [Troubleshooting](./BODYGRAPH_TROUBLESHOOTING.md) - Common issues
