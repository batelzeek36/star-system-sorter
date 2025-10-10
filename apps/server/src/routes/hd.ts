// @file apps/server/src/routes/hd.ts
// BodyGraph Chart API proxy endpoint
// Forwards requests to https://api.bodygraphchart.com/v221006/hd-data
// with caching and error handling

import { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';

// Request validation schema
// API expects: date (YYYY-MM-DD HH:mm), timezone
const HDRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/), // "YYYY-MM-DD HH:mm"
  timezone: z.string(),
});

type HDRequest = z.infer<typeof HDRequestSchema>;

// Cache entry type
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache with 30-day TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Generate cache key from request params
function getCacheKey(params: HDRequest): string {
  const { date, timezone } = params;
  return `${date}|${timezone}`;
}

// Check if cache entry is valid
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

// Forward request to BodyGraph API
async function fetchFromBodyGraph(
  params: HDRequest,
  apiKey: string
): Promise<unknown> {
  // Build URL with query parameters
  // Using v221006 as it's confirmed working (latest returns "API endpoint not found")
  const url = new URL('https://api.bodygraphchart.com/v221006/hd-data');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('date', params.date);
  url.searchParams.set('timezone', params.timezone);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    
    // Map upstream errors to clean client errors
    if (status === 400) {
      throw new Error('Invalid birth data format');
    }
    if (status === 401) {
      throw new Error('API authentication failed');
    }
    if (status === 429) {
      throw new Error('Rate limit exceeded');
    }
    if (status >= 500) {
      throw new Error('BodyGraph service unavailable');
    }
    
    throw new Error(`Upstream error: ${status} ${text}`);
  }

  return response.json();
}

// Main handler
export async function handleHDRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // Only accept POST
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Read request body
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    const body = Buffer.concat(chunks).toString();
    const rawData = JSON.parse(body);

    // Validate request
    const validatedData = HDRequestSchema.parse(rawData);

    // Check API key
    const apiKey = process.env.BODYGRAPH_API_KEY;
    if (!apiKey) {
      console.error('BODYGRAPH_API_KEY not configured');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server misconfiguration' }));
      return;
    }

    // Check cache
    const cacheKey = getCacheKey(validatedData);
    const cached = cache.get(cacheKey);
    
    if (cached && isCacheValid(cached)) {
      console.log(`[HD] Cache HIT: ${cacheKey}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cached.data));
      return;
    }

    console.log(`[HD] Cache MISS: ${cacheKey}`);

    // Fetch from upstream
    const data = await fetchFromBodyGraph(validatedData, apiKey);

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    // Return response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Invalid request format',
        details: error.issues,
      }));
      return;
    }

    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('Invalid birth data')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
        return;
      }
      
      if (message.includes('authentication failed')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
        return;
      }
      
      if (message.includes('Rate limit')) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
        return;
      }
      
      if (message.includes('unavailable')) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
        return;
      }
    }

    console.error('[HD] Unexpected error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
