# Flutter Module Setup Checklist

This checklist helps verify that the Flutter module integration is correctly configured.

## Prerequisites Verification

- [ ] **Flutter SDK Installed**: Run `flutter --version` and verify version >= 3.16.0
- [ ] **Android Studio Installed**: Required for Android development
- [ ] **Xcode Installed** (macOS only): Required for iOS development
- [ ] **CocoaPods Installed** (macOS only): Run `pod --version`

## Configuration Files

### Flutter Module (`super_dash/pubspec.yaml`)

- [ ] **Module section added**:
  ```yaml
  module:
    androidX: true
    androidPackage: com.s3app.super_dash
    iosBundleIdentifier: com.s3app.superDash
  ```

### Android Configuration

- [ ] **`android/settings.gradle` includes Flutter module**:
  ```groovy
  setBinding(new Binding([gradle: this]))
  evaluate(new File(
    settingsDir.parentFile,
    'super_dash/.android/include_flutter.groovy'
  ))
  ```

- [ ] **`android/app/build.gradle` has Flutter dependency**:
  ```groovy
  dependencies {
      implementation project(':flutter')
  }
  ```

- [ ] **`MainApplication.kt` initializes FlutterEngine**:
  - Imports `io.flutter.embedding.engine.*`
  - Creates FlutterEngine in `onCreate()`
  - Caches engine with ID `"s3_engine"`

### iOS Configuration

- [ ] **`ios/Podfile` includes Flutter module**:
  ```ruby
  flutter_application_path = '../super_dash'
  load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')
  install_all_flutter_pods(flutter_application_path)
  ```

- [ ] **`AppDelegate.swift` initializes FlutterEngine**:
  - Imports `Flutter` and `FlutterPluginRegistrant`
  - Creates `lazy var flutterEngine = FlutterEngine(name: "s3_engine")`
  - Calls `flutterEngine.run()` in `didFinishLaunchingWithOptions`
  - Registers plugins with `GeneratedPluginRegistrant.register(with: self.flutterEngine)`

## Build Verification

### Generate Flutter Platform Files

Run these commands to generate the necessary platform files:

```bash
cd super_dash
flutter pub get
flutter build aar --release
flutter build ios-framework --release
cd ..
```

**Expected Output:**

- [ ] **Android**: `super_dash/.android/` directory created
- [ ] **Android**: `super_dash/.android/include_flutter.groovy` exists
- [ ] **Android**: `super_dash/build/host/outputs/repo/` contains AAR files
- [ ] **iOS**: `super_dash/.ios/` directory created
- [ ] **iOS**: `super_dash/.ios/Flutter/podhelper.rb` exists
- [ ] **iOS**: `super_dash/build/ios/framework/` contains Flutter.xcframework

### Install iOS Pods

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

**Expected Output:**

- [ ] **Pods installed successfully** without errors
- [ ] **`ios/Pods/` directory** contains Flutter pods
- [ ] **`ios/Podfile.lock`** includes Flutter dependencies

### Build Android App

```bash
cd android
./gradlew assembleDebug
cd ..
```

**Expected Output:**

- [ ] **Build succeeds** without errors
- [ ] **APK created** at `android/app/build/outputs/apk/debug/app-debug.apk`
- [ ] **APK size increase** of approximately 20-25MB (Flutter module overhead)

### Build iOS App

```bash
npx react-native run-ios --configuration Debug
```

**Expected Output:**

- [ ] **Build succeeds** without errors
- [ ] **App launches** on iOS Simulator
- [ ] **No Flutter-related errors** in Xcode console

## Runtime Verification

### Android

Run the app and check logs:

```bash
npx react-native run-android
adb logcat | grep -i flutter
```

**Expected Logs:**

- [ ] **FlutterEngine created**: Look for "Creating FlutterEngine"
- [ ] **Engine cached**: Look for "FlutterEngineCache.put"
- [ ] **Dart VM started**: Look for "DartExecutor.executeDartEntrypoint"
- [ ] **No errors**: No "FlutterEngine not found" or similar errors

### iOS

Run the app and check logs:

```bash
npx react-native run-ios
# Check Xcode console or device logs
```

**Expected Logs:**

- [ ] **FlutterEngine created**: Look for "Creating FlutterEngine"
- [ ] **Engine running**: Look for "flutterEngine.run()"
- [ ] **Plugins registered**: Look for "GeneratedPluginRegistrant.register"
- [ ] **No errors**: No "Flutter framework not found" or similar errors

## Performance Verification

### Memory Usage

- [ ] **Android**: FlutterEngine adds ~50MB to app memory
- [ ] **iOS**: FlutterEngine adds ~40MB to app memory
- [ ] **No memory leaks**: Memory usage stable after multiple game launches

### Launch Time

Measure time from app launch to FlutterEngine ready:

- [ ] **Android**: ≤500ms for engine initialization
- [ ] **iOS**: ≤300ms for engine initialization
- [ ] **Subsequent launches**: Engine already cached, instant access

### APK/IPA Size

- [ ] **Android APK**: Flutter module adds ≤25MB (compressed)
- [ ] **iOS IPA**: Flutter module adds ≤25MB (compressed)

## Troubleshooting

### Common Issues

**Issue**: `Project ':flutter' not found` (Android)

**Solution**:
```bash
cd super_dash
flutter build aar --release
cd ..
```

---

**Issue**: `framework not found Flutter` (iOS)

**Solution**:
```bash
cd super_dash
flutter build ios-framework --release
cd ../ios
bundle exec pod install
cd ..
```

---

**Issue**: `FlutterEngineCache.getInstance().get("s3_engine") returns null`

**Solution**: Verify `initializeFlutterEngine()` is called in `MainApplication.onCreate()` or `AppDelegate.didFinishLaunchingWithOptions`

---

**Issue**: Build fails with "Execution failed for task ':app:mergeDebugNativeLibs'"

**Solution**: Clean and rebuild:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

---

**Issue**: iOS build fails with "Undefined symbols for architecture arm64"

**Solution**: Clean build folder and reinstall pods:
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
```

## Next Steps

After verifying the Flutter module integration:

1. **Implement Native Bridge** (Task 6.1-6.5):
   - Create GameBridgeModule for Android
   - Create GameBridgeModule for iOS
   - Set up MethodChannel and EventChannel

2. **Implement Flutter Bridge** (Task 9.1-9.2):
   - Create MethodChannel bridge in Flutter
   - Create EventChannel bridge in Flutter
   - Define message schemas

3. **Test Integration** (Task 14.1):
   - Write E2E tests for native bridge
   - Verify message passing works correctly
   - Test FlutterEngine caching performance

## References

- [Flutter Add-to-App Documentation](https://docs.flutter.dev/development/add-to-app)
- [Flutter Module Integration Guide](./FLUTTER_MODULE_INTEGRATION.md)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
