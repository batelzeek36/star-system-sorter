/**
 * Birth Data Validation Tests
 * Tests for enhanced form validation rules
 */

import {z} from 'zod';

// Replicate the validation schema from InputScreen
const birthDataSchema = z.object({
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

describe('Birth Data Validation', () => {
  describe('Date Validation', () => {
    it('accepts valid date in MM/DD/YYYY format', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty date', () => {
      const result = birthDataSchema.safeParse({
        date: '',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Date is required');
      }
    });

    it('rejects invalid date format', () => {
      const result = birthDataSchema.safeParse({
        date: '1990-01-15',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Date must be in MM/DD/YYYY format');
      }
    });

    it('rejects invalid month (13)', () => {
      const result = birthDataSchema.safeParse({
        date: '13/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('rejects invalid month (00)', () => {
      const result = birthDataSchema.safeParse({
        date: '00/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('rejects invalid day for month (February 30)', () => {
      const result = birthDataSchema.safeParse({
        date: '02/30/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('accepts leap year date (February 29, 2020)', () => {
      const result = birthDataSchema.safeParse({
        date: '02/29/2020',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects non-leap year date (February 29, 2019)', () => {
      const result = birthDataSchema.safeParse({
        date: '02/29/2019',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('rejects year before 1900', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1899',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('rejects future year', () => {
      const currentYear = new Date().getFullYear();
      const futureYear = currentYear + 1;
      const result = birthDataSchema.safeParse({
        date: `01/15/${futureYear}`,
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('accepts current year', () => {
      const currentYear = new Date().getFullYear();
      const result = birthDataSchema.safeParse({
        date: `01/15/${currentYear}`,
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects day 00', () => {
      const result = birthDataSchema.safeParse({
        date: '01/00/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });

    it('rejects day 32 for January', () => {
      const result = birthDataSchema.safeParse({
        date: '01/32/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });
  });

  describe('Time Validation', () => {
    it('accepts valid time in HH:MM AM/PM format', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty time', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Time is required');
      }
    });

    it('rejects invalid time format (24-hour)', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '15:30',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Time must be in HH:MM AM/PM format');
      }
    });

    it('rejects invalid hour (00)', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '00:30 AM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid time');
      }
    });

    it('rejects invalid hour (13)', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '13:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid time');
      }
    });

    it('accepts valid hour range (01-12)', () => {
      for (let hour = 1; hour <= 12; hour++) {
        const hourStr = String(hour).padStart(2, '0');
        const result = birthDataSchema.safeParse({
          date: '01/15/1990',
          time: `${hourStr}:30 PM`,
          location: 'New York, NY',
          timeZone: 'America/New_York',
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid minutes (60)', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:60 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid time');
      }
    });

    it('accepts valid minutes range (00-59)', () => {
      const result00 = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:00 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result00.success).toBe(true);

      const result59 = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:59 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result59.success).toBe(true);
    });

    it('accepts midnight (12:00 AM)', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '12:00 AM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('accepts noon (12:00 PM)', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '12:00 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Location Validation', () => {
    it('accepts valid location', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty location', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: '',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Location is required');
      }
    });

    it('rejects location with only 1 character', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'A',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Location must be at least 2 characters');
      }
    });

    it('accepts location with 2 characters', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects location longer than 100 characters', () => {
      const longLocation = 'A'.repeat(101);
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: longLocation,
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Location must be less than 100 characters');
      }
    });

    it('accepts location with exactly 100 characters', () => {
      const location = 'A'.repeat(100);
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location,
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('accepts location with spaces', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York City',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('accepts location with commas', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York, NY, USA',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('accepts location with hyphens', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'Saint-Denis',
        timeZone: 'Europe/Paris',
      });
      expect(result.success).toBe(true);
    });

    it('accepts location with periods', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'St. Louis',
        timeZone: 'America/Chicago',
      });
      expect(result.success).toBe(true);
    });

    it('rejects location with numbers', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York 123',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Location should only contain letters, spaces, and basic punctuation'
        );
      }
    });

    it('rejects location with special characters', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York @#$',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Location should only contain letters, spaces, and basic punctuation'
        );
      }
    });
  });

  describe('Time Zone Validation', () => {
    it('accepts valid time zone', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty time zone', () => {
      const result = birthDataSchema.safeParse({
        date: '01/15/1990',
        time: '03:30 PM',
        location: 'New York, NY',
        timeZone: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Time zone is required');
      }
    });
  });

  describe('Complete Form Validation', () => {
    it('validates all fields together', () => {
      const validData = {
        date: '06/15/1992',
        time: '08:45 AM',
        location: 'Los Angeles, CA',
        timeZone: 'America/Los_Angeles',
      };
      const result = birthDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('reports multiple validation errors', () => {
      const invalidData = {
        date: '',
        time: '',
        location: '',
        timeZone: '',
      };
      const result = birthDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
