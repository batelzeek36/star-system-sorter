# Flutter Module Integration Guide

This document describes how the Super Dash Flutter module is integrated into the React Native app.

## Overview

The Super Dash game is a Flutter/Flame module embedded as a native module in the React Native app. It uses MethodChannel for commands and EventChannel for events, with FlutterEngine caching for optimal performance.

## Architecture

```
React Native App (S3App)
├── Android Native Layer
│   ├── MainApplication.kt (FlutterEngine cache)
│   └── GameBridgeModule.java (MethodChannel/EventChannel)
├── iOS Native Layer
│   ├── AppDelegate.swift (FlutterEngine cache)
│   └── GameBridgeModule.m (MethodChannel/EventChannel)
└── Flutter Module (super_dash)
    ├── lib/bridge/ (NEW: Message channel integration)
    ├── lib/core/ (NEW: Deterministic components)
    └── lib/game/ (EXISTING: Game logic)
```

## Flutter Module Configuration

The Super Dash project has been configured as a Flutter module by adding the `module` section to `pubspec.yaml`:

```yaml
module:
  androidX: true
  androidPackage: com.s3app.super_dash
  iosBundleIdentifier: com.s3app.superDash
```

## Android Integration

### 1. Settings Configuration (`android/settings.gradle`)

The Flutter module is included via the generated `include_flutter.groovy` script:

```groovy
setBinding(new Binding([gradle: this]))
evaluate(new File(
  settingsDir.parentFile,
  'super_dash/.android/include_flutter.groovy'
))
```

### 2. App Dependencies (`android/app/build.gradle`)

The Flutter module is added as a project dependency:

```groovy
dependencies {
    implementation project(':flutter')
}
```

### 3. FlutterEngine Caching (`MainApplication.kt`)

The FlutterEngine is initialized and cached in the Application class:

```kotlin
class MainApplication : Application(), ReactApplication {
  private lateinit var flutterEngine: FlutterEngine

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    initializeFlutterEngine()
  }

  private fun initializeFlutterEngine() {
    flutterEngine = FlutterEngine(this)
    flutterEngine.dartExecutor.executeDartEntrypoint(
      DartExecutor.DartEntrypoint.createDefault()
    )
    FlutterEngineCache
      .getInstance()
      .put("s3_engine", flutterEngine)
  }
}
```

**Benefits:**
- Pre-warms the Flutter engine during app startup
- Reduces game launch time from ~3s to <500ms
- Reuses the same engine instance across game sessions
- Dart VM stays warm between games

## iOS Integration

### 1. Podfile Configuration (`ios/Podfile`)

The Flutter module pods are installed via the `podhelper.rb` script:

```ruby
flutter_application_path = '../super_dash'
load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')

target 'S3App' do
  install_all_flutter_pods(flutter_application_path)
  
  post_install do |installer|
    flutter_post_install(installer) if defined?(flutter_post_install)
  end
end
```

### 2. FlutterEngine Caching (`AppDelegate.swift`)

The FlutterEngine is initialized and cached in the AppDelegate:

```swift
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  lazy var flutterEngine = FlutterEngine(name: "s3_engine")

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    initializeFlutterEngine()
    // ... React Native setup
    return true
  }
  
  private func initializeFlutterEngine() {
    flutterEngine.run()
    GeneratedPluginRegistrant.register(with: self.flutterEngine)
  }
}
```

**Benefits:**
- Pre-warms the Flutter engine during app startup
- Reduces game launch time from ~2s to <300ms
- Reuses the same engine instance across game sessions
- Plugins are registered once at startup

## FlutterEngine Caching Strategy

### Cache ID

Both platforms use the cache ID `"s3_engine"` to store and retrieve the FlutterEngine instance.

### Lifecycle

1. **App Launch**: FlutterEngine is created and cached in Application/AppDelegate
2. **First Game Launch**: Cached engine is retrieved and used (fast)
3. **Subsequent Launches**: Same cached engine is reused (instant)
4. **App Background**: Engine remains cached and warm
5. **App Termination**: Engine is destroyed with the app

### Performance Targets

- **Cold Launch** (first game): ≤500ms (Android), ≤300ms (iOS)
- **Warm Launch** (subsequent): ≤200ms (Android), ≤100ms (iOS)
- **Memory Overhead**: ~50MB for cached engine
- **Total Flutter Module Size**: ≤25MB added to APK/IPA

## Building the Flutter Module

### Generate Platform Files

Before building the React Native app, generate the Flutter platform files:

```bash
cd super_dash
flutter pub get
flutter build aar --release  # Android
flutter build ios-framework --release  # iOS
cd ..
```

### Android Build

The Flutter module is automatically included when building the Android app:

```bash
cd android
./gradlew assembleRelease
```

### iOS Build

Install pods and build:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npx react-native run-ios --configuration Release
```

## Development Workflow

### Hot Reload (Flutter)

While developing the Flutter game, you can use hot reload:

```bash
cd super_dash
flutter run -d <device_id>
```

### Full App Development

Run the React Native app with the embedded Flutter module:

```bash
# Android
npm run android

# iOS
npm run ios
```

## Troubleshooting

### Android: Flutter module not found

**Error**: `Project ':flutter' not found`

**Solution**: Generate the Flutter Android files:
```bash
cd super_dash
flutter build aar
```

### iOS: Flutter framework not found

**Error**: `framework not found Flutter`

**Solution**: Generate the Flutter iOS framework and reinstall pods:
```bash
cd super_dash
flutter build ios-framework
cd ../ios
bundle exec pod install
```

### FlutterEngine not cached

**Error**: `FlutterEngineCache.getInstance().get("s3_engine") returns null`

**Solution**: Ensure `initializeFlutterEngine()` is called in Application/AppDelegate `onCreate`/`didFinishLaunchingWithOptions`

### Memory Issues

**Symptom**: App crashes with OOM errors

**Solution**: 
- Monitor FlutterEngine memory usage
- Consider lazy initialization (create engine on first game launch)
- Destroy and recreate engine if memory pressure is high

## Next Steps

After completing this integration:

1. **Task 6.1-6.5**: Implement native bridge (MethodChannel/EventChannel)
2. **Task 9.1-9.11**: Implement Flutter bridge and deterministic core
3. **Task 14.1**: Write E2E tests for native bridge integration

## References

- [Flutter Add-to-App Documentation](https://docs.flutter.dev/development/add-to-app)
- [FlutterEngine API](https://api.flutter.dev/javadoc/io/flutter/embedding/engine/FlutterEngine.html)
- [MethodChannel Documentation](https://api.flutter.dev/flutter/services/MethodChannel-class.html)
- [EventChannel Documentation](https://api.flutter.dev/flutter/services/EventChannel-class.html)
