/**
 * Bridge Module
 * Public API for React Native ↔ Flutter communication
 */

// Export types and schemas
export type {
  GameCommand,
  StartCommand,
  PauseCommand,
  ResumeCommand,
  QuitCommand,
  SetMusicCommand,
  GameEvent,
  ReadyEvent,
  StateEvent,
  ResultEvent,
  ErrorEvent,
  GameResult,
} from './types';

export {
  GameCommandSchema,
  StartCommandSchema,
  PauseCommandSchema,
  ResumeCommandSchema,
  QuitCommandSchema,
  SetMusicCommandSchema,
  GameEventSchema,
  ReadyEventSchema,
  StateEventSchema,
  ResultEventSchema,
  ErrorEventSchema,
  GameResultSchema,
  validateGameCommand,
  validateGameEvent,
  validateGameResult,
  safeValidateGameCommand,
  safeValidateGameEvent,
} from './types';

// Export GameBridge wrapper
export { GameBridge } from './GameBridge';
export type { EventListener } from './GameBridge';
