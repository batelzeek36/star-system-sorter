/**
 * Moderation Service
 * Main service for content moderation with rate limiting
 */

import type {
  ModerationResult,
  ModerationContext,
  RateLimitConfig,
  RateLimitState,
} from './types';
import { findBlockedTerms } from './blocklists';
import { sanitizeBasic, sanitizeWithMasking } from './sanitizer';

/**
 * Default rate limit configuration
 */
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 10,
  windowMs: 60000, // 1 minute
};

/**
 * Moderation Service
 */
export class ModerationService {
  private rateLimits: Map<string, RateLimitState> = new Map();
  private rateLimitConfig: RateLimitConfig;

  constructor(rateLimitConfig: RateLimitConfig = DEFAULT_RATE_LIMIT) {
    this.rateLimitConfig = rateLimitConfig;
  }

  /**
   * Check if user is rate limited
   */
  private isRateLimited(userId: string, timestamp: number): boolean {
    const state = this.rateLimits.get(userId);

    if (!state) {
      return false;
    }

    const windowElapsed = timestamp - state.windowStart;

    // Reset window if expired
    if (windowElapsed >= this.rateLimitConfig.windowMs) {
      this.rateLimits.delete(userId);
      return false;
    }

    return state.attempts >= this.rateLimitConfig.maxAttempts;
  }

  /**
   * Increment rate limit counter
   */
  private incrementRateLimit(userId: string, timestamp: number): void {
    const state = this.rateLimits.get(userId);

    if (!state) {
      this.rateLimits.set(userId, {
        attempts: 1,
        windowStart: timestamp,
      });
      return;
    }

    const windowElapsed = timestamp - state.windowStart;

    // Reset window if expired
    if (windowElapsed >= this.rateLimitConfig.windowMs) {
      this.rateLimits.set(userId, {
        attempts: 1,
        windowStart: timestamp,
      });
    } else {
      state.attempts += 1;
    }
  }

  /**
   * Moderate text content
   */
  moderate(text: string, context: ModerationContext): ModerationResult {
    const { userId, field, timestamp } = context;

    // Check rate limit if userId provided
    if (userId && this.isRateLimited(userId, timestamp)) {
      return {
        decision: 'block',
        sanitized: '',
        reason: 'Rate limit exceeded',
      };
    }

    // Increment rate limit counter
    if (userId) {
      this.incrementRateLimit(userId, timestamp);
    }

    // Basic sanitization
    const basicSanitized = sanitizeBasic(text);

    // Check for blocked terms
    const { matches, entries } = findBlockedTerms(basicSanitized);

    // No blocked terms found
    if (matches.length === 0) {
      return {
        decision: 'allow',
        sanitized: basicSanitized,
      };
    }

    // Check severity - block on high severity
    const hasHighSeverity = entries.some((entry) => entry.severity === 'high');

    if (hasHighSeverity) {
      return {
        decision: 'block',
        sanitized: '',
        reason: 'Content contains prohibited terms',
        blockedTerms: matches,
      };
    }

    // Medium/low severity - sanitize with masking
    const masked = sanitizeWithMasking(basicSanitized, matches);

    return {
      decision: 'sanitize',
      sanitized: masked,
      reason: 'Content sanitized',
      blockedTerms: matches,
    };
  }

  /**
   * Clear rate limits (for testing)
   */
  clearRateLimits(): void {
    this.rateLimits.clear();
  }

  /**
   * Get rate limit state for user (for testing)
   */
  getRateLimitState(userId: string): RateLimitState | undefined {
    return this.rateLimits.get(userId);
  }
}

/**
 * Default moderation service instance
 */
export const moderationService = new ModerationService();
