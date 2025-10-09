/**
 * Tests for hdkit adapter
 */

import { computeHDExtract } from '../src/hd';
import type { BirthData, HDExtract } from '../src/hd';

describe('hdkit-adapter', () => {
  describe('computeHDExtract', () => {
    it('should return a valid HDExtract structure', async () => {
      const birthData: BirthData = {
        dateISO: '1990-01-15',
        time: '14:30',
        timeZone: 'America/New_York',
      };

      const result = await computeHDExtract(birthData);

      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('authority');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('centers');
      expect(result).toHaveProperty('channels');
      expect(result).toHaveProperty('gates');

      expect(typeof result.type).toBe('string');
      expect(typeof result.authority).toBe('string');
      expect(typeof result.profile).toBe('string');
      expect(Array.isArray(result.centers)).toBe(true);
      expect(Array.isArray(result.channels)).toBe(true);
      expect(Array.isArray(result.gates)).toBe(true);
    });

    it('should be deterministic (same inputs → same outputs)', async () => {
      const birthData: BirthData = {
        dateISO: '1985-06-20',
        time: '08:15',
        timeZone: 'Europe/London',
      };

      const result1 = await computeHDExtract(birthData);
      const result2 = await computeHDExtract(birthData);

      expect(result1).toEqual(result2);
    });

    it('should produce different results for different inputs', async () => {
      const birthData1: BirthData = {
        dateISO: '1990-01-15',
        time: '14:30',
        timeZone: 'America/New_York',
      };

      const birthData2: BirthData = {
        dateISO: '1992-03-22',
        time: '09:45',
        timeZone: 'America/Los_Angeles',
      };

      const result1 = await computeHDExtract(birthData1);
      const result2 = await computeHDExtract(birthData2);

      expect(result1).not.toEqual(result2);
    });

    it('should handle optional lat/lon parameters', async () => {
      const birthData: BirthData = {
        dateISO: '1988-11-10',
        time: '16:20',
        timeZone: 'Asia/Tokyo',
        lat: 35.6762,
        lon: 139.6503,
      };

      const result = await computeHDExtract(birthData);

      expect(result).toHaveProperty('type');
      expect(result.gates.length).toBeGreaterThan(0);
    });

    it('should return valid HD types', async () => {
      const birthData: BirthData = {
        dateISO: '1995-07-04',
        time: '12:00',
        timeZone: 'America/Chicago',
      };

      const result = await computeHDExtract(birthData);

      const validTypes = [
        'Manifestor',
        'Generator',
        'Manifesting Generator',
        'Projector',
        'Reflector',
      ];

      expect(validTypes).toContain(result.type);
    });

    it('should return valid profile format', async () => {
      const birthData: BirthData = {
        dateISO: '2000-12-25',
        time: '18:45',
        timeZone: 'Australia/Sydney',
      };

      const result = await computeHDExtract(birthData);

      // Profile should be in format "N/N" where N is 1-6
      expect(result.profile).toMatch(/^[1-6]\/[1-6]$/);
    });

    it('should return sorted and unique channels', async () => {
      const birthData: BirthData = {
        dateISO: '1987-04-18',
        time: '07:30',
        timeZone: 'America/Denver',
      };

      const result = await computeHDExtract(birthData);

      // Channels should be sorted
      const sortedChannels = [...result.channels].sort((a, b) => a - b);
      expect(result.channels).toEqual(sortedChannels);

      // Channels should be unique
      const uniqueChannels = [...new Set(result.channels)];
      expect(result.channels).toEqual(uniqueChannels);
    });

    it('should return sorted and unique gates', async () => {
      const birthData: BirthData = {
        dateISO: '1993-09-14',
        time: '22:15',
        timeZone: 'Europe/Paris',
      };

      const result = await computeHDExtract(birthData);

      // Gates should be sorted
      const sortedGates = [...result.gates].sort((a, b) => a - b);
      expect(result.gates).toEqual(sortedGates);

      // Gates should be unique
      const uniqueGates = [...new Set(result.gates)];
      expect(result.gates).toEqual(uniqueGates);
    });
  });
});
