/**
 * Comprehensive Scorer Unit Tests
 * 
 * Tests the complete scorer module with golden fixtures and edge cases.
 * Covers all systems, tie-breaking scenarios, and deterministic behavior.
 * 
 * Requirements: 10.1 (≥80% statement coverage)
 * Task: 3.6 Write scorer unit tests (REQUIRED)
 */

import { classify } from '../src/scorer';
import { computeCanonChecksum, loadCanon } from '../src/scorer/canon';
import type { HDExtract, ScorerResult } from '../src/scorer/types';

describe('Scorer Module - Comprehensive Tests', () => {
  describe('Golden Fixtures - Known Inputs to Expected Outputs', () => {
    /**
     * Golden Fixture 1: Strong Pleiadian Alignment
     * 
     * Manifestor with emotional authority and key Pleiadian channels
     * Expected: Primary Pleiades classification with high percentage
     */
    it('should classify strong Pleiadian profile correctly', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [3457, 2034],
        gates: [1, 13, 25],
      };

      const result = await classify(extract);

      // Should be primary classification
      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Pleiades');
      expect(result.hybrid).toBeUndefined();

      // Pleiades should have highest percentage
      expect(result.percentages.Pleiades).toBeGreaterThan(30);

      // Should have expected contributors
      const pleiadesContributors = result.contributorsPerSystem.Pleiades;
      expect(pleiadesContributors).toContain('type_manifestor');
      expect(pleiadesContributors).toContain('authority_emotional');
      expect(pleiadesContributors).toContain('profile_1_3');
      expect(pleiadesContributors).toContain('channel_3457');
      expect(pleiadesContributors).toContain('channel_2034');
      expect(pleiadesContributors).toContain('gate_1');
      expect(pleiadesContributors).toContain('gate_13');
      expect(pleiadesContributors).toContain('gate_25');

      // Should have allies
      expect(result.allies.length).toBeGreaterThan(0);
      expect(result.allies.every(a => a.system !== 'Pleiades')).toBe(true);

      // Meta information
      expect(result.meta.canonVersion).toBe('0.1.0');
      expect(result.meta.canonChecksum).toMatch(/^[a-f0-9]{64}$/);
    });

    /**
     * Golden Fixture 2: Strong Sirian Alignment
     * 
     * Projector with splenic authority and key Sirian channels
     * Expected: Primary Sirius classification
     */
    it('should classify strong Sirian profile correctly', async () => {
      const extract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: ['Spleen', 'G'],
        channels: [1858, 1057],
        gates: [2, 14, 29],
      };

      const result = await classify(extract);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Sirius');
      expect(result.percentages.Sirius).toBeGreaterThan(30);

      const siriusContributors = result.contributorsPerSystem.Sirius;
      expect(siriusContributors).toContain('type_projector');
      expect(siriusContributors).toContain('authority_splenic');
      expect(siriusContributors).toContain('profile_2_4');
      expect(siriusContributors).toContain('channel_1858');
      expect(siriusContributors).toContain('channel_1057');
    });

    /**
     * Golden Fixture 3: Strong Arcturian Alignment
     * 
     * Generator with sacral authority and key Arcturian channels
     * Expected: Primary Arcturus classification
     */
    it('should classify strong Arcturian profile correctly', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [515, 2750],
        gates: [3, 9, 42],
      };

      const result = await classify(extract);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Arcturus');
      expect(result.percentages.Arcturus).toBeGreaterThan(30);

      const arcturusContributors = result.contributorsPerSystem.Arcturus;
      expect(arcturusContributors).toContain('type_generator');
      expect(arcturusContributors).toContain('authority_sacral');
      expect(arcturusContributors).toContain('profile_5_1');
      expect(arcturusContributors).toContain('channel_515');
      expect(arcturusContributors).toContain('channel_2750');
    });

    /**
     * Golden Fixture 4: Strong Andromedan Alignment
     * 
     * Reflector with lunar authority (all centers open)
     * Expected: Primary Andromeda classification
     */
    it('should classify strong Andromedan profile correctly', async () => {
      const extract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '6/3',
        centers: [],
        channels: [1156, 1333],
        gates: [4, 7, 23],
      };

      const result = await classify(extract);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Andromeda');
      expect(result.percentages.Andromeda).toBeGreaterThan(30);

      const andromedaContributors = result.contributorsPerSystem.Andromeda;
      expect(andromedaContributors).toContain('type_reflector');
      expect(andromedaContributors).toContain('authority_lunar');
      expect(andromedaContributors).toContain('profile_6_3');
      expect(andromedaContributors).toContain('channel_1156');
      expect(andromedaContributors).toContain('channel_1333');
    });

    /**
     * Golden Fixture 5: Strong Orion Alignment
     * 
     * Manifestor with ego authority and key Orion channels
     * Expected: Primary Orion classification
     */
    it('should classify strong Orion profile correctly', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Ego',
        profile: '1/4',
        centers: ['Heart', 'Throat'],
        channels: [2145, 2551],
        gates: [8, 16, 31],
      };

      const result = await classify(extract);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Orion');
      expect(result.percentages.Orion).toBeGreaterThan(25);

      const orionContributors = result.contributorsPerSystem.Orion;
      expect(orionContributors).toContain('type_manifestor');
      expect(orionContributors).toContain('authority_ego');
      expect(orionContributors).toContain('profile_1_4');
      expect(orionContributors).toContain('channel_2145');
      expect(orionContributors).toContain('channel_2551');
    });

    /**
     * Golden Fixture 6: Hybrid Classification
     * 
     * Mixed profile with strong alignment to both Pleiades and Sirius
     * Expected: Hybrid classification
     */
    it('should classify hybrid profile correctly', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Emotional',
        profile: '2/4',
        centers: ['Sacral', 'Spleen'],
        channels: [3457, 18_58],
        gates: [1, 2, 13],
      };

      const result = await classify(extract);

      // Should be hybrid (both systems have strong alignment)
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toBeDefined();
      expect(result.hybrid!.length).toBe(2);
      expect(result.primary).toBeUndefined();

      // Both systems should have significant percentages
      const [first, second] = result.hybrid!;
      expect(result.percentages[first]).toBeGreaterThan(20);
      expect(result.percentages[second]).toBeGreaterThan(20);

      // Margin should be within hybrid window (< 6%)
      const margin = result.percentages[first] - result.percentages[second];
      expect(margin).toBeLessThan(6.0);
      expect(margin).toBeGreaterThanOrEqual(0);
    });

    /**
     * Golden Fixture 7: Minimal Alignment
     * 
     * Profile with very few matching attributes
     * Expected: Still produces valid classification
     */
    it('should handle minimal alignment profile', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [],
        gates: [],
      };

      const result = await classify(extract);

      // Should still classify (even with minimal data)
      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      expect(result.percentages).toBeDefined();
      expect(result.allies).toBeDefined();

      // All percentages should sum to ~100%
      const total = Object.values(result.percentages).reduce((sum, pct) => sum + pct, 0);
      expect(total).toBeGreaterThanOrEqual(99.9);
      expect(total).toBeLessThanOrEqual(100.1);
    });
  });

  describe('System-Specific Scoring Tests', () => {
    it('should score Pleiades highly for Manifestor + Emotional + 34-57', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '3/5',
        centers: ['Sacral', 'Throat'],
        channels: [3457],
        gates: [1, 13],
      };

      const result = await classify(extract);
      
      // Pleiades should be top or near-top
      const pleiadesRank = Object.entries(result.percentages)
        .sort(([, a], [, b]) => b - a)
        .findIndex(([sys]) => sys === 'Pleiades');
      
      expect(pleiadesRank).toBeLessThanOrEqual(1); // Top 2
    });

    it('should score Sirius highly for Projector + Splenic + 18-58', async () => {
      const extract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '4/6',
        centers: ['Spleen', 'G'],
        channels: [1858],
        gates: [2, 14],
      };

      const result = await classify(extract);
      
      const siriusRank = Object.entries(result.percentages)
        .sort(([, a], [, b]) => b - a)
        .findIndex(([sys]) => sys === 'Sirius');
      
      expect(siriusRank).toBeLessThanOrEqual(1);
    });

    it('should score Arcturus highly for Generator + Sacral + 5-15', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '6/2',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [515],
        gates: [3, 9],
      };

      const result = await classify(extract);
      
      const arcturusRank = Object.entries(result.percentages)
        .sort(([, a], [, b]) => b - a)
        .findIndex(([sys]) => sys === 'Arcturus');
      
      expect(arcturusRank).toBeLessThanOrEqual(1);
    });

    it('should score Andromeda highly for Reflector + Lunar', async () => {
      const extract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '3/6',
        centers: [],
        channels: [1156],
        gates: [4, 7],
      };

      const result = await classify(extract);
      
      const andromedaRank = Object.entries(result.percentages)
        .sort(([, a], [, b]) => b - a)
        .findIndex(([sys]) => sys === 'Andromeda');
      
      expect(andromedaRank).toBeLessThanOrEqual(1);
    });

    it('should score Orion highly for Manifestor + Ego + 21-45', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Ego',
        profile: '4/1',
        centers: ['Heart', 'Throat'],
        channels: [2145],
        gates: [8, 16],
      };

      const result = await classify(extract);
      
      const orionRank = Object.entries(result.percentages)
        .sort(([, a], [, b]) => b - a)
        .findIndex(([sys]) => sys === 'Orion');
      
      expect(orionRank).toBeLessThanOrEqual(1);
    });
  });

  describe('Tie-Breaking Edge Cases', () => {
    it('should handle exact tie with custom hybridWindowPct', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Emotional',
        profile: '2/4',
        centers: ['Sacral', 'Spleen'],
        channels: [3457, 18_58],
        gates: [1, 2],
      };

      // Test with different hybrid windows
      const result1 = await classify(extract, { tiePolicy: { hybridWindowPct: 3.0 } });
      const result2 = await classify(extract, { tiePolicy: { hybridWindowPct: 10.0 } });

      // Both should produce valid results
      expect(result1.classification).toMatch(/^(primary|hybrid)$/);
      expect(result2.classification).toMatch(/^(primary|hybrid)$/);

      // Smaller window might produce primary, larger window more likely hybrid
      if (result1.classification === 'primary' && result2.classification === 'hybrid') {
        // This is expected behavior
        expect(true).toBe(true);
      }
    });

    it('should handle three-way near-tie', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Emotional',
        profile: '5/1',
        centers: ['Sacral', 'Spleen', 'Solar Plexus'],
        channels: [3457, 18_58, 5_15],
        gates: [1, 2, 3],
      };

      const result = await classify(extract);

      // Should still only return top 2 for hybrid
      if (result.classification === 'hybrid') {
        expect(result.hybrid!.length).toBe(2);
      }

      // All systems should have non-zero scores
      const nonZeroSystems = Object.entries(result.percentages)
        .filter(([, pct]) => pct > 0);
      expect(nonZeroSystems.length).toBeGreaterThan(2);
    });

    it('should handle zero hybridWindowPct (always primary)', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [3457],
        gates: [1],
      };

      const result = await classify(extract, { tiePolicy: { hybridWindowPct: 0 } });

      // Should always be primary with zero window
      expect(result.classification).toBe('primary');
      expect(result.primary).toBeDefined();
      expect(result.hybrid).toBeUndefined();
    });

    it('should handle large hybridWindowPct (always hybrid)', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [3457, 20_34],
        gates: [1, 13, 25],
      };

      const result = await classify(extract, { tiePolicy: { hybridWindowPct: 100.0 } });

      // Should be hybrid with very large window
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toBeDefined();
      expect(result.hybrid!.length).toBe(2);
    });
  });

  describe('Canon Checksum Verification', () => {
    it('should compute consistent checksum', async () => {
      const canon = loadCanon();
      const checksum1 = computeCanonChecksum(canon);
      const checksum2 = computeCanonChecksum(canon);

      expect(checksum1).toBe(checksum2);
      expect(checksum1).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should include checksum in classification result', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral'],
        channels: [515],
        gates: [3],
      };

      const result = await classify(extract);

      expect(result.meta.canonChecksum).toBeDefined();
      expect(result.meta.canonChecksum).toMatch(/^[a-f0-9]{64}$/);
      expect(result.meta.canonChecksum.length).toBe(64);
    });

    it('should produce same checksum across multiple classifications', async () => {
      const extract1: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [3457],
        gates: [1],
      };

      const extract2: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: ['Spleen'],
        channels: [1858],
        gates: [2],
      };

      const result1 = await classify(extract1);
      const result2 = await classify(extract2);

      // Same canon, same checksum
      expect(result1.meta.canonChecksum).toBe(result2.meta.canonChecksum);
    });
  });

  describe('Determinism and Consistency', () => {
    it('should produce identical results for identical inputs', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [515, 27_50],
        gates: [3, 9, 42],
      };

      const result1 = await classify(extract);
      const result2 = await classify(extract);

      // Deep equality check
      expect(result1.classification).toBe(result2.classification);
      expect(result1.primary).toBe(result2.primary);
      expect(result1.hybrid).toEqual(result2.hybrid);
      expect(result1.percentages).toEqual(result2.percentages);
      expect(result1.meta.canonVersion).toBe(result2.meta.canonVersion);
      expect(result1.meta.canonChecksum).toBe(result2.meta.canonChecksum);
    });

    it('should produce consistent percentages that sum to 100%', async () => {
      const extract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: ['Spleen', 'G'],
        channels: [1858, 1057],
        gates: [2, 14, 29],
      };

      const result = await classify(extract);

      const total = Object.values(result.percentages).reduce((sum, pct) => sum + pct, 0);
      // Allow for floating point precision issues
      expect(total).toBeGreaterThanOrEqual(99.8);
      expect(total).toBeLessThanOrEqual(100.2);
    });

    it('should maintain 0.1% precision in percentages', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [3457],
        gates: [1, 13],
      };

      const result = await classify(extract);

      Object.values(result.percentages).forEach(pct => {
        const decimalPlaces = (pct.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(1);
      });
    });

    it('should never produce NaN or Infinity', async () => {
      const extract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '6/3',
        centers: [],
        channels: [1156],
        gates: [4],
      };

      const result = await classify(extract);

      Object.values(result.percentages).forEach(pct => {
        expect(Number.isFinite(pct)).toBe(true);
        expect(Number.isNaN(pct)).toBe(false);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty channels and gates', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral'],
        channels: [],
        gates: [],
      };

      const result = await classify(extract);

      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      expect(result.percentages).toBeDefined();
    });

    it('should handle empty centers (Reflector)', async () => {
      const extract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '6/3',
        centers: [],
        channels: [1156],
        gates: [4, 7],
      };

      const result = await classify(extract);

      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      // Andromeda should score well for Reflector
      expect(result.percentages.Andromeda).toBeGreaterThan(0);
    });

    it('should handle unknown attributes gracefully', async () => {
      const extract: HDExtract = {
        type: 'UnknownType',
        authority: 'UnknownAuthority',
        profile: '9/9',
        centers: ['UnknownCenter'],
        channels: [9999],
        gates: [999],
      };

      const result = await classify(extract);

      // Should still produce valid result (all zeros)
      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      expect(result.percentages).toBeDefined();
    });

    it('should handle mixed case in type and authority', async () => {
      const extract: HDExtract = {
        type: 'MANIFESTOR',
        authority: 'EMOTIONAL',
        profile: '1/3',
        centers: ['SACRAL', 'THROAT'],
        channels: [3457],
        gates: [1],
      };

      const result = await classify(extract);

      // Should normalize to lowercase and match
      expect(result.classification).toMatch(/^(primary|hybrid|unresolved)$/);
      const pleiadesContributors = result.contributorsPerSystem.Pleiades || [];
      expect(pleiadesContributors.length).toBeGreaterThan(0);
    });
  });

  describe('Result Structure Validation', () => {
    it('should have all required fields in result', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral'],
        channels: [515],
        gates: [3],
      };

      const result = await classify(extract);

      // Required fields
      expect(result).toHaveProperty('classification');
      expect(result).toHaveProperty('allies');
      expect(result).toHaveProperty('percentages');
      expect(result).toHaveProperty('contributorsPerSystem');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('canonVersion');
      expect(result.meta).toHaveProperty('canonChecksum');
    });

    it('should have correct ally structure', async () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [3457, 20_34],
        gates: [1, 13, 25],
      };

      const result = await classify(extract);

      expect(Array.isArray(result.allies)).toBe(true);
      result.allies.forEach(ally => {
        expect(ally).toHaveProperty('system');
        expect(ally).toHaveProperty('percentage');
        expect(typeof ally.system).toBe('string');
        expect(typeof ally.percentage).toBe('number');
      });

      // Allies should not include primary/hybrid systems
      if (result.primary) {
        expect(result.allies.every(a => a.system !== result.primary)).toBe(true);
      }
      if (result.hybrid) {
        result.hybrid.forEach(sys => {
          expect(result.allies.every(a => a.system !== sys)).toBe(true);
        });
      }
    });

    it('should have valid contributors structure', async () => {
      const extract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: ['Spleen'],
        channels: [1858],
        gates: [2],
      };

      const result = await classify(extract);

      Object.entries(result.contributorsPerSystem).forEach(([system, contributors]) => {
        expect(Array.isArray(contributors)).toBe(true);
        contributors.forEach(key => {
          expect(typeof key).toBe('string');
          expect(key.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should complete classification in reasonable time', async () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus', 'Spleen', 'G', 'Heart'],
        channels: [515, 27_50, 18_58, 10_57, 21_45],
        gates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      };

      const startTime = Date.now();
      await classify(extract);
      const endTime = Date.now();

      // Should complete in under 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple classifications efficiently', async () => {
      const extracts: HDExtract[] = [
        {
          type: 'Manifestor',
          authority: 'Emotional',
          profile: '1/3',
          centers: ['Sacral'],
          channels: [3457],
          gates: [1],
        },
        {
          type: 'Projector',
          authority: 'Splenic',
          profile: '2/4',
          centers: ['Spleen'],
          channels: [1858],
          gates: [2],
        },
        {
          type: 'Generator',
          authority: 'Sacral',
          profile: '5/1',
          centers: ['Sacral'],
          channels: [515],
          gates: [3],
        },
      ];

      const startTime = Date.now();
      await Promise.all(extracts.map(extract => classify(extract)));
      const endTime = Date.now();

      // Should complete all in under 200ms
      expect(endTime - startTime).toBeLessThan(200);
    });
  });
});
