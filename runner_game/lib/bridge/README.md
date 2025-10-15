# Bridge Schema and Implementation

This directory contains the bridge schema, constants, and MethodChannel implementation for communication between React Native and the Flutter game module.

## Files

- `schema.dart` - Channel constants, command/event types, and JSON serialization
- `method_channel_bridge.dart` - MethodChannel bridge implementation

## Channel Constants

The channel names are defined as constants in `schema.dart` to serve as the **single source of truth**:

```dart
const String S3_CMD_CHANNEL = 's3/game/cmd';
const String S3_EVT_CHANNEL = 's3/game/events';
```

### Usage Across Platforms

**Flutter (Dart):**
```dart
import 'package:runner_game/bridge/schema.dart';

// Use the constants directly
MethodChannel(S3_CMD_CHANNEL);
EventChannel(S3_EVT_CHANNEL);
```

**Android (Kotlin/Java):**
```kotlin
// Copy the constant values to your native code
private const val S3_CMD_CHANNEL = "s3/game/cmd"
private const val S3_EVT_CHANNEL = "s3/game/events"
```

**iOS (Swift):**
```swift
// Copy the constant values to your native code
private let S3_CMD_CHANNEL = "s3/game/cmd"
private let S3_EVT_CHANNEL = "s3/game/events"
```

**React Native (TypeScript):**
```typescript
// Copy the constant values to your bridge wrapper
const S3_CMD_CHANNEL = 's3/game/cmd';
const S3_EVT_CHANNEL = 's3/game/events';
```

## Command Types

Commands are sent **from React Native to Flutter**:

- `START` - Begin a new game with seed and team
- `PAUSE` - Pause the current game
- `RESUME` - Resume a paused game
- `QUIT` - Exit the current game

### START Command Example

```dart
{
  "type": "start",
  "seed": 12345,
  "team": "Manifestor"
}
```

## Event Types

Events are sent **from Flutter to React Native**:

- `READY` - Game is initialized and ready to start
- `STATE` - Game state update (playing, paused, etc.)
- `RESULT` - Game completed with final score and metrics
- `ERROR` - Game encountered an error

### RESULT Event Example

```dart
{
  "type": "result",
  "score": 1234,
  "seed": 12345,
  "clientHash": "abc123...",
  "game_core_version": "1.0.0"
}
```

## Type Safety

All commands and events have corresponding Dart classes with:
- Type-safe constructors
- JSON serialization (`toJson()`)
- JSON deserialization (`fromJson()`)
- Validation of required fields

## MethodChannel Bridge Usage

The `MethodChannelBridge` class handles all communication between React Native and Flutter:

```dart
import 'package:runner_game/bridge/method_channel_bridge.dart';
import 'package:runner_game/bridge/schema.dart';

// Initialize the bridge
final bridge = MethodChannelBridge();
await bridge.initialize();

// Listen for commands from React Native
bridge.commandStream.listen((command) {
  if (command is StartCommand) {
    print('Starting game with seed: ${command.seed}, team: ${command.team}');
    // Start your game logic here
  } else if (command is PauseCommand) {
    print('Pausing game');
    // Pause your game logic here
  } else if (command is ResumeCommand) {
    print('Resuming game');
    // Resume your game logic here
  } else if (command is QuitCommand) {
    print('Quitting game');
    // Quit your game logic here
  }
});

// Send events to React Native
bridge.sendEvent(ReadyEvent(gameCoreVersion: '1.0.0'));

// When game completes
bridge.sendEvent(ResultEvent(
  score: 1234,
  seed: 12345,
  clientHash: 'abc123...',
  gameCoreVersion: '1.0.0',
));

// Clean up when done
await bridge.dispose();
```

### EventChannel Integration

The native platform (Android/iOS) needs to set up the EventChannel to receive events:

**Android (Kotlin):**
```kotlin
val eventChannel = EventChannel(flutterEngine.dartExecutor.binaryMessenger, S3_EVT_CHANNEL)
eventChannel.setStreamHandler(object : EventChannel.StreamHandler {
    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        // Events will be sent here from Flutter
    }
    override fun onCancel(arguments: Any?) {}
})
```

**iOS (Swift):**
```swift
let eventChannel = FlutterEventChannel(
    name: S3_EVT_CHANNEL,
    binaryMessenger: flutterEngine.binaryMessenger
)
eventChannel.setStreamHandler(self)
```

## Important Notes

1. **Keep channel names in sync** across all platforms (Flutter, Android, iOS, React Native)
2. **Do not modify channel names** without updating all platforms
3. **Use the constants** instead of hardcoding strings to avoid typos
4. **Validate JSON** before sending/receiving to catch errors early
5. **Initialize the bridge** before sending any events
6. **Dispose the bridge** when the game is closed to clean up resources
