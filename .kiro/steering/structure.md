# Project Structure

## Repository Location

**IMPORTANT**: The main git repository is located at:
- **Local path**: `/Users/kingkamehameha/Documents/Kiro/GF_App/star-system-sorter/`
- **Remote**: `https://github.com/batelzeek36/star-system-sorter.git`
- **Current branch**: `feature/phase-4-native-modules`

Note: The parent directory `/Users/kingkamehameha/Documents/Kiro/GF_App/` has its own git repo but is NOT the main project repo. Always work in the `star-system-sorter/` subdirectory.

## Root Directory Layout

```
star-system-sorter/
├── android/              # Android native project
├── ios/                  # iOS native project
├── src/                  # React Native source code
├── components/           # shadcn/ui components (to be adapted)
├── super_dash/          # Flutter/Flame game module
├── apps/                # Backend services
│   └── server/          # Node.js API server
├── __tests__/           # Test files
├── scripts/             # Build and setup scripts
├── docs/                # Documentation
└── schemas/             # JSON schemas for bridge types
```

## Source Code Structure (`src/`)

```
src/
├── screens/             # Screen components (top layer)
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── bridge/              # Native game bridge (MethodChannel/EventChannel)
├── scorer/              # Scoring library (deterministic)
├── hd/                  # Human Design API integration
├── moderation/          # Content moderation system
├── state/               # Zustand state management
└── lib/                 # Utilities and helpers (bottom layer)
```

## Layered Architecture

The codebase follows strict layering enforced by dependency-cruiser:

```
Screens (top layer)
  ↓ can import from
Components
  ↓ can import from
Theme/Tokens
  ↓ can import from
Utils (lib, state)
```

**Rules:**

- Lower layers CANNOT import from higher layers
- Components cannot import from Screens
- Utils (lib/state) cannot import from Components or Screens
- Only import from module `index.ts` files (no deep imports)
- No circular dependencies allowed
- Acyclic: No circular dependencies across folders/packages
- Size: Target 100-200 LOC, soft limit 300 LOC, hard limit 500 LOC (see File Size Guidelines)
- Functions: ≤40 LOC, cyclomatic ≤10

## Source of Truth

- Zod schemas define all validation (forms + API)
- Public APIs per module via index.ts only

## Module Structure Pattern

Each module follows this structure:

```
src/scorer/
├── types.ts          # TypeScript interfaces and types
├── canon.ts          # Implementation file
├── score.ts          # Implementation file
├── tie.ts            # Implementation file
└── index.ts          # Public API exports (ONLY import from here)
```

**Import Rules:**

```typescript
// ❌ Bad: Deep import
import { computeScore } from '@/scorer/score';

// ✅ Good: Import from index.ts
import { computeScore } from '@/scorer';
```

## Key Directories

### `src/screens/`

Screen components for navigation. Each screen is a top-level view.

**Files:**

- `InputScreen.tsx` - Birth data input
- `ResultScreen.tsx` - Star system classification results
- `WhyScreen.tsx` - Explanation of results
- `GameHubScreen.tsx` - Game lobby and team selection
- `SuperDashScreen.tsx` - Flutter game integration
- `LeaderboardScreen.tsx` - Competition rankings
- `ProfileScreen.tsx` - User profile
- `SettingsScreen.tsx` - App settings

### `src/components/`

Reusable UI components used across screens.

**Files:**

- `RadialChart.tsx` - Radial chart visualization
- `ScoreDisplay.tsx` - Score display component
- `StarSystemCrest.tsx` - Star system visual representation
- `TimeZonePicker.tsx` - Time zone selection

### `src/navigation/`

React Navigation configuration and routing.

**Files:**

- `RootNavigator.tsx` - Main navigation stack
- `types.ts` - Navigation type definitions
- `linking.ts` - Deep linking configuration
- `guards.ts` - Navigation guards
- `ErrorBoundary.tsx` - Error boundary for navigation

### `src/bridge/`

Bridge between React Native and Flutter game module.

**Files:**

- `GameBridge.ts` - Main bridge implementation
- `types.ts` - Bridge type definitions
- `generate-schemas.ts` - JSON schema generator
- `GAMEBRIDGE_USAGE.md` - Usage documentation

**Schemas:** JSON schemas in `schemas/` directory for type validation.

### `src/scorer/`

Deterministic scoring system based on Human Design.

**Files:**

- `canon.ts` - Canonical scoring rules
- `score.ts` - Score computation
- `tie.ts` - Tie-breaking logic
- `types.ts` - Scorer type definitions
- `canon.mock.yaml` - Mock data for testing

### `src/hd/`

Human Design API integration (BodyGraph Chart API).

**Files:**

