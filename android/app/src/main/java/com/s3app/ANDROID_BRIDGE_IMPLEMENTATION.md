# Android Native Bridge Implementation

## Overview

This document describes the Android native bridge implementation for Star System Sorter (S³). The bridge enables communication between React Native and the Flutter game module using MethodChannel.

## Architecture

### Components

1. **GameBridgeModule.kt** - React Native native module
2. **GameBridgePackage.kt** - React Native package registration
3. **MainApplication.kt** - FlutterEngine initialization and caching

### Communication Flow

```
React Native (JS)
    ↓ NativeModules.GameBridge
GameBridgeModule (Kotlin)
    ↓ MethodChannel
Flutter Game Module (Dart)
    ↓ MethodChannel callback
GameBridgeModule (Kotlin)
    ↓ DeviceEventEmitter
React Native (JS)
```

## Implementation Details

### FlutterEngine Caching

The FlutterEngine is initialized and cached in `MainApplication.onCreate()`:

```kotlin
private fun initializeFlutterEngine() {
  flutterEngine = FlutterEngine(this)
  flutterEngine.dartExecutor.executeDartEntrypoint(
    DartExecutor.DartEntrypoint.createDefault()
  )
  FlutterEngineCache.getInstance().put("s3_engine", flutterEngine)
}
```

**Benefits:**
- Pre-warms the Flutter engine for faster game launch
- Reduces first-launch latency
- Enables instant game startup

### MethodChannel Communication

**Channel Name:** `s3/game/cmd`

**Commands (RN → Flutter):**
- `sendCommand(commandJson)` - Sends game commands to Flutter

**Events (Flutter → RN):**
- `sendEvent(eventJson)` - Receives game events from Flutter

### Bidirectional Communication

The bridge uses a single MethodChannel for bidirectional communication:

1. **RN → Flutter:** React Native calls `sendCommand()` which invokes the MethodChannel
2. **Flutter → RN:** Flutter calls back to Android via `sendEvent()` method, which forwards to React Native's DeviceEventEmitter

This approach is simpler than using separate EventChannel and avoids complexity with EventSink wrapping.

## API

### GameBridgeModule Methods

#### `open(promise: Promise)`

Launches the Flutter game activity using the cached FlutterEngine.

**Returns:** Promise that resolves when activity launches successfully

**Errors:**
- `NO_ACTIVITY` - No current activity available
- `NO_ENGINE` - FlutterEngine not found in cache
- `LAUNCH_ERROR` - Failed to launch Flutter activity

#### `sendCommand(commandJson: String, promise: Promise)`

Sends a command to the Flutter game module.

**Parameters:**
- `commandJson` - JSON string containing the command (validated by Zod on RN side)

**Returns:** Promise that resolves when command is sent successfully

**Errors:**
- `NO_CHANNEL` - MethodChannel not initialized
- `SEND_ERROR` - Failed to send command

#### `addListener(eventName: String)`

Required by React Native event emitter. No-op implementation.

#### `removeListeners(count: Int)`

Required by React Native event emitter. No-op implementation.

### Events

Events are emitted to React Native via `DeviceEventEmitter` with event name `"GameEvent"`.

**Event Types:**
- `ready` - Flutter engine initialized
- `state` - Game state update
- `result` - Game completed with score
- `error` - Error occurred

## Flutter Integration Status

Flutter integration is **ENABLED** in the following files:

1. ✅ `android/settings.gradle` - Flutter module included
2. ✅ `android/app/build.gradle` - Flutter dependency added
3. ✅ `android/app/src/main/java/com/s3app/MainApplication.kt` - FlutterEngine cached

## Testing

### Manual Testing

1. Build the Android app:
   ```bash
   cd android && ./gradlew clean && ./gradlew assembleDebug && cd ..
   ```

2. Run the app:
   ```bash
   npm run android
   ```

3. Test bridge communication:
   - Navigate to Bridge Test screen
   - Verify "ready" event is received
   - Send "start" command
   - Verify game launches

### Automated Testing

Bridge contract tests are located in:
- `__tests__/bridge-handshake.test.ts`
- `__tests__/game-bridge.test.ts`

Run tests:
```bash
npm test
```

## Troubleshooting

### FlutterEngine not found

**Symptom:** `NO_ENGINE` error when calling `open()`

**Solution:**
1. Verify Flutter module is built: `./scripts/build-flutter-module.sh`
2. Check MainApplication initialization
3. Verify FlutterEngineCache is populated

### MethodChannel not initialized

**Symptom:** `NO_CHANNEL` error when calling `sendCommand()`

**Solution:**
1. Verify FlutterEngine is cached
2. Check that `setupChannels()` is called
3. Restart the app

### Events not received

**Symptom:** No events in React Native DeviceEventEmitter

**Solution:**
1. Verify Flutter bridge is calling `sendEvent()`
2. Check Android logs for errors
3. Verify event listener is registered in React Native

## File Locations

- **Native Module:** `android/app/src/main/java/com/s3app/GameBridgeModule.kt`
- **Package:** `android/app/src/main/java/com/s3app/GameBridgePackage.kt`
- **Application:** `android/app/src/main/java/com/s3app/MainApplication.kt`
- **Flutter Bridge:** `super_dash/lib/bridge/method_channel_bridge.dart`
- **RN Bridge:** `src/bridge/GameBridge.ts`

## Requirements Satisfied

- ✅ 3.1 - Native bridge implementation
- ✅ 3.2 - MethodChannel communication
- ✅ 3.3 - FlutterEngine caching
- ✅ 3.4 - Event handling

## Next Steps

1. Implement iOS native bridge (Task 6.3)
2. Wire React Native to native bridge (Task 6.4)
3. Write bridge contract tests (Task 6.5)
