# Dependency Rules

This document explains the dependency-cruiser rules enforced in this project to maintain code quality, modularity, and clear architectural boundaries.

## Overview

We use [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) to enforce:
- **No circular dependencies** (Requirement 11.7)
- **No deep imports** - only import from module index.ts (Requirement 11.6)
- **Layered architecture** - Screens → Components → Theme/Tokens → Utils (Requirement 11.5)

## Running the Checks

```bash
# Check dependency graph
npm run lint:graph

# Run all quality checks
npm run lint
npm run typecheck
npm run lint:graph
npm test
```

## Rules

### 1. No Circular Dependencies

**Rule:** `no-circular`  
**Severity:** Error

Circular dependencies are not allowed anywhere in the codebase. They make code harder to understand, test, and maintain.

**Example of violation:**
```typescript
// src/components/A.tsx
import { B } from './B';

// src/components/B.tsx
import { A } from './A'; // ❌ Circular dependency!
```

**How to fix:**
- Extract shared logic to a third module
- Use dependency inversion (interfaces)
- Restructure to make dependencies unidirectional

### 2. No Deep Imports

**Rule:** `no-deep-imports`  
**Severity:** Error

Modules must only be imported via their public API (index.ts). Direct imports of internal files are forbidden.

**Example of violation:**
```typescript
// ❌ Bad: Deep import
import { computeScore } from '@/scorer/score';

// ✅ Good: Import from index.ts
import { computeScore } from '@/scorer';
```

**Allowed patterns:**
- Imports from `index.ts` or `index.tsx`
- Imports within the same module (internal use)
- Test files can import anything

**How to fix:**
- Export the needed function/type from the module's index.ts
- If it shouldn't be public, keep it internal and refactor usage

### 3. Layered Architecture

**Rules:** `enforce-layering-*`  
**Severity:** Error

The codebase follows a strict layered architecture:

```
Screens (top layer)
  ↓ can import from
Components
  ↓ can import from
Theme/Tokens
  ↓ can import from
Utils (lib, state)
```

**Forbidden dependencies:**
- ❌ Utils (lib/state) → Components
- ❌ Utils (lib/state) → Screens
- ❌ Components → Screens
- ❌ Theme/Tokens → Components
- ❌ Theme/Tokens → Screens

**Example of violation:**
```typescript
// src/lib/validation.ts
import { Button } from '@/components'; // ❌ Utils cannot import Components

// src/components/Card.tsx
import { HomeScreen } from '@/screens'; // ❌ Components cannot import Screens
```

**How to fix:**
- Move shared logic down to a lower layer
- Use dependency injection or callbacks
- Restructure to respect the layering

## Module Structure

Each module should follow this structure:

```
src/scorer/
├── types.ts          # TypeScript interfaces and types
├── canon.ts          # Implementation file
├── score.ts          # Implementation file
├── tie.ts            # Implementation file
└── index.ts          # Public API exports (ONLY import from here)
```

**index.ts example:**
```typescript
// Public API - only export what should be used externally
export { computeScore } from './score';
export { loadCanon } from './canon';
export type { ScorerResult, HDExtract } from './types';

// Internal functions are NOT exported
```

## Exceptions

Test files are exempt from these rules:
- `__tests__/**`
- `*.test.ts`, `*.test.tsx`
- `*.spec.ts`, `*.spec.tsx`

## CI Integration

These checks run automatically in CI on every push and pull request. The build will fail if any violations are detected.

See `.github/workflows/ci.yml` for the CI configuration.

## Troubleshooting

### "Circular dependency detected"

1. Run `npm run lint:graph` to see the cycle
2. Identify the modules involved
3. Break the cycle by:
   - Extracting shared code to a new module
   - Using interfaces/types instead of concrete imports
   - Restructuring the dependency flow

### "Deep import detected"

1. Check which internal file you're importing
2. Add the export to the module's `index.ts`
3. Update your import to use the module path

### "Layering violation"

1. Identify which layer is importing from a higher layer
2. Move the shared logic to a lower layer
3. Or restructure to use callbacks/dependency injection

## References

- [dependency-cruiser documentation](https://github.com/sverweij/dependency-cruiser)
- Requirements 11.5, 11.6, 11.7 in requirements.md
- structure.md steering file
