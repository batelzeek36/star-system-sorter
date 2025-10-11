# Testing Flutter Module Integration

Quick guide for testing the Flutter module integration on Android and iOS.

## Quick Test

Run the automated test script:

```bash
./scripts/test-flutter-integration.sh
```

This will verify:
- Flutter SDK installation
- Module configuration
- Platform directories
- Android configuration
- iOS configuration
- Dependencies

## Manual Testing

### Android

#### 1. Quick Build Test
```bash
cd android
./gradlew assembleDebug
```

**Expected:** Build succeeds and creates APK at `android/app/build/outputs/apk/debug/app-debug.apk`

#### 2. Run on Device/Emulator
```bash
cd ..  # Back to project root
npx react-native run-android
```

**Expected:** App launches successfully on connected device/emulator

#### 3. Verify FlutterEngine Initialization

Open a new terminal and run:
```bash
adb logcat | grep -i "flutter\|s3_engine"
```

**Look for:**
```
FlutterEngine: Creating FlutterEngine
FlutterEngineCache: Cached engine with ID: s3_engine
DartExecutor: Executing Dart entrypoint
```

#### 4. Check Memory Usage
```bash
adb shell dumpsys meminfo com.s3app | grep -A 10 "App Summary"
```

**Expected:** FlutterEngine should add ~40-60MB to app memory

#### 5. Test Hot Reload (if applicable)
```bash
# In React Native terminal
r  # Reload
```

**Expected:** App reloads without crashing

### iOS

#### 1. Install Pods (if not done)
```bash
cd ios
pod install
```

**Expected:** 
```
Pod installation complete! There are 76 dependencies from the Podfile and 75 total pods installed.
```

#### 2. Run on Simulator
```bash
cd ..  # Back to project root
npx react-native run-ios
```

Or specify device:
```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

**Expected:** App launches successfully on simulator

#### 3. Run on Physical Device
```bash
npx react-native run-ios --device
```

**Expected:** App launches on connected iOS device

#### 4. Build from Xcode

```bash
cd ios
open S3App.xcworkspace
```

Then in Xcode:
1. Select target device/simulator
2. Press ⌘R to build and run

**Expected:** Build succeeds and app launches

#### 5. Verify FlutterEngine Initialization

In Xcode console (⌘⇧Y), look for:
```
Flutter: Initializing FlutterEngine
Flutter: Engine name: s3_engine
Flutter: Dart VM initialized
```

#### 6. Check Memory Usage

In Xcode:
1. Run app (⌘R)
2. Open Debug Navigator (⌘7)
3. Select Memory

**Expected:** FlutterEngine should add ~40-60MB to app memory

## Verification Checklist

### Pre-Build Checks

- [ ] Flutter SDK installed (`flutter --version`)
- [ ] Super Dash is a module (`grep "project_type: module" super_dash/.metadata`)
- [ ] `.android/` directory exists
- [ ] `.ios/` directory exists
- [ ] Dependencies resolved (`cd super_dash && flutter pub get`)

### Android Checks

- [ ] `settings.gradle` includes Flutter module
- [ ] `app/build.gradle` has Flutter dependency
- [ ] `MainApplication.kt` imports FlutterEngine
- [ ] `MainApplication.kt` caches engine with ID "s3_engine"
- [ ] Gradle sync succeeds
- [ ] Build succeeds
- [ ] App launches without crashes

### iOS Checks

- [ ] `Podfile` includes Flutter module
- [ ] `AppDelegate.swift` imports Flutter
- [ ] `AppDelegate.swift` caches engine with ID "s3_engine"
- [ ] `pod install` succeeds
- [ ] Build succeeds
- [ ] App launches without crashes

## Common Issues & Solutions

### Android: "include_flutter.groovy not found"

**Solution:**
```bash
./scripts/bootstrap-flutter-module.sh
cd android
./gradlew clean
./gradlew assembleDebug
```

### Android: "Could not get unknown property 'flutter'"

**Cause:** Flutter plugins not fully resolved

**Solution:**
```bash
cd super_dash
flutter clean
flutter pub get
cd ../android
./gradlew clean
./gradlew assembleDebug
```

### iOS: "Flutter.xcframework not found"

**Solution:**
```bash
cd ios
pod deintegrate
pod install
```

### iOS: "Module 'Flutter' not found"

**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

### FlutterEngine initialization fails

**Check logs:**

Android:
```bash
adb logcat | grep -E "Flutter|ERROR|FATAL"
```

iOS: Check Xcode console for errors

**Common causes:**
- Flutter SDK path incorrect
- Dart code has compilation errors
- Missing Flutter dependencies

**Solution:**
```bash
cd super_dash
flutter doctor
flutter pub get
flutter analyze
```

## Performance Testing

### Measure Launch Time

#### Android
```bash
adb shell am start -W com.s3app/.MainActivity
```

Look for `TotalTime` in output. Should be <500ms for FlutterEngine initialization.

#### iOS

In Xcode:
1. Product → Scheme → Edit Scheme
2. Run → Diagnostics
3. Enable "Time Profiler"
4. Run app and check launch time

### Memory Profiling

#### Android
```bash
adb shell dumpsys meminfo com.s3app
```

#### iOS

In Xcode:
1. Product → Profile (⌘I)
2. Select "Allocations"
3. Run and monitor memory usage

**Expected baseline (before game launch):**
- Android: ~150-200MB total (including FlutterEngine)
- iOS: ~120-180MB total (including FlutterEngine)

## Integration Test Script

The automated test script checks:

```bash
./scripts/test-flutter-integration.sh
```

**Output:**
```
🧪 Testing Flutter Module Integration
======================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Flutter SDK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Flutter SDK found: Flutter 3.35.6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. Flutter Module Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Super Dash is configured as Flutter module
✓ Module configuration found in pubspec.yaml

[... more tests ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tests Passed: 15
Tests Failed: 0

✓ All tests passed!
```

## Next Steps After Successful Testing

Once integration tests pass:

1. **Implement Native Bridges**
   - Task 6.2: Android MethodChannel/EventChannel
   - Task 6.3: iOS MethodChannel/EventChannel

2. **Implement Flutter Bridge**
   - Task 9.1: Flutter MethodChannel/EventChannel
   - Task 9.2: Bridge schemas in Dart

3. **Create Game Launch UI**
   - Task 1.1: Game launch button in React Native

4. **Test End-to-End**
   - Launch game from React Native
   - Verify communication between layers
   - Test game state persistence

## Useful Commands

### Flutter
```bash
flutter doctor              # Check Flutter installation
flutter pub get            # Install dependencies
flutter clean              # Clean build artifacts
flutter analyze            # Analyze Dart code
```

### Android
```bash
./gradlew clean            # Clean build
./gradlew assembleDebug    # Build debug APK
./gradlew tasks            # List available tasks
adb devices                # List connected devices
adb logcat                 # View device logs
```

### iOS
```bash
pod install                # Install pods
pod deintegrate           # Remove pods
pod update                # Update pods
xcrun simctl list         # List simulators
```

### React Native
```bash
npx react-native run-android    # Run on Android
npx react-native run-ios        # Run on iOS
npx react-native start          # Start Metro bundler
npx react-native log-android    # View Android logs
npx react-native log-ios        # View iOS logs
```

## Support

For issues or questions:
1. Check `docs/FLUTTER_MODULE_INTEGRATION.md` for detailed integration guide
2. Review `docs/TASK_0.2_FLUTTER_MODULE_INTEGRATION_COMPLETE.md` for implementation details
3. Run `./scripts/test-flutter-integration.sh` to diagnose issues
