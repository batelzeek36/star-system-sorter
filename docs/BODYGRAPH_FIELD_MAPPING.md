# BodyGraph Field Mapping

## Overview

This document describes how raw BodyGraph API responses are transformed into our `HDExtract` format.

## Field Mapping Table

| HDExtract Field | API Response Path                  | Transformation                  | Example                                  |
| --------------- | ---------------------------------- | ------------------------------- | ---------------------------------------- |
| `type`          | `Properties.Type.option`           | Direct copy                     | "Manifesting Generator"                  |
| `authority`     | `Properties.InnerAuthority.option` | Normalize via `AUTHORITY_MAP`   | "Emotional - Solar Plexus" → "Emotional" |
| `profile`       | `Properties.Profile.option`        | Remove spaces                   | "2 / 4" → "2/4"                          |
| `gates`         | `Properties.Gates.list[].option`   | Extract numbers from list       | `[{option: 1}, {option: 2}]` → `[1, 2]`  |
| `centers`       | _Derived from gates_               | Map gates to centers (TODO)     | `[]` (not yet implemented)               |
| `channels`      | _Derived from gates_               | Pair gates into channels (TODO) | `[]` (not yet implemented)               |

## Authority Normalization

The API returns detailed authority names that need to be normalized:

```typescript
const AUTHORITY_MAP: Record<string, string> = {
  'Emotional - Solar Plexus': 'Emotional',
  'Emotional': 'Emotional',
  'Sacral': 'Sacral',
  'Splenic': 'Splenic',
  'Ego Manifested': 'Ego',
  'Ego Projected': 'Ego',
  'Self Projected': 'Self-Projected',
  'Mental Projector': 'Mental',
  'Lunar': 'Lunar',
};

function normalizeAuthority(raw?: string): string {
  if (!raw) return 'Sacral';
  return AUTHORITY_MAP[raw] || raw;
}
```

## Profile Formatting

Remove spaces from profile strings:

```typescript
function normalizeProfile(raw?: string): string {
  if (!raw) return '1/3';
  return raw.replace(/\s+/g, ''); // "2 / 4" → "2/4"
}
```

## Gate Extraction

Extract gate numbers from the nested list structure:

```typescript
function extractGates(props: any): number[] {
  const gatesList = props.Gates?.list || [];
  return gatesList
    .map((g: any) => g.option)
    .filter((n: any) => typeof n === 'number');
}
```

## Centers Derivation (TODO)

Centers are not directly provided by the API. Implementation options:

1. **Gate-to-Center Mapping**: Use a lookup table mapping gates to their centers
2. **HD Logic**: Implement Human Design logic to derive centers from gates
3. **Additional API Call**: Check if BodyGraph provides a separate endpoint

**Current Status**: Returns empty array `[]` until implemented.

## Channels Derivation (TODO)

Channels are pairs of connected gates. Implementation options:

1. **Gate Pairing**: Use HD channel definitions to pair gates
2. **hdkit Integration**: Use hdkit constants for channel mapping
3. **Additional API Call**: Check if BodyGraph provides channel data

**Current Status**: Returns empty array `[]` until implemented.

## Date and Time Handling

### Input Format

The client accepts separate date and time fields:

```typescript
{
  dateISO: '1992-10-03',  // ISO date string
  time: '00:03',          // 24-hour time
  timeZone: 'America/New_York'  // IANA timezone
}
```

### API Format Conversion

The BodyGraph API expects a combined date-time string:

```typescript
// Combine date and time for API
const apiDate = `${dateISO} ${time}`;  // "1992-10-03 00:03"
```

### Timezone Handling

- Use IANA timezone identifiers (e.g., `America/New_York`, `Europe/London`)
- The API handles timezone conversion internally
- No need to convert to UTC on the client side

## Related Documentation

- [API Reference](./BODYGRAPH_API_REFERENCE.md) - Endpoints and payloads
- [Client Implementation](./BODYGRAPH_CLIENT_IMPLEMENTATION.md) - Client code
