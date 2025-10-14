# Android Build Issue - Flutter Plugin Compatibility

## Problem

Android build fails with Flutter plugin errors:

```
Could not get unknown property 'flutter' for extension 'android'
Android Gradle Plugin: project ':path_provider_android' does not specify `compileSdk`
```

## Root Cause

Flutter plugins in the module (`path_provider_android`, `firebase_*`, etc.) have build.gradle files that are incompatible with:
- The way Flutter modules are embedded in React Native
- The newer Gradle version (9.0.0)
- The Android Gradle Plugin version

## Affected Plugins

- `path_provider_android` (2.2.19)
- `firebase_*` plugins
- Other Flutter plugins with old build.gradle syntax

## Temporary Workaround

**Use iOS only for now:**
```bash
npm run ios
```

## Permanent Solutions

### Option 1: Update Flutter SDK (Recommended)
```bash
flutter upgrade
cd super_dash
flutter pub upgrade
```

### Option 2: Remove Unnecessary Dependencies

The Flutter module (`super_dash`) has many dependencies that aren't needed for embedded use:

**Remove from `super_dash/pubspec.yaml`:**
- `firebase_*` (if not using Firebase features)
- `path_provider` (if not saving files)
- `share_plus` (if not sharing content)
- `url_launcher` (if not opening URLs)

**Keep only:**
- `flame` and `flame_*` (game engine)
- `flutter_bloc` (state management)
- Core game dependencies

### Option 3: Patch Plugin Build Files

Manually update plugin build.gradle files in `.pub-cache` to add:

```groovy
android {
    compileSdkVersion 34
    // ... rest of config
}
```

**Note:** This is tedious and gets overwritten when plugins update.

### Option 4: Use Flutter 3.19+ with Better Module Support

Flutter 3.19+ has improved module support and plugin compatibility.

## Current Status

✅ **iOS**: Working perfectly
❌ **Android**: Blocked by Flutter plugin compatibility issues

## Next Steps

1. Decide if Firebase/plugins are needed in the game
2. If not needed, remove them from pubspec.yaml
3. If needed, upgrade Flutter SDK to latest stable
4. Rebuild Android after changes

## Related Files

- `super_dash/pubspec.yaml` - Flutter dependencies
- `android/settings.gradle` - Flutter module inclusion
- `android/app/build.gradle` - App configuration
- `super_dash/.android/` - Flutter Android module files

## Testing After Fix

```bash
# Clean everything
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

---

**Created:** October 13, 2025
**Status:** Known Issue - iOS Working, Android Pending
