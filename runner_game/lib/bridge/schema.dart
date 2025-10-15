/// Bridge schema and constants for React Native ⇄ Flutter communication.
///
/// This file defines the single source of truth for:
/// - Channel names (used by RN, Android, iOS, and Flutter)
/// - Command and event types for the game bridge
///
/// Keep these constants in sync across all platforms to avoid fat-fingering errors.
library;

// Channel constants - SINGLE SOURCE OF TRUTH
// ignore: constant_identifier_names
const String S3_CMD_CHANNEL = 's3/game/cmd';
// ignore: constant_identifier_names
const String S3_EVT_CHANNEL = 's3/game/events';

/// Commands sent from React Native to Flutter game
enum GameCommandType {
  start,
  pause,
  resume,
  quit,
}

/// Events sent from Flutter game to React Native
enum GameEventType {
  ready,
  state,
  result,
  error,
}

/// Base class for all game commands
abstract class GameCommand {
  final GameCommandType type;

  const GameCommand(this.type);

  Map<String, dynamic> toJson();

  factory GameCommand.fromJson(Map<String, dynamic> json) {
    final typeStr = json['type'] as String?;
    if (typeStr == null) {
      throw ArgumentError('Missing required field: type');
    }

    switch (typeStr.toLowerCase()) {
      case 'start':
        return StartCommand.fromJson(json);
      case 'pause':
        return PauseCommand.fromJson(json);
      case 'resume':
        return ResumeCommand.fromJson(json);
      case 'quit':
        return QuitCommand.fromJson(json);
      default:
        throw ArgumentError('Unknown command type: $typeStr');
    }
  }
}

/// START command - begins a new game with seed and team
class StartCommand extends GameCommand {
  final String seed;
  final String team;
  final String eventId;
  final bool musicEnabled;

  const StartCommand({
    required this.seed,
    required this.team,
    required this.eventId,
    this.musicEnabled = true,
  }) : super(GameCommandType.start);

  @override
  Map<String, dynamic> toJson() => {
        'type': 'start',
        'seed': seed,
        'team': team,
        'eventId': eventId,
        'musicEnabled': musicEnabled,
      };

  factory StartCommand.fromJson(Map<String, dynamic> json) {
    return StartCommand(
      seed: json['seed'] as String? ?? '',
      team: json['team'] as String? ?? '',
      eventId: json['eventId'] as String? ?? '',
      musicEnabled: json['musicEnabled'] as bool? ?? true,
    );
  }
}

/// PAUSE command - pauses the current game
class PauseCommand extends GameCommand {
  const PauseCommand() : super(GameCommandType.pause);

  @override
  Map<String, dynamic> toJson() => {'type': 'pause'};

  factory PauseCommand.fromJson(Map<String, dynamic> json) {
    return const PauseCommand();
  }
}

/// RESUME command - resumes a paused game
class ResumeCommand extends GameCommand {
  const ResumeCommand() : super(GameCommandType.resume);

  @override
  Map<String, dynamic> toJson() => {'type': 'resume'};

  factory ResumeCommand.fromJson(Map<String, dynamic> json) {
    return const ResumeCommand();
  }
}

/// QUIT command - exits the current game
class QuitCommand extends GameCommand {
  const QuitCommand() : super(GameCommandType.quit);

  @override
  Map<String, dynamic> toJson() => {'type': 'quit'};

  factory QuitCommand.fromJson(Map<String, dynamic> json) {
    return const QuitCommand();
  }
}

/// Base class for all game events
abstract class GameEvent {
  final GameEventType type;

  const GameEvent(this.type);

  Map<String, dynamic> toJson();
}

/// READY event - game is initialized and ready to start
class ReadyEvent extends GameEvent {
  final String gameCoreVersion;

  const ReadyEvent({
    required this.gameCoreVersion,
  }) : super(GameEventType.ready);

  @override
  Map<String, dynamic> toJson() => {
        'type': 'ready',
        'game_core_version': gameCoreVersion,
      };

  factory ReadyEvent.fromJson(Map<String, dynamic> json) {
    return ReadyEvent(
      gameCoreVersion: json['game_core_version'] as String? ?? '1.0.0',
    );
  }
}

/// STATE event - game state update (playing, paused, etc.)
class StateEvent extends GameEvent {
  final String state;

  const StateEvent({
    required this.state,
  }) : super(GameEventType.state);

  @override
  Map<String, dynamic> toJson() => {
        'type': 'state',
        'state': state,
      };

  factory StateEvent.fromJson(Map<String, dynamic> json) {
    return StateEvent(
      state: json['state'] as String? ?? 'unknown',
    );
  }
}

/// RESULT event - game completed with final score and metrics
class ResultEvent extends GameEvent {
  final int score;
  final String seed;
  final String clientHash;
  final String gameCoreVersion;

  const ResultEvent({
    required this.score,
    required this.seed,
    required this.clientHash,
    required this.gameCoreVersion,
  }) : super(GameEventType.result);

  @override
  Map<String, dynamic> toJson() => {
        'type': 'result',
        'score': score,
        'seed': seed,
        'clientHash': clientHash,
        'game_core_version': gameCoreVersion,
      };

  factory ResultEvent.fromJson(Map<String, dynamic> json) {
    return ResultEvent(
      score: json['score'] as int? ?? 0,
      seed: json['seed'] as String? ?? '',
      clientHash: json['clientHash'] as String? ?? '',
      gameCoreVersion: json['game_core_version'] as String? ?? '1.0.0',
    );
  }
}

/// ERROR event - game encountered an error
class ErrorEvent extends GameEvent {
  final String message;
  final String? code;

  const ErrorEvent({
    required this.message,
    this.code,
  }) : super(GameEventType.error);

  @override
  Map<String, dynamic> toJson() => {
        'type': 'error',
        'message': message,
        if (code != null) 'code': code,
      };

  factory ErrorEvent.fromJson(Map<String, dynamic> json) {
    return ErrorEvent(
      message: json['message'] as String? ?? 'Unknown error',
      code: json['code'] as String?,
    );
  }
}
