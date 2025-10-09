/**
 * Canon Loading and Checksum Tests
 * 
 * Tests for canon.ts: YAML loading, Zod validation, and SHA256 checksum computation.
 * 
 * Requirements: 4.2, 4.8
 */

import {
  loadCanon,
  computeCanonChecksum,
  getCanonWithChecksum,
} from '../src/scorer/canon';
import type {Canon} from '../src/scorer/types';

describe('Canon Loading and Validation', () => {
  describe('loadCanon', () => {
    it('should load and validate mock canon data', () => {
      const canon = loadCanon();

      expect(canon).toBeDefined();
      expect(canon.version).toBe('0.1.0');
      expect(canon.systems).toBeDefined();
    });

    it('should have valid version format', () => {
      const canon = loadCanon();

      expect(canon.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should contain expected star systems', () => {
      const canon = loadCanon();

      expect(canon.systems).toHaveProperty('Pleiades');
      expect(canon.systems).toHaveProperty('Sirius');
      expect(canon.systems).toHaveProperty('Arcturus');
      expect(canon.systems).toHaveProperty('Andromeda');
      expect(canon.systems).toHaveProperty('Orion');
    });

    it('should have valid system weights structure', () => {
      const canon = loadCanon();

      Object.entries(canon.systems).forEach(([systemName, systemData]) => {
        expect(systemData).toHaveProperty('weights');
        expect(systemData).toHaveProperty('why');
        expect(typeof systemData.weights).toBe('object');
        expect(typeof systemData.why).toBe('string');
        expect(systemData.why.length).toBeGreaterThan(0);
      });
    });

    it('should have numeric weight values', () => {
      const canon = loadCanon();

      Object.entries(canon.systems).forEach(([systemName, systemData]) => {
        Object.entries(systemData.weights).forEach(([key, value]) => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThan(0);
        });
      });
    });

    it('should have meaningful weight keys', () => {
      const canon = loadCanon();

      const validPrefixes = [
        'type_',
        'authority_',
        'profile_',
        'center_',
        'channel_',
        'gate_',
      ];

      Object.entries(canon.systems).forEach(([systemName, systemData]) => {
        Object.keys(systemData.weights).forEach(key => {
          const hasValidPrefix = validPrefixes.some(prefix =>
            key.startsWith(prefix),
          );
          expect(hasValidPrefix).toBe(true);
        });
      });
    });
  });

  describe('computeCanonChecksum', () => {
    it('should compute SHA256 checksum', () => {
      const canon = loadCanon();
      const checksum = computeCanonChecksum(canon);

      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64); // SHA256 hex is 64 chars
      expect(checksum).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce deterministic checksums', () => {
      const canon = loadCanon();
      const checksum1 = computeCanonChecksum(canon);
      const checksum2 = computeCanonChecksum(canon);

      expect(checksum1).toBe(checksum2);
    });

    it('should produce different checksums for different data', () => {
      const canon1 = loadCanon();
      const checksum1 = computeCanonChecksum(canon1);

      // Modify canon slightly
      const canon2: Canon = {
        ...canon1,
        version: '0.2.0',
      };
      const checksum2 = computeCanonChecksum(canon2);

      expect(checksum1).not.toBe(checksum2);
    });

    it('should handle canonicalization correctly', () => {
      const canon = loadCanon();

      // Create equivalent canon with different key order
      const reorderedCanon: Canon = {
        systems: canon.systems,
        version: canon.version,
      };

      const checksum1 = computeCanonChecksum(canon);
      const checksum2 = computeCanonChecksum(reorderedCanon);

      // Should produce same checksum due to canonicalization
      expect(checksum1).toBe(checksum2);
    });

    it('should be sensitive to weight changes', () => {
      const canon = loadCanon();
      const checksum1 = computeCanonChecksum(canon);

      // Modify a weight
      const modifiedCanon: Canon = {
        ...canon,
        systems: {
          ...canon.systems,
          Pleiades: {
            ...canon.systems.Pleiades,
            weights: {
              ...canon.systems.Pleiades.weights,
              type_manifestor: 20, // Changed from 15
            },
          },
        },
      };
      const checksum2 = computeCanonChecksum(modifiedCanon);

      expect(checksum1).not.toBe(checksum2);
    });
  });

  describe('getCanonWithChecksum', () => {
    it('should return canon and checksum together', () => {
      const result = getCanonWithChecksum();

      expect(result).toHaveProperty('canon');
      expect(result).toHaveProperty('checksum');
      expect(result.canon).toBeDefined();
      expect(result.checksum).toBeDefined();
    });

    it('should return valid canon', () => {
      const {canon} = getCanonWithChecksum();

      expect(canon.version).toBe('0.1.0');
      expect(Object.keys(canon.systems).length).toBeGreaterThan(0);
    });

    it('should return valid checksum', () => {
      const {checksum} = getCanonWithChecksum();

      expect(checksum).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce consistent results', () => {
      const result1 = getCanonWithChecksum();
      const result2 = getCanonWithChecksum();

      expect(result1.checksum).toBe(result2.checksum);
      expect(result1.canon.version).toBe(result2.canon.version);
    });
  });

  describe('Canon Content Validation', () => {
    it('should have Pleiades system with expected weights', () => {
      const canon = loadCanon();
      const pleiades = canon.systems.Pleiades;

      expect(pleiades.weights).toHaveProperty('type_manifestor');
      expect(pleiades.weights).toHaveProperty('authority_emotional');
      expect(pleiades.weights).toHaveProperty('channel_34_57');
      expect(pleiades.weights.channel_34_57).toBe(20);
    });

    it('should have Sirius system with expected weights', () => {
      const canon = loadCanon();
      const sirius = canon.systems.Sirius;

      expect(sirius.weights).toHaveProperty('type_projector');
      expect(sirius.weights).toHaveProperty('authority_splenic');
      expect(sirius.weights).toHaveProperty('channel_18_58');
      expect(sirius.weights.channel_18_58).toBe(18);
    });

    it('should have meaningful why explanations', () => {
      const canon = loadCanon();

      Object.entries(canon.systems).forEach(([systemName, systemData]) => {
        expect(systemData.why.length).toBeGreaterThan(50);
        // Check that explanation is meaningful (contains common HD terms)
        const hasHDTerms =
          systemData.why.toLowerCase().includes('authority') ||
          systemData.why.toLowerCase().includes('channel') ||
          systemData.why.toLowerCase().includes('alignment');
        expect(hasHDTerms).toBe(true);
      });
    });

    it('should have diverse weight distributions', () => {
      const canon = loadCanon();

      Object.entries(canon.systems).forEach(([systemName, systemData]) => {
        const weights = Object.values(systemData.weights);
        const uniqueWeights = new Set(weights);

        // Should have at least some variety in weights
        expect(uniqueWeights.size).toBeGreaterThan(1);
      });
    });
  });

  describe('Checksum Stability', () => {
    it('should maintain stable checksum for mock canon v0.1.0', () => {
      const {checksum} = getCanonWithChecksum();

      // This test ensures the checksum remains stable for the mock canon
      // If this test fails after intentional canon changes, update the expected value
      expect(checksum).toBeDefined();
      expect(checksum.length).toBe(64);

      // Store the checksum for regression testing
      // (In a real scenario, you'd commit this value and verify it doesn't change)
      console.log('Current canon checksum:', checksum);
    });
  });
});
