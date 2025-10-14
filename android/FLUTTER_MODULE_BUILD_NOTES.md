# Flutter Module Build Notes

## Issue: Flutter Classes Not Found

**Problem:**
```
Unresolved reference 'embedding'
Unresolved reference 'FlutterEngine'
Unresolved reference 'MethodChannel'
```

## Root Cause

The Flutter module (`super_dash`) is configured correctly as a module, but the Flutter SDK classes aren't being included in the Android build classpath.

## Current Status

1. ✅ Flutter module structure is correct (`module:` in pubspec.yaml)
2. ✅ `.android/` directory exists with `include_flutter.groovy`
3. ✅ Flutter SDK path is set in `.android/local.properties`
4. ✅ `settings.gradle` includes Flutter module
5. ✅ `app/build.gradle` has `implementation project(':flutter')`
6. ✅ `:flutter` project is recognized by Gradle
7. ❌ Flutter embedding classes not in classpath

## Investigation

The `:flutter` project only includes lifecycle dependencies:
```
androidx.annotation:annotation:1.7.0
androidx.lifecycle:lifecycle-common:2.6.2
```

But it's missing the actual Flutter engine/embedding classes.

## Possible Solutions

### Option 1: Build Flutter Module First (Doesn't Work)
```bash
cd super_dash
flutter build aar
```
**Result:** "AARs can only be built from modules" (confusing error)
**Also:** "Build failed due to use of deleted Android v1 embedding"

### Option 2: Let Host App Build It (Should Work)
The Flutter module should be built automatically when the host app builds.

**Theory:** The `module_plugin_loader.gradle` from Flutter SDK should inject the Flutter engine dependencies, but it's not happening.

### Option 3: Check Flutter SDK Integration
The `include_flutter.groovy` loads:
```groovy
gradle.apply from: "$flutterSdkPath/packages/flutter_tools/gradle/module_plugin_loader.gradle"
```

This should add the Flutter engine to the classpath, but it's not working.

## Next Steps

1. **Verify Flutter SDK path is correct:**
   ```bash
   cat super_dash/.android/local.properties
   # Should show: flutter.sdk=/opt/homebrew/share/flutter
   ```

2. **Check if Flutter SDK has the loader:**
   ```bash
   ls -la /opt/homebrew/share/flutter/packages/flutter_tools/gradle/
   ```

3. **Try building with verbose output:**
   ```bash
   cd android
   ./gradlew assembleDebug --info | grep -i flutter
   ```

4. **Check if Flutter engine is being downloaded:**
   The Flutter SDK should download the engine artifacts during build.

## Workaround: Disable Flutter Temporarily

If we need to test the React Native app without Flutter:

1. Comment out Flutter integration in 5 files (see `docs/!!!FLUTTER_TOGGLE_REFERENCE.md`)
2. Build and test RN app
3. Re-enable Flutter when ready

## Related Files

- `super_dash/pubspec.yaml` - Module configuration
- `super_dash/.android/include_flutter.groovy` - Gradle integration
- `super_dash/.android/local.properties` - Flutter SDK path
- `android/settings.gradle` - Includes Flutter module
- `android/app/build.gradle` - Depends on `:flutter` project

## Date

October 13, 2025
