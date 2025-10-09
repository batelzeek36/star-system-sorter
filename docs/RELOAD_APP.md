# App Reload Guide

npm run reload:both

npm run reload:both:clean

Quick reference for reloading the React Native app during development.

## Quick Reload (In Simulator)

If Metro is already running and you only changed JS/TS code:

**iOS Simulator:**

- Press `Cmd + R`

**Android Emulator:**

- Press `R` twice quickly (double-tap R)
- Or: `Cmd + M` → "Reload"

## Full Reload Scripts

Use these npm scripts to stop Metro, clear cache, and restart the app:

### Basic Reload

```bash
# iOS only
npm run reload:ios

# Android only
npm run reload:android

# Both platforms
npm run reload:both
```

### Clean Reload

Use when you have issues or made native changes (pods, gradle, etc.):

```bash
# iOS with clean build
npm run reload:ios:clean

# Android with clean build
npm run reload:android:clean

# Both with clean builds
npm run reload:both:clean
```

## What Each Script Does

### Basic Reload (`reload:ios`, `reload:android`, `reload:both`)

1. Stops Metro bundler if running
2. Clears Metro cache
3. Starts Metro in background
4. Builds and runs the app on selected platform(s)

### Clean Reload (`reload:*:clean`)

Does everything above, plus:

- **iOS**: Removes Pods, reinstalls CocoaPods dependencies
- **Android**: Runs `./gradlew clean`

## Manual Commands

If you prefer to run commands manually:

```bash
# Stop Metro
lsof -ti:8081 | xargs kill -9

# Start Metro with cache reset
npm start -- --reset-cache

# In another terminal, run the app
npm run ios
# or
npm run android
```

## Troubleshooting

### Metro won't start (port 8081 in use)

```bash
lsof -ti:8081 | xargs kill -9
npm start
```

### App shows old code after reload

```bash
# Use clean reload
npm run reload:both:clean
```

### iOS build fails

```bash
npm run reload:ios:clean
```

### Android build fails

```bash
npm run reload:android:clean
```

### Check Metro logs

The reload script saves Metro output to `metro.log`:

```bash
tail -f metro.log
```

## Dev Menu Shortcuts

**iOS Simulator:**

- `Cmd + D` - Open dev menu
- `Cmd + R` - Reload
- `Cmd + Ctrl + Z` - Shake gesture

**Android Emulator:**

- `Cmd + M` (Mac) / `Ctrl + M` (Windows/Linux) - Open dev menu
- `R + R` - Reload

## Fast Refresh

Enable Fast Refresh in the dev menu for automatic reloads on file save:

1. Open dev menu (`Cmd + D` on iOS, `Cmd + M` on Android)
2. Enable "Fast Refresh"
3. Save any file to see changes instantly

## When to Use Each Method

| Scenario                              | Method                               |
| ------------------------------------- | ------------------------------------ |
| Changed JS/TS code, Metro running     | `Cmd + R` (iOS) or `R + R` (Android) |
| Changed JS/TS code, Metro not running | `npm run reload:both`                |
| Installed new npm package             | `npm run reload:both`                |
| Changed native code (iOS/Android)     | `npm run reload:both:clean`          |
| Changed Podfile or build.gradle       | `npm run reload:both:clean`          |
| App won't start or shows errors       | `npm run reload:both:clean`          |

## Script Location

The reload script is located at `scripts/reload-app.sh` and can be run directly:

```bash
# Direct usage
./scripts/reload-app.sh ios
./scripts/reload-app.sh android
./scripts/reload-app.sh both
./scripts/reload-app.sh both --clean
```
