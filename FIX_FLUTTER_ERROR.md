# Fix: "Flutter integration not enabled" Error

## Problem

When trying to play the game, you see:
```
Error: Game module not available. Flutter integration not enabled.
```

## Root Cause

The **native GameBridge module** isn't compiled into your app. This happens because:

1. Native modules (Kotlin/Swift code) are compiled into the app binary
2. Metro bundler only handles JavaScript - it can't add native modules
3. The app needs a **full native rebuild** to include the GameBridge module

## Solution

### Quick Fix (Recommended)

Run the rebuild script:

```bash
# For Android
./scripts/rebuild-with-flutter.sh android

# For iOS
./scripts/rebuild-with-flutter.sh ios

# For both
./scripts/rebuild-with-flutter.sh both
```

Then:
```bash
# Start Metro
npm start

# Run the app
npm run android  # or npm run ios
```

### Manual Fix

If you prefer to do it manually:

#### Android

```bash
# 1. Clean everything
cd android
./gradlew clean
cd ..

# 2. Rebuild Flutter AAR
cd runner_game
flutter clean
flutter pub get
flutter build aar
cd ..

# 3. Clean Metro cache
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*

# 4. Start Metro
npm start

# 5. In another terminal, run the app
npm run android
```

#### iOS

```bash
# 1. Clean everything
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# 2. Ensure Flutter module is ready
cd runner_game
flutter clean
flutter pub get
cd ..

# 3. Reinstall pods
cd ios
bundle exec pod install
cd ..

# 4. Clean Metro cache
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*

# 5. Start Metro
npm start

# 6. In another terminal, run the app
npm run ios
```

## Why This Happens

### Native vs JavaScript

- **JavaScript changes**: Hot reload works, Metro handles it
- **Native changes**: Requires full rebuild, Metro can't help

### What GameBridge Is

GameBridge is a **native module** written in:
- **Android**: Kotlin (`GameBridgeModule.kt`)
- **iOS**: Swift (`GameBridgeModule.swift`)

These files must be **compiled** into the app binary.

### When You Need to Rebuild

You need a full rebuild when:
- ✅ Adding/modifying native modules
- ✅ Changing native dependencies (AAR, Pods)
- ✅ Updating native configuration
- ❌ Changing JavaScript code (Metro handles this)

## Verification

After rebuilding, the game should work. You'll see in Metro logs:

```
[SuperDashScreen] GameBridge is available
[SuperDashScreen] ✅ READY EVENT RECEIVED
```

If you still see the error:

1. **Check Metro logs** for build errors
2. **Run diagnostics**: `./scripts/diagnose-flutter-error.sh`
3. **Verify integration**: `./scripts/verify-integration.sh`

## Common Mistakes

### ❌ Just restarting Metro

```bash
npm start  # This won't help!
```

Metro only bundles JavaScript. Native modules need native rebuild.

### ❌ Just reloading the app

Pressing "R" or "Reload" in the app won't help. The native module isn't in the binary.

### ✅ Full rebuild

```bash
./scripts/rebuild-with-flutter.sh android
npm start
npm run android
```

This compiles the native module into the app.

## Technical Details

### What Happens During Rebuild

1. **Clean**: Removes old build artifacts
2. **Flutter AAR**: Builds Flutter module as Android Archive
3. **Native Compile**: Compiles Kotlin/Swift with GameBridge module
4. **Link**: Links Flutter AAR and native modules into app binary
5. **Install**: Installs new app binary on device

### Why Metro Can't Help

Metro is a **JavaScript bundler**:
- ✅ Bundles `.js`, `.ts`, `.tsx` files
- ✅ Handles hot reload for JavaScript
- ❌ Can't compile Kotlin/Swift
- ❌ Can't link native libraries
- ❌ Can't modify app binary

Native builds use:
- **Android**: Gradle (compiles Kotlin, links AAR)
- **iOS**: Xcode (compiles Swift, links Pods)

## Summary

**Problem**: Native module not in app binary  
**Solution**: Rebuild the app with native changes  
**Command**: `./scripts/rebuild-with-flutter.sh android`  
**Time**: ~2-5 minutes for first build, ~30s for incremental  

After rebuild, the game will work! 🎮
