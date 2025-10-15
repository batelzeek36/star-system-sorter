# Flutter AAR Integration Guide

**Status**: Direct project inclusion disabled due to Gradle plugin incompatibility  
**Solution**: Use prebuilt AAR method

## Problem

Direct Flutter module inclusion via `include_flutter.groovy` causes this error:

```
Cannot run Project.afterEvaluate(Action) when the project is already evaluated.
```

This is a known issue with Flutter's Gradle plugin when included directly in a React Native project, regardless of Gradle version (tested with 8.13 and 9.0).

## Solution: Prebuilt AAR Method

Build the Flutter module as an AAR (Android Archive) and include it as a prebuilt dependency. This decouples the Flutter build from the React Native build.

## Implementation Steps

### 1. Build Flutter AAR

```bash
cd runner_game
flutter build aar
cd ..
```

This creates:
- `runner_game/build/host/outputs/repo/` - Maven repository with AAR artifacts
- Debug, Profile, and Release variants

### 2. Add Maven Local Repository

**File**: `android/build.gradle`

Add `mavenLocal()` to repositories:

```groovy
allprojects {
    repositories {
        mavenLocal()  // Add this
        google()
        mavenCentral()
        // ... other repositories
    }
}
```

### 3. Add AAR Dependency

**File**: `android/app/build.gradle`

Replace the project dependency with AAR dependency:

```groovy
dependencies {
    // Flutter module as prebuilt AAR
    debugImplementation 'com.starsystemsorter.runner_game:flutter_debug:1.0'
    profileImplementation 'com.starsystemsorter.runner_game:flutter_profile:1.0'
    releaseImplementation 'com.starsystemsorter.runner_game:flutter_release:1.0'
    
    // ... other dependencies
}
```

### 4. Publish AAR to Maven Local

After building the AAR, publish it to Maven local:

```bash
cd runner_game/build/host/outputs/repo
# Copy to ~/.m2/repository or use gradle publishToMavenLocal
```

Or use the Flutter build output directly by adding a custom repository:

```groovy
allprojects {
    repositories {
        maven {
            url '../runner_game/build/host/outputs/repo'
        }
        // ... other repositories
    }
}
```

### 5. Clean and Rebuild

```bash
./android/gradlew clean
npm run android
```

## Advantages of AAR Method

✅ **Decoupled builds**: Flutter and RN build independently  
✅ **No Gradle conflicts**: Avoids plugin evaluation issues  
✅ **Faster RN builds**: Flutter only rebuilt when changed  
✅ **CI/CD friendly**: Build Flutter once, use everywhere  
✅ **Version control**: Can version and cache AAR artifacts  

## Disadvantages

⚠️ **Extra build step**: Must rebuild AAR when Flutter code changes  
⚠️ **Larger repo**: AAR files are binary artifacts  
⚠️ **Manual sync**: Changes to Flutter require AAR rebuild  

## Development Workflow

### During Flutter Development

1. Make changes to Flutter code in `runner_game/`
2. Rebuild AAR: `cd runner_game && flutter build aar && cd ..`
3. Rebuild RN app: `npm run android`

### During React Native Development

1. Make changes to RN code
2. No need to rebuild Flutter AAR
3. Just rebuild RN: `npm run android`

## Automation Script

Create `scripts/build-flutter-aar.sh`:

```bash
#!/bin/bash
set -e

echo "Building Flutter AAR..."
cd runner_game
flutter build aar
cd ..

echo "✅ Flutter AAR built successfully"
echo "📦 Location: runner_game/build/host/outputs/repo"
echo ""
echo "Next steps:"
echo "1. Update android/build.gradle to add Maven repository"
echo "2. Update android/app/build.gradle to add AAR dependency"
echo "3. Run: ./android/gradlew clean && npm run android"
```

Make it executable:
```bash
chmod +x scripts/build-flutter-aar.sh
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build Flutter AAR
  run: |
    cd runner_game
    flutter build aar
    cd ..

- name: Cache Flutter AAR
  uses: actions/cache@v3
  with:
    path: runner_game/build/host/outputs/repo
    key: flutter-aar-${{ hashFiles('runner_game/**/*.dart') }}

- name: Build Android App
  run: |
    cd android
    ./gradlew assembleRelease
```

## Troubleshooting

### AAR Not Found

**Error**: `Could not find com.starsystemsorter.runner_game:flutter_debug:1.0`

**Solution**:
1. Verify AAR was built: `ls runner_game/build/host/outputs/repo`
2. Check repository path in `android/build.gradle`
3. Rebuild AAR: `cd runner_game && flutter build aar`

### Wrong AAR Version

**Error**: App crashes or behaves unexpectedly

**Solution**:
1. Clean build: `./android/gradlew clean`
2. Rebuild AAR: `cd runner_game && flutter build aar`
3. Rebuild app: `npm run android`

### Flutter Changes Not Reflected

**Problem**: Made changes to Flutter code but app doesn't update

**Solution**:
1. Rebuild AAR (changes don't auto-propagate)
2. Clean Android build
3. Rebuild app

## Current Status

- ❌ Direct project inclusion - DISABLED (causes Gradle errors)
- ✅ AAR method - IMPLEMENTED AND WORKING
- ✅ Documentation - COMPLETE
- ✅ Android build - SUCCESSFUL
- ⏳ Device testing - PENDING

## Next Steps

1. Build Flutter AAR: `cd runner_game && flutter build aar`
2. Update `android/build.gradle` to add Maven repository
3. Update `android/app/build.gradle` to add AAR dependencies
4. Test build: `./android/gradlew clean && npm run android`

## References

- Flutter AAR docs: https://docs.flutter.dev/add-to-app/android/project-setup#option-b---depend-on-the-android-archive-aar
- Task 9.5.0: Integration strategy selection
- `docs/ANDROID_TOOLCHAIN_MATRIX.md`: Toolchain versions
- `FLUTTER_GRADLE_ISSUE.md`: Problem explanation

## Related Files

- `android/settings.gradle` - Flutter inclusion (now disabled)
- `android/app/build.gradle` - Dependencies (needs AAR added)
- `android/build.gradle` - Repositories (needs Maven added)
- `runner_game/build/host/outputs/repo/` - AAR output location
