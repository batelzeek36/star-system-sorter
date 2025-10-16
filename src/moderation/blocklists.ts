/**
 * Blocklists
 * Defines blocked terms and patterns for content moderation
 */

import type { BlocklistEntry, BlocklistCategory } from './types';

/**
 * Common profanity patterns (minimal set for MVP)
 */
const PROFANITY_PATTERNS: BlocklistEntry[] = [
  { pattern: /\bf+u+c+k+/gi, category: 'profanity', severity: 'high' },
  { pattern: /\bs+h+i+t+/gi, category: 'profanity', severity: 'medium' },
  { pattern: /\ba+s+s+h+o+l+e+/gi, category: 'profanity', severity: 'high' },
  { pattern: /\bb+i+t+c+h+/gi, category: 'profanity', severity: 'medium' },
  { pattern: /\bd+a+m+n+/gi, category: 'profanity', severity: 'low' },
];

/**
 * Spam patterns (repetitive characters, excessive caps)
 */
const SPAM_PATTERNS: BlocklistEntry[] = [
  { pattern: /(.)\1{10,}/g, category: 'spam', severity: 'medium' }, // 10+ repeated chars
  { pattern: /[A-Z]{20,}/g, category: 'spam', severity: 'low' }, // 20+ consecutive caps
];

/**
 * PII patterns (email, phone, SSN-like)
 */
const PII_PATTERNS: BlocklistEntry[] = [
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    category: 'pii',
    severity: 'high',
  },
  {
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    category: 'pii',
    severity: 'high',
  },
  {
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    category: 'pii',
    severity: 'high',
  },
];

/**
 * Harmful content patterns (threats, self-harm)
 */
const HARMFUL_PATTERNS: BlocklistEntry[] = [
  { pattern: /\bkill\s+(myself|yourself)/gi, category: 'harmful', severity: 'high' },
  { pattern: /\bsuicide\b/gi, category: 'harmful', severity: 'high' },
  { pattern: /\bharm\s+(myself|yourself)/gi, category: 'harmful', severity: 'high' },
];

/**
 * Get all blocklist entries
 */
export function getAllBlocklistEntries(): BlocklistEntry[] {
  return [
    ...PROFANITY_PATTERNS,
    ...SPAM_PATTERNS,
    ...PII_PATTERNS,
    ...HARMFUL_PATTERNS,
  ];
}

/**
 * Get blocklist entries by category
 */
export function getBlocklistByCategory(
  category: BlocklistCategory
): BlocklistEntry[] {
  return getAllBlocklistEntries().filter((entry) => entry.category === category);
}

/**
 * Check if text matches any blocklist pattern
 */
export function findBlockedTerms(text: string): {
  matches: string[];
  entries: BlocklistEntry[];
} {
  const matches: string[] = [];
  const entries: BlocklistEntry[] = [];
  const allEntries = getAllBlocklistEntries();

  for (const entry of allEntries) {
    const pattern = entry.pattern;
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'gi') : pattern;
    const found = text.match(regex);

    if (found && found.length > 0) {
      matches.push(...found);
      entries.push(entry);
    }
  }

  return { matches, entries };
}
