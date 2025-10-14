# Bridge Module

This module defines the types and schemas for communication between React Native and Flutter via MethodChannel and EventChannel.

## Overview

The bridge enables bidirectional communication:
- **Commands** (React Native → Flutter): Control game lifecycle
- **Events** (Flutter → React Native): Report game state and results

## Type System

All types are defined using **Zod** as the runtime source of truth. JSON Schemas are generated from Zod for documentation and client usage.

### Commands (React Native → Flutter)

Commands are sent via MethodChannel to control the Flutter game:

- **StartCommand**: Initialize a new game session with seed and configuration
- **PauseCommand**: Pause the current game session
- **ResumeCommand**: Resume a paused game session
- **QuitCommand**: Terminate the current game session
- **SetMusicCommand**: Update music enabled state during gameplay

### Events (Flutter → React Native)

Events are sent via EventChannel to report game state:

- **ReadyEvent**: Sent when Flutter engine is initialized and ready
- **StateEvent**: Periodic updates about game state during gameplay
- **ResultEvent**: Sent when game completes with final score and validation data
- **ErrorEvent**: Sent when an error occurs in the Flutter game

### Game Result

The `GameResult` type represents complete game result data for server submission and validation. It includes:
- Score and metrics (distance, time, enemies defeated, coins collected)
- Client hash (SHA256 of seed + inputs + game_core_version)
- Game core version
- Compressed input timeline
- Seed, team, and event ID

## Usage

### Validating Commands

```typescript
import { validateGameCommand, safeValidateGameCommand } from '@/bridge';

// Throws on validation error
const command = validateGameCommand(data);

// Returns success/error result
const result = safeValidateGameCommand(data);
if (result.success) {
  console.log('Valid command:', result.data);
} else {
  console.error('Validation error:', result.error);
}
```

### Validating Events

```typescript
import { validateGameEvent, safeValidateGameEvent } from '@/bridge';

// Throws on validation error
const event = validateGameEvent(data);

// Returns success/error result
const result = safeValidateGameEvent(data);
if (result.success) {
  console.log('Valid event:', result.data);
} else {
  console.error('Validation error:', result.error);
}
```

### Type Guards

```typescript
import type { GameEvent } from '@/bridge';

function handleEvent(event: GameEvent) {
  switch (event.type) {
    case 'ready':
      console.log('Game ready, version:', event.game_core_version);
      break;
    case 'result':
      console.log('Game complete, score:', event.score);
      break;
    case 'error':
      console.error('Game error:', event.message);
      break;
  }
}
```

## JSON Schemas

JSON Schemas are generated from Zod definitions and stored in the `schemas/` directory. These schemas can be used for:
- API documentation
- Client code generation
- Contract testing
- Validation in other languages (Dart, etc.)

### Generating Schemas

Run the schema generator:

```bash
npm run generate:schemas
```

This will regenerate all JSON Schema files in the `schemas/` directory.

## Requirements

- **3.5**: Bridge contract with typed commands and events
- **2.9**: Client hash computation (SHA256 of seed + inputs + version)

## Fixtures

JSON fixtures are provided for testing and documentation purposes:

- `__fixtures__/commands.json`: Example commands for all command types
- `__fixtures__/events.json`: Example events for all event types
- `__fixtures__/game-results.json`: Example game results with various scores

All fixtures are validated with round-trip tests to ensure they match the Zod schemas.

### Using Fixtures

```typescript
import commandFixtures from '@/bridge/__fixtures__/commands.json';
import eventFixtures from '@/bridge/__fixtures__/events.json';
import gameResultFixtures from '@/bridge/__fixtures__/game-results.json';

// Use in tests
const startCmd = validateGameCommand(commandFixtures.startCommand);

// Use for mocking
mockGameBridge.sendCommand(commandFixtures.pauseCommand);
```

## Files

- `types.ts`: Zod schemas and TypeScript types
- `generate-schemas.ts`: JSON Schema generator script
- `index.ts`: Public API exports
- `__fixtures__/*.json`: JSON fixtures for testing and documentation
- `../../schemas/*.json`: Generated JSON Schemas

## Notes

- Zod v4 is used for runtime validation
- JSON Schemas are manually generated due to compatibility issues with zod-to-json-schema
- All commands and events use discriminated unions with a `type` field
- Seeds must be 16-character hex strings (64-bit)
- Client hashes must be 64-character hex strings (SHA256)
