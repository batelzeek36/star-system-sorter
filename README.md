# Star System Sorter (S³)

A hybrid mobile application combining React Native for UI with an embedded Flutter/Flame game (Super Dash). The app features a deterministic star system classification system based on Human Design principles, team-based gaming with async competition, comprehensive moderation, and server-side validation.

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
│   ├── bridge/          # Native game bridge
│   ├── hd/              # Human Design integration
│   └── lib/             # Utilities and helpers
├── components/          # Existing shadcn/ui components (to be adapted)
├── hdkit/              # Human Design calculation library
├── super_dash/         # Flutter/Flame game module
├── __tests__/          # Test files
└── package.json        # Dependencies and scripts
```

## Prerequisites

- **Node.js**: >= 20.x
- **npm** or **yarn**
- **React Native CLI**: Installed globally or via npx
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **CocoaPods**: For iOS dependencies (macOS only)
- **Flutter SDK**: For Super Dash game module integration

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. iOS Setup (macOS only)

Install CocoaPods dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 3. Start Metro Bundler

The Metro bundler compiles JavaScript code for React Native:

```bash
npm start
# or
yarn start
```

### 4. Run on Android

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

### 5. Run on iOS (macOS only)

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
- Path aliases for cleaner imports (`@/*`, `@hdkit/*`, `@components/*`)
- Strict type checking enabled
- Support for React Native and React JSX

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run typecheck` - Run TypeScript type checking

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

## Flutter Module Integration

The Super Dash game will be integrated as a Flutter module. Setup instructions:

1. Convert Super Dash to Flutter module structure
2. Configure Android to include Flutter module in `build.gradle`
3. Configure iOS to include Flutter module in `Podfile`
4. Set up FlutterEngine caching for performance
5. Implement MethodChannel/EventChannel bridge for communication

See the design document for detailed integration steps.

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

- **Frontend**: React Native 0.82+ with TypeScript
- **Navigation**: React Navigation (to be added)
- **State Management**: zustand (minimal, 2-3 atoms)
- **Forms**: react-hook-form + Zod validation
- **Game Module**: Flutter/Flame (Super Dash)
- **Backend**: Node.js server (separate repository)

### Design Principles

- **Modularity**: Small, focused files (60-120 LOC preferred, ≤150 LOC max)
- **Determinism**: PCG32 RNG, fixed timestep for reproducible gameplay
- **Safety-first**: Comprehensive moderation across all user content
- **Native-first**: React Native UI with Flutter native modules

## Next Steps

1. Install core dependencies (zod, react-hook-form, zustand, etc.)
2. Set up React Navigation
3. Adapt existing shadcn/ui components for React Native
4. Integrate hdkit for Human Design calculations
5. Implement scorer library
6. Set up Flutter module integration
7. Implement native bridge (MethodChannel/EventChannel)

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Flutter Documentation](https://flutter.dev/docs)
- [Metro Bundler](https://facebook.github.io/metro/)

## License

See LICENSE file for details.

## Contributing

See CONTRIBUTING.md for guidelines.
