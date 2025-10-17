# Star System Sorter (S³)

A React Native mobile application featuring a deterministic star system classification system based on Human Design principles. The app provides birth data input, HD chart generation via BodyGraph API, and comprehensive content moderation with server-side validation.

## Project Structure

```
.
├── android/              # Android native project
├── ios/                  # iOS native project
├── src/                  # React Native source code
│   ├── screens/         # Screen components
│   ├── components/      # Reusable UI components
│   ├── scorer/          # Scoring library
│   ├── moderation/      # Moderation system
│   ├── hd/              # Human Design integration
│   ├── navigation/      # Navigation configuration
│   ├── state/           # Zustand state management
│   └── lib/             # Utilities and helpers
├── apps/                # Backend services
│   └── server/          # Node.js API server
├── components/          # shadcn/ui components (to be adapted)
├── __tests__/           # Test files
└── package.json         # Dependencies and scripts
```

## Prerequisites

- **Node.js**: >= 20.x
- **npm** or **yarn**
- **React Native CLI**: Installed globally or via npx
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **CocoaPods**: For iOS dependencies (macOS only)

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

This will also automatically install iOS CocoaPods dependencies via the postinstall script.

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
BODYGRAPH_API_KEY=your-api-key-here
PORT=3000
```

### 3. Start Metro Bundler

The Metro bundler compiles JavaScript code for React Native:

```bash
npm start
# or
yarn start
```

### 4. Start Backend Server (Optional)

In a new terminal window:

```bash
npm run dev --prefix ./apps/server
```

The server will run on `http://localhost:3000` (or the PORT specified in `.env`).

### 5. Run on Android

In a new terminal window:

```bash
npm run android
# or
yarn android
```

**Requirements:**
- Android Studio installed
- Android SDK configured
- Android emulator running or physical device connected via USB with USB debugging enabled

### 6. Run on iOS (macOS only)

In a new terminal window:

```bash
npm run ios
# or
yarn ios
```

**Requirements:**
- Xcode installed
- iOS Simulator or physical device configured

## Development Workflow

### Metro Bundler Configuration

The Metro bundler is configured in `metro.config.js`. Key features:
- TypeScript support out of the box
- Fast Refresh for instant updates during development
- Source maps for debugging

### TypeScript Configuration

TypeScript is configured in `tsconfig.json` with:
- Path aliases for cleaner imports (`@/*`, `@components/*`)
- Strict type checking enabled
- Support for React Native and React JSX

### Available Scripts

**Development:**
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device

**Testing:**
- `npm test` - Run Jest unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e:ios` - Run Detox E2E tests on iOS
- `npm run test:e2e:android` - Run Detox E2E tests on Android

**Code Quality:**
- `npm run lint` - Run ESLint
- `npm run lint:graph` - Validate import graph (no cycles, no deep imports, layering)
- `npm run typecheck` - Run TypeScript type checking

**Reload & Restart:**
- `npm run reload:ios` - Stop Metro, clear cache, restart iOS app
- `npm run reload:android` - Stop Metro, clear cache, restart Android app
- `npm run reload:both` - Reload both platforms
- `npm run reload:ios:clean` - Clean rebuild and reload iOS
- `npm run reload:android:clean` - Clean rebuild and reload Android
- `npm run reload:both:clean` - Clean rebuild and reload both platforms

**Build & Rebuild:**
- `npm run rebuild:ios` - Rebuild iOS native project
- `npm run rebuild:android` - Rebuild Android native project
- `npm run rebuild:all` - Rebuild both platforms
- `npm run build:detox:ios` - Build app for Detox E2E tests (iOS)
- `npm run build:detox:android` - Build app for Detox E2E tests (Android)

## Project Configuration

### app.json

Defines the app name and display name:
- **name**: `StarSystemSorter` (internal identifier)
- **displayName**: `Star System Sorter` (shown to users)

### Metro Bundler

Metro is the JavaScript bundler for React Native. Configuration in `metro.config.js` includes:
- Default React Native configuration
- Support for TypeScript
- Fast Refresh for hot reloading

### Babel Configuration

Babel transpiles modern JavaScript/TypeScript. Configuration in `babel.config.js` uses:
- `@react-native/babel-preset` for React Native compatibility

## Android Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/          # Java/Kotlin source code
│   │       ├── res/           # Resources (layouts, drawables, etc.)
│   │       └── AndroidManifest.xml
│   └── build.gradle           # App-level Gradle config
├── gradle/                    # Gradle wrapper
├── build.gradle              # Project-level Gradle config
└── settings.gradle           # Gradle settings
```

### Key Android Files

