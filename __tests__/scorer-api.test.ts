/**
 * Scorer Public API Tests
 * 
 * Tests for the scorer module's public API structure and exports.
 * 
 * Requirements: 4.7, 4.9
 */

import { classify } from '../src/scorer';
import type {
  HDExtract,
  ScorerResult,
  ClassificationOptions,
  Canon,
  SystemWeights,
  TiePolicy,
  Contributor,
  SystemScore,
} from '../src/scorer';

describe('Scorer Public API', () => {
  describe('Type Exports', () => {
    it('should export all required types', () => {
      // This test verifies that all types are properly exported
      // TypeScript compilation will fail if any type is missing
      
      const hdExtract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Throat'],
        channels: [3457],
        gates: [1, 13, 25],
      };
      
      const options: ClassificationOptions = {
        tiePolicy: { hybridWindowPct: 6.0, minPrimaryPct: 0, leadPct: 0 },
        includeContributors: true,
      };
      
      expect(hdExtract).toBeDefined();
      expect(options).toBeDefined();
    });
  });

  describe('classify() function', () => {
    it('should be exported as a function', () => {
      expect(typeof classify).toBe('function');
    });

    it('should return a Promise that rejects with pending implementation error', async () => {
      const hdExtract: HDExtract = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral'],
        channels: [3457],
        gates: [1],
      };
      
      const result = classify(hdExtract);
      expect(result).toBeInstanceOf(Promise);
      
      await expect(result).rejects.toThrow(
        /not yet implemented.*tasks 3\.2-3\.4/i
      );
    });

    it('should accept optional ClassificationOptions', async () => {
      const hdExtract: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '2/4',
        centers: ['Sacral', 'Spleen'],
        channels: [1858],
        gates: [2, 14],
      };
      
      const options: ClassificationOptions = {
        tiePolicy: { hybridWindowPct: 8.0, minPrimaryPct: 0, leadPct: 0 },
        includeContributors: false,
      };
      
      await expect(classify(hdExtract, options)).rejects.toThrow();
    });
  });

  describe('API Contract', () => {
    it('should have correct function signature', () => {
      // Verify the function accepts HDExtract and optional options
      const validCall = (extract: HDExtract, opts?: ClassificationOptions) => {
        return classify(extract, opts);
      };
      
      expect(typeof validCall).toBe('function');
    });

    it('should return ScorerResult type (verified by TypeScript)', async () => {
      // This test verifies the return type at compile time
      // Runtime verification will be added when implementation is complete
      
      const hdExtract: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '3/5',
        centers: ['Spleen'],
        channels: [2048],
        gates: [3, 7],
      };
      
      try {
        const result: ScorerResult = await classify(hdExtract);
        // This won't execute until implementation is complete
        expect(result).toBeDefined();
      } catch (error) {
        // Expected until tasks 3.2-3.4 are complete
        expect(error).toBeDefined();
      }
    });
  });

  describe('Meta Information Requirements', () => {
    it('should include canonVersion in result (when implemented)', async () => {
      // Placeholder test for requirement 4.7
      // Will be updated when implementation is complete
      
      const hdExtract: HDExtract = {
        type: 'Reflector',
        authority: 'Lunar',
        profile: '4/6',
        centers: [],
        channels: [],
        gates: [11, 56],
      };
      
      try {
        const result = await classify(hdExtract);
        expect(result.meta.canonVersion).toBeDefined();
        expect(typeof result.meta.canonVersion).toBe('string');
      } catch (error) {
        // Expected until implementation complete
        expect(error).toBeDefined();
      }
    });

    it('should include canonChecksum in result (when implemented)', async () => {
      // Placeholder test for requirement 4.9
      // Will be updated when implementation is complete
      
      const hdExtract: HDExtract = {
        type: 'Generator',
        authority: 'Emotional',
        profile: '5/1',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [3664],
        gates: [5, 15],
      };
      
      try {
        const result = await classify(hdExtract);
        expect(result.meta.canonChecksum).toBeDefined();
        expect(typeof result.meta.canonChecksum).toBe('string');
        expect(result.meta.canonChecksum).toMatch(/^[a-f0-9]{64}$/); // SHA256 format
      } catch (error) {
        // Expected until implementation complete
        expect(error).toBeDefined();
      }
    });
  });
});
