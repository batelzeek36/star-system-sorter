# Gradle Version Correction

**Date**: October 14, 2025  
**Issue**: Gradle version was incorrectly set to 9.0.0 instead of 8.13

## What Happened

The React Native host's Gradle version was set to 9.0.0, which caused a build failure when trying to integrate the Flutter module:

```
Cannot run Project.afterEvaluate(Action) when the project is already evaluated.
```

## Root Cause

Gradle 9.0.0 is too new and has compatibility issues with Flutter's Gradle plugin. The project specification called for **Gradle 8.13**, which is:
- ✅ Stable and well-tested
- ✅ Compatible with Flutter module integration
- ✅ Recommended in `FLUTTER_GAME_REPLACEMENT_PLAN.md`

## Correction Made

**File**: `android/gradle/wrapper/gradle-wrapper.properties`

**Before** (incorrect):
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-9.0.0-bin.zip
```

**After** (correct):
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-bin.zip
```

## Why Gradle 8.13?

From `FLUTTER_GAME_REPLACEMENT_PLAN.md`:

> **Toolchain:** AGP 8.12 + Gradle 8.13 (let Flutter template decide)
> - Reason: Known-good combination, avoid Gradle 9 issues

Gradle 8.13 is:
1. **Stable**: Well-tested and production-ready
2. **Flutter-compatible**: Works with Flutter's Gradle plugin
3. **Modern**: Recent enough for all React Native features
4. **Specified**: Explicitly chosen in the project plan

## Documentation Updated

- ✅ `android/gradle/wrapper/gradle-wrapper.properties` - Corrected to 8.13
- ✅ `docs/ANDROID_TOOLCHAIN_MATRIX.md` - Updated to reflect 8.13
- ✅ `FLUTTER_RE_ENABLED.md` - Added note about Gradle version
- ✅ `FLUTTER_GRADLE_ISSUE.md` - Created (explains the issue)
- ✅ `GRADLE_VERSION_CORRECTION.md` - This document

## Next Steps

1. Clean Android build:
   ```bash
   ./android/gradlew clean
   ```

2. Rebuild with correct Gradle version:
   ```bash
   npm run android
   ```

3. The Flutter module should now integrate properly

## Lessons Learned

- Always check project specifications before making toolchain changes
- Gradle 9.x is too new for Flutter module integration
- Stick with specified versions (8.13) for stability

## Status

- ❌ Gradle 9.0.0 - Incompatible with Flutter
- ✅ Gradle 8.13 - Correct version, Flutter-compatible
- ✅ Documentation updated
- ⏳ Ready for clean rebuild

## References

- `FLUTTER_GAME_REPLACEMENT_PLAN.md` - Original specification
- `docs/ANDROID_TOOLCHAIN_MATRIX.md` - Toolchain versions
- `FLUTTER_GRADLE_ISSUE.md` - Detailed issue explanation
