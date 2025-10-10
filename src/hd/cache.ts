// BodyGraph API cache with in-memory + AsyncStorage persistence
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HDExtract } from './types';

const CACHE_PREFIX = '@hd_cache:';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface CacheEntry {
  data: HDExtract;
  timestamp: number;
}

interface CacheKey {
  utcTimestamp: string;
  lat?: number;
  lon?: number;
}

// In-memory cache for fast access
const memoryCache = new Map<string, CacheEntry>();

// In-flight request tracking for coalescing
const inflightRequests = new Map<string, Promise<HDExtract>>();

export function getCacheKey(key: CacheKey): string {
  const { utcTimestamp, lat, lon } = key;
  const latStr = lat !== undefined ? lat.toFixed(4) : 'none';
  const lonStr = lon !== undefined ? lon.toFixed(4) : 'none';
  return `${utcTimestamp}|${latStr}|${lonStr}`;
}

export async function getCached(key: CacheKey): Promise<HDExtract | null> {
  const cacheKey = getCacheKey(key);
  const now = Date.now();
  
  // Check memory cache first
  const memEntry = memoryCache.get(cacheKey);
  if (memEntry && now - memEntry.timestamp < CACHE_TTL_MS) {
    console.log('[HD Cache] Memory hit:', cacheKey);
    return memEntry.data;
  }
  
  // Check AsyncStorage
  try {
    const stored = await AsyncStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
    if (stored) {
      const entry: CacheEntry = JSON.parse(stored);
      if (now - entry.timestamp < CACHE_TTL_MS) {
        console.log('[HD Cache] Storage hit:', cacheKey);
        // Populate memory cache
        memoryCache.set(cacheKey, entry);
        return entry.data;
      } else {
        // Expired, remove it
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
      }
    }
  } catch (error) {
    console.warn('[HD Cache] Storage read error:', error);
  }
  
  console.log('[HD Cache] Miss:', cacheKey);
  return null;
}

export async function setCached(key: CacheKey, data: HDExtract): Promise<void> {
  const cacheKey = getCacheKey(key);
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
  };
  
  // Store in memory
  memoryCache.set(cacheKey, entry);
  
  // Persist to AsyncStorage
  try {
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${cacheKey}`,
      JSON.stringify(entry)
    );
    console.log('[HD Cache] Stored:', cacheKey);
  } catch (error) {
    console.warn('[HD Cache] Storage write error:', error);
  }
}

export function getInflightRequest(key: CacheKey): Promise<HDExtract> | null {
  const cacheKey = getCacheKey(key);
  return inflightRequests.get(cacheKey) || null;
}

export function setInflightRequest(
  key: CacheKey,
  promise: Promise<HDExtract>
): void {
  const cacheKey = getCacheKey(key);
  inflightRequests.set(cacheKey, promise);
  
  // Clean up after promise settles (success or error)
  promise
    .then(() => {
      inflightRequests.delete(cacheKey);
    })
    .catch(() => {
      inflightRequests.delete(cacheKey);
    });
}

export function clearMemoryCache(): void {
  memoryCache.clear();
  inflightRequests.clear();
  console.log('[HD Cache] Cleared memory cache');
}

export async function clearCache(): Promise<void> {
  memoryCache.clear();
  inflightRequests.clear();
  
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log('[HD Cache] Cleared all cache entries');
  } catch (error) {
    console.warn('[HD Cache] Clear cache error:', error);
  }
}
