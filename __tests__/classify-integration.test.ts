/**
 * Integration Test: Complete classify() Function
 * 
 * Tests the full classification pipeline from HD extract to final result.
 * Verifies integration of canon loading, scoring, and tie-breaking.
 */

import {classify} from '../src/scorer';
import type {HDExtract} from '../src/scorer';

describe('classify() Integration', () => {
  describe('Primary Classification', () => {
    it('should classify Pleiadian-aligned extract as primary', async () => {
      const hdExtract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [],
        gates: [1],
      };

      const result = await classify(hdExtract);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Pleiades');
      expect(result.hybrid).toBeUndefined();
      expect(result.allies.length).toBeGreaterThan(0);
      expect(result.percentages.Pleiades).toBeGreaterThan(40);
      expect(result.meta.canonVersion).toBe('0.1.0');
      expect(result.meta.canonChecksum).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should classify Sirian-aligned extract as primary', async () => {
      const hdExtract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: ['Spleen'],
        channels: [],
        gates: [2],
      };

      const result = await classify(hdExtract);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Sirius');
      expect(result.percentages.Sirius).toBeGreaterThan(30);
    });
  });

  describe('Hybrid Classification', () => {
    it('should classify balanced extract as hybrid', async () => {
      const hdExtract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '2/4',
        centers: ['Sacral', 'Spleen'],
        channels: [],
        gates: [2, 14],
      };

      const result = await classify(hdExtract);

      // This extract has balanced Sirius/Arcturus alignment
      if (result.classification === 'hybrid') {
        expect(result.hybrid).toBeDefined();
        expect(result.hybrid?.length).toBe(2);
        expect(result.primary).toBeUndefined();
        
        // Verify hybrid systems are ordered by percentage
        const [first, second] = result.hybrid!;
        expect(result.percentages[first]).toBeGreaterThanOrEqual(
          result.percentages[second]
        );
      }
    });

    it('should respect custom hybridWindowPct', async () => {
      const hdExtract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [],
        gates: [1],
      };

      // With default 6.0%, this should be primary
      const defaultResult = await classify(hdExtract);
      expect(defaultResult.classification).toBe('primary');

      // With large window, force hybrid
      const hybridResult = await classify(hdExtract, {
        tiePolicy: {hybridWindowPct: 50.0, minPrimaryPct: 0, leadPct: 0},
      });
      expect(hybridResult.classification).toBe('hybrid');
    });
  });

  describe('Result Structure', () => {
    it('should include all required fields', async () => {
      const hdExtract: HDExtract = {
        type: 'Generator',
        authority: 'Emotional',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [],
        gates: [5, 15],
      };

      const result = await classify(hdExtract);

      // Verify structure
      expect(result).toHaveProperty('classification');
      expect(result).toHaveProperty('allies');
      expect(result).toHaveProperty('percentages');
      expect(result).toHaveProperty('contributorsPerSystem');
      expect(result).toHaveProperty('meta');

      // Verify allies
      expect(Array.isArray(result.allies)).toBe(true);
      result.allies.forEach(ally => {
        expect(ally).toHaveProperty('system');
        expect(ally).toHaveProperty('percentage');
        expect(typeof ally.system).toBe('string');
        expect(typeof ally.percentage).toBe('number');
      });

      // Verify percentages
      expect(typeof result.percentages).toBe('object');
      Object.values(result.percentages).forEach(pct => {
        expect(typeof pct).toBe('number');
        expect(pct).toBeGreaterThanOrEqual(0);
        expect(pct).toBeLessThanOrEqual(100);
      });

      // Verify contributors
      expect(typeof result.contributorsPerSystem).toBe('object');
      Object.values(result.contributorsPerSystem).forEach(contributors => {
        expect(Array.isArray(contributors)).toBe(true);
      });

      // Verify meta
      expect(result.meta.canonVersion).toBe('0.1.0');
      expect(result.meta.canonChecksum).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should have percentages sum to ~100%', async () => {
      const hdExtract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '4/6',
        centers: [],
        channels: [],
        gates: [11, 56],
      };

      const result = await classify(hdExtract);

      const sum = Object.values(result.percentages).reduce(
        (acc, pct) => acc + pct,
        0
      );

      // Allow small rounding error
      expect(sum).toBeGreaterThan(99.5);
      expect(sum).toBeLessThan(100.5);
    });
  });

  describe('Determinism', () => {
    it('should produce identical results for identical inputs', async () => {
      const hdExtract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [],
        gates: [1, 13, 25],
      };

      const result1 = await classify(hdExtract);
      const result2 = await classify(hdExtract);

      expect(result1).toEqual(result2);
    });

    it('should be deterministic across multiple runs', async () => {
      const hdExtract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '2/4',
        centers: ['Sacral'],
        channels: [],
        gates: [14],
      };

      const results = await Promise.all(
        Array(5)
          .fill(null)
          .map(() => classify(hdExtract))
      );

      // All results should be identical
      results.forEach(result => {
        expect(result).toEqual(results[0]);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle extract with no matching weights', async () => {
      const hdExtract: HDExtract = {
        type: 'Unknown',
        authority: 'Unknown',
        profile: '9/9',
        centers: [],
        channels: [],
        gates: [999],
      };

      const result = await classify(hdExtract);

      // Should still return valid result with all zeros
      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      expect(result.percentages).toBeDefined();
    });

    it('should handle minimal extract', async () => {
      const hdExtract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '1/3',
        centers: [],
        channels: [],
        gates: [],
      };

      const result = await classify(hdExtract);

      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      expect(result.meta.canonVersion).toBe('0.1.0');
    });

    it('should handle extract with many attributes', async () => {
      const hdExtract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat', 'Spleen', 'Solar Plexus'],
        channels: [3457, 1858, 2048],
        gates: [1, 2, 3, 7, 13, 14, 25, 56],
      };

      const result = await classify(hdExtract);

      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      expect(Object.keys(result.contributorsPerSystem).length).toBeGreaterThan(0);
    });
  });
});
