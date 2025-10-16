/**
 * Blocklists Tests
 */

import {
  getAllBlocklistEntries,
  getBlocklistByCategory,
  findBlockedTerms,
} from '../src/moderation/blocklists';

describe('Blocklists', () => {
  describe('getAllBlocklistEntries', () => {
    it('should return all blocklist entries', () => {
      const entries = getAllBlocklistEntries();
      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0]).toHaveProperty('pattern');
      expect(entries[0]).toHaveProperty('category');
      expect(entries[0]).toHaveProperty('severity');
    });
  });

  describe('getBlocklistByCategory', () => {
    it('should return profanity entries', () => {
      const entries = getBlocklistByCategory('profanity');
      expect(entries.length).toBeGreaterThan(0);
      expect(entries.every((e) => e.category === 'profanity')).toBe(true);
    });

    it('should return spam entries', () => {
      const entries = getBlocklistByCategory('spam');
      expect(entries.length).toBeGreaterThan(0);
      expect(entries.every((e) => e.category === 'spam')).toBe(true);
    });

    it('should return PII entries', () => {
      const entries = getBlocklistByCategory('pii');
      expect(entries.length).toBeGreaterThan(0);
      expect(entries.every((e) => e.category === 'pii')).toBe(true);
    });

    it('should return harmful entries', () => {
      const entries = getBlocklistByCategory('harmful');
      expect(entries.length).toBeGreaterThan(0);
      expect(entries.every((e) => e.category === 'harmful')).toBe(true);
    });
  });

  describe('findBlockedTerms', () => {
    it('should find profanity', () => {
      const result = findBlockedTerms('This is a fuck test');
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.entries.length).toBeGreaterThan(0);
      expect(result.entries[0].category).toBe('profanity');
    });

    it('should find spam patterns', () => {
      const result = findBlockedTerms('aaaaaaaaaaaaa'); // 13 repeated chars
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.entries.some((e) => e.category === 'spam')).toBe(true);
    });

    it('should find PII - email', () => {
      const result = findBlockedTerms('Contact me at test@example.com');
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.entries.some((e) => e.category === 'pii')).toBe(true);
    });

    it('should find PII - phone', () => {
      const result = findBlockedTerms('Call me at 555-123-4567');
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.entries.some((e) => e.category === 'pii')).toBe(true);
    });

    it('should find harmful content', () => {
      const result = findBlockedTerms('I want to harm myself');
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.entries.some((e) => e.category === 'harmful')).toBe(true);
    });

    it('should return empty for clean text', () => {
      const result = findBlockedTerms('This is clean text');
      expect(result.matches.length).toBe(0);
      expect(result.entries.length).toBe(0);
    });

    it('should be case insensitive', () => {
      const result = findBlockedTerms('This is a FUCK test');
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('should handle multiple matches', () => {
      const result = findBlockedTerms('fuck and shit');
      expect(result.matches.length).toBe(2);
      expect(result.entries.length).toBe(2);
    });
  });
});
