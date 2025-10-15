/// MethodChannel bridge for React Native ⇄ Flutter communication.
///
/// This bridge handles:
/// - Receiving commands from React Native via MethodChannel
/// - Sending events to React Native via EventChannel
/// - Command validation and error handling
library;

import 'dart:async';

import 'package:flutter/services.dart';

import 'schema.dart';

/// Bridge for communicating between React Native and Flutter game.
///
/// Usage:
/// ```dart
/// final bridge = MethodChannelBridge();
/// await bridge.initialize();
///
/// // Listen for commands
/// bridge.commandStream.listen((command) {
///   if (command is StartCommand) {
///     // Start game with seed and team
///   }
/// });
///
/// // Send events
/// bridge.sendEvent(ReadyEvent(gameCoreVersion: '1.0.0'));
/// ```
class MethodChannelBridge {
  /// MethodChannel for receiving commands from React Native
  final MethodChannel _commandChannel = const MethodChannel(S3_CMD_CHANNEL);

  /// EventChannel for sending events to React Native
  final EventChannel _eventChannel = const EventChannel(S3_EVT_CHANNEL);

  /// Stream controller for outgoing events
  final StreamController<Map<String, dynamic>> _eventController =
      StreamController<Map<String, dynamic>>.broadcast();

  /// Stream controller for incoming commands
  final StreamController<GameCommand> _commandController =
      StreamController<GameCommand>.broadcast();

  /// Whether the bridge has been initialized
  bool _initialized = false;

  /// Stream of commands received from React Native
  Stream<GameCommand> get commandStream => _commandController.stream;

  /// Initialize the bridge and set up listeners
  Future<void> initialize() async {
    if (_initialized) {
      return;
    }

    // Set up command handler
    _commandChannel.setMethodCallHandler(_handleMethodCall);

    // Set up event channel stream handler
    // Note: The native side (Android/iOS) will listen to this stream
    _eventChannel.receiveBroadcastStream().listen(
      (_) {}, // Native side handles the stream
      onError: (error) {
        // Log errors but don't crash
        // ignore: avoid_print
        print('[Bridge] EventChannel error: $error');
      },
    );

    _initialized = true;
  }

  /// Handle incoming method calls from React Native
  Future<dynamic> _handleMethodCall(MethodCall call) async {
    try {
      // Parse the command from the method call arguments
      final args = call.arguments as Map<dynamic, dynamic>?;
      if (args == null) {
        throw ArgumentError('Command arguments cannot be null');
      }

      // Convert to Map<String, dynamic>
      final jsonMap = Map<String, dynamic>.from(args);

      // Parse command using factory
      final command = GameCommand.fromJson(jsonMap);

      // Add to command stream
      _commandController.add(command);

      // Return success
      return {'success': true};
    } catch (e) {
      // Send error event
      sendEvent(ErrorEvent(
        message: 'Failed to handle command: $e',
        code: 'COMMAND_ERROR',
      ));

      // Return error
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  /// Send an event to React Native
  void sendEvent(GameEvent event) {
    if (!_initialized) {
      throw StateError('Bridge not initialized. Call initialize() first.');
    }

    // Convert event to JSON and add to stream
    final json = event.toJson();
    _eventController.add(json);

    // Also log for debugging
    // ignore: avoid_print
    print('[Bridge] Sending event: ${json['type']}');
  }

  /// Get the event stream for native EventChannel consumption
  Stream<Map<String, dynamic>> get eventStream => _eventController.stream;

  /// Dispose of the bridge and clean up resources
  Future<void> dispose() async {
    await _commandController.close();
    await _eventController.close();
    _initialized = false;
  }
}