- **AndroidManifest.xml**: App permissions, activities, and metadata
- **build.gradle**: Dependencies and build configuration
- **MainActivity.java**: Entry point for React Native

## iOS Project Structure

```
ios/
├── StarSystemSorter/
│   ├── AppDelegate.h         # App delegate header
│   ├── AppDelegate.mm        # App delegate implementation
│   ├── Info.plist           # App configuration
│   └── main.m               # Entry point
├── StarSystemSorter.xcodeproj/  # Xcode project
└── Podfile                  # CocoaPods dependencies
```

### Key iOS Files

- **AppDelegate.mm**: Initializes React Native bridge
- **Info.plist**: App permissions, bundle ID, and metadata
- **Podfile**: CocoaPods dependencies for native modules

## Core Features

- **Star System Classification**: Deterministic scoring based on Human Design birth data
- **Birth Data Input**: Comprehensive form with date, time, location, and timezone
- **HD Chart Generation**: Integration with BodyGraph Chart API
- **Content Moderation**: Comprehensive moderation across all user inputs
- **Server-Side Validation**: Node.js backend with API proxy and 30-day caching

## Testing

### Unit Tests

Run Jest tests:

```bash
npm test
# or
yarn test
```

### E2E Tests

Detox will be configured for end-to-end testing of native flows.

## Troubleshooting

### Metro Bundler Issues

If Metro fails to start:
```bash
# Clear Metro cache
npm start -- --reset-cache
```

### Android Build Issues

```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

### iOS Build Issues

```bash
# Clean iOS build
cd ios
xcodebuild clean
rm -rf ~/Library/Developer/Xcode/DerivedData
pod deintegrate
pod install
cd ..
```

### Common Issues

1. **"Unable to resolve module"**: Clear Metro cache and restart
2. **Android build fails**: Check Android SDK and Gradle versions
3. **iOS build fails**: Check Xcode version and CocoaPods installation
4. **TypeScript errors**: Run `npm run typecheck` to see all errors

## Architecture

### Technology Stack

- **Frontend**: React Native 0.82+ with TypeScript 5.9+
- **React**: 19.1.1
- **Navigation**: React Navigation (native stack)
- **State Management**: zustand (minimal, 2-3 atoms)
- **Forms**: react-hook-form + Zod validation (v4)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: Custom primitives in `src/ui/` (Button, Card, Input, Sheet)
- **SVG**: react-native-svg
- **Backend**: Node.js 20+ with Express (see `apps/server/`)

### Server (Node.js)

The server provides API endpoints for the mobile app, including a proxy to the BodyGraph Chart API.

**Location:** `apps/server/`

**Features:**
- BodyGraph Chart API proxy with 30-day caching
- In-memory storage (no database for MVP)
- Clean error mapping for upstream failures
- CORS support for development

**Quick Start:**
```bash
# Install server dependencies
npm install --prefix ./apps/server

# Start development server (auto-reload)
npm run dev --prefix ./apps/server

# Run tests
npm test --prefix ./apps/server
```

**Endpoints:**
- `POST /internal/hd` - BodyGraph Chart API proxy
- `GET /health` - Health check

**Environment Variables:**
```bash
# Required in .env file at project root
BODYGRAPH_API_KEY=your-api-key-here
PORT=3000
```

**API Access:**
- iOS simulator: `http://localhost:3000`
- Android emulator: `http://10.0.2.2:3000`
- Physical devices: `http://<YOUR_LAN_IP>:3000`

See `apps/server/README.md` for detailed documentation.

### Design Principles

- **Modularity**: Small, focused files (target 100-200 LOC, soft limit 300 LOC, hard limit 500 LOC)
- **Determinism**: PCG32 RNG for reproducible scoring
- **Safety-first**: Comprehensive moderation across all user content
- **Type Safety**: TypeScript strict mode enabled throughout

### Code Quality & Dependency Rules

We enforce strict dependency rules to maintain code quality and architectural boundaries:

- **No circular dependencies**: All imports must be acyclic
- **No deep imports**: Only import from module `index.ts` files
- **Layered architecture**: Screens → Components → Theme/Tokens → Utils

Run `npm run lint:graph` to validate these rules. See `docs/DEPENDENCY_RULES.md` for detailed documentation.

**Layering rules:**
```
Screens (top layer)
  ↓ can import from
Components
  ↓ can import from
Theme/Tokens
  ↓ can import from
Utils (lib, state)
```

**Module structure:**
```
src/scorer/
├── types.ts          # TypeScript interfaces
├── canon.ts          # Implementation
├── score.ts          # Implementation
└── index.ts          # Public API (import from here only)
```

