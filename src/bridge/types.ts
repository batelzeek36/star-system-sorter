/**
 * Bridge Types and Schemas
 * 
 * Defines types and Zod schemas for React Native ↔ Flutter communication.
 * Zod is the runtime source of truth; JSON Schemas are generated for docs.
 * 
 * Requirements: 3.5, 2.9
 */

import { z } from 'zod';

// ============================================================================
// Game Commands (React Native → Flutter)
// ============================================================================

/**
 * Start Command
 * Initializes a new game session with seed and configuration
 */
export const StartCommandSchema = z.object({
  type: z.literal('start'),
  seed: z.string().regex(/^[0-9a-fA-F]{16}$/, 'Seed must be 16-character hex string'),
  team: z.string().min(1),
  eventId: z.string().min(1),
  musicEnabled: z.boolean().optional().default(true),
  ghostData: z.object({
    seed: z.string(),
    inputs: z.string(), // RLE/delta compressed input timeline
  }).optional(),
});

/**
 * Pause Command
 * Pauses the current game session
 */
export const PauseCommandSchema = z.object({
  type: z.literal('pause'),
});

/**
 * Resume Command
 * Resumes a paused game session
 */
export const ResumeCommandSchema = z.object({
  type: z.literal('resume'),
});

/**
 * Quit Command
 * Terminates the current game session
 */
export const QuitCommandSchema = z.object({
  type: z.literal('quit'),
});

/**
 * Set Music Command
 * Updates music enabled state during gameplay
 */
export const SetMusicCommandSchema = z.object({
  type: z.literal('set-music'),
  enabled: z.boolean(),
});

/**
 * Union of all game commands
 */
export const GameCommandSchema = z.discriminatedUnion('type', [
  StartCommandSchema,
  PauseCommandSchema,
  ResumeCommandSchema,
  QuitCommandSchema,
  SetMusicCommandSchema,
]);

export type StartCommand = z.infer<typeof StartCommandSchema>;
export type PauseCommand = z.infer<typeof PauseCommandSchema>;
export type ResumeCommand = z.infer<typeof ResumeCommandSchema>;
export type QuitCommand = z.infer<typeof QuitCommandSchema>;
export type SetMusicCommand = z.infer<typeof SetMusicCommandSchema>;
export type GameCommand = z.infer<typeof GameCommandSchema>;

// ============================================================================
// Game Events (Flutter → React Native)
// ============================================================================

/**
 * Ready Event
 * Sent when Flutter engine is initialized and ready to receive commands
 */
export const ReadyEventSchema = z.object({
  type: z.literal('ready'),
  game_core_version: z.string(),
});

/**
 * State Event
 * Periodic updates about game state during gameplay
 */
export const StateEventSchema = z.object({
  type: z.literal('state'),
  state: z.enum(['playing', 'paused', 'loading']),
  progress: z.number().min(0).max(1).optional(), // 0-1 for loading/level progress
});

/**
 * Result Event
 * Sent when game completes with final score and validation data
 */
export const ResultEventSchema = z.object({
  type: z.literal('result'),
  score: z.number().int().min(0),
  metrics: z.object({
    distance: z.number().min(0),
    time: z.number().min(0), // milliseconds
    enemiesDefeated: z.number().int().min(0),
    coinsCollected: z.number().int().min(0),
  }),
  clientHash: z.string().regex(/^[0-9a-fA-F]{64}$/, 'Must be SHA256 hex string'),
  game_core_version: z.string(),
  inputs: z.string(), // RLE/delta compressed input timeline
});

/**
 * Error Event
 * Sent when an error occurs in the Flutter game
 */
export const ErrorEventSchema = z.object({
  type: z.literal('error'),
  code: z.string(),
  message: z.string(),
});

/**
 * Union of all game events
 */
export const GameEventSchema = z.discriminatedUnion('type', [
  ReadyEventSchema,
  StateEventSchema,
  ResultEventSchema,
  ErrorEventSchema,
]);

export type ReadyEvent = z.infer<typeof ReadyEventSchema>;
export type StateEvent = z.infer<typeof StateEventSchema>;
export type ResultEvent = z.infer<typeof ResultEventSchema>;
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;
export type GameEvent = z.infer<typeof GameEventSchema>;

// ============================================================================
// Game Result (for API submission)
// ============================================================================

/**
 * Game Result
 * Complete game result data for server submission and validation
 */
export const GameResultSchema = z.object({
  score: z.number().int().min(0),
  metrics: z.object({
    distance: z.number().min(0),
    time: z.number().min(0),
    enemiesDefeated: z.number().int().min(0),
    coinsCollected: z.number().int().min(0),
  }),
  clientHash: z.string().regex(/^[0-9a-fA-F]{64}$/, 'Must be SHA256 hex string'),
  game_core_version: z.string(),
  inputs: z.string(),
  seed: z.string().regex(/^[0-9a-fA-F]{16}$/, 'Seed must be 16-character hex string'),
  team: z.string().min(1),
  eventId: z.string().min(1),
});

export type GameResult = z.infer<typeof GameResultSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates a game command and returns typed result
 */
export function validateGameCommand(data: unknown): GameCommand {
  return GameCommandSchema.parse(data);
}

/**
 * Validates a game event and returns typed result
 */
export function validateGameEvent(data: unknown): GameEvent {
  return GameEventSchema.parse(data);
}

/**
 * Validates a game result and returns typed result
 */
export function validateGameResult(data: unknown): GameResult {
  return GameResultSchema.parse(data);
}

/**
 * Safe validation that returns success/error result
 */
export function safeValidateGameCommand(data: unknown): 
  | { success: true; data: GameCommand }
  | { success: false; error: z.ZodError } {
  const result = GameCommandSchema.safeParse(data);
  return result.success 
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

/**
 * Safe validation that returns success/error result
 */
export function safeValidateGameEvent(data: unknown):
  | { success: true; data: GameEvent }
  | { success: false; error: z.ZodError } {
  const result = GameEventSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}
