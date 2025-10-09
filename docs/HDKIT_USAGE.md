# hdkit Usage Guide

## Overview

hdkit is a Human Design programming toolkit integrated as a git submodule at the repo root. It provides constants, helper functions, and data structures for Human Design calculations.

## Importing from hdkit

Always import from `@hdkit/index`:

```typescript
// Import constants and functions
import { gateOrder, planetGlyphs, gateNames, oppositeGate } from '@hdkit/index';

// Import types
import type { Gate, Planet, Activations } from '@hdkit/index';
```

## Available Exports

### Constants

#### Gate Data
- `gateOrder: Gate[]` - Array of 64 gates in specific order (starts with 41)
- `harmonicOrder: (Gate | Gate[])[]` - Harmonic gate mappings
- `svgRaveMandalaGateOrder: Gate[]` - Gate order for SVG rendering
- `gateOf: Record<string, string>` - Gate descriptions (e.g., "Gate of Self-Expression")
- `gateNames: Record<string, string>` - I Ching names (e.g., "The Creative")
- `gateShortDescriptions: Record<string, string>` - Short gate descriptions

#### Planet Data
- `planetGlyphs: Record<string, string>` - Unicode glyphs for planets
  - Example: `planetGlyphs['Sun']` → '☉'

#### Astrological Data
- `astrologicalSigns: string[]` - Zodiac sign names
- `astrologicalSignSymbols: string[]` - Zodiac symbols
- `godheads: string[]` - Godhead names
- `godheadsByGate: Record<string, string>` - Godhead for each gate

#### Biochemical Data
- `aminoAcidByGate: Record<string, {...}>` - Amino acid mappings
- `nucleicAcidSequences: Record<string, string>` - DNA codon sequences
- `iChingHexagramGlyphs: Record<string, string>` - I Ching hexagram symbols

#### Visual Data
- `raveMandalaGateColors: Record<string, string>` - Color codes for gates
- Color constants: `yellow`, `lightYellow`, `green`, `brown`, `red`

#### Fixing Data
- `fixings: Record<string, any>` - Exalting and detrimenting planets by gate.line

### Helper Functions

#### Gate Navigation
```typescript
// Get opposite gate (32 positions away in gateOrder)
oppositeGate(gate: Gate): Gate

// Get harmonic gate(s)
harmonicGate(gate: Gate): Gate | Gate[]

// Get next gate in sequence
nextGate(gate: Gate): Gate

// Get next line (1-6, wraps to 1)
nextLine(line: Line): Line

// Get next gate and line as string
nextGateAndLine(gate: Gate, line: Line): string
```

#### Gate Checking
```typescript
// Check if a gate is fixed by a planet
isFixed(gate: Gate, planet: string, activations: Activations): boolean
```

## Type Definitions

### Basic Types
```typescript
type Gate = number; // 1-64
type Line = number; // 1-6
type GateLine = string; // e.g., "1.1"

type Planet =
  | 'Sun' | 'Earth' | 'NorthNode' | 'SouthNode'
  | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';
```

### Activation Types
```typescript
interface PlanetActivation {
  g: Gate;        // Gate number
  l: Line;        // Line number
  sign?: string;  // Astrological sign
  degree?: number; // Degree in sign
}

interface Activations {
  Sun?: PlanetActivation;
  Earth?: PlanetActivation;
  // ... other planets
}
```

## Usage Examples

### Example 1: Get Gate Information
```typescript
import { gateOrder, gateNames, gateOf } from '@hdkit/index';

const firstGate = gateOrder[0]; // 41
const gateName = gateNames['41']; // "Decrease"
const gateDescription = gateOf['41']; // "Gate of Contraction"

console.log(`Gate ${firstGate}: ${gateName} - ${gateDescription}`);
```

### Example 2: Work with Planets
```typescript
import { planetGlyphs } from '@hdkit/index';
import type { Planet } from '@hdkit/index';

const planets: Planet[] = ['Sun', 'Moon', 'Mercury'];
planets.forEach(planet => {
  console.log(`${planet}: ${planetGlyphs[planet]}`);
});
// Output:
// Sun: ☉
// Moon: ☽
// Mercury: ☿
```

### Example 3: Navigate Gates
```typescript
import { oppositeGate, harmonicGate, nextGate } from '@hdkit/index';
import type { Gate } from '@hdkit/index';

const gate: Gate = 1;
console.log(`Gate ${gate}`);
console.log(`  Opposite: ${oppositeGate(gate)}`);
console.log(`  Harmonic:`, harmonicGate(gate));
console.log(`  Next: ${nextGate(gate)}`);
```

### Example 4: Check Gate Colors
```typescript
import { raveMandalaGateColors } from '@hdkit/index';

const gate1Color = raveMandalaGateColors['1']; // '#FCD34D' (yellow)
const gate2Color = raveMandalaGateColors['2']; // '#FCD34D' (yellow)
const gate3Color = raveMandalaGateColors['3']; // '#F56565' (red)
```

## Integration with React Native

### In a Component
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { gateOrder, planetGlyphs } from '@hdkit/index';

export const HdExample: React.FC = () => {
  return (
    <View>
      <Text>First Gate: {gateOrder[0]}</Text>
      <Text>Sun Glyph: {planetGlyphs['Sun']}</Text>
    </View>
  );
};
```

### In a Utility Function
```typescript
// src/hd/utils.ts
import { gateNames, gateOf } from '@hdkit/index';
import type { Gate } from '@hdkit/index';

export function getGateInfo(gate: Gate) {
  return {
    name: gateNames[String(gate)],
    description: gateOf[String(gate)],
  };
}
```

## Notes

- hdkit is a git submodule located at repo root
- The module entry point is `hdkit/index.js`
- TypeScript types are defined in `hdkit/index.d.ts`
- Metro bundler is configured to resolve `@hdkit/*` to `hdkit/*`
- Always use string keys for gate lookups: `gateNames['1']` not `gateNames[1]`

## Troubleshooting

### Import not found
Make sure you're importing from `@hdkit/index`:
```typescript
// ✅ Correct
import { gateOrder } from '@hdkit/index';

// ❌ Wrong
import { gateOrder } from '@hdkit/hdkit';
import { gateOrder } from '@hdkit/constants';
```

### Type errors
Make sure TypeScript can find the type definitions:
```bash
npm run typecheck
```

### Metro bundler issues
Clear Metro cache and restart:
```bash
npm start -- --reset-cache
```

## Next Steps

See `docs/TASK_2.2_SUMMARY.md` for creating the hdkit adapter that uses these imports to compute Human Design extracts.
