/**
 * hdkit adapter for computing Human Design extracts
 * 
 * NOTE: This is a stub implementation. The hdkit library at repo root
 * provides constants and helpers but not complete chart calculation.
 * This adapter demonstrates the API shape and can be replaced with
 * real ephemeris calculations when available.
 * 
 * @exception(max-lines) why: Core adapter with timezone conversion logic
 */

import type { HDExtract, BirthData } from './types';

/**
 * Convert local wall time + IANA timezone to UTC timestamp
 * Uses platform APIs only (no external time libraries)
 */
function toUTC(dateISO: string, time: string, timeZone: string): Date {
  // Parse date and time
  const [year, month, day] = dateISO.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  // Create date string in ISO format for the given timezone
  const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  
  // Use Intl.DateTimeFormat to convert to UTC
  // This leverages platform timezone data without external deps
  const localDate = new Date(dateTimeStr);
  
  // Get offset for the timezone at this date
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(localDate);
  const tzYear = Number(parts.find(p => p.type === 'year')?.value);
  const tzMonth = Number(parts.find(p => p.type === 'month')?.value);
  const tzDay = Number(parts.find(p => p.type === 'day')?.value);
  const tzHour = Number(parts.find(p => p.type === 'hour')?.value);
  const tzMinute = Number(parts.find(p => p.type === 'minute')?.value);
  
  // Create UTC date from the timezone-adjusted values
  return new Date(Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute));
}

/**
 * Compute Human Design extract from birth data
 * 
 * This is deterministic: same inputs always produce same outputs.
 * 
 * @param birthData - Birth date, time, timezone, and optional location
 * @returns HDExtract with type, authority, profile, centers, channels, gates
 */
export async function computeHDExtract(
  birthData: BirthData
): Promise<HDExtract> {
  const { dateISO, time, timeZone, lat, lon } = birthData;
  
  // Convert to UTC for ephemeris calculations
  const utcDate = toUTC(dateISO, time, timeZone);
  
  // TODO: Replace with real ephemeris calculations
  // For now, return deterministic mock data based on input hash
  const hash = hashInput(dateISO, time, timeZone);
  
  return computeMockExtract(hash, utcDate, lat, lon);
}

/**
 * Hash input for deterministic mock data
 */
function hashInput(
  dateISO: string,
  time: string,
  timeZone: string
): number {
  const str = `${dateISO}|${time}|${timeZone}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate deterministic channels from hash
 */
function generateChannels(hash: number): number[] {
  const numChannels = 2 + ((hash >> 9) % 5);
  const channels: number[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(1 + ((hash + i * 7) % 36));
  }
  return [...new Set(channels)].sort((a, b) => a - b);
}

/**
 * Generate deterministic gates from hash and channels
 */
function generateGates(hash: number, channels: number[]): number[] {
  const gates: number[] = [];
  channels.forEach(ch => {
    gates.push(ch, ch + 32); // Mock: each channel has 2 gates
  });
  for (let i = 0; i < 3; i++) {
    gates.push(1 + ((hash + i * 11) % 64));
  }
  return [...new Set(gates)].sort((a, b) => a - b);
}

/**
 * Compute mock HD extract (deterministic based on hash)
 * TODO: Replace with real ephemeris calculations
 */
function computeMockExtract(
  hash: number,
  _utcDate: Date,
  _lat?: number,
  _lon?: number
): HDExtract {
  const types = ['Manifestor', 'Generator', 'Manifesting Generator', 'Projector', 'Reflector'];
  const authorities = ['Emotional', 'Sacral', 'Splenic', 'Ego', 'Self-Projected', 'Lunar'];
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '5/1', '5/2', '6/2', '6/3'];
  const allCenters = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Spleen', 'Solar Plexus', 'Sacral', 'Root'];
  
  const channels = generateChannels(hash);
  
  return {
    type: types[hash % types.length],
    authority: authorities[(hash >> 3) % authorities.length],
    profile: profiles[(hash >> 6) % profiles.length],
    centers: allCenters.slice(0, 3 + (hash % 5)),
    channels,
    gates: generateGates(hash, channels),
  };
}
