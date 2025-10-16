/**
 * Sanitizer Tests
 */

import {
  normalizeWhitespace,
  removeControlCharacters,
  truncateText,
  maskText,
  stripHtmlTags,
  sanitizeBasic,
  sanitizeWithMasking,
} from '../src/moderation/sanitizer';

describe('Sanitizer', () => {
  describe('normalizeWhitespace', () => {
    it('should collapse multiple spaces', () => {
      expect(normalizeWhitespace('hello    world')).toBe('hello world');
    });

    it('should trim leading/trailing whitespace', () => {
      expect(normalizeWhitespace('  hello world  ')).toBe('hello world');
    });

    it('should handle newlines and tabs', () => {
      expect(normalizeWhitespace('hello\n\nworld\t\ttest')).toBe('hello world test');
    });
  });

  describe('removeControlCharacters', () => {
    it('should remove control characters', () => {
      const text = 'hello\x00\x01world';
      expect(removeControlCharacters(text)).toBe('helloworld');
    });

    it('should preserve printable characters', () => {
      const text = 'Hello World 123!';
      expect(removeControlCharacters(text)).toBe(text);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'a'.repeat(100);
      expect(truncateText(text, 50)).toHaveLength(50);
    });

    it('should not truncate short text', () => {
      const text = 'hello';
      expect(truncateText(text, 50)).toBe(text);
    });

    it('should trim after truncation', () => {
      const text = 'hello world test';
      expect(truncateText(text, 11)).toBe('hello world');
    });
  });

  describe('maskText', () => {
    it('should mask matched terms', () => {
      const result = maskText('hello world', ['hello']);
      expect(result).toBe('***** world');
    });

    it('should mask multiple matches', () => {
      const result = maskText('hello world', ['hello', 'world']);
      expect(result).toBe('***** *****');
    });

    it('should be case insensitive', () => {
      const result = maskText('Hello World', ['hello']);
      expect(result).toBe('***** World');
    });
  });

  describe('stripHtmlTags', () => {
    it('should remove HTML tags', () => {
      expect(stripHtmlTags('<p>hello</p>')).toBe('hello');
    });

    it('should remove multiple tags', () => {
      expect(stripHtmlTags('<div><p>hello</p></div>')).toBe('hello');
    });

    it('should handle self-closing tags', () => {
      expect(stripHtmlTags('hello<br/>world')).toBe('helloworld');
    });
  });

  describe('sanitizeBasic', () => {
    it('should apply all basic sanitization', () => {
      const text = '  <p>hello</p>    world  ';
      const result = sanitizeBasic(text);
      expect(result).toBe('hello world');
    });

    it('should truncate to max length', () => {
      const text = 'a'.repeat(2000);
      const result = sanitizeBasic(text, 100);
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should handle empty string', () => {
      expect(sanitizeBasic('')).toBe('');
    });
  });

  describe('sanitizeWithMasking', () => {
    it('should sanitize and mask blocked terms', () => {
      const text = '  <p>hello fuck world</p>  ';
      const result = sanitizeWithMasking(text, ['fuck']);
      expect(result).toBe('hello **** world');
    });

    it('should handle no blocked terms', () => {
      const text = 'hello world';
      const result = sanitizeWithMasking(text, []);
      expect(result).toBe('hello world');
    });

    it('should truncate after masking', () => {
      const text = 'a'.repeat(2000);
      const result = sanitizeWithMasking(text, [], 100);
      expect(result.length).toBeLessThanOrEqual(100);
    });
  });
});
