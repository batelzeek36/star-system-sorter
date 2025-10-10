# Technology Stack

## Frontend (React Native)

- **Framework**: React Native 0.82+ with TypeScript 5.9+
- **Navigation**: React Navigation (native stack)
- **State Management**: zustand (minimal: 2-3 atoms max)
- **Forms**: react-hook-form + @hookform/resolvers + Zod
- **Validation**: Zod (single source of truth)
- **UI Components**: Existing shadcn/ui components (adapted for RN)
- **Styling**: React Native StyleSheet with design tokens from globals.css

## Game Module (Flutter/Flame)

- **Framework**: Flutter with Flame engine
- **Integration**: Native module via MethodChannel/EventChannel
- **Source**: Existing Super Dash game at `super_dash/`
- **Deterministic Core**: PCG32 RNG, fixed timestep (16.6667ms), Q16.16 math

## Backend (Node.js)

- **Runtime**: Node.js 20+
- **HTTP**: node:http (no Express)
- **Storage**: In-memory (no database for MVP)
- **Validation**: Zod schemas

## Development Tools

- **Testing**: Jest (unit/integration), Detox (E2E)
- **Linting**: ESLint with @react-native/eslint-config
- **Type Checking**: TypeScript strict mode
- **Mocking**: msw for API endpoints
- **Import Validation**: dependency-cruiser (no cycles, no deep imports)

## Key Dependencies

**Production:**

- react-native, react
- @react-navigation/native, @react-navigation/native-stack
- react-native-screens, react-native-safe-area-context, react-native-gesture-handler
- zod, react-hook-form, @hookform/resolvers
- zustand (minimal usage)
- react-native-svg
- pako (primary compression library)

**Development:**

- typescript
- jest, @testing-library/react-native
- prettier, eslint
- babel-plugin-module-resolver

## Common Commands

```bash
# Development
npm start                 # Start Metro bundler
npm run android          # Run on Android
npm run ios              # Run on iOS

# Quality
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
npm test                 # Run Jest tests
npm run test:coverage    # Coverage report

# iOS Setup
cd ios && bundle install && bundle exec pod install && cd ..

# Clean builds
npm start -- --reset-cache                    # Clear Metro cache
cd android && ./gradlew clean && cd ..        # Clean Android
cd ios && xcodebuild clean && cd ..           # Clean iOS
```

## Build Requirements

- **Node.js**: >= 20.x
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **CocoaPods**: For iOS dependencies (macOS only)
- **Flutter SDK**: For Super Dash game module

## Performance Targets

- Cold launch: ≤2.5s (Android), ≤1.8s (iOS)
- Game FPS: ≥55 target, never <45 for >1s
- Memory: ≤350MB peak on mid-tier devices
- Flutter module size: ≤25MB added to APK/IPA

## Path Aliases

```typescript
"@/*"          → "src/*"
"@components/*" → "components/*"
```

## Engineering Guardrails (Self-Steering)

**Do**

- React Native UI + Flutter native module only (MethodChannel/EventChannel).
- Determinism: PCG32 RNG, fixed timestep (16.6667ms), avoid wall-clock in logic.
- Keep deps within the documented budget; favor small, focused files.

**Don't**

- No web client, no iframe, no Vite/react-router-dom/Tailwind.
- No adding deps with telemetry/analytics or native perms without review.
- No `Date.now()`/randomness in scoring/physics paths.

## Dependency Budget (Allowed)

**App:** react-native, react, @react-navigation/native, @react-navigation/native-stack, react-native-screens, react-native-safe-area-context, react-native-gesture-handler, zod, react-hook-form, @hookform/resolvers, zustand, react-native-svg, pako.

**Tests/Tooling:** jest, @testing-library/react-native, msw@2 + @mswjs/interceptors (Jest only), dependency-cruiser, zod-to-json-schema, babel-plugin-module-resolver, eslint, prettier.

> RN ships its own types—no separate `@types/react-native` needed.
> pako is primary compression library (RN doesn't have CompressionStream; native optimization can come later).

## Platform Targets

- **Android:** minSdk 24 (Android 7.0), targetSdk 34
- **iOS:** deploymentTarget 14.0
- **Node:** ≥20

## Local Dev Config

- **API (dev):** Android emulator → `http://10.0.2.2:3000`; iOS simulator → `http://localhost:3000`; devices → `http://<LAN_IP>:3000`.
- Env keys (document in README): `DEV_API_BASE`, `PROD_API_BASE`.

## PR / CI Checklist

- `npm run typecheck` (TS strict) & ESLint clean
- Unit tests green; MSW v2 wired in Jest only
- `npm run lint:graph` passes (no cycles/deep imports; layering ok)
- File/func size limits respected or `@exception` noted
- App boots Android **and** iOS (Onboarding→Input→Result smoke)
- Update docs when schemas/bridge/contracts change

**package.json scripts:**

```json
{
  "scripts": {
    "lint:graph": "dependency-cruiser --config .dependency-cruiser.js src",
    "typecheck": "tsc --noEmit"
  }
}
```

## Escalation Triggers

- New dependency, native permission, or RNG/time usage in logic
- Schema/bridge contract changes or breaking API changes
- Any file >150 LOC without `@exception` rationale
