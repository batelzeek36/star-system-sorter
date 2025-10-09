/**
 * Birth Data Schema Validation Tests
 * 
 * Tests Zod schema validation for birth data input form.
 * Covers happy paths (valid data) and sad paths (invalid data).
 */

import { z } from 'zod';

// Define the schema (same as in InputScreen)
const birthDataSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format'),
  location: z.string().min(1, 'Location is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
});

describe('Birth Data Schema Validation', () => {
  describe('Happy Paths - Valid Data', () => {
    it('should validate correct birth data', () => {
      const validData = {
        date: '01/15/1990',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate with AM time', () => {
      const validData = {
        date: '12/25/2000',
        time: '09:45 AM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      };

      const result = birthDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with midnight time', () => {
      const validData = {
        date: '06/20/1985',
        time: '12:00 AM',
        location: 'London, UK',
        timeZone: 'Europe/London',
      };

      const result = birthDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with noon time', () => {
      const validData = {
        date: '03/10/1995',
        time: '12:00 PM',
        location: 'Tokyo, Japan',
        timeZone: 'Asia/Tokyo',
      };

      const result = birthDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with international location', () => {
      const validData = {
        date: '07/04/1988',
        time: '03:15 PM',
        location: 'Sydney, Australia',
        timeZone: 'Australia/Sydney',
      };

      const result = birthDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Sad Paths - Invalid Date', () => {
    it('should reject empty date', () => {
      const invalidData = {
        date: '',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Date is required');
      }
    });

    it('should reject date without leading zeros', () => {
      const invalidData = {
        date: '1/5/1990',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Date must be in MM/DD/YYYY format');
      }
    });

    it('should reject date with wrong separator', () => {
      const invalidData = {
        date: '01-15-1990',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject date with 2-digit year', () => {
      const invalidData = {
        date: '01/15/90',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject ISO date format', () => {
      const invalidData = {
        date: '1990-01-15',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Sad Paths - Invalid Time', () => {
    it('should reject empty time', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Time is required');
      }
    });

    it('should reject 24-hour time format', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '14:30',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject time without AM/PM', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Time must be in HH:MM AM/PM format');
      }
    });

    it('should reject time with lowercase am/pm', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30 pm',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject time without leading zero', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '2:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject time with single-digit minutes', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:5 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Sad Paths - Invalid Location', () => {
    it('should reject empty location', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30 PM',
        location: '',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Location is required');
      }
    });
  });

  describe('Sad Paths - Invalid Time Zone', () => {
    it('should reject empty time zone', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: '',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Time zone is required');
      }
    });
  });

  describe('Sad Paths - Missing Fields', () => {
    it('should reject data missing date field', () => {
      const invalidData = {
        time: '02:30 PM',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject data missing time field', () => {
      const invalidData = {
        date: '01/15/1990',
        location: 'San Francisco, CA',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject data missing location field', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30 PM',
        timeZone: 'America/Los_Angeles',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject data missing timeZone field', () => {
      const invalidData = {
        date: '01/15/1990',
        time: '02:30 PM',
        location: 'San Francisco, CA',
      };

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject completely empty object', () => {
      const invalidData = {};

      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
