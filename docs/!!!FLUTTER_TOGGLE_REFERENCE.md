# Flutter Module Toggle Reference

This document lists all files where Flutter integration can be enabled/disabled for testing purposes.

## Files to Modify

### Android (3 files)

#### 1. `android/settings.gradle`

**Location:** Lines 8-12

**Disabled:**

```groovy
// Flutter module integration (TEMPORARILY DISABLED FOR TESTING)
// Uncomment when Flutter module is ready (task 9.1+)
// setBinding(new Binding([gradle: this]))
// evaluate(new File(
//   settingsDir.parentFile,
//   'super_dash/.android/include_flutter.groovy'
// ))
```

**Enabled:**

```groovy
// Flutter module integration
setBinding(new Binding([gradle: this]))
evaluate(new File(
  settingsDir.parentFile,
  'super_dash/.android/include_flutter.groovy'
))
```

---

#### 2. `android/app/build.gradle`

**Location:** Around line 121 (in dependencies block)

**Disabled:**

```groovy
    // Flutter module integration (TEMPORARILY DISABLED FOR TESTING)
    // implementation project(':flutter')
```

**Enabled:**

```groovy
    // Flutter module integration
    implementation project(':flutter')
```

---

#### 3. `android/app/src/main/java/com/s3app/MainApplication.kt`

**Location:** Lines 9-11 (imports) and lines 27-52 (initialization)

**Disabled:**

```kotlin
// TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
// import io.flutter.embedding.engine.FlutterEngine
// import io.flutter.embedding.engine.FlutterEngineCache
// import io.flutter.embedding.engine.dart.DartExecutor

class MainApplication : Application(), ReactApplication {
  // ...

  // TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
  // FlutterEngine cache for Super Dash game
  // private lateinit var flutterEngine: FlutterEngine

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    // TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
    // Initialize and cache FlutterEngine for Super Dash
    // initializeFlutterEngine()
  }

  // TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
  // private fun initializeFlutterEngine() {
  //   // Create FlutterEngine instance
  //   flutterEngine = FlutterEngine(this)
  //
  //   // Start executing Dart code to pre-warm the FlutterEngine
  //   flutterEngine.dartExecutor.executeDartEntrypoint(
  //     DartExecutor.DartEntrypoint.createDefault()
  //   )
  //
  //   // Cache the FlutterEngine with ID "s3_engine"
  //   FlutterEngineCache
  //     .getInstance()
  //     .put("s3_engine", flutterEngine)
  // }
  //
  // fun getFlutterEngine(): FlutterEngine = flutterEngine
}
```

**Enabled:**

```kotlin
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.embedding.engine.FlutterEngineCache
import io.flutter.embedding.engine.dart.DartExecutor

class MainApplication : Application(), ReactApplication {
  // ...

  // FlutterEngine cache for Super Dash game
  private lateinit var flutterEngine: FlutterEngine

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    // Initialize and cache FlutterEngine for Super Dash
    initializeFlutterEngine()
  }

  private fun initializeFlutterEngine() {
    // Create FlutterEngine instance
    flutterEngine = FlutterEngine(this)

    // Start executing Dart code to pre-warm the FlutterEngine
    flutterEngine.dartExecutor.executeDartEntrypoint(
      DartExecutor.DartEntrypoint.createDefault()
    )

    // Cache the FlutterEngine with ID "s3_engine"
    FlutterEngineCache
      .getInstance()
      .put("s3_engine", flutterEngine)
  }

  fun getFlutterEngine(): FlutterEngine = flutterEngine
}
```

---

### iOS (2 files)

#### 4. `ios/Podfile`

**Location:** Lines 23-25, 35-36, 45-46

**Disabled:**

```ruby
# Flutter module integration (TEMPORARILY DISABLED FOR TESTING)
# Uncomment when Flutter module is ready (task 9.1+)
# flutter_application_path = '../super_dash'
# load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')

target 'S3App' do
  # ...

  # Install Flutter module pods (TEMPORARILY DISABLED FOR TESTING)
  # install_all_flutter_pods(flutter_application_path)

  post_install do |installer|
    # ...

    # Flutter post-install hook (TEMPORARILY DISABLED FOR TESTING)
    # flutter_post_install(installer) if defined?(flutter_post_install)
  end
end
```

**Enabled:**

```ruby
# Flutter module integration
flutter_application_path = '../super_dash'
load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')

target 'S3App' do
  # ...

  # Install Flutter module pods
  install_all_flutter_pods(flutter_application_path)

  post_install do |installer|
    # ...

    # Flutter post-install hook
    flutter_post_install(installer) if defined?(flutter_post_install)
  end
end
```

---

#### 5. `ios/S3App/AppDelegate.swift`

**Location:** Lines 4-5 (imports), lines 13-15 (property), lines 21-23 (initialization), lines 42-49 (method)

**Disabled:**

```swift
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
// TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
// import Flutter
// import FlutterPluginRegistrant

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
  // FlutterEngine cache for Super Dash game
  // lazy var flutterEngine = FlutterEngine(name: "s3_engine")

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
    // Initialize and cache FlutterEngine
    // initializeFlutterEngine()

    // ... rest of initialization

    return true
  }

  // TEMPORARILY DISABLED FOR TESTING - Uncomment when Flutter module is ready (task 9.1+)
  // private func initializeFlutterEngine() {
  //   // Start executing Dart code to pre-warm the FlutterEngine
  //   flutterEngine.run()
  //
  //   // Register plugins with the FlutterEngine
  //   GeneratedPluginRegistrant.register(with: self.flutterEngine)
  // }
}
```

**Enabled:**

```swift
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Flutter
import FlutterPluginRegistrant

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // FlutterEngine cache for Super Dash game
  lazy var flutterEngine = FlutterEngine(name: "s3_engine")

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize and cache FlutterEngine
    initializeFlutterEngine()

    // ... rest of initialization

    return true
  }

  private func initializeFlutterEngine() {
    // Start executing Dart code to pre-warm the FlutterEngine
    flutterEngine.run()

    // Register plugins with the FlutterEngine
    GeneratedPluginRegistrant.register(with: self.flutterEngine)
  }
}
```

---

## Quick Toggle Instructions

### To Disable Flutter (for testing without Flutter module):

1. Comment out all code blocks marked above in all 5 files
2. Add clear comments indicating temporary disable
3. Run clean builds:

   ```bash
   # Android
   cd android && ./gradlew clean && cd ..

   # iOS
   cd ios && pod install && cd ..
   ```

### To Re-enable Flutter:

1. Uncomment all code blocks in all 5 files
2. Remove temporary disable comments
3. Run clean builds:

   ```bash
   # Android
   cd android && ./gradlew clean && cd ..

   # iOS
   cd ios && pod install && cd ..
   ```

## Notes

- All changes are just commenting/uncommenting - no code is deleted
- Git tracks all changes, so you can always revert
- The Flutter module code in `super_dash/` is never modified
- This only affects the React Native host app's integration with Flutter
- When disabled, the app builds and runs but cannot launch Flutter screens
- When enabled, the app requires the Flutter module to be properly built

## Related Files

- `temp/disable-flutter-for-testing` branch - Has Flutter disabled
- `feature/task-5.0-zustand-store` branch - Has Flutter enabled
- `FLUTTER_DISABLED.md` - Created when disabled, deleted when enabled
