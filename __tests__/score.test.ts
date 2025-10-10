/**
 * Core Scoring Algorithm Tests
 * 
 * Tests weighted scoring logic, normalization, and contributor tracking.
 */

import {computeScores} from '../src/scorer/score';
import {loadCanon} from '../src/scorer/canon';
import type {HDExtract} from '../src/scorer/types';

describe('Core Scoring Algorithm', () => {
  const canon = loadCanon();

  describe('computeScores', () => {
    it('should compute scores for Pleiadian-aligned extract', () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [34_57, 20_34],
        gates: [1, 13, 25],
      };

      const scores = computeScores(extract, canon);

      // Should return scores for all systems
      expect(scores).toHaveLength(5);

      // Pleiades should have highest score
      expect(scores[0].system).toBe('Pleiades');

      // Should have positive raw score
      expect(scores[0].rawScore).toBeGreaterThan(0);

      // Should have percentage between 0-100
      expect(scores[0].percentage).toBeGreaterThan(0);
      expect(scores[0].percentage).toBeLessThanOrEqual(100);

      // Should have contributors
      expect(scores[0].contributors.length).toBeGreaterThan(0);

      // Check specific contributors
      const contributorKeys = scores[0].contributors.map(c => c.key);
      expect(contributorKeys).toContain('type_manifestor');
      expect(contributorKeys).toContain('authority_emotional');
      expect(contributorKeys).toContain('profile_1_3');
    });

    it('should compute scores for Sirian-aligned extract', () => {
      const extract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: ['Spleen', 'G'],
        channels: [18_58, 10_57],
        gates: [2, 14, 29],
      };

      const scores = computeScores(extract, canon);

      // Sirius should have highest score
      expect(scores[0].system).toBe('Sirius');
      expect(scores[0].rawScore).toBeGreaterThan(0);
    });

    it('should normalize scores to 0.1% precision', () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [5_15, 27_50],
        gates: [3, 9, 42],
      };

      const scores = computeScores(extract, canon);

      // All percentages should have at most 1 decimal place
      scores.forEach(score => {
        const decimalPlaces = (score.percentage.toString().split('.')[1] || '')
          .length;
        expect(decimalPlaces).toBeLessThanOrEqual(1);
      });

      // Sum of percentages should be close to 100 (allowing for rounding)
      const total = scores.reduce((sum, s) => sum + s.percentage, 0);
      expect(total).toBeGreaterThanOrEqual(99.9);
      expect(total).toBeLessThanOrEqual(100.1);
    });

    it('should sort scores by percentage descending', () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [34_57],
        gates: [1],
      };

      const scores = computeScores(extract, canon);

      // Verify descending order
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i].percentage).toBeGreaterThanOrEqual(
          scores[i + 1].percentage
        );
      }
    });

    it('should track contributors with weights and labels', () => {
      const extract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '6/3',
        centers: [],
        channels: [11_56, 13_33],
        gates: [4, 7, 23],
      };

      const scores = computeScores(extract, canon);

      // Find Andromeda (should be highest for Reflector)
      const andromeda = scores.find(s => s.system === 'Andromeda');
      expect(andromeda).toBeDefined();

      // Check contributors have required fields
      andromeda!.contributors.forEach(contributor => {
        expect(contributor.key).toBeDefined();
        expect(contributor.weight).toBeGreaterThan(0);
        expect(contributor.label).toBeDefined();
        expect(contributor.label.length).toBeGreaterThan(0);
      });

      // Check label formatting
      const typeContributor = andromeda!.contributors.find(c =>
        c.key.startsWith('type_')
      );
      if (typeContributor) {
        expect(typeContributor.label).toMatch(/^Type:/);
      }
    });

    it('should handle extract with no matching weights', () => {
      const extract: HDExtract = {
        type: 'Unknown',
        authority: 'Unknown',
        profile: '9/9',
        centers: [],
        channels: [],
        gates: [],
      };

      const scores = computeScores(extract, canon);

      // Should still return scores for all systems
      expect(scores).toHaveLength(5);

      // All scores should be 0
      scores.forEach(score => {
        expect(score.rawScore).toBe(0);
        expect(score.percentage).toBe(0);
        expect(score.contributors).toHaveLength(0);
      });
    });

    it('should handle mixed alignment (multiple systems)', () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Emotional',
        profile: '2/4',
        centers: ['Sacral', 'Spleen'],
        channels: [34_57, 18_58],
        gates: [1, 2, 3],
      };

      const scores = computeScores(extract, canon);

      // Multiple systems should have non-zero scores
      const nonZeroScores = scores.filter(s => s.rawScore > 0);
      expect(nonZeroScores.length).toBeGreaterThan(1);

      // Top system should have highest percentage
      expect(scores[0].percentage).toBeGreaterThan(scores[1].percentage);
    });

    it('should generate correct attribute keys', () => {
      const extract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '3/5',
        centers: ['Heart', 'Throat'],
        channels: [21_45],
        gates: [8],
      };

      const scores = computeScores(extract, canon);

      // Find system with contributors
      const systemWithContributors = scores.find(
        s => s.contributors.length > 0
      );
      expect(systemWithContributors).toBeDefined();

      // Check key formats
      const keys = systemWithContributors!.contributors.map(c => c.key);

      // Should have properly formatted keys
      keys.forEach(key => {
        expect(key).toMatch(
          /^(type_|authority_|profile_|center_|channel_|gate_)/
        );
      });
    });

    it('should be deterministic: same extract produces identical results', () => {
      const extract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [5_15, 27_50],
        gates: [3, 9, 42],
      };

      // Compute scores twice
      const scores1 = computeScores(extract, canon);
      const scores2 = computeScores(extract, canon);

      // Should have same length
      expect(scores1.length).toBe(scores2.length);

      // Each system should have identical percentages
      scores1.forEach((score1, i) => {
        const score2 = scores2[i];
        expect(score1.system).toBe(score2.system);
        expect(score1.percentage).toBe(score2.percentage);
        expect(score1.rawScore).toBe(score2.rawScore);
      });

      // Percentages should sum to ~100.0% (±0.1%)
      const total1 = scores1.reduce((sum, s) => sum + s.percentage, 0);
      const total2 = scores2.reduce((sum, s) => sum + s.percentage, 0);

      expect(total1).toBeGreaterThanOrEqual(99.9);
      expect(total1).toBeLessThanOrEqual(100.1);
      expect(total2).toBeGreaterThanOrEqual(99.9);
      expect(total2).toBeLessThanOrEqual(100.1);

      // No NaNs or Infinity
      scores1.forEach(score => {
        expect(Number.isFinite(score.percentage)).toBe(true);
        expect(Number.isFinite(score.rawScore)).toBe(true);
        expect(Number.isNaN(score.percentage)).toBe(false);
        expect(Number.isNaN(score.rawScore)).toBe(false);
      });

      scores2.forEach(score => {
        expect(Number.isFinite(score.percentage)).toBe(true);
        expect(Number.isFinite(score.rawScore)).toBe(true);
        expect(Number.isNaN(score.percentage)).toBe(false);
        expect(Number.isNaN(score.rawScore)).toBe(false);
      });
    });
  });
});
