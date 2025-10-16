/**
 * Moderation Service Tests
 */

import { ModerationService } from '../src/moderation/service';
import type { ModerationContext } from '../src/moderation/types';

describe('ModerationService', () => {
  let service: ModerationService;
  let timestamp: number;

  beforeEach(() => {
    service = new ModerationService({
      maxAttempts: 3,
      windowMs: 60000, // 1 minute
    });
    timestamp = Date.now();
  });

  describe('moderate - clean content', () => {
    it('should allow clean text', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'name',
        timestamp,
      };

      const result = service.moderate('John Doe', context);

      expect(result.decision).toBe('allow');
      expect(result.sanitized).toBe('John Doe');
      expect(result.reason).toBeUndefined();
    });

    it('should sanitize whitespace in clean text', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'name',
        timestamp,
      };

      const result = service.moderate('  John   Doe  ', context);

      expect(result.decision).toBe('allow');
      expect(result.sanitized).toBe('John Doe');
    });
  });

  describe('moderate - blocked content', () => {
    it('should block high severity profanity', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      const result = service.moderate('This is fuck test', context);

      expect(result.decision).toBe('block');
      expect(result.sanitized).toBe('');
      expect(result.reason).toBe('Content contains prohibited terms');
      expect(result.blockedTerms).toBeDefined();
      expect(result.blockedTerms!.length).toBeGreaterThan(0);
    });

    it('should block harmful content', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      const result = service.moderate('I want to harm myself', context);

      expect(result.decision).toBe('block');
      expect(result.sanitized).toBe('');
    });

    it('should block PII', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      const result = service.moderate('Email me at test@example.com', context);

      expect(result.decision).toBe('block');
      expect(result.sanitized).toBe('');
    });
  });

  describe('moderate - sanitized content', () => {
    it('should sanitize medium severity terms', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      const result = service.moderate('This is damn annoying', context);

      expect(result.decision).toBe('sanitize');
      expect(result.sanitized).toContain('****');
      expect(result.reason).toBe('Content sanitized');
      expect(result.blockedTerms).toBeDefined();
    });
  });

  describe('rate limiting', () => {
    it('should allow requests within rate limit', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      // First 3 requests should succeed
      for (let i = 0; i < 3; i++) {
        const result = service.moderate('Clean text', context);
        expect(result.decision).toBe('allow');
      }
    });

    it('should block requests exceeding rate limit', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      // Make 3 requests (at limit)
      for (let i = 0; i < 3; i++) {
        service.moderate('Clean text', context);
      }

      // 4th request should be blocked
      const result = service.moderate('Clean text', context);
      expect(result.decision).toBe('block');
      expect(result.reason).toBe('Rate limit exceeded');
    });

    it('should reset rate limit after window expires', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      // Make 3 requests (at limit)
      for (let i = 0; i < 3; i++) {
        service.moderate('Clean text', context);
      }

      // Wait for window to expire
      const newTimestamp = timestamp + 61000; // 61 seconds later
      const newContext: ModerationContext = {
        ...context,
        timestamp: newTimestamp,
      };

      // Should allow again
      const result = service.moderate('Clean text', newContext);
      expect(result.decision).toBe('allow');
    });

    it('should track rate limits per user', () => {
      const context1: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      const context2: ModerationContext = {
        userId: 'user2',
        field: 'message',
        timestamp,
      };

      // User1 makes 3 requests
      for (let i = 0; i < 3; i++) {
        service.moderate('Clean text', context1);
      }

      // User2 should still be allowed
      const result = service.moderate('Clean text', context2);
      expect(result.decision).toBe('allow');
    });

    it('should work without userId', () => {
      const context: ModerationContext = {
        field: 'message',
        timestamp,
      };

      const result = service.moderate('Clean text', context);
      expect(result.decision).toBe('allow');
    });
  });

  describe('clearRateLimits', () => {
    it('should clear all rate limits', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      // Hit rate limit
      for (let i = 0; i < 4; i++) {
        service.moderate('Clean text', context);
      }

      // Clear and try again
      service.clearRateLimits();
      const result = service.moderate('Clean text', context);
      expect(result.decision).toBe('allow');
    });
  });

  describe('getRateLimitState', () => {
    it('should return rate limit state', () => {
      const context: ModerationContext = {
        userId: 'user1',
        field: 'message',
        timestamp,
      };

      service.moderate('Clean text', context);

      const state = service.getRateLimitState('user1');
      expect(state).toBeDefined();
      expect(state!.attempts).toBe(1);
      expect(state!.windowStart).toBe(timestamp);
    });

    it('should return undefined for unknown user', () => {
      const state = service.getRateLimitState('unknown');
      expect(state).toBeUndefined();
    });
  });
});
