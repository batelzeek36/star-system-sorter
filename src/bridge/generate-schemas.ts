// @exception(max-lines) why: Build script with repetitive JSON Schema definitions for all command/event types
/**
 * JSON Schema Generator
 * 
 * Generates JSON Schemas from Zod schemas for documentation and client usage.
 * Run with: npx tsx src/bridge/generate-schemas.ts
 * 
 * Note: Manual schemas due to zod-to-json-schema compatibility issues with Zod v4
 * 
 * Requirements: 3.5, 2.9
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMAS_DIR = path.join(__dirname, '../../schemas');

// Ensure schemas directory exists
if (!fs.existsSync(SCHEMAS_DIR)) {
  fs.mkdirSync(SCHEMAS_DIR, { recursive: true });
}

/**
 * Write a JSON Schema file
 */
function writeSchema(name: string, schema: any) {
  const filePath = path.join(SCHEMAS_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
  console.log(`✓ Generated ${name}.json`);
}

// Generate schemas for all command types
console.log('Generating JSON Schemas from Zod definitions...\n');

// StartCommand
writeSchema('StartCommand', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'StartCommand',
  description: 'Command to start a new game session with seed and configuration',
  type: 'object',
  required: ['type', 'seed', 'team', 'eventId'],
  properties: {
    type: { type: 'string', const: 'start' },
    seed: { type: 'string', pattern: '^[0-9a-fA-F]{16}$', description: 'Seed must be 16-character hex string' },
    team: { type: 'string', minLength: 1 },
    eventId: { type: 'string', minLength: 1 },
    musicEnabled: { type: 'boolean', default: true },
    ghostData: {
      type: 'object',
      required: ['seed', 'inputs'],
      properties: {
        seed: { type: 'string' },
        inputs: { type: 'string', description: 'RLE/delta compressed input timeline' },
      },
    },
  },
});

// PauseCommand
writeSchema('PauseCommand', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'PauseCommand',
  description: 'Command to pause the current game session',
  type: 'object',
  required: ['type'],
  properties: {
    type: { type: 'string', const: 'pause' },
  },
});

// ResumeCommand
writeSchema('ResumeCommand', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ResumeCommand',
  description: 'Command to resume a paused game session',
  type: 'object',
  required: ['type'],
  properties: {
    type: { type: 'string', const: 'resume' },
  },
});

// QuitCommand
writeSchema('QuitCommand', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'QuitCommand',
  description: 'Command to terminate the current game session',
  type: 'object',
  required: ['type'],
  properties: {
    type: { type: 'string', const: 'quit' },
  },
});

// SetMusicCommand
writeSchema('SetMusicCommand', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'SetMusicCommand',
  description: 'Command to update music enabled state during gameplay',
  type: 'object',
  required: ['type', 'enabled'],
  properties: {
    type: { type: 'string', const: 'set-music' },
    enabled: { type: 'boolean' },
  },
});

// GameCommand (union)
writeSchema('GameCommand', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'GameCommand',
  description: 'Union of all game commands sent from React Native to Flutter',
  oneOf: [
    { $ref: './StartCommand.json' },
    { $ref: './PauseCommand.json' },
    { $ref: './ResumeCommand.json' },
    { $ref: './QuitCommand.json' },
    { $ref: './SetMusicCommand.json' },
  ],
  discriminator: { propertyName: 'type' },
});

// ReadyEvent
writeSchema('ReadyEvent', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ReadyEvent',
  description: 'Event sent when Flutter engine is initialized and ready',
  type: 'object',
  required: ['type', 'game_core_version'],
  properties: {
    type: { type: 'string', const: 'ready' },
    game_core_version: { type: 'string' },
  },
});

// StateEvent
writeSchema('StateEvent', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'StateEvent',
  description: 'Event with periodic updates about game state during gameplay',
  type: 'object',
  required: ['type', 'state'],
  properties: {
    type: { type: 'string', const: 'state' },
    state: { type: 'string', enum: ['playing', 'paused', 'loading'] },
    progress: { type: 'number', minimum: 0, maximum: 1, description: '0-1 for loading/level progress' },
  },
});

// ResultEvent
writeSchema('ResultEvent', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ResultEvent',
  description: 'Event sent when game completes with final score and validation data',
  type: 'object',
  required: ['type', 'score', 'metrics', 'clientHash', 'game_core_version', 'inputs'],
  properties: {
    type: { type: 'string', const: 'result' },
    score: { type: 'integer', minimum: 0 },
    metrics: {
      type: 'object',
      required: ['distance', 'time', 'enemiesDefeated', 'coinsCollected'],
      properties: {
        distance: { type: 'number', minimum: 0 },
        time: { type: 'number', minimum: 0, description: 'milliseconds' },
        enemiesDefeated: { type: 'integer', minimum: 0 },
        coinsCollected: { type: 'integer', minimum: 0 },
      },
    },
    clientHash: { type: 'string', pattern: '^[0-9a-fA-F]{64}$', description: 'Must be SHA256 hex string' },
    game_core_version: { type: 'string' },
    inputs: { type: 'string', description: 'RLE/delta compressed input timeline' },
  },
});

// ErrorEvent
writeSchema('ErrorEvent', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ErrorEvent',
  description: 'Event sent when an error occurs in the Flutter game',
  type: 'object',
  required: ['type', 'code', 'message'],
  properties: {
    type: { type: 'string', const: 'error' },
    code: { type: 'string' },
    message: { type: 'string' },
  },
});

// GameEvent (union)
writeSchema('GameEvent', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'GameEvent',
  description: 'Union of all game events sent from Flutter to React Native',
  oneOf: [
    { $ref: './ReadyEvent.json' },
    { $ref: './StateEvent.json' },
    { $ref: './ResultEvent.json' },
    { $ref: './ErrorEvent.json' },
  ],
  discriminator: { propertyName: 'type' },
});

// GameResult
writeSchema('GameResult', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'GameResult',
  description: 'Complete game result data for server submission and validation',
  type: 'object',
  required: ['score', 'metrics', 'clientHash', 'game_core_version', 'inputs', 'seed', 'team', 'eventId'],
  properties: {
    score: { type: 'integer', minimum: 0 },
    metrics: {
      type: 'object',
      required: ['distance', 'time', 'enemiesDefeated', 'coinsCollected'],
      properties: {
        distance: { type: 'number', minimum: 0 },
        time: { type: 'number', minimum: 0 },
        enemiesDefeated: { type: 'integer', minimum: 0 },
        coinsCollected: { type: 'integer', minimum: 0 },
      },
    },
    clientHash: { type: 'string', pattern: '^[0-9a-fA-F]{64}$', description: 'Must be SHA256 hex string' },
    game_core_version: { type: 'string' },
    inputs: { type: 'string' },
    seed: { type: 'string', pattern: '^[0-9a-fA-F]{16}$', description: 'Seed must be 16-character hex string' },
    team: { type: 'string', minLength: 1 },
    eventId: { type: 'string', minLength: 1 },
  },
});

console.log('\n✓ All JSON Schemas generated successfully!');
console.log(`  Location: ${SCHEMAS_DIR}`);
