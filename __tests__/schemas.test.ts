/**
 * Schema Validation Tests
 * 
 * Tests all Zod schemas for the Star System Sorter application.
 * Covers happy paths (valid data) and sad paths (invalid data).
 * 
 * Requirements: 4.1
 */

import {
  BirthDataFormSchema,
  BirthDataAPIRequestSchema,
  HDExtractSchema,
  BodyGraphRequestSchema,
  BodyGraphResponseSchema,
  ContributorSchema,
  SystemScoreSchema,
  AllySchema,
  ClassificationResultSchema,
  TiePolicySchema,
  ClassificationOptionsSchema,
  SystemWeightsSchema,
  CanonSchema,
  ResultScreenParamsSchema,
  WhyScreenParamsSchema,
  APIErrorResponseSchema,
  ValidationErrorSchema,
  CacheKeySchema,
  CacheEntrySchema,
  safeParse,
  parse,
} from '@/lib/schemas';

describe('Schema Validation Tests', () => {
  // ==========================================================================
  // Client-Side Schemas
  // ==========================================================================

  describe('BirthDataFormSchema', () => {
    it('validates correct birth data form', () => {
      const validData = {
        date: '01/15/1990',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid date format', () => {
      const invalidData = {
        date: '1990-01-15',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid time format', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '14:30',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty location', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30 PM',
        location: '',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // API Schemas
  // ==========================================================================

  describe('BirthDataAPIRequestSchema', () => {
    it('validates correct API request', () => {
      const validData = {
        dateISO: '1990-01-15',
        time: '14:30',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataAPIRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates with optional lat/lon', () => {
      const validData = {
        dateISO: '1990-01-15',
        time: '14:30',
        timeZone: 'America/Los_Angeles',
        lat: 37.7749,
        lon: -122.4194,
      };

      const result = BirthDataAPIRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid date format', () => {
      const invalidData = {
        dateISO: '01/15/1990',
        time: '14:30',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataAPIRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid time format', () => {
      const invalidData = {
        dateISO: '1990-01-15',
        time: '02:30 PM',
        timeZone: 'America/Los_Angeles',
      };

      const result = BirthDataAPIRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid latitude', () => {
      const invalidData = {
        dateISO: '1990-01-15',
        time: '14:30',
        timeZone: 'America/Los_Angeles',
        lat: 91,
        lon: -122.4194,
      };

      const result = BirthDataAPIRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid longitude', () => {
      const invalidData = {
        dateISO: '1990-01-15',
        time: '14:30',
        timeZone: 'America/Los_Angeles',
        lat: 37.7749,
        lon: -181,
      };

      const result = BirthDataAPIRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('HDExtractSchema', () => {
    it('validates correct HD extract', () => {
      const validData = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '1/3',
        centers: ['Sacral', 'Spleen'],
        channels: [34, 57],
        gates: [1, 2, 3, 13, 25],
      };

      const result = HDExtractSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
      const invalidData = {
        type: 'Generator',
        authority: 'Sacral',
      };

      const result = HDExtractSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid array types', () => {
      const invalidData = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '1/3',
        centers: ['Sacral', 123], // Should be all strings
        channels: [34, 57],
        gates: [1, 2, 3],
      };

      const result = HDExtractSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Server-Side Schemas
  // ==========================================================================

  describe('BodyGraphRequestSchema', () => {
    it('validates correct BodyGraph request', () => {
      const validData = {
        date: '1990-01-15 14:30',
        timezone: 'America/Los_Angeles',
      };

      const result = BodyGraphRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid date format', () => {
      const invalidData = {
        date: '1990-01-15T14:30:00Z',
        timezone: 'America/Los_Angeles',
      };

      const result = BodyGraphRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing timezone', () => {
      const invalidData = {
        date: '1990-01-15 14:30',
      };

      const result = BodyGraphRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('BodyGraphResponseSchema', () => {
    it('validates correct BodyGraph response', () => {
      const validData = {
        Properties: {
          Type: { option: 'Generator' },
          InnerAuthority: { option: 'Sacral' },
          Profile: { option: '1/3' },
          Gates: {
            list: [
              { option: 1 },
              { option: 2 },
              { option: 3 },
            ],
          },
        },
      };

      const result = BodyGraphResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates minimal response', () => {
      const validData = {
        Properties: {},
      };

      const result = BodyGraphResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates empty response', () => {
      const validData = {};

      const result = BodyGraphResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // Scorer Schemas
  // ==========================================================================

  describe('ContributorSchema', () => {
    it('validates correct contributor', () => {
      const validData = {
        key: 'type_generator',
        weight: 15,
        label: 'Type: Generator',
      };

      const result = ContributorSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects missing fields', () => {
      const invalidData = {
        key: 'type_generator',
        weight: 15,
      };

      const result = ContributorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('SystemScoreSchema', () => {
    it('validates correct system score', () => {
      const validData = {
        system: 'Pleiades',
        rawScore: 45,
        percentage: 67.5,
        contributors: [
          { key: 'type_generator', weight: 15, label: 'Type: Generator' },
          { key: 'gate_1', weight: 5, label: 'Gate 1' },
        ],
      };

      const result = SystemScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects percentage out of range', () => {
      const invalidData = {
        system: 'Pleiades',
        rawScore: 45,
        percentage: 150,
        contributors: [],
      };

      const result = SystemScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('AllySchema', () => {
    it('validates correct ally', () => {
      const validData = {
        system: 'Sirius',
        percentage: 18.2,
      };

      const result = AllySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects negative percentage', () => {
      const invalidData = {
        system: 'Sirius',
        percentage: -5,
      };

      const result = AllySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ClassificationResultSchema', () => {
    it('validates primary classification', () => {
      const validData = {
        classification: 'primary',
        primary: 'Pleiades',
        allies: [
          { system: 'Sirius', percentage: 18.2 },
          { system: 'Arcturus', percentage: 14.3 },
        ],
        percentages: {
          Pleiades: 67.5,
          Sirius: 18.2,
          Arcturus: 14.3,
        },
        contributorsPerSystem: {
          Pleiades: ['type_generator', 'gate_1'],
          Sirius: ['center_sacral'],
        },
        meta: {
          canonVersion: '0.1.0',
          canonChecksum: 'abc123',
        },
      };

      const result = ClassificationResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates hybrid classification', () => {
      const validData = {
        classification: 'hybrid',
        hybrid: ['Pleiades', 'Sirius'],
        allies: [],
        percentages: {
          Pleiades: 48.5,
          Sirius: 47.2,
        },
        contributorsPerSystem: {},
        meta: {
          canonVersion: '0.1.0',
          canonChecksum: 'abc123',
        },
      };

      const result = ClassificationResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid classification type', () => {
      const invalidData = {
        classification: 'unknown',
        allies: [],
        percentages: {},
        contributorsPerSystem: {},
        meta: {
          canonVersion: '0.1.0',
          canonChecksum: 'abc123',
        },
      };

      const result = ClassificationResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('TiePolicySchema', () => {
    it('validates with defaults', () => {
      const validData = {};

      const result = TiePolicySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minPrimaryPct).toBe(0);
        expect(result.data.hybridWindowPct).toBe(6.0);
        expect(result.data.leadPct).toBe(0);
      }
    });

    it('validates custom values', () => {
      const validData = {
        minPrimaryPct: 50,
        hybridWindowPct: 10,
        leadPct: 5,
      };

      const result = TiePolicySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects out of range values', () => {
      const invalidData = {
        minPrimaryPct: 150,
        hybridWindowPct: 10,
        leadPct: 5,
      };

      const result = TiePolicySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ClassificationOptionsSchema', () => {
    it('validates empty options', () => {
      const validData = {};

      const result = ClassificationOptionsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates with tie policy', () => {
      const validData = {
        tiePolicy: {
          minPrimaryPct: 50,
        },
        includeContributors: true,
      };

      const result = ClassificationOptionsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // Canon Schemas
  // ==========================================================================

  describe('SystemWeightsSchema', () => {
    it('validates correct system weights', () => {
      const validData = {
        weights: {
          type_generator: 15,
          gate_1: 5,
          center_sacral: 10,
        },
        why: 'This system values generators with gate 1',
      };

      const result = SystemWeightsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects missing why field', () => {
      const invalidData = {
        weights: {
          type_generator: 15,
        },
      };

      const result = SystemWeightsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('CanonSchema', () => {
    it('validates correct canon', () => {
      const validData = {
        version: '0.1.0',
        systems: {
          Pleiades: {
            weights: { type_generator: 15 },
            why: 'Pleiades values generators',
          },
          Sirius: {
            weights: { type_manifestor: 15 },
            why: 'Sirius values manifestors',
          },
        },
      };

      const result = CanonSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects missing version', () => {
      const invalidData = {
        systems: {},
      };

      const result = CanonSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Navigation Schemas
  // ==========================================================================

  describe('ResultScreenParamsSchema', () => {
    it('validates primary result params', () => {
      const validData = {
        classification: 'primary',
        primary: 'Pleiades',
        percentage: 67.5,
        allies: [{ system: 'Sirius', percentage: 18.2 }],
        contributorsPerSystem: { Pleiades: ['type_generator'] },
        percentages: { Pleiades: 67.5, Sirius: 18.2 },
      };

      const result = ResultScreenParamsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates hybrid result params', () => {
      const validData = {
        classification: 'hybrid',
        hybrid: ['Pleiades', 'Sirius'],
        percentage: 48.5,
        allies: [],
        contributorsPerSystem: {},
        percentages: { Pleiades: 48.5, Sirius: 47.2 },
      };

      const result = ResultScreenParamsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('WhyScreenParamsSchema', () => {
    it('validates correct why params', () => {
      const validData = {
        system: 'Pleiades',
        contributors: ['type_generator', 'gate_1'],
        percentage: 67.5,
      };

      const result = WhyScreenParamsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects missing fields', () => {
      const invalidData = {
        system: 'Pleiades',
      };

      const result = WhyScreenParamsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Error Schemas
  // ==========================================================================

  describe('APIErrorResponseSchema', () => {
    it('validates simple error', () => {
      const validData = {
        error: 'Invalid input',
      };

      const result = APIErrorResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates error with details', () => {
      const validData = {
        error: 'Validation failed',
        details: { field: 'date', message: 'Invalid format' },
        code: 'VALIDATION_ERROR',
      };

      const result = APIErrorResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('ValidationErrorSchema', () => {
    it('validates validation error', () => {
      const validData = {
        error: 'Validation failed',
        details: [
          {
            path: ['date'],
            message: 'Invalid format',
            code: 'invalid_string',
          },
        ],
      };

      const result = ValidationErrorSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // Cache Schemas
  // ==========================================================================

  describe('CacheKeySchema', () => {
    it('validates cache key without coordinates', () => {
      const validData = {
        utcTimestamp: '1990-01-15 14:30',
      };

      const result = CacheKeySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates cache key with coordinates', () => {
      const validData = {
        utcTimestamp: '1990-01-15 14:30',
        lat: 37.7749,
        lon: -122.4194,
      };

      const result = CacheKeySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('CacheEntrySchema', () => {
    it('validates cache entry', () => {
      const validData = {
        data: {
          type: 'Generator',
          authority: 'Sacral',
          profile: '1/3',
          centers: ['Sacral'],
          channels: [34],
          gates: [1, 2, 3],
        },
        timestamp: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };

      const result = CacheEntrySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  describe('safeParse utility', () => {
    it('returns success for valid data', () => {
      const result = safeParse(
        AllySchema,
        { system: 'Sirius', percentage: 18.2 },
        'Test context'
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.system).toBe('Sirius');
      }
    });

    it('returns error for invalid data', () => {
      const result = safeParse(
        AllySchema,
        { system: 'Sirius', percentage: -5 },
        'Test context'
      );

      expect(result.success).toBe(false);
    });
  });

  describe('parse utility', () => {
    it('returns data for valid input', () => {
      const data = parse(
        AllySchema,
        { system: 'Sirius', percentage: 18.2 },
        'Test context'
      );

      expect(data.system).toBe('Sirius');
      expect(data.percentage).toBe(18.2);
    });

    it('throws for invalid input', () => {
      expect(() => {
        parse(
          AllySchema,
          { system: 'Sirius', percentage: -5 },
          'Test context'
        );
      }).toThrow();
    });
  });
});
