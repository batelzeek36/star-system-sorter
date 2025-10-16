/**
 * Moderation Module
 * Public API for content moderation
 */

export { ModerationService, moderationService } from './service';
export { findBlockedTerms, getAllBlocklistEntries, getBlocklistByCategory } from './blocklists';
export { sanitizeBasic, sanitizeWithMasking } from './sanitizer';
export type {
  ModerationResult,
  ModerationDecision,
  ModerationContext,
  RateLimitConfig,
  RateLimitState,
  BlocklistCategory,
  BlocklistEntry,
} from './types';
