# Flutter Module Quick Reference

Quick commands and snippets for working with the Flutter module integration.

## Setup Commands

```bash
# One-time setup (run after cloning repo)
./scripts/setup-flutter-module.sh

# Manual setup
cd super_dash && flutter pub get && flutter build aar --release && flutter build ios-framework --release && cd ..
cd ios && bundle install && bundle exec pod install && cd ..
```

## Development Commands

```bash
# Run React Native app with Flutter module
npm run android  # Android
npm run ios      # iOS

# Rebuild Flutter module after changes
cd super_dash
flutter build aar --release        # Android
flutter build ios-framework --release  # iOS
cd ..

# Reinstall iOS pods after Flutter changes
cd ios && bundle exec pod install && cd ..

# Clean rebuild
cd android && ./gradlew clean && cd ..  # Android
cd ios && rm -rf Pods Podfile.lock && bundle exec pod install && cd ..  # iOS
```

## FlutterEngine Cache Access

### Android (Kotlin)

```kotlin
// In MainApplication.kt
private lateinit var flutterEngine: FlutterEngine

private fun initializeFlutterEngine() {
  flutterEngine = FlutterEngine(this)
  flutterEngine.dartExecutor.executeDartEntrypoint(
    DartExecutor.DartEntrypoint.createDefault()
  )
  FlutterEngineCache.getInstance().put("s3_engine", flutterEngine)
}

// Access cached engine
val engine = FlutterEngineCache.getInstance().get("s3_engine")
```

### iOS (Swift)

```swift
// In AppDelegate.swift
lazy var flutterEngine = FlutterEngine(name: "s3_engine")

private func initializeFlutterEngine() {
  flutterEngine.run()
  GeneratedPluginRegistrant.register(with: self.flutterEngine)
}

// Access cached engine
let engine = (UIApplication.shared.delegate as! AppDelegate).flutterEngine
```

## Launching Flutter Activity/ViewController

### Android

```kotlin
// In GameBridgeModule.java
val cachedEngine = FlutterEngineCache.getInstance().get("s3_engine")
val intent = FlutterActivity
  .withCachedEngine("s3_engine")
  .build(currentActivity)
currentActivity.startActivity(intent)
```

### iOS

```swift
// In GameBridgeModule.m
let flutterEngine = (UIApplication.shared.delegate as! AppDelegate).flutterEngine
let flutterViewController = FlutterViewController(engine: flutterEngine, nibName: nil, bundle: nil)
UIApplication.shared.keyWindow?.rootViewController?.present(flutterViewController, animated: true)
```

## MethodChannel Setup

### Android (Kotlin)

```kotlin
val engine = FlutterEngineCache.getInstance().get("s3_engine")
val channel = MethodChannel(engine.dartExecutor.binaryMessenger, "s3/game/cmd")

// Send command
channel.invokeMethod("start", mapOf("seed" to "abc123", "team" to "Pleiades"))

// Handle result
channel.setMethodCallHandler { call, result ->
  when (call.method) {
    "ready" -> result.success(null)
    else -> result.notImplemented()
  }
}
```

### iOS (Swift)

```swift
let engine = (UIApplication.shared.delegate as! AppDelegate).flutterEngine
let channel = FlutterMethodChannel(name: "s3/game/cmd", binaryMessenger: engine.binaryMessenger)

// Send command
channel.invokeMethod("start", arguments: ["seed": "abc123", "team": "Pleiades"])

// Handle result
channel.setMethodCallHandler { (call: FlutterMethodCall, result: @escaping FlutterResult) in
  switch call.method {
  case "ready":
    result(nil)
  default:
    result(FlutterMethodNotImplemented)
  }
}
```

## EventChannel Setup

### Android (Kotlin)

```kotlin
val engine = FlutterEngineCache.getInstance().get("s3_engine")
val eventChannel = EventChannel(engine.dartExecutor.binaryMessenger, "s3/game/events")

eventChannel.setStreamHandler(object : EventChannel.StreamHandler {
  override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
    // Send events to React Native
    events?.success(mapOf("type" to "ready"))
  }
  
  override fun onCancel(arguments: Any?) {
    // Cleanup
  }
})
```

