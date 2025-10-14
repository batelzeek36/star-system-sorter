# Bridge Fixtures

This directory contains JSON fixtures for all bridge types. These fixtures serve multiple purposes:

1. **Documentation**: Show real-world examples of each command, event, and result type
2. **Testing**: Provide valid test data for unit and integration tests
3. **Validation**: Ensure round-trip JSON serialization works correctly
4. **Mocking**: Use in tests and development without needing real Flutter integration

## Files

### commands.json

Contains example commands sent from React Native to Flutter:

- `startCommand`: Basic game start with seed and configuration
- `startCommandWithGhost`: Game start with ghost replay data
- `pauseCommand`: Pause the current game
- `resumeCommand`: Resume a paused game
- `quitCommand`: Quit the current game
- `setMusicCommandEnabled`: Enable music
- `setMusicCommandDisabled`: Disable music

### events.json

Contains example events sent from Flutter to React Native:

- `readyEvent`: Flutter engine initialized and ready
- `stateEventPlaying`: Game is actively playing
- `stateEventPaused`: Game is paused
- `stateEventLoading`: Game is loading with progress
- `resultEvent`: Game completed with score and metrics
- `errorEventGameCrash`: Game crashed with error details
- `errorEventInvalidSeed`: Validation error occurred

### game-results.json

Contains example game results for API submission:

- `gameResultHighScore`: High-scoring game (25,680 points)
- `gameResultLowScore`: Low-scoring game (500 points)
- `gameResultPerfectRun`: Perfect run (50,000 points)

## Validation

All fixtures are validated in `__tests__/bridge-fixtures.test.ts`:

- ✓ Each fixture validates against its Zod schema
- ✓ Round-trip JSON serialization preserves data
- ✓ Type safety is enforced
- ✓ Snapshots prevent unintended changes

## Usage Examples

### In Tests

```typescript
import commandFixtures from '@/bridge/__fixtures__/commands.json';
import { validateGameCommand } from '@/bridge';

it('handles start command', () => {
  const command = validateGameCommand(commandFixtures.startCommand);
  expect(command.type).toBe('start');
});
```

### For Mocking

```typescript
import eventFixtures from '@/bridge/__fixtures__/events.json';

// Mock Flutter sending a result event
mockEventChannel.emit(eventFixtures.resultEvent);
```

### For Documentation

```typescript
// Example: Starting a game with ghost data
const startWithGhost = {
  type: 'start',
  seed: '0123456789abcdef',
  team: 'Generator',
  eventId: 'event-002',
  musicEnabled: false,
  ghostData: {
    seed: 'fedcba9876543210',
    inputs: 'R5L3D2U1R10L5'
  }
};
```

## Maintenance

When adding new command/event types:

1. Add example fixture to appropriate JSON file
2. Add validation test in `bridge-fixtures.test.ts`
3. Update this README with the new fixture
4. Run tests to ensure round-trip validation passes

## Format Notes

- **Seeds**: 16-character hex strings (64-bit)
- **Client Hashes**: 64-character hex strings (SHA256)
- **Inputs**: RLE/delta compressed input timeline (format TBD)
- **Timestamps**: Milliseconds since game start
- **Progress**: 0-1 float for loading/level progress
