// @exception(max-lines) why: API client with caching, error handling, and data transformation
// BodyGraph Chart API Client - Calls server proxy at POST /internal/hd
import { Platform } from 'react-native';
import type { HDExtract } from './types';
import {
  getCached,
  setCached,
  getInflightRequest,
  setInflightRequest,
  getCacheKey,
} from './cache';

// Android emulator needs 10.0.2.2 to reach host machine
// iOS simulator can use localhost
const getAPIBase = (): string => {
  if (__DEV__) {
    return Platform.OS === 'android' 
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';
  }
  return 'https://api.example.com';
};

const API_BASE = getAPIBase();

const AUTHORITY_MAP: Record<string, string> = {
  'Emotional - Solar Plexus': 'Emotional',
  'Emotional': 'Emotional',
  'Sacral': 'Sacral',
  'Splenic': 'Splenic',
  'Ego Manifested': 'Ego',
  'Ego Projected': 'Ego',
  'Self Projected': 'Self-Projected',
  'Mental Projector': 'Mental',
  'Lunar': 'Lunar',
};

export async function computeHDExtract(params: {
  dateISO: string;
  time: string;
  timeZone: string;
  lat?: number;
  lon?: number;
}): Promise<HDExtract> {
  const { dateISO, time, timeZone, lat, lon } = params;
  
  // Convert to UTC timestamp for cache key
  const utcTimestamp = `${dateISO} ${time}`;
  const cacheKey = { utcTimestamp, lat, lon };
  
  // Check cache first
  const cached = await getCached(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Check if request is already in-flight (coalescing)
  const inflight = getInflightRequest(cacheKey);
  if (inflight) {
    console.log('[HD API] Coalescing request:', getCacheKey(cacheKey));
    return inflight;
  }
  
  // Make new request
  const requestPromise = fetchHDData(dateISO, time, timeZone)
    .then(async (result) => {
      // Cache the result
      await setCached(cacheKey, result);
      return result;
    });
  
  // Track in-flight request
  setInflightRequest(cacheKey, requestPromise);
  
  return requestPromise;
}

async function fetchHDData(
  dateISO: string,
  time: string,
  timeZone: string
): Promise<HDExtract> {
  try {
    const response = await fetch(`${API_BASE}/internal/hd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: `${dateISO} ${time}`, timezone: timeZone }),
    });
    
    await handleErrors(response);
    const data = await response.json();
    return transformResponse(data);
  } catch (error) {
    // Network errors (airplane mode, no connection, timeout)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    throw error;
  }
}

async function handleErrors(response: Response): Promise<void> {
  if (response.ok) return;
  
  const status = response.status;
  let message = 'Unknown error';
  
  try {
    const body = await response.json();
    message = body.error || message;
  } catch {
    message = response.statusText;
  }
  
  if (status === 400) throw new Error(`Invalid input: ${message}`);
  if (status === 401) throw new Error(`Server misconfiguration: ${message}`);
  if (status === 429) throw new Error(`Rate limit exceeded: ${message}`);
  if (status >= 500) throw new Error(`Server error: ${message}`);
  throw new Error(`API error (${status}): ${message}`);
}

function transformResponse(data: any): HDExtract {
  const props = data.Properties || {};
  return {
    type: props.Type?.option || 'Generator',
    authority: normalizeAuthority(props.InnerAuthority?.option),
    profile: normalizeProfile(props.Profile?.option),
    centers: deriveCenters(props),
    channels: deriveChannels(props),
    gates: extractGates(props),
  };
}

function normalizeAuthority(raw?: string): string {
  if (!raw) return 'Sacral';
  return AUTHORITY_MAP[raw] || raw;
}

function normalizeProfile(raw?: string): string {
  if (!raw) return '1/3';
  return raw.replace(/\s+/g, '');
}

function extractGates(props: any): number[] {
  const gatesList = props.Gates?.list || [];
  return gatesList.map((g: any) => g.option).filter((n: any) => typeof n === 'number');
}

function deriveCenters(props: any): string[] {
  // TODO: Implement center derivation logic
  return [];
}

function deriveChannels(props: any): number[] {
  // TODO: Implement channel derivation logic
  return [];
}

// Export cache utilities for testing
export { clearCache, clearMemoryCache } from './cache';
