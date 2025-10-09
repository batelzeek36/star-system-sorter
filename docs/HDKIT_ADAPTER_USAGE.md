# hdkit Adapter Usage Guide

## Overview

The hdkit adapter provides a clean API for computing Human Design extracts from birth data. It handles timezone conversion and returns structured HD data.

## Basic Usage

```typescript
import { computeHDExtract } from '@/hd';
import type { BirthData, HDExtract } from '@/hd';

// Prepare birth data
const birthData: BirthData = {
  dateISO: '1990-01-15',      // YYYY-MM-DD format
  time: '14:30',               // HH:mm format (24-hour)
  timeZone: 'America/New_York', // IANA timezone
  lat: 40.7128,                // Optional: latitude
  lon: -74.0060,               // Optional: longitude
};

// Compute HD extract
const result: HDExtract = await computeHDExtract(birthData);

console.log(result);
// {
//   type: 'Generator',
//   authority: 'Sacral',
//   profile: '2/4',
//   centers: ['Head', 'Ajna', 'Throat', 'G'],
//   channels: [1, 8, 15, 22],
//   gates: [1, 8, 15, 22, 33, 40, 47, 54]
// }
```

## Integration with Input Screen

```typescript
// src/screens/InputScreen.tsx
import { computeHDExtract } from '@/hd';
import type { BirthData } from '@/hd';

const handleSubmit = async (formData: any) => {
  try {
    // Prepare birth data from form
    const birthData: BirthData = {
      dateISO: formData.date,
      time: formData.time,
      timeZone: formData.timeZone,
    };
    
    // Compute HD extract
    const hdExtract = await computeHDExtract(birthData);
    
    // Pass to scorer for classification
    const classification = await classify(hdExtract);
    
    // Navigate to result screen
    navigation.navigate('Result', { classification });
  } catch (error) {
    console.error('Failed to compute HD extract:', error);
    // Show error message to user
  }
};
```

## API Reference

### `computeHDExtract(birthData: BirthData): Promise<HDExtract>`

Computes a Human Design extract from birth data.

**Parameters:**
- `birthData.dateISO` (string, required): Birth date in ISO format (YYYY-MM-DD)
- `birthData.time` (string, required): Birth time in 24-hour format (HH:mm)
- `birthData.timeZone` (string, required): IANA timezone identifier
- `birthData.lat` (number, optional): Latitude for location-based calculations
- `birthData.lon` (number, optional): Longitude for location-based calculations

**Returns:**
- `Promise<HDExtract>`: HD extract with type, authority, profile, centers, channels, gates

**Example:**
```typescript
const result = await computeHDExtract({
  dateISO: '1985-06-20',
  time: '08:15',
  timeZone: 'Europe/London',
});
```

## Types

### `BirthData`

```typescript
interface BirthData {
  dateISO: string;   // ISO date (YYYY-MM-DD)
  time: string;      // 24-hour time (HH:mm)
  timeZone: string;  // IANA timezone
  lat?: number;      // Optional latitude
  lon?: number;      // Optional longitude
}
```

### `HDExtract`

```typescript
interface HDExtract {
  type: string;       // HD type (Manifestor, Generator, etc.)
  authority: string;  // Inner authority (Emotional, Sacral, etc.)
  profile: string;    // Profile (e.g., "1/3", "2/4")
  centers: string[];  // Defined centers
  channels: number[]; // Active channels (sorted, unique)
  gates: number[];    // Active gates (sorted, unique)
}
```

## Timezone Handling

The adapter uses `Intl.DateTimeFormat` to convert local wall time to UTC:

```typescript
// Example: Convert New York time to UTC
const birthData = {
  dateISO: '1990-01-15',
  time: '14:30',
  timeZone: 'America/New_York',
};

// Internally converts to UTC for calculations
// Handles DST automatically
```

**Supported Timezones:**
- Any IANA timezone identifier (e.g., "America/New_York", "Europe/London", "Asia/Tokyo")
- Platform timezone database is used (no external deps)
- DST is handled automatically

## Determinism

The adapter is deterministic: same inputs always produce same outputs.

```typescript
const birthData = {
  dateISO: '1990-01-15',
  time: '14:30',
  timeZone: 'America/New_York',
};

const result1 = await computeHDExtract(birthData);
const result2 = await computeHDExtract(birthData);

// result1 === result2 (deep equality)
```

## Error Handling

```typescript
try {
  const result = await computeHDExtract(birthData);
  // Use result
} catch (error) {
  if (error instanceof Error) {
    console.error('HD computation failed:', error.message);
  }
  // Show user-friendly error message
}
```

## Testing

```typescript
import { computeHDExtract } from '@/hd';

describe('HD Integration', () => {
  it('should compute HD extract', async () => {
    const result = await computeHDExtract({
      dateISO: '1990-01-15',
      time: '14:30',
      timeZone: 'America/New_York',
    });
    
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('authority');
    expect(result).toHaveProperty('profile');
    expect(result.gates.length).toBeGreaterThan(0);
  });
});
```

## Implementation Notes

### Current Implementation
- Uses deterministic mock data based on input hash
- Provides correct API shape for integration
- Ready for real ephemeris calculations

### Future Enhancement
To replace with real HD calculations:
1. Add ephemeris library (e.g., Swiss Ephemeris)
2. Calculate planetary positions at birth time
3. Map positions to gates using I Ching wheel
4. Determine channels, centers, type, authority, profile

### No Breaking Changes
The API will remain the same when real calculations are added:
```typescript
// API stays the same
const result = await computeHDExtract(birthData);
```

## Common Patterns

### With Form Validation

```typescript
import { z } from 'zod';
import { computeHDExtract } from '@/hd';

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  timeZone: z.string().min(1),
});

const handleSubmit = async (data: z.infer<typeof schema>) => {
  const result = await computeHDExtract({
    dateISO: data.date,
    time: data.time,
    timeZone: data.timeZone,
  });
  // Use result
};
```

### With Loading State

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleCompute = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await computeHDExtract(birthData);
    // Use result
  } catch (err) {
    setError('Failed to compute HD data');
  } finally {
    setLoading(false);
  }
};
```

## See Also

- [HDKIT_USAGE.md](./HDKIT_USAGE.md) - hdkit library reference
- [TASK_2.2_SUMMARY.md](./TASK_2.2_SUMMARY.md) - Implementation details
- [TASK_2.3_SUMMARY.md](./TASK_2.3_SUMMARY.md) - Timezone picker integration
