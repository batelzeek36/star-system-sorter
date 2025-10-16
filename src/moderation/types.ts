/**
 * Moderation Types
 * Type definitions for content moderation system
 */

/**
 * Moderation decision result
 */
export type ModerationDecision = 'allow' | 'block' | 'sanitize';

/**
 * Moderation result with decision and sanitized content
 */
export interface ModerationResult {
  decision: ModerationDecision;
  sanitized: string;
  reason?: string;
  blockedTerms?: string[];
}

/**
 * Context for moderation decisions
 */
export interface ModerationContext {
  userId?: string;
  field: string;
  timestamp: number;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

/**
 * Rate limit state for a user
 */
export interface RateLimitState {
  attempts: number;
  windowStart: number;
}

/**
 * Blocklist category
 */
export type BlocklistCategory = 'profanity' | 'spam' | 'pii' | 'harmful';

/**
 * Blocklist entry
 */
export interface BlocklistEntry {
  pattern: string | RegExp;
  category: BlocklistCategory;
  severity: 'low' | 'medium' | 'high';
}