## Styling with NativeWind

This project uses **NativeWind** to bring Tailwind CSS utilities to React Native. NativeWind allows you to style components using the familiar `className` prop with Tailwind utility classes.

### Installation & Setup

NativeWind is already configured in this project. If you're setting up a new project or need to reinstall:

```bash
# Install dependencies
npm install nativewind tailwindcss
npm install --save-dev @types/react-native

# Configuration files are already set up:
# - tailwind.config.js (custom design tokens)
# - global.css (Tailwind directives)
# - metro.config.js (NativeWind wrapper)
# - babel.config.js (nativewind/babel plugin)
# - nativewind-env.d.ts (TypeScript types)
```

**Key Configuration Files:**

1. **tailwind.config.js** - Custom design tokens (colors, spacing, typography)
   - All tokens from `src/theme/tokens.ts` are mapped to Tailwind utilities
   - Includes Figma design tokens from `Figma/design-tokens.json`

2. **global.css** - Tailwind directives (imported in App.tsx)
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **metro.config.js** - NativeWind wrapper for Metro bundler
   ```javascript
   const { withNativeWind } = require('nativewind/metro');
   module.exports = withNativeWind(config, { input: './global.css' });
   ```

4. **babel.config.js** - NativeWind Babel plugin
   ```javascript
   plugins: ['nativewind/babel']
   ```

### Quick Start

```typescript
import { View, Text } from 'react-native';

// Use className with Tailwind utilities
<View className="flex-1 bg-canvas-dark px-5 pt-16">
  <Text className="text-3xl font-bold text-text-primary mb-4">
    Welcome to S³
  </Text>
  <Text className="text-base text-text-secondary leading-relaxed">
    Discover your star system alignment
  </Text>
</View>
```

### UI Primitives

Custom primitive components are available in `src/ui/`:

```typescript
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Input } from '@/ui/Input';
import { Sheet } from '@/ui/Sheet';

// Button with variants and sizes
<Button variant="primary" size="lg" onPress={handlePress}>
  Get Started
</Button>

// Card with gradient backgrounds
<Card variant="emphasis">
  <Text className="text-lg text-text-primary">Card Content</Text>
</Card>

// Input with label and error states
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>

// Sheet for modal presentations
<Sheet isOpen={isOpen} onClose={handleClose}>
  <Text className="text-xl font-bold">Modal Content</Text>
</Sheet>
```

See `src/ui/README.md` for detailed documentation on all primitive components.

### Common Patterns

**Layout:**
```typescript
// Full height container
<View className="flex-1 bg-canvas-dark">

// Centered content
<View className="items-center justify-center">

// Horizontal row with gap
<View className="flex-row gap-4">

// Absolute positioning
<View className="absolute inset-0">
```

**Spacing:**
```typescript
// Padding (all sides)
<View className="p-4">  // 16px

// Padding (directional)
<View className="px-5 pt-16 pb-6">  // horizontal, top, bottom

// Margin
<View className="mx-5 mb-12">  // horizontal, bottom

// Gap between children
<View className="flex-row gap-4">  // 16px gap
```

**Colors:**
```typescript
// Background colors
<View className="bg-canvas-dark">
<View className="bg-lavender-500">
<View className="bg-surface-subtle">

// Text colors
<Text className="text-text-primary">  // White
<Text className="text-text-secondary">  // Light gray
<Text className="text-lavender-400">  // Lavender accent

// Border colors
<View className="border border-borders-subtle">
<View className="border-2 border-lavender-500">
```

**Typography:**
```typescript
// Font size and weight
<Text className="text-3xl font-bold">  // 30px, bold
<Text className="text-base font-medium">  // 16px, medium

// Line height
<Text className="leading-tight">  // 1.25
<Text className="leading-relaxed">  // 1.75

// Text alignment
<Text className="text-center">
```

**Borders & Radius:**
```typescript
// Border radius
<View className="rounded-md">  // 12px
<View className="rounded-xl">  // 24px
<View className="rounded-full">  // 9999px (circle)

// Border width
<View className="border">  // 1px
<View className="border-2">  // 2px
```

**Touch Targets (WCAG 2.1 AA):**
```typescript
// Minimum 44px height for interactive elements
<Pressable className="min-h-[44px] px-6 py-3">
  <Text>Button</Text>
</Pressable>

// Using spacing-11 (44px)
<View className="h-11 w-11">  // Icon button
```

**Conditional Styling:**
```typescript
const [isActive, setIsActive] = useState(false);

<View className={`
  p-4 rounded-md
  ${isActive ? 'bg-lavender-500' : 'bg-surface-subtle'}
