# Technology Stack

## Frontend

- **Framework**: React Native 0.82+ with TypeScript 5.9+
- **React**: 19.1.1
- **Navigation**: React Navigation (native stack)
- **State Management**: zustand (minimal, 2-3 atoms)
- **Forms**: react-hook-form + Zod validation (v4)
- **UI Components**: shadcn/ui adapted for React Native
- **SVG**: react-native-svg

## Game Module

- **Framework**: Flutter 3.16.0+ (as embedded module)
- **Game Engine**: Flame
- **Module Type**: Flutter module (not standalone app)
- **Android Package**: `com.starsystemsorter.super_dash`
- **iOS Bundle ID**: `com.starsystemsorter.superDash`

## Backend

- **Runtime**: Node.js 20+
- **Server**: Express-based (in `apps/server/`)
- **API Proxy**: BodyGraph Chart API with 30-day caching
- **Storage**: In-memory (no database for MVP)

## Build Tools

- **Bundler**: Metro (React Native default)
- **Transpiler**: Babel with `@react-native/babel-preset`
- **TypeScript**: Strict mode enabled
- **Package Manager**: npm (Node 20+ required)

## Testing

- **Unit Tests**: Jest 29+
- **Component Tests**: @testing-library/react-native
- **E2E Tests**: Detox 20+
- **API Mocking**: MSW (Mock Service Worker)

## Code Quality

- **Linter**: ESLint with `@react-native/eslint-config`
- **Formatter**: Prettier 2.8.8
- **Dependency Graph**: dependency-cruiser (enforces no cycles, no deep imports, layering)
- **Type Checking**: TypeScript strict mode

## Native Platforms

### iOS
- **Xcode**: Required for iOS development
- **CocoaPods**: For native dependencies
- **Language**: Swift (AppDelegate)

### Android
- **Android Studio**: Required for Android development
- **Build System**: Gradle
- **Language**: Kotlin/Java

## Path Aliases

TypeScript path aliases configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `components/*`

## Common Commands

### Development
```bash
npm start                    # Start Metro bundler
npm run android              # Run on Android
npm run ios                  # Run on iOS
```

### Testing
```bash
npm test                     # Run Jest unit tests
npm run test:coverage        # Run tests with coverage
npm run test:e2e:ios         # Run Detox E2E tests (iOS)
npm run test:e2e:android     # Run Detox E2E tests (Android)
```

### Code Quality
```bash
npm run lint                 # Run ESLint
npm run lint:graph           # Validate dependency graph (no cycles, layering)
npm run typecheck            # Run TypeScript type checking
```

### Reload & Rebuild
```bash
npm run reload:ios           # Stop Metro, clear cache, restart iOS
npm run reload:android       # Stop Metro, clear cache, restart Android
npm run reload:both          # Reload both platforms
npm run reload:ios:clean     # Clean rebuild iOS
npm run reload:android:clean # Clean rebuild Android
npm run rebuild:ios          # Rebuild iOS native project
npm run rebuild:android      # Rebuild Android native project
npm run rebuild:all          # Rebuild both platforms
```

### Flutter Module
```bash
./scripts/setup-flutter-module.sh        # Initial Flutter module setup
./scripts/build-flutter-module.sh        # Build Flutter module
./scripts/test-flutter-integration.sh    # Test Flutter integration
```

### Server
```bash
npm run dev --prefix ./apps/server       # Start dev server (auto-reload)
npm test --prefix ./apps/server          # Run server tests
```

### Schema Generation
```bash
npm run generate:schemas     # Generate JSON schemas from TypeScript types
```

## Environment Variables

Required in `.env` file at project root:
```bash
BODYGRAPH_API_KEY=your-api-key-here
PORT=3000
```

## API Access

- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Devices**: `http://<YOUR_LAN_IP>:3000`

## Key Dependencies

### Production
- `@react-navigation/native` - Navigation
- `zustand` - State management
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-gesture-handler` - Gesture support
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screen optimization
- `react-native-svg` - SVG rendering
- `pako` - Compression

### Development
- `@testing-library/react-native` - Component testing
- `dependency-cruiser` - Dependency graph validation
- `detox` - E2E testing
- `msw` - API mocking
- `tsx` - TypeScript execution
- `zod-to-json-schema` - Schema generation

## Performance Targets

- Cold launch: ≤2.5s (Android), ≤1.8s (iOS)
- Game FPS: ≥55 target, never <45 for >1s
- Memory: ≤350MB peak on mid-tier devices
- Flutter module size: ≤25MB added to APK/IPA

## Engineering Guardrails

**Do:**
- React Native UI + Flutter native module only (MethodChannel/EventChannel)
- Determinism: PCG32 RNG, fixed timestep (16.6667ms), avoid wall-clock in logic
- Keep deps within the documented budget; favor small, focused files

**Don't:**
- No web client, no iframe, no Vite/react-router-dom/Tailwind
- No adding deps with telemetry/analytics or native perms without review
- No `Date.now()`/randomness in scoring/physics paths

## Dependency Budget (Allowed)

**App:** react-native, react, @react-navigation/native, @react-navigation/native-stack, react-native-screens, react-native-safe-area-context, react-native-gesture-handler, zod, react-hook-form, @hookform/resolvers, zustand, react-native-svg, pako

**Tests/Tooling:** jest, @testing-library/react-native, msw@2 + @mswjs/interceptors (Jest only), dependency-cruiser, zod-to-json-schema, babel-plugin-module-resolver, eslint, prettier

> RN ships its own types—no separate `@types/react-native` needed.
> pako is primary compression library (RN doesn't have CompressionStream; native optimization can come later).

## PR / CI Checklist

- `npm run typecheck` (TS strict) & ESLint clean
- Unit tests green; MSW v2 wired in Jest only
- `npm run lint:graph` passes (no cycles/deep imports; layering ok)
- File/func size limits respected or `@exception` noted
- App boots Android **and** iOS (Onboarding→Input→Result smoke)
- Update docs when schemas/bridge/contracts change

## Escalation Triggers

- New dependency, native permission, or RNG/time usage in logic
- Schema/bridge contract changes or breaking API changes
- Any file >150 LOC without `@exception` rationale

## Troubleshooting

### Metro Cache Issues
```bash
npm start -- --reset-cache
```

### Native Module Errors
```bash
npm run rebuild:ios          # or rebuild:android
npm start -- --reset-cache
```

### Port Already in Use (8081)
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

### iOS Build Issues
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
npm run ios
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```
