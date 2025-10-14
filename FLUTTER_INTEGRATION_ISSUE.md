# Flutter Integration Issue - October 13, 2025

## Problem Summary

Android build is failing because Flutter embedding classes cannot be found, even though Flutter integration is properly configured.

## Root Cause

**Flutter Version Mismatch:**
- Current Flutter: 3.35.6 (October 8, 2025 - very new!)
- Module was originally set up for Flutter 3.16.0
- Flutter 3.35.x has breaking changes in how Gradle plugins are applied

**Evidence:**
```
/opt/homebrew/share/flutter/packages/flutter_tools/gradle/flutter.gradle:
"You are applying Flutter's main Gradle plugin imperatively using the apply script method, 
which is not possible anymore. Migrate to applying Gradle plugins with the declarative plugins block"
```

## Current Status

✅ **Working:**
- iOS builds and runs successfully
- React Native app structure is solid
- Bridge code is implemented
- Flutter module structure is correct
- Dependencies cleaned up (removed unused packages)

❌ **Not Working:**
- Android build fails with "Unresolved reference 'embedding'"
- Flutter classes not in classpath
- Module integration not working with Flutter 3.35.6

## Options

### Option 1: Downgrade Flutter (Recommended for Quick Fix)
```bash
# Switch to Flutter 3.16.0 (the version specified in pubspec.yaml)
flutter downgrade 3.16.0

# Rebuild
cd super_dash && flutter pub get && cd ..
cd android && ./gradlew clean assembleDebug
```

**Pros:** Should work immediately
**Cons:** Using older Flutter version

### Option 2: Update Flutter Module for 3.35.x (Proper Fix)
Need to migrate to declarative plugin application:
- Update `super_dash/.android/include_flutter.groovy`
- Update Flutter module Gradle configuration
- Follow migration guide: https://flutter.dev/to/flutter-gradle-plugin-apply

**Pros:** Uses latest Flutter
**Cons:** Requires research and testing

### Option 3: Temporarily Disable Flutter (Testing Only)
Comment out Flutter integration to test RN app:
- Follow `docs/!!!FLUTTER_TOGGLE_REFERENCE.md`
- Comment out 5 files (3 Android, 2 iOS)
- Build and test RN app without game

**Pros:** Can continue RN development
**Cons:** Can't test game integration

## Recommendation

**For immediate progress:** Option 3 (disable Flutter temporarily)
- Get Android building
- Test React Native app
- Work on other features (moderation, server API, etc.)
- Fix Flutter integration separately

**For proper fix:** Option 2 (update for Flutter 3.35.x)
- Research new plugin application method
- Update module configuration
- Test thoroughly

## Related Issues

1. **shared_preferences removed:** Was causing similar build issues, successfully removed
2. **Firebase removed:** Not needed in Flutter module, successfully removed
3. **Flutter SDK integration:** Core issue remaining

## Files Involved

### Android (3 files)
- `android/settings.gradle` - Includes Flutter module
- `android/app/build.gradle` - Depends on `:flutter`
- `android/app/src/main/java/com/s3app/MainApplication.kt` - Flutter engine initialization

### Flutter Module
- `super_dash/pubspec.yaml` - Module configuration
- `super_dash/.android/include_flutter.groovy` - Gradle integration
- `super_dash/.android/local.properties` - Flutter SDK path

## Next Steps

1. **Decide on approach** (downgrade, update, or disable)
2. **If disabling:** Follow toggle reference to comment out Flutter
3. **If updating:** Research Flutter 3.35.x module integration
4. **If downgrading:** Switch Flutter version and rebuild

## Timeline

- **Quick fix (disable):** 10 minutes
- **Downgrade:** 30 minutes
- **Proper update:** 2-4 hours (research + implementation + testing)

## Date

October 13, 2025

## Status

🔴 **Blocked:** Android build failing due to Flutter integration
✅ **iOS:** Working
🟡 **Solution:** Multiple options available
