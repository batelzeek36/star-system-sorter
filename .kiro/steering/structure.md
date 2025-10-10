# Project Structure

## Root Organization

```
.
├── src/                  # React Native source code
├── components/           # Existing shadcn/ui components (to be adapted)
├── hdkit/               # Human Design calculation library (submodule)
├── super_dash/          # Flutter/Flame game module (submodule)
├── android/             # Android native project
├── ios/                 # iOS native project
├── scripts/             # Build and setup scripts
├── docs/                # Documentation
├── __tests__/           # Test files
├── App.tsx              # Main app entry point
└── index.js             # React Native entry point
```

## Source Directory (`src/`)

```
src/
├── screens/             # Screen components (one per route)
├── components/          # Reusable UI components
├── scorer/              # Scoring library (HD → star system)
├── moderation/          # Moderation system
├── bridge/              # Native game bridge (RN ↔ Flutter)
├── hd/                  # Human Design integration
├── state/               # Global state (zustand atoms)
└── lib/                 # Utilities and helpers
```

## Module Organization

Each module should have:

- `types.ts` - TypeScript interfaces and types
- `index.ts` - Public API exports (only import from here)
- Implementation files (≤150 LOC each)

**Example (scorer module):**

```
src/scorer/
├── types.ts             # HDExtract, Canon, ScorerResult interfaces
├── canon.ts             # Load and validate canon YAML
├── score.ts             # Core scoring algorithm
├── tie.ts               # Tie-breaking logic
├── checksum.ts          # Canon checksum computation
└── index.ts             # Public API: { computeScore, loadCanon }
```

## Component Organization

```
components/
├── ui/                  # Existing shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ... (40+ components)
└── figma/               # Figma-exported components
    └── ImageWithFallback.tsx
```

**New components go in `src/components/`:**

```
src/components/
├── StarSystemCrest.tsx  # SVG crest renderer
├── RadialChart.tsx      # Radial progress chart
├── ScoreDisplay.tsx     # Score result display
└── index.ts             # Public exports
```

## Native Bridge Structure

```
src/bridge/
├── GameBridge.ts        # RN module wrapper
├── types.ts             # GameCommand, GameEvent types
├── protocol.ts          # Message validation
└── index.ts             # Public API

android/app/src/main/java/com/s3/
├── GameBridgeModule.java    # Native module
├── GameBridgePackage.java   # Package registration
└── MainActivity.java        # FlutterEngine caching

ios/StarSystemSorter/
├── GameBridgeModule.m       # Native module
└── AppDelegate.mm           # FlutterEngine caching
```

## Super Dash Integration

```
super_dash/
├── lib/
│   ├── bridge/              # NEW: Message channel integration
│   │   ├── method_channel_bridge.dart
│   │   └── schema.dart
│   ├── core/                # NEW: Deterministic components
│   │   ├── seeded_rng.dart
│   │   ├── fixed_timestep.dart
│   │   ├── fixed_point.dart
│   │   └── input_recorder.dart
│   ├── theming/             # NEW: Team visual themes
│   │   └── team_theme.dart
│   ├── adapter/             # NEW: Dependency injection
│   │   └── game_adapter.dart
│   └── game/                # EXISTING: Game logic (minimal changes)
└── main.dart                # MODIFY: Add bridge initialization
```

## File Size Guidelines

- **Target**: 60-120 LOC per file
- **Maximum**: 150 LOC (hard limit)
- **Exception**: Requires comment `// @exception(max-lines) why:<reason>`
- **Allowlist**: App root, router config only

## Testing Structure

```
__tests__/
├── scorer.test.ts           # Scorer unit tests + golden fixtures
├── moderation.test.ts       # Moderation tests
├── bridge.contract.test.ts  # Bridge message contract tests
└── integration/             # Integration tests
    ├── game-flow.test.ts
    └── api.test.ts
```

## Documentation

```
docs/
├── DEPENDENCIES.md          # Dependency rationale
├── USAGE_EXAMPLES.md        # Code examples
└── TASK_*.md               # Task summaries
```

## Configuration Files

- `tsconfig.json` - TypeScript config with path aliases
- `babel.config.js` - Babel preset for React Native
- `metro.config.js` - Metro bundler config
- `jest.config.js` - Jest test config
- `.eslintrc.js` - ESLint rules
- `.prettierrc.js` - Prettier formatting

## Key Principles

1. **Small files**: Break large files into focused modules
2. **Clear boundaries**: Each module has single responsibility
3. **Public APIs**: Import only from index.ts
4. **No cycles**: Enforce acyclic dependency graph
5. **Composition**: Favor composition over inheritance

## Layering & Import Rules

**Allowed dependency flow:** `Screens → Components → Theme/Tokens → Utils` (no reverse deps)

**Imports:** Only from each module's `index.ts`. No deep imports.

**Acyclic:** No circular dependencies across folders/packages.

**Size:** Files ≤150 LOC (prefer 60–120). If exceeded, add `// @exception(max-lines) why:<reason>`.

**Functions:** ≤40 LOC, cyclomatic ≤10.

## Path Aliases & Metro

Use TS paths and Metro to reach local folders (e.g., `hdkit/` in repo root).

**tsconfig.json (excerpt):**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@hdkit/*": ["hdkit/*"],
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
          '@hdkit': './hdkit',
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
      '@hdkit': path.resolve(__dirname, 'hdkit'),
      '@components': path.resolve(__dirname, 'components'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

> Use `babel-plugin-module-resolver` for runtime path resolution. Keep tsconfig paths in sync.

## Source of Truth

- Zod schemas define all validation (forms + API).
- Public APIs per module via index.ts only.