### iOS (Swift)

```swift
let engine = (UIApplication.shared.delegate as! AppDelegate).flutterEngine
let eventChannel = FlutterEventChannel(name: "s3/game/events", binaryMessenger: engine.binaryMessenger)

class EventStreamHandler: NSObject, FlutterStreamHandler {
  func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
    // Send events to React Native
    events(["type": "ready"])
    return nil
  }
  
  func onCancel(withArguments arguments: Any?) -> FlutterError? {
    return nil
  }
}

eventChannel.setStreamHandler(EventStreamHandler())
```

## Debugging

### Android Logs

```bash
# Filter Flutter logs
adb logcat | grep -i flutter

# Filter app logs
adb logcat | grep -i s3app

# Clear logs and start fresh
adb logcat -c && adb logcat
```

### iOS Logs

```bash
# View device logs
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "S3App"'

# View Xcode console
# Open Xcode → Window → Devices and Simulators → Select device → View Device Logs
```

### Common Log Messages

**Success:**
- `Creating FlutterEngine` - Engine initialization started
- `FlutterEngineCache.put("s3_engine")` - Engine cached successfully
- `DartExecutor.executeDartEntrypoint` - Dart VM started

**Errors:**
- `FlutterEngine not found` - Engine not cached or cache ID mismatch
- `MethodChannel not found` - Channel not registered in Flutter
- `Flutter framework not found` - iOS framework not built or pods not installed

## Performance Monitoring

### Memory Usage

```bash
# Android
adb shell dumpsys meminfo com.s3app | grep -A 10 "App Summary"

# iOS (Xcode Instruments)
# Open Xcode → Product → Profile → Select "Allocations" template
```

### Launch Time

```bash
# Android
adb shell am start -W com.s3app/.MainActivity

# iOS (Xcode Instruments)
# Open Xcode → Product → Profile → Select "Time Profiler" template
```

## File Locations

### Generated Files

```
super_dash/
├── .android/                    # Android platform files
│   ├── include_flutter.groovy  # Gradle include script
│   └── Flutter/                # Flutter Android plugin
├── .ios/                       # iOS platform files
│   └── Flutter/                # Flutter iOS plugin
│       └── podhelper.rb        # CocoaPods helper script
└── build/
    ├── host/outputs/repo/      # Android AAR files
    └── ios/framework/          # iOS framework files
```

### Integration Files

```
android/
├── settings.gradle             # Includes Flutter module
├── app/build.gradle           # Flutter dependency
└── app/src/main/java/com/s3app/
    └── MainApplication.kt     # FlutterEngine cache

ios/
├── Podfile                    # Flutter pods
└── S3App/
    └── AppDelegate.swift      # FlutterEngine cache
```

## Troubleshooting Quick Fixes

```bash
# Flutter module not found (Android)
cd super_dash && flutter build aar --release && cd ..

# Flutter framework not found (iOS)
cd super_dash && flutter build ios-framework --release && cd ../ios && bundle exec pod install && cd ..

# Clean everything and rebuild
rm -rf super_dash/.android super_dash/.ios super_dash/build
cd super_dash && flutter clean && flutter pub get && cd ..
./scripts/setup-flutter-module.sh

# Reset Android build
cd android && ./gradlew clean && cd ..

# Reset iOS build
cd ios && rm -rf Pods Podfile.lock build && bundle exec pod install && cd ..
```

## Next Steps

- [Flutter Module Integration Guide](./FLUTTER_MODULE_INTEGRATION.md) - Detailed documentation
- [Setup Checklist](./FLUTTER_MODULE_SETUP_CHECKLIST.md) - Verification steps
- [Task 6.x](../.kiro/specs/hybrid-mobile-game-app/tasks.md) - Implement native bridge
- [Task 9.x](../.kiro/specs/hybrid-mobile-game-app/tasks.md) - Implement Flutter bridge
