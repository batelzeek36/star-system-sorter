/**
 * Zod Schemas - Single Source of Truth for Validation
 * 
 * All validation schemas for the Star System Sorter application.
 * Used for:
 * - Client-side form validation (react-hook-form)
 * - Server-side request/response validation
 * - Runtime type checking and parsing
 * 
 * Requirements: 4.1
 */

import { z } from 'zod';

// ============================================================================
// Client-Side Schemas (Forms & UI)
// ============================================================================

/**
 * Birth Data Form Schema
 * Used in InputScreen for user input validation
 */
export const BirthDataFormSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format')
    .refine((val) => {
      // Validate date is a real date
      const [month, day, year] = val.split('/').map(Number);
      if (!month || !day || !year) return false;
      
      // Check month range
      if (month < 1 || month > 12) return false;
      
      // Check day range based on month
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) return false;
      
      // Check year range (1900-current year)
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) return false;
      
      return true;
    }, 'Please enter a valid date'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format')
    .refine((val) => {
      // Validate time components
      const match = val.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
      if (!match) return false;
      
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      
      // Check hours range (01-12 for 12-hour format)
      if (hours < 1 || hours > 12) return false;
      
      // Check minutes range (00-59)
      if (minutes < 0 || minutes > 59) return false;
      
      return true;
    }, 'Please enter a valid time'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .refine((val) => {
      // Basic validation: should contain letters and optionally comma/space
      return /^[a-zA-Z\s,.-]+$/.test(val);
    }, 'Location should only contain letters, spaces, and basic punctuation'),
  timeZone: z.string().min(1, 'Time zone is required'),
});

export type BirthDataForm = z.infer<typeof BirthDataFormSchema>;

// ============================================================================
// API Schemas (Client ↔ Server Communication)
// ============================================================================

/**
 * Birth Data API Request Schema
 * Used when client sends birth data to server
 * Format: ISO date + 24-hour time
 */
export const BirthDataAPIRequestSchema = z.object({
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  timeZone: z.string().min(1, 'Time zone is required'),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
});

export type BirthDataAPIRequest = z.infer<typeof BirthDataAPIRequestSchema>;

/**
 * HD Extract Schema
 * Human Design data extracted from birth chart
 */
export const HDExtractSchema = z.object({
  type: z.string(),
  authority: z.string(),
  profile: z.string(),
  centers: z.array(z.string()),
  channels: z.array(z.number()),
  gates: z.array(z.number()),
});

export type HDExtract = z.infer<typeof HDExtractSchema>;

// ============================================================================
// Server-Side Schemas (BodyGraph API Proxy)
// ============================================================================

/**
 * BodyGraph API Request Schema
 * Used by server when calling BodyGraph Chart API
 */
export const BodyGraphRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'Date must be in YYYY-MM-DD HH:mm format'),
  timezone: z.string(),
});

export type BodyGraphRequest = z.infer<typeof BodyGraphRequestSchema>;

/**
 * BodyGraph API Response Schema (partial)
 * Validates the structure of BodyGraph API responses
 */
export const BodyGraphResponseSchema = z.object({
  Properties: z.object({
    Type: z.object({
      option: z.string(),
    }).optional(),
    InnerAuthority: z.object({
      option: z.string(),
    }).optional(),
    Profile: z.object({
      option: z.string(),
    }).optional(),
    Gates: z.object({
      list: z.array(z.object({
        option: z.number(),
      })),
    }).optional(),
  }).optional(),
});

export type BodyGraphResponse = z.infer<typeof BodyGraphResponseSchema>;

// ============================================================================
// Scorer Schemas (Classification System)
// ============================================================================

/**
 * Contributor Schema
 * Represents a single HD attribute that contributed to a system's score
 */
export const ContributorSchema = z.object({
  key: z.string(),
  weight: z.number(),
  label: z.string(),
});

export type Contributor = z.infer<typeof ContributorSchema>;

/**
 * System Score Schema
 * Detailed scoring information for a single star system
 */
export const SystemScoreSchema = z.object({
  system: z.string(),
  rawScore: z.number(),
  percentage: z.number().min(0).max(100),
  contributors: z.array(ContributorSchema),
});

export type SystemScore = z.infer<typeof SystemScoreSchema>;

/**
 * Ally Schema
 * Allied star system with percentage
 */
export const AllySchema = z.object({
  system: z.string(),
  percentage: z.number().min(0).max(100),
});

export type Ally = z.infer<typeof AllySchema>;

