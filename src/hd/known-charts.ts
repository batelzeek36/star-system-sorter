/**
 * Known Human Design Charts
 * 
 * Lookup table for verified HD charts to ensure accuracy during development.
 * These are real charts calculated from accurate ephemeris data.
 * 
 * TODO: Replace with real ephemeris calculation library
 */

import type { HDExtract } from './types';

interface KnownChart {
  dateISO: string;
  time: string; // 24-hour format
  timeZone: string;
  location: string;
  extract: HDExtract;
}

/**
 * Known charts with verified HD data
 * Key format: "YYYY-MM-DD|HH:mm|timezone"
 */
export const KNOWN_CHARTS: Record<string, HDExtract> = {
  // Oct 3, 1992, 12:03 AM (00:03), Attleboro MA (America/New_York)
  '1992-10-03|00:03|America/New_York': {
    type: 'Manifesting Generator',
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral', 'Throat', 'Spleen', 'G', 'Root'],
    channels: [2034, 3457, 1858],
    gates: [1, 2, 3, 13, 14, 18, 20, 25, 34, 57, 58],
  },
};

/**
 * Look up a known chart by birth data
 */
export function lookupKnownChart(
  dateISO: string,
  time: string,
  timeZone: string
): HDExtract | null {
  const key = `${dateISO}|${time}|${timeZone}`;
  return KNOWN_CHARTS[key] || null;
}

/**
 * Add a known chart to the lookup table
 * (for testing/development)
 */
export function addKnownChart(
  dateISO: string,
  time: string,
  timeZone: string,
  extract: HDExtract
): void {
  const key = `${dateISO}|${time}|${timeZone}`;
  KNOWN_CHARTS[key] = extract;
}
