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
  const gates = gatesList.map((g: any) => g.option).filter((n: any) => typeof n === 'number');
  return gates.sort((a: number, b: number) => a - b);
}

// Gate-to-Center mapping based on Human Design system
const GATE_TO_CENTER: Record<number, string> = {
  // Head Center
  61: 'Head', 63: 'Head', 64: 'Head',
  // Ajna Center
  47: 'Ajna', 24: 'Ajna', 4: 'Ajna', 17: 'Ajna', 43: 'Ajna', 11: 'Ajna',
  // Throat Center
  62: 'Throat', 23: 'Throat', 56: 'Throat', 35: 'Throat', 12: 'Throat',
  45: 'Throat', 33: 'Throat', 8: 'Throat', 31: 'Throat', 20: 'Throat', 16: 'Throat',
  // G Center (Identity)
  7: 'G', 1: 'G', 13: 'G', 10: 'G',
  // Will/Ego Center
  21: 'Will', 40: 'Will', 26: 'Will', 51: 'Will',
  // Sacral Center
  5: 'Sacral', 14: 'Sacral', 29: 'Sacral', 59: 'Sacral', 9: 'Sacral',
  3: 'Sacral', 42: 'Sacral', 27: 'Sacral', 34: 'Sacral',
  // Spleen Center
  48: 'Spleen', 57: 'Spleen', 44: 'Spleen', 50: 'Spleen', 32: 'Spleen',
  28: 'Spleen', 18: 'Spleen',
  // Solar Plexus Center
  6: 'Solar Plexus', 37: 'Solar Plexus', 22: 'Solar Plexus', 36: 'Solar Plexus',
  30: 'Solar Plexus', 55: 'Solar Plexus', 49: 'Solar Plexus',
  // Root Center
  58: 'Root', 38: 'Root', 54: 'Root', 53: 'Root', 60: 'Root',
  52: 'Root', 19: 'Root', 39: 'Root', 41: 'Root',
  // Additional gates
  2: 'G', 15: 'G', 46: 'G', 25: 'G',
};

// Channel definitions (gate pairs)
const CHANNELS: Array<[number, number]> = [
  // Format Design channels
  [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31],
  [9, 52], [10, 20], [10, 34], [10, 57], [11, 56], [12, 22], [13, 33],
  [16, 48], [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45],
  [23, 43], [24, 61], [25, 51], [26, 44], [27, 50], [28, 38], [29, 46],
  [30, 41], [32, 54], [35, 36], [37, 40], [39, 55], [42, 53], [47, 64],
];

function deriveCenters(props: any): string[] {
  const gates = extractGates(props);
  const centerSet = new Set<string>();
  
  gates.forEach(gate => {
    const center = GATE_TO_CENTER[gate];
    if (center) {
      centerSet.add(center);
    }
  });
  
  return Array.from(centerSet).sort();
}

function deriveChannels(props: any): number[] {
  const gates = extractGates(props);
  const gateSet = new Set(gates);
  const channels: number[] = [];
  
  CHANNELS.forEach(([gate1, gate2]) => {
    if (gateSet.has(gate1) && gateSet.has(gate2)) {
      // Use the smaller gate number as the channel identifier
      channels.push(Math.min(gate1, gate2));
    }
  });
  
  return channels.sort((a, b) => a - b);
}

// Export cache utilities for testing
export { clearCache, clearMemoryCache } from './cache';