/**
 * Classification Result Schema
 * Complete classification result from scorer
 */
export const ClassificationResultSchema = z.object({
  classification: z.enum(['primary', 'hybrid', 'unresolved']),
  primary: z.string().optional(),
  hybrid: z.tuple([z.string(), z.string()]).optional(),
  allies: z.array(AllySchema),
  percentages: z.record(z.string(), z.number()),
  contributorsPerSystem: z.record(z.string(), z.array(z.string())),
  meta: z.object({
    canonVersion: z.string(),
    canonChecksum: z.string(),
  }),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

/**
 * Tie Policy Schema
 * Configuration for tie-breaking logic
 */
export const TiePolicySchema = z.object({
  minPrimaryPct: z.number().min(0).max(100).default(0),
  hybridWindowPct: z.number().min(0).max(100).default(6.0),
  leadPct: z.number().min(0).max(100).default(0),
});

export type TiePolicy = z.infer<typeof TiePolicySchema>;

/**
 * Classification Options Schema
 * Optional configuration for classification algorithm
 */
export const ClassificationOptionsSchema = z.object({
  tiePolicy: TiePolicySchema.partial().optional(),
  includeContributors: z.boolean().optional(),
});

export type ClassificationOptions = z.infer<typeof ClassificationOptionsSchema>;

// ============================================================================
// Canon Schemas (Scoring Rules)
// ============================================================================

/**
 * System Weights Schema
 * Defines weighted scoring rules for a single star system
 */
export const SystemWeightsSchema = z.object({
  weights: z.record(z.string(), z.number()),
  why: z.string(),
});

export type SystemWeights = z.infer<typeof SystemWeightsSchema>;

/**
 * Canon Schema
 * Complete canon data structure containing all star system definitions
 */
export const CanonSchema = z.object({
  version: z.string(),
  systems: z.record(z.string(), SystemWeightsSchema),
});

export type Canon = z.infer<typeof CanonSchema>;

// ============================================================================
// Navigation Schemas (Screen Parameters)
// ============================================================================

/**
 * Result Screen Parameters Schema
 * Data passed to Result screen after classification
 */
export const ResultScreenParamsSchema = z.object({
  classification: z.enum(['primary', 'hybrid', 'unresolved']),
  primary: z.string().optional(),
  hybrid: z.tuple([z.string(), z.string()]).optional(),
  percentage: z.number().min(0).max(100),
  allies: z.array(AllySchema),
  contributorsPerSystem: z.record(z.string(), z.array(z.string())),
  percentages: z.record(z.string(), z.number()),
});

export type ResultScreenParams = z.infer<typeof ResultScreenParamsSchema>;

/**
 * Why Screen Parameters Schema
 * Data passed to Why screen for explanation
 */
export const WhyScreenParamsSchema = z.object({
  system: z.string(),
  contributors: z.array(z.string()),
  percentage: z.number().min(0).max(100),
});

export type WhyScreenParams = z.infer<typeof WhyScreenParamsSchema>;

// ============================================================================
// Error Schemas (API Error Responses)
// ============================================================================

/**
 * API Error Response Schema
 * Standard error response format
 */
export const APIErrorResponseSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
  code: z.string().optional(),
});

export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;

/**
 * Validation Error Schema
 * Zod validation error details
 */
export const ValidationErrorSchema = z.object({
  error: z.string(),
  details: z.array(z.object({
    path: z.array(z.union([z.string(), z.number()])),
    message: z.string(),
    code: z.string(),
  })),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

// ============================================================================
// Cache Schemas (Client-Side Caching)
// ============================================================================

/**
 * Cache Key Schema
 * Key structure for HD data caching
 */
export const CacheKeySchema = z.object({
  utcTimestamp: z.string(),
  lat: z.number().optional(),
  lon: z.number().optional(),
});

export type CacheKey = z.infer<typeof CacheKeySchema>;

/**
 * Cache Entry Schema
 * Cached HD extract with metadata
 */
export const CacheEntrySchema = z.object({
  data: HDExtractSchema,
  timestamp: z.number(),
  expiresAt: z.number(),
});

export type CacheEntry = z.infer<typeof CacheEntrySchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Safe parse with detailed error logging
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (!result.success && context) {
    console.error(`[Schema Validation Error] ${context}:`, result.error.issues);
  }
  
  return result;
}

/**
 * Parse with exception throwing
 */
export function parse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError && context) {
      console.error(`[Schema Validation Error] ${context}:`, error.issues);
    }
    throw error;
  }
}
