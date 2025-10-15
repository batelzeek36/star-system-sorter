# Flutter Gradle Integration Issue

**Error**: `Cannot run Project.afterEvaluate(Action) when the project is already evaluated.`

## Root Cause

The Flutter Gradle plugin (in `runner_game/.android/Flutter/build.gradle`) is incompatible with Gradle 9.0.0. The plugin tries to apply after the project has already been evaluated, which is not allowed in newer Gradle versions.

## Possible Solutions

### Option 1: Downgrade Gradle (Quick Fix)

Change Gradle version to 8.x which is known to work with Flutter:

**File**: `android/gradle/wrapper/gradle-wrapper.properties`

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.7-bin.zip
```

Then run:
```bash
cd android
./gradlew clean
cd ..
```

### Option 2: Use AAR Instead of Direct Project (Recommended for Production)

Build Flutter as an AAR and include it as a dependency instead of a project:

1. **Build Flutter AAR:**
   ```bash
   cd runner_game
   flutter build aar
   cd ..
   ```

2. **Update `android/app/build.gradle`:**
   ```groovy
   dependencies {
       // Replace this:
       // implementation project(':flutter')
       
       // With this:
       implementation 'com.starsystemsorter.runner_game:flutter_debug:1.0'
   }
   ```

3. **Update `android/build.gradle`** to add Maven local:
   ```groovy
   allprojects {
       repositories {
           mavenLocal()
           // ... other repositories
       }
   }
   ```

4. **Comment out Flutter module in `android/settings.gradle`:**
   ```groovy
   // Flutter module integration (using AAR instead)
   // setBinding(new Binding([gradle: this]))
   // evaluate(new File(
   //   settingsDir.parentFile,
   //   'runner_game/.android/include_flutter.groovy'
   // ))
   ```

### Option 3: Wait for Flutter Update

The Flutter team is working on Gradle 9.0 compatibility. Check:
- https://github.com/flutter/flutter/issues
- Flutter stable channel updates

### Option 4: Disable Flutter Temporarily

If you need to continue development without Flutter:

1. Re-disable Flutter integration (reverse the changes)
2. Rename native bridge files back to `.disabled`
3. Continue with React Native development

## Recommended Action

**For now, use Option 1 (Downgrade Gradle)** as it's the quickest fix and Gradle 8.7 is stable and well-tested with Flutter.

Once Flutter officially supports Gradle 9.0, we can upgrade back.

## Related Files

- `android/gradle/wrapper/gradle-wrapper.properties` - Gradle version
- `runner_game/.android/Flutter/build.gradle` - Flutter Gradle plugin
- `runner_game/.android/include_flutter.groovy` - Flutter integration script
- `android/settings.gradle` - Project settings
- `android/app/build.gradle` - App dependencies

## Status

- ❌ Gradle 9.0.0 + Flutter direct project inclusion = INCOMPATIBLE
- ✅ Gradle 8.7 + Flutter direct project inclusion = COMPATIBLE
- ✅ Gradle 9.0.0 + Flutter AAR = COMPATIBLE (but requires build step)

## Next Steps

Choose one of the options above and proceed with testing.
