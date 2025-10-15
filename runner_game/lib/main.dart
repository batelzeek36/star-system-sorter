/// Runner Game - Simple tap-to-jump game with bridge integration
///
/// This is a minimal Flutter module that integrates with React Native via
/// MethodChannel/EventChannel bridge.
library;

import 'dart:async';

import 'package:flutter/material.dart';

import 'bridge/method_channel_bridge.dart';
import 'bridge/schema.dart';

/// Game core version for compatibility checking
const String kGameCoreVersion = '1.0.0';

void main() {
  runApp(const RunnerGameApp());
}

class RunnerGameApp extends StatefulWidget {
  const RunnerGameApp({super.key});

  @override
  State<RunnerGameApp> createState() => _RunnerGameAppState();
}

class _RunnerGameAppState extends State<RunnerGameApp> {
  final MethodChannelBridge _bridge = MethodChannelBridge();
  StreamSubscription<GameCommand>? _commandSubscription;

  String? _seed;
  String? _team;
  String? _eventId;
  bool _isPlaying = false;
  bool _isPaused = false;
  int _score = 0;

  @override
  void initState() {
    super.initState();
    _initializeBridge();
  }

  /// Initialize the bridge and listen for commands
  Future<void> _initializeBridge() async {
    try {
      // Initialize the bridge
      await _bridge.initialize();

      // Listen for commands from React Native
      _commandSubscription = _bridge.commandStream.listen(_handleCommand);

      // Send READY event to indicate initialization complete
      _bridge.sendEvent(const ReadyEvent(gameCoreVersion: kGameCoreVersion));

      debugPrint('[RunnerGame] Bridge initialized, READY event sent');
    } catch (e) {
      debugPrint('[RunnerGame] Failed to initialize bridge: $e');
      _bridge.sendEvent(ErrorEvent(
        message: 'Failed to initialize bridge: $e',
        code: 'INIT_ERROR',
      ));
    }
  }

  /// Handle incoming commands from React Native
  void _handleCommand(GameCommand command) {
    debugPrint('[RunnerGame] Received command: ${command.type}');

    switch (command.type) {
      case GameCommandType.start:
        _handleStartCommand(command as StartCommand);
        break;
      case GameCommandType.pause:
        _handlePauseCommand();
        break;
      case GameCommandType.resume:
        _handleResumeCommand();
        break;
      case GameCommandType.quit:
        _handleQuitCommand();
        break;
    }
  }

  /// Handle START command - begin game with seed and team
  void _handleStartCommand(StartCommand command) {
    setState(() {
      _seed = command.seed;
      _team = command.team;
      _eventId = command.eventId;
      _isPlaying = true;
      _isPaused = false;
      _score = 0;
    });

    debugPrint('[RunnerGame] Game started with seed=${command.seed}, team=${command.team}, eventId=${command.eventId}');
    _bridge.sendEvent(const StateEvent(state: 'playing'));
  }

  /// Handle PAUSE command
  void _handlePauseCommand() {
    setState(() {
      _isPaused = true;
    });

    debugPrint('[RunnerGame] Game paused');
    _bridge.sendEvent(const StateEvent(state: 'paused'));
  }

  /// Handle RESUME command
  void _handleResumeCommand() {
    setState(() {
      _isPaused = false;
    });

    debugPrint('[RunnerGame] Game resumed');
    _bridge.sendEvent(const StateEvent(state: 'playing'));
  }

  /// Handle QUIT command
  void _handleQuitCommand() {
    setState(() {
      _isPlaying = false;
      _isPaused = false;
    });

    debugPrint('[RunnerGame] Game quit');
    _bridge.sendEvent(const StateEvent(state: 'quit'));
  }

  /// Handle game over - send RESULT event
  void _handleGameOver() {
    if (!_isPlaying) return;

    setState(() {
      _isPlaying = false;
    });

    // Generate a simple client hash (in real implementation, this would be more sophisticated)
    final clientHash = 'hash_${_seed}_$_score';

    // Send RESULT event to React Native
    _bridge.sendEvent(ResultEvent(
      score: _score,
      seed: _seed ?? '',
      clientHash: clientHash,
      gameCoreVersion: kGameCoreVersion,
    ));

    debugPrint('[RunnerGame] Game over, RESULT event sent: score=$_score, seed=$_seed');
  }

  /// Simulate scoring (placeholder for actual game logic)
  void _incrementScore() {
    if (!_isPlaying || _isPaused) return;

    setState(() {
      _score += 10;
    });
  }

  @override
  void dispose() {
    _commandSubscription?.cancel();
    _bridge.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Runner Game',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: Scaffold(
        backgroundColor: _getTeamColor(),
        body: SafeArea(
          child: Center(
            child: _buildGameContent(),
          ),
        ),
      ),
    );
  }

  /// Get team color based on team name
  Color _getTeamColor() {
    if (_team == null) return Colors.grey;

    switch (_team!.toLowerCase()) {
      case 'manifestor':
        return Colors.red.shade300;
      case 'generator':
        return Colors.orange.shade300;
      case 'manifesting generator':
        return Colors.amber.shade300;
      case 'projector':
        return Colors.green.shade300;
      case 'reflector':
        return Colors.blue.shade300;
      default:
        return Colors.grey.shade300;
    }
  }

  /// Build game content based on current state
  Widget _buildGameContent() {
    if (!_isPlaying && _seed == null) {
      return const Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.sports_esports, size: 64, color: Colors.white70),
          SizedBox(height: 16),
          Text(
            'Waiting for START command...',
            style: TextStyle(fontSize: 18, color: Colors.white70),
          ),
        ],
      );
    }

    if (_isPaused) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.pause_circle, size: 64, color: Colors.white),
          const SizedBox(height: 16),
          const Text(
            'PAUSED',
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Score: $_score',
            style: const TextStyle(fontSize: 24, color: Colors.white70),
          ),
        ],
      );
    }

    if (!_isPlaying) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.flag, size: 64, color: Colors.white),
          const SizedBox(height: 16),
          const Text(
            'GAME OVER',
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Final Score: $_score',
            style: const TextStyle(fontSize: 24, color: Colors.white70),
          ),
        ],
      );
    }

    // Active game state
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Team: $_team',
          style: const TextStyle(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Text(
          'Seed: $_seed',
          style: const TextStyle(fontSize: 16, color: Colors.white70),
        ),
        const SizedBox(height: 32),
        Text(
          'Score: $_score',
          style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 48),
        ElevatedButton(
          onPressed: _incrementScore,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 24),
            textStyle: const TextStyle(fontSize: 24),
          ),
          child: const Text('TAP TO SCORE'),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: _handleGameOver,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
          ),
          child: const Text('END GAME'),
        ),
      ],
    );
  }
}