`}>
```

**Platform-Specific Styling:**
```typescript
import { Platform } from 'react-native';

// Shadows (iOS) and Elevation (Android)
<View 
  className="bg-surface-subtle rounded-md p-4"
  style={Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
  })}
>
```

### Design Token Reference

All design tokens from `src/theme/tokens.ts` and `Figma/design-tokens.json` are available as Tailwind utilities:

**Colors:**
- Canvas: `bg-canvas-dark`, `bg-canvas-darker`
- Surface: `bg-surface-subtle`, `bg-surface-muted`
- Lavender: `bg-lavender-100` through `bg-lavender-900`
- Gold: `bg-gold-100` through `bg-gold-700`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-subtle`
- Semantic: `bg-semantic-success`, `bg-semantic-error`, `bg-semantic-warning`, `bg-semantic-info`
- Borders: `border-borders-subtle`, `border-borders-muted`, `border-borders-emphasis`

**Spacing (4px grid):**
- `p-1` through `p-16` (4px to 64px)
- `p-11` = 44px (touch target minimum)

**Typography:**
- Font sizes: `text-xs` (12px) through `text-4xl` (36px)
- Font weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- Line heights: `leading-tight`, `leading-normal`, `leading-relaxed`

**Border Radius:**
- `rounded-sm` (8px), `rounded-md` (12px), `rounded-lg` (16px), `rounded-xl` (24px), `rounded-full` (9999px)

For a complete mapping of Figma tokens to Tailwind classes, see the [Migration Guide](.kiro/specs/nativewind-migration/CHANGELOG.md#figma-token--tailwind-class-reference).

### Troubleshooting

**Styles not applying:**
```bash
# Clear Metro cache and restart
npm start -- --reset-cache
```

**TypeScript errors with className:**
- Ensure `nativewind-env.d.ts` exists in project root
- Restart TypeScript server in your IDE

**Custom colors not working:**
- Verify colors are defined in `tailwind.config.js`
- Restart Metro bundler after config changes

**Hot reload not working:**
- Save the file and shake device to reload
- Or use Cmd+R (iOS) / Ctrl+R (Android)

For more troubleshooting tips and advanced patterns, see the [Migration Guide](.kiro/specs/nativewind-migration/CHANGELOG.md).

### Resources

- **Migration Guide & Patterns**: [.kiro/specs/nativewind-migration/CHANGELOG.md](.kiro/specs/nativewind-migration/CHANGELOG.md)
- **UI Primitives Documentation**: [src/ui/README.md](src/ui/README.md)
- **Design Tokens**: `src/theme/tokens.ts`
- **Figma Tokens**: `Figma/design-tokens.json`
- **NativeWind Documentation**: https://www.nativewind.dev/
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs

## Development Status

This is an MVP-focused implementation prioritizing:
- ✅ Core React Native setup with TypeScript
- ✅ Navigation structure
- ✅ Dependency management and build tooling
- ✅ NativeWind styling system with custom primitives
- ✅ Human Design API integration
- ✅ Scorer library implementation
- ✅ UI components and screens
- ✅ Content moderation system
- ✅ Testing infrastructure

## Troubleshooting

### Native Module Errors

If you see errors like:
```
Invariant Violation: TurboModuleRegistry.getEnforcing(...): 
'RNGestureHandlerModule' could not be found.
```

**Quick Fix:**
```bash
# For iOS
npm run rebuild:ios

# For Android
npm run rebuild:android

# Then restart Metro and rebuild
npm start -- --reset-cache
npm run ios  # or npm run android
```

See `FIX_NATIVE_MODULE_ERROR.md` for detailed instructions.

### Common Issues

- **Metro bundler won't start (EADDRINUSE)**: Port 8081 is already in use
  ```bash
  lsof -ti:8081 | xargs kill -9
  npm start
  ```

- **Build fails after installing dependencies**: Rebuild native projects
  ```bash
  npm run rebuild:all
  ```

- **iOS build fails**: Clean and reinstall pods
  ```bash
  cd ios
  rm -rf Pods Podfile.lock
  bundle exec pod install
  cd ..
  npm run ios
  ```

- **Android build fails**: Clean gradle cache
  ```bash
  cd android
  ./gradlew clean
  cd ..
  npm run android
  ```

For more troubleshooting, see:
- `docs/TROUBLESHOOTING_NATIVE_MODULES.md`
- `docs/DEV_DEPENDENCIES.md`

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Zod Validation](https://zod.dev/)
- [Metro Bundler](https://facebook.github.io/metro/)

## License

See LICENSE file for details.

## Contributing

See CONTRIBUTING.md for guidelines.
