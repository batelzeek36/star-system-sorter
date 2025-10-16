/**
 * Sanitizer
 * Text sanitization utilities for content moderation
 */

/**
 * Remove excessive whitespace
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Remove control characters and non-printable characters
 */
export function removeControlCharacters(text: string): string {
  // Keep newlines, tabs, and printable characters
  return text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Limit text length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim();
}

/**
 * Replace matched patterns with asterisks
 */
export function maskText(text: string, matches: string[]): string {
  let sanitized = text;

  for (const match of matches) {
    const replacement = '*'.repeat(match.length);
    sanitized = sanitized.replace(new RegExp(match, 'gi'), replacement);
  }

  return sanitized;
}

/**
 * Remove HTML tags (basic protection)
 */
export function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize text with all basic rules
 */
export function sanitizeBasic(text: string, maxLength = 1000): string {
  let sanitized = text;

  // Remove HTML tags
  sanitized = stripHtmlTags(sanitized);

  // Remove control characters
  sanitized = removeControlCharacters(sanitized);

  // Normalize whitespace
  sanitized = normalizeWhitespace(sanitized);

  // Truncate to max length
  sanitized = truncateText(sanitized, maxLength);

  return sanitized;
}

/**
 * Sanitize with masking of blocked terms
 */
export function sanitizeWithMasking(
  text: string,
  blockedMatches: string[],
  maxLength = 1000
): string {
  let sanitized = sanitizeBasic(text, maxLength);

  // Mask blocked terms
  if (blockedMatches.length > 0) {
    sanitized = maskText(sanitized, blockedMatches);
  }

  return sanitized;
}
