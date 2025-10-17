# Schema Validation Guide

This document describes the Zod schemas used throughout the Star System Sorter application and how to use them.

## Overview

All validation schemas are defined in `src/lib/schemas.ts` as the single source of truth. These schemas are used for:

- **Client-side form validation** (with react-hook-form)
- **Server-side request/response validation**
- **Runtime type checking and parsing**
- **TypeScript type inference**

## Schema Categories

### 1. Client-Side Schemas (Forms & UI)

#### BirthDataFormSchema

Used in `InputScreen` for user input validation.

```typescript
import { BirthDataFormSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(BirthDataFormSchema),
  defaultValues: {
    date: '',
    time: '',
    location: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});
```

**Format:**
- `date`: MM/DD/YYYY (e.g., "01/15/1990")
- `time`: HH:MM AM/PM (e.g., "02:30 PM")
- `location`: City, State/Country (2-100 characters, letters/spaces/punctuation only)
- `timeZone`: IANA timezone (e.g., "America/Los_Angeles")

### 2. API Schemas (Client ↔ Server)

#### BirthDataAPIRequestSchema

Used when client sends birth data to server.

```typescript
import { BirthDataAPIRequestSchema } from '@/lib/schemas';

const apiRequest = {
  dateISO: '1990-01-15',
  time: '14:30',
  timeZone: 'America/Los_Angeles',
  lat: 37.7749, // optional
  lon: -122.4194, // optional
};

const validated = BirthDataAPIRequestSchema.parse(apiRequest);
```

**Format:**
- `dateISO`: YYYY-MM-DD (ISO date)
- `time`: HH:mm (24-hour format)
- `timeZone`: IANA timezone
- `lat`: -90 to 90 (optional)
- `lon`: -180 to 180 (optional)

#### HDExtractSchema

Validates Human Design data extracted from birth chart.

```typescript
import { HDExtractSchema } from '@/lib/schemas';

const hdExtract = {
  type: 'Generator',
  authority: 'Sacral',
  profile: '1/3',
  centers: ['Sacral', 'Spleen'],
  channels: [34, 57],
  gates: [1, 2, 3, 13, 25],
};

const validated = HDExtractSchema.parse(hdExtract);
```

### 3. Server-Side Schemas (BodyGraph API)

#### BodyGraphRequestSchema

Used by server when calling BodyGraph Chart API.

```typescript
import { BodyGraphRequestSchema } from '@/lib/schemas';

const request = {
  date: '1990-01-15 14:30',
  timezone: 'America/Los_Angeles',
};

const validated = BodyGraphRequestSchema.parse(request);
```

#### BodyGraphResponseSchema

Validates BodyGraph API responses.

```typescript
import { BodyGraphResponseSchema } from '@/lib/schemas';

const response = await fetch('https://api.bodygraphchart.com/...');
const data = await response.json();
const validated = BodyGraphResponseSchema.parse(data);
```

### 4. Scorer Schemas (Classification)

#### ClassificationResultSchema

Complete classification result from scorer.

```typescript
import { ClassificationResultSchema } from '@/lib/schemas';

const result = {
  classification: 'primary',
  primary: 'Pleiades',
  allies: [
    { system: 'Sirius', percentage: 18.2 },
    { system: 'Arcturus', percentage: 14.3 },
  ],
  percentages: {
    Pleiades: 67.5,
    Sirius: 18.2,
    Arcturus: 14.3,
  },
  contributorsPerSystem: {
    Pleiades: ['type_generator', 'gate_1'],
    Sirius: ['center_sacral'],
  },
  meta: {
    canonVersion: '0.1.0',
    canonChecksum: 'abc123',
  },
};

const validated = ClassificationResultSchema.parse(result);
```

#### TiePolicySchema

Configuration for tie-breaking logic.

```typescript
import { TiePolicySchema } from '@/lib/schemas';

const policy = {
  minPrimaryPct: 50,
  hybridWindowPct: 6.0,
  leadPct: 0,
};

const validated = TiePolicySchema.parse(policy);
```

### 5. Canon Schemas (Scoring Rules)

#### CanonSchema

Complete canon data structure.

```typescript
import { CanonSchema } from '@/lib/schemas';

const canon = {
  version: '0.1.0',
  systems: {
    Pleiades: {
      weights: {
        type_generator: 15,
        gate_1: 5,
        center_sacral: 10,
      },
      why: 'Pleiades values generators with gate 1',
    },
    Sirius: {
      weights: {
        type_manifestor: 15,
      },
      why: 'Sirius values manifestors',
    },
  },
};

const validated = CanonSchema.parse(canon);
```

### 6. Navigation Schemas (Screen Parameters)

#### ResultScreenParamsSchema

Data passed to Result screen after classification.

```typescript
import { ResultScreenParamsSchema } from '@/lib/schemas';

navigation.navigate('Result', {
  classification: 'primary',
  primary: 'Pleiades',
  percentage: 67.5,
  allies: [{ system: 'Sirius', percentage: 18.2 }],
  contributorsPerSystem: { Pleiades: ['type_generator'] },
  percentages: { Pleiades: 67.5, Sirius: 18.2 },
});
```

#### WhyScreenParamsSchema

Data passed to Why screen for explanation.

```typescript
import { WhyScreenParamsSchema } from '@/lib/schemas';

navigation.navigate('Why', {
  system: 'Pleiades',
  contributors: ['type_generator', 'gate_1'],
  percentage: 67.5,
});
```

