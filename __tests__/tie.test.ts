/**
 * Tie-Breaking Logic Tests
 * 
 * Tests tie-breaking rules for star system classification.
 * Covers primary, hybrid, and edge case scenarios.
 */

import {resolveTies} from '../src/scorer/tie';
import type {SystemScore} from '../src/scorer/types';

describe('resolveTies', () => {
  // Helper to create mock system scores
  const createScore = (
    system: string,
    percentage: number,
    contributorCount: number
  ): SystemScore => ({
    system,
    rawScore: percentage * 10, // Mock raw score
    percentage,
    contributors: Array(contributorCount)
      .fill(null)
      .map((_, i) => ({
        key: `attr_${i}`,
        weight: 10,
        label: `Attribute ${i}`,
      })),
  });

  describe('Edge Cases', () => {
    it('should return unresolved for empty scores', () => {
      const result = resolveTies([]);
      expect(result.classification).toBe('unresolved');
      expect(result.primary).toBeUndefined();
      expect(result.hybrid).toBeUndefined();
    });

    it('should return primary for single score', () => {
      const scores = [createScore('Pleiades', 100.0, 5)];
      const result = resolveTies(scores);
      
      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Pleiades');
      expect(result.hybrid).toBeUndefined();
    });
  });

  describe('Primary Classification (Clear Lead)', () => {
    it('should return primary when lead >= hybridWindowPct (default 6.0)', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 33.0, 4), // 7% margin
        createScore('Arcturus', 27.0, 3),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Pleiades');
      expect(result.hybrid).toBeUndefined();
    });

    it('should return primary when lead exactly equals hybridWindowPct', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 34.0, 4), // Exactly 6.0% margin
        createScore('Arcturus', 26.0, 3),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Pleiades');
    });

    it('should respect custom hybridWindowPct', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 36.0, 4), // 4% margin
      ];

      // With default 6.0%, this would be hybrid
      const defaultResult = resolveTies(scores);
      expect(defaultResult.classification).toBe('hybrid');

      // With custom 3.0%, this should be primary
      const customResult = resolveTies(scores, {hybridWindowPct: 3.0});
      expect(customResult.classification).toBe('primary');
      expect(customResult.primary).toBe('Pleiades');
    });
  });

  describe('Hybrid Classification (Close Scores)', () => {
    it('should return hybrid when lead < hybridWindowPct', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 36.0, 4), // 4% margin < 6%
        createScore('Arcturus', 24.0, 3),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });

    it('should order hybrid systems by percentage (higher first)', () => {
      const scores = [
        createScore('Sirius', 38.5, 4),
        createScore('Pleiades', 35.2, 5), // 3.3% margin
        createScore('Arcturus', 26.3, 3),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Sirius', 'Pleiades']);
    });

    it('should handle very small margins', () => {
      const scores = [
        createScore('Pleiades', 40.1, 5),
        createScore('Sirius', 40.0, 4), // 0.1% margin
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });
  });

  describe('Tie-Breaking (Equal Scores)', () => {
    it('should tie-break by contributor count when scores equal', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5), // More contributors
        createScore('Sirius', 40.0, 3),   // Fewer contributors
        createScore('Arcturus', 20.0, 2),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });

    it('should prefer system with more contributors', () => {
      const scores = [
        createScore('Sirius', 40.0, 8),    // Most contributors
        createScore('Pleiades', 40.0, 5),  // Fewer contributors
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Sirius', 'Pleiades']);
    });

    it('should tie-break by lexicographic order when contributor counts equal', () => {
      const scores = [
        createScore('Sirius', 40.0, 5),
        createScore('Pleiades', 40.0, 5), // Same contributors
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      // Lexicographic order: Pleiades < Sirius
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });

    it('should handle lexicographic tie-breaking with multiple systems', () => {
      const scores = [
        createScore('Zeta', 40.0, 5),
        createScore('Alpha', 40.0, 5), // Same contributors, alphabetically first
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Alpha', 'Zeta']);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle three-way near-tie with contributor tie-break', () => {
      const scores = [
        createScore('Pleiades', 35.0, 6),
        createScore('Sirius', 35.0, 4),   // Same score, fewer contributors
        createScore('Arcturus', 30.0, 5),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });

    it('should only consider top two systems for hybrid', () => {
      const scores = [
        createScore('Pleiades', 38.0, 5),
        createScore('Sirius', 36.0, 4),   // Within hybrid window
        createScore('Arcturus', 26.0, 8), // Not considered despite high contributors
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
      // Arcturus is not in hybrid despite having most contributors
    });

    it('should handle zero contributors', () => {
      const scores = [
        createScore('Pleiades', 40.0, 0),
        createScore('Sirius', 40.0, 0),
      ];

      const result = resolveTies(scores);
      
      expect(result.classification).toBe('hybrid');
      // Falls back to lexicographic order
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });
  });

  describe('Policy Configuration', () => {
    it('should use default policy when not provided', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 35.0, 4), // 5% margin < default 6%
      ];

      const result = resolveTies(scores);
      expect(result.classification).toBe('hybrid');
    });

    it('should allow partial policy override', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 32.0, 4), // 8% margin
      ];

      // With default 6%, this is primary
      const defaultResult = resolveTies(scores);
      expect(defaultResult.classification).toBe('primary');

      // With custom 10%, this is hybrid
      const customResult = resolveTies(scores, {hybridWindowPct: 10.0});
      expect(customResult.classification).toBe('hybrid');
    });

    it('should handle zero hybridWindowPct (always primary)', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 39.9, 4), // 0.1% margin
      ];

      const result = resolveTies(scores, {hybridWindowPct: 0});
      
      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Pleiades');
    });

    it('should handle large hybridWindowPct (always hybrid)', () => {
      const scores = [
        createScore('Pleiades', 60.0, 5),
        createScore('Sirius', 20.0, 4), // 40% margin
      ];

      const result = resolveTies(scores, {hybridWindowPct: 50.0});
      
      expect(result.classification).toBe('hybrid');
      expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    });
  });

  describe('Determinism', () => {
    it('should produce identical results for identical inputs', () => {
      const scores = [
        createScore('Pleiades', 40.0, 5),
        createScore('Sirius', 36.0, 4),
      ];

      const result1 = resolveTies(scores);
      const result2 = resolveTies(scores);
      
      expect(result1).toEqual(result2);
    });

    it('should be deterministic with lexicographic tie-breaking', () => {
      const scores = [
        createScore('Sirius', 40.0, 5),
        createScore('Pleiades', 40.0, 5),
      ];

      // Run multiple times
      const results = Array(10)
        .fill(null)
        .map(() => resolveTies(scores));

      // All results should be identical
      results.forEach(result => {
        expect(result.classification).toBe('hybrid');
        expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
      });
    });
  });
});