- `api-client.ts` - API client with caching
- `cache.ts` - 30-day cache implementation
- `types.ts` - HD type definitions

### `src/state/`

Zustand state management (minimal, 2-3 atoms).

**Files:**

- `store.ts` - Main state store
- `__tests__/store.test.ts` - Store tests

### `src/lib/`

Utilities and helper functions (bottom layer).

**Files:**

- `validation.ts` - Validation utilities

## Flutter Module (`super_dash/`)

```
super_dash/
├── lib/                 # Dart source code
│   ├── game/           # Flame game implementation
│   ├── bridge/         # MethodChannel/EventChannel bridge
│   ├── audio/          # Audio system
│   └── main.dart       # Entry point
├── assets/             # Game assets (images, audio, maps)
├── test/               # Flutter tests
└── pubspec.yaml        # Flutter dependencies
```

**Module Configuration:**

- Project type: `module` (not standalone app)
- Android package: `com.starsystemsorter.super_dash`
- iOS bundle ID: `com.starsystemsorter.superDash`

## Backend Server (`apps/server/`)

```
apps/server/
├── src/
│   ├── index.ts        # Server entry point
│   ├── http.ts         # HTTP server setup
│   └── routes/         # API routes
├── __tests__/          # Server tests
└── package.json        # Server dependencies
```

## Test Files (`__tests__/`)

Test files mirror the source structure:

- `*.test.ts` - Unit tests
- `*.test.tsx` - Component tests
- Test files are exempt from dependency rules

## Scripts (`scripts/`)

Build and setup automation:

- `setup-flutter-module.sh` - Initial Flutter setup
- `build-flutter-module.sh` - Build Flutter module
- `rebuild-native.sh` - Rebuild native projects
- `reload-app.sh` - Reload app with cache clearing
- `verify-*.sh` - Verification scripts

## Documentation (`docs/`)

Technical documentation:

- `FLUTTER_MODULE_INTEGRATION.md` - Flutter integration guide
- `DEPENDENCY_RULES.md` - Dependency graph rules
- `BODYGRAPH_API.md` - BodyGraph API documentation
- `NAVIGATION.md` - Navigation patterns
- `DEBUGGING_GUIDE.md` - Debugging tips

## Configuration Files

### Root Level

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration
- `jest.config.js` - Jest test configuration
- `.eslintrc.js` - ESLint configuration
- `.dependency-cruiser.js` - Dependency rules
- `.env` - Environment variables

### Platform Specific

- `android/build.gradle` - Android build configuration
- `ios/Podfile` - iOS dependencies
- `super_dash/pubspec.yaml` - Flutter dependencies

## Path Aliases & Metro Configuration

Use TS paths and Metro to reach local folders.

**tsconfig.json (excerpt):**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["components/*"]
    },
    "strict": true
  }
}
```

**babel.config.js (excerpt):**

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@components': './components',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};
```

**metro.config.js (excerpt):**

```javascript
const path = require('path');

module.exports = {
  watchFolders: [path.resolve(__dirname)],
  resolver: {
    extraNodeModules: {
      '@components': path.resolve(__dirname, 'components'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

> Use `babel-plugin-module-resolver` for runtime path resolution. Keep tsconfig paths in sync.

## File Size Guidelines

- **Target**: 100-200 lines of code (sweet spot for readability)
- **Soft Limit**: 300 lines of code (review and consider refactoring)
- **Hard Limit**: 500 lines of code (must split into multiple modular files)
- **Rationale**: Files over 300 LOC are a signal to refactor into smaller, focused modules

**When approaching the soft limit (300 LOC):**
- Extract reusable components into separate files
- Split complex logic into helper functions/modules
- Move type definitions to dedicated `types.ts` files
- Consider if the file is doing too much (violating single responsibility)

**When hitting the hard limit (500 LOC):**
- File must be split into multiple modular files
- Create a module directory with `index.ts` for public API
- Break down by feature, responsibility, or logical grouping
- Example: `InputScreen.tsx` → `InputScreen/index.tsx`, `InputScreen/FormFields.tsx`, `InputScreen/validation.ts`

## Naming Conventions

- **Files**: PascalCase for components (`RadialChart.tsx`), camelCase for utilities (`validation.ts`)
- **Directories**: kebab-case or lowercase
- **Components**: PascalCase
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

## Import Order

1. External dependencies (React, React Native, etc.)
2. Internal absolute imports (`@/...`)
3. Relative imports (`./...`)
4. Type imports (if separate)

## Module Exports

Each module must have an `index.ts` that exports its public API:

```typescript
// src/scorer/index.ts
export { computeScore } from './score';
export { loadCanon } from './canon';
export type { ScorerResult, HDExtract } from './types';

// Internal functions are NOT exported
```
