# iOS Native Bridge Implementation

## Overview

This document describes the iOS native bridge implementation for the Flutter game module integration.

## Files Created

### 1. GameBridgeModule.m (Objective-C Bridge Header)

**Location:** `ios/S3App/GameBridgeModule.m`

**Purpose:** Exposes the Swift GameBridge module to React Native's JavaScript layer.

**Key Features:**
- Declares the module name as "GameBridge"
- Exposes `open()` method to launch Flutter view controller
- Exposes `sendCommand()` method for MethodChannel communication
- Implements event emitter methods for receiving Flutter events
- Requires main queue setup for UI operations

### 2. GameBridgeModule.swift (Swift Implementation)

**Location:** `ios/S3App/GameBridgeModule.swift`

**Purpose:** Implements the native bridge logic for Flutter integration.

**Key Components:**

#### Constants
- `ENGINE_ID`: "s3_engine" - FlutterEngine cache identifier
- `METHOD_CHANNEL_NAME`: "s3/game/cmd" - MethodChannel name
- `RN_EVENT_NAME`: "GameEvent" - React Native event name

#### Properties
- `methodChannel`: FlutterMethodChannel for bidirectional communication
- `flutterEngine`: Reference to cached FlutterEngine from AppDelegate

#### Methods

**setupChannels()**
- Initializes MethodChannel with cached FlutterEngine
- Sets up method call handler to receive events from Flutter
- Handles "sendEvent" method calls from Flutter

**open()**
- Creates FlutterViewController with cached engine
- Presents view controller full screen
- Returns promise to React Native

**sendCommand()**
- Sends commands to Flutter via MethodChannel
- Handles success/error responses
- Returns promise to React Native

**sendEventToReactNative()**
- Forwards events from Flutter to React Native
- Uses RCTEventEmitter to emit events

### 3. S3App-Bridging-Header.h

**Location:** `ios/S3App/S3App-Bridging-Header.h`

**Purpose:** Bridges Objective-C headers to Swift code.

**Imports:**
- `RCTBridgeModule.h` - React Native bridge module protocol
- `RCTEventEmitter.h` - React Native event emitter

## Architecture

```
React Native (JavaScript)
         ↓
GameBridgeModule.m (Objective-C)
         ↓
GameBridgeModule.swift (Swift)
         ↓
FlutterMethodChannel
         ↓
Flutter (Dart)
```

## Communication Flow

### Opening Flutter Game

1. JavaScript calls `GameBridge.open()`
2. Objective-C bridge forwards to Swift implementation
3. Swift creates FlutterViewController with cached engine
4. View controller presented full screen
5. Promise resolved back to JavaScript

### Sending Commands

1. JavaScript calls `GameBridge.sendCommand(jsonString)`
2. Objective-C bridge forwards to Swift implementation
3. Swift invokes MethodChannel with command
4. Flutter receives command via MethodChannel handler
5. Result returned via promise to JavaScript

### Receiving Events

1. Flutter calls MethodChannel.invokeMethod("sendEvent", eventJson)
2. Swift method call handler receives event
3. Swift forwards to React Native via RCTEventEmitter
4. JavaScript receives event via DeviceEventEmitter

## FlutterEngine Caching

The FlutterEngine is cached in AppDelegate for performance:

```swift
// AppDelegate.swift
lazy var flutterEngine = FlutterEngine(name: "s3_engine")

func application(...) -> Bool {
  initializeFlutterEngine()
  // ...
}

private func initializeFlutterEngine() {
  flutterEngine.run()
  GeneratedPluginRegistrant.register(with: self.flutterEngine)
}
```

Benefits:
- Faster game launch (engine pre-warmed)
- Reduced memory overhead (single engine instance)
- Persistent state between game sessions

## Integration with Xcode Project

The bridge files need to be added to the Xcode project:

1. Open `S3App.xcodeproj` in Xcode
2. Right-click on S3App folder → Add Files to "S3App"
3. Select:
   - `GameBridgeModule.m`
   - `GameBridgeModule.swift`
   - `S3App-Bridging-Header.h`
4. Ensure "Copy items if needed" is checked
5. Ensure "S3App" target is selected

## Build Settings

In Xcode project settings, configure:

**Swift Compiler - General:**
- Objective-C Bridging Header: `S3App/S3App-Bridging-Header.h`

**Swift Compiler - Language:**
- Swift Language Version: Swift 5

## Testing

After implementation, test the bridge:

1. Run `cd ios && bundle exec pod install`
2. Build and run the app
3. Navigate to BridgeTestScreen
4. Verify:
   - FlutterEngine is cached
   - MethodChannel is initialized
   - Commands can be sent
   - Events can be received

## Requirements Satisfied

- **3.1**: Native bridge implementation (iOS)
- **3.2**: MethodChannel for commands
- **3.3**: EventChannel for events (via MethodChannel callback)
- **3.4**: FlutterEngine caching in AppDelegate

## Related Files

- `android/app/src/main/java/com/s3app/GameBridgeModule.kt` - Android implementation
- `src/bridge/GameBridge.ts` - React Native wrapper
- `super_dash/lib/bridge/method_channel_bridge.dart` - Flutter implementation
- `docs/!!!FLUTTER_TOGGLE_REFERENCE.md` - Flutter integration toggle guide

## Notes

- iOS uses FlutterViewController instead of FlutterActivity (Android)
- iOS presents view controller modally instead of starting activity
- iOS uses RCTEventEmitter instead of DeviceEventManagerModule (Android)
- Both platforms share the same MethodChannel protocol
- Both platforms use the same channel names and message formats

## Troubleshooting

### "Module 'Flutter' not found"

Run `cd ios && bundle exec pod install` to install Flutter pods.

### "Use of undeclared type 'FlutterEngine'"

Ensure Flutter integration is enabled in Podfile and AppDelegate.swift.

### "No such module 'React'"

Ensure bridging header includes React Native headers.

### Bridge not working

1. Check FlutterEngine is initialized in AppDelegate
2. Verify MethodChannel name matches Flutter side
3. Check Xcode console for error messages
4. Verify bridge files are added to Xcode project

## Next Steps

1. Add bridge files to Xcode project
2. Run pod install
3. Build and test on iOS simulator/device
4. Verify bridge handshake with BridgeTestScreen
5. Test game launch and command/event flow