### 7. Error Schemas

#### APIErrorResponseSchema

Standard error response format.

```typescript
import { APIErrorResponseSchema } from '@/lib/schemas';

const error = {
  error: 'Invalid input',
  details: { field: 'date', message: 'Invalid format' },
  code: 'VALIDATION_ERROR',
};

const validated = APIErrorResponseSchema.parse(error);
```

#### ValidationErrorSchema

Zod validation error details.

```typescript
import { ValidationErrorSchema } from '@/lib/schemas';

const error = {
  error: 'Validation failed',
  details: [
    {
      path: ['date'],
      message: 'Invalid format',
      code: 'invalid_string',
    },
  ],
};

const validated = ValidationErrorSchema.parse(error);
```

### 8. Cache Schemas

#### CacheKeySchema

Key structure for HD data caching.

```typescript
import { CacheKeySchema } from '@/lib/schemas';

const cacheKey = {
  utcTimestamp: '1990-01-15 14:30',
  lat: 37.7749,
  lon: -122.4194,
};

const validated = CacheKeySchema.parse(cacheKey);
```

#### CacheEntrySchema

Cached HD extract with metadata.

```typescript
import { CacheEntrySchema } from '@/lib/schemas';

const entry = {
  data: {
    type: 'Generator',
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral'],
    channels: [34],
    gates: [1, 2, 3],
  },
  timestamp: Date.now(),
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
};

const validated = CacheEntrySchema.parse(entry);
```

## Utility Functions

### safeParse

Safe parsing with detailed error logging.

```typescript
import { safeParse, AllySchema } from '@/lib/schemas';

const result = safeParse(
  AllySchema,
  { system: 'Sirius', percentage: 18.2 },
  'Ally validation'
);

if (result.success) {
  console.log('Valid:', result.data);
} else {
  console.error('Invalid:', result.error);
}
```

### parse

Parse with exception throwing.

```typescript
import { parse, AllySchema } from '@/lib/schemas';

try {
  const data = parse(
    AllySchema,
    { system: 'Sirius', percentage: 18.2 },
    'Ally validation'
  );
  console.log('Valid:', data);
} catch (error) {
  console.error('Invalid:', error);
}
```

## Best Practices

### 1. Always Use Schemas for Validation

```typescript
// ❌ Bad: Manual validation
if (typeof data.date === 'string' && data.date.length > 0) {
  // ...
}

// ✅ Good: Schema validation
const result = BirthDataFormSchema.safeParse(data);
if (result.success) {
  // Use result.data
}
```

### 2. Use TypeScript Type Inference

```typescript
import { BirthDataForm } from '@/lib/schemas';

// Type is automatically inferred from schema
function processBirthData(data: BirthDataForm) {
  // data.date is string
  // data.time is string
  // etc.
}
```

### 3. Validate at Boundaries

```typescript
// Validate when receiving data from external sources
const apiResponse = await fetch('/api/hd');
const data = await apiResponse.json();
const validated = HDExtractSchema.parse(data);

// Validate user input
const formData = form.getValues();
const validated = BirthDataFormSchema.parse(formData);

// Validate navigation params
const params = route.params;
const validated = ResultScreenParamsSchema.parse(params);
```

### 4. Handle Validation Errors Gracefully

```typescript
import { z } from 'zod';

try {
  const validated = BirthDataFormSchema.parse(data);
  // Use validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    error.issues.forEach(issue => {
      console.error(`${issue.path.join('.')}: ${issue.message}`);
    });
  }
}
```

### 5. Use safeParse for Non-Critical Validation

```typescript
// When you want to handle errors without throwing
const result = BirthDataFormSchema.safeParse(data);

if (result.success) {
  // Use result.data
  processData(result.data);
} else {
  // Handle errors
  showErrorMessage(result.error.issues[0].message);
}
```

## Testing

All schemas have comprehensive tests in `__tests__/schemas.test.ts`.

Run tests:
```bash
npm test -- __tests__/schemas.test.ts
```

## Schema Updates

When updating schemas:

1. Update the schema in `src/lib/schemas.ts`
2. Update corresponding TypeScript types (automatically inferred)
3. Add tests in `__tests__/schemas.test.ts`
4. Update this documentation
5. Run tests to ensure nothing breaks

## JSON Schemas

JSON Schema versions of all Zod schemas are auto-generated and available in the `schemas/` directory.

### Generate JSON Schemas

```bash
npm run schemas:generate
```

This will:
- Convert all Zod schemas to JSON Schema format (Draft 07)
- Write individual `.json` files to `schemas/` directory
- Create an `index.json` with metadata about all schemas

### Usage

JSON schemas can be used for:
- API documentation generation
- Non-TypeScript validation
- IDE autocomplete and tooling
- Contract definition and sharing

See [schemas/README.md](../schemas/README.md) for detailed information about the generated JSON schemas.

### Known Limitations

The current version of `zod-to-json-schema` has limited support for Zod v4 features. For the most accurate schema definitions, always refer to the Zod schemas in `src/lib/schemas.ts`.

## Related Documentation

- [JSON Schemas](../schemas/README.md)
- [Validation Configuration](../src/lib/validation.ts)
- [API Client](../src/hd/api-client.ts)
- [Scorer Types](../src/scorer/types.ts)
- [Navigation Types](../src/navigation/types.ts)
