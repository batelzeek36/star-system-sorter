# Scorer API Usage Guide

## Overview

The scorer module provides a deterministic star system classification API based on Human Design principles.

## Basic Usage

```typescript
import { classify } from '@/scorer';
import type { HDExtract, ScorerResult } from '@/scorer';

// Create HD extract from chart data
const hdExtract: HDExtract = {
  type: 'Manifestor',
  authority: 'Emotional',
  profile: '1/3',
  centers: ['Sacral', 'Throat'],
  channels: [3457],
  gates: [1, 13, 25]
};

// Classify with default options
const result: ScorerResult = await classify(hdExtract);

console.log(result.classification); // 'primary' | 'hybrid' | 'unresolved'
console.log(result.primary); // 'Pleiades' (if primary)
console.log(result.meta.canonVersion); // '0.1.0'
```

## Advanced Usage

```typescript
// Custom tie policy
const result = await classify(hdExtract, {
  tiePolicy: {
    hybridWindowPct: 8.0,  // Wider hybrid window
    minPrimaryPct: 10.0,   // Minimum for primary
    leadPct: 5.0           // Minimum lead
  },
  includeContributors: true
});

// Access detailed contributors
result.contributorsPerSystem['Pleiades'].forEach(key => {
  console.log(`Contributor: ${key}`);
});
```

## API Reference

See `src/scorer/types.ts` for complete type definitions.
