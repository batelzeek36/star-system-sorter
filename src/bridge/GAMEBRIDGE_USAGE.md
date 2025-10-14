# GameBridge Usage Guide

The GameBridge module provides a typed API for communication between React Native and the Flutter game module.

## Basic Usage

### Opening the Game

```typescript
import { GameBridge } from './bridge';

// Open the Flutter game view and wait for ready event
try {
  const readyEvent = await GameBridge.open();
  console.log('Game ready, version:', readyEvent.game_core_version);
} catch (error) {
  console.error('Failed to open game:', error);
  // Handle timeout or native module unavailable
}
```

### Sending Commands

```typescript
// Start a new game
await GameBridge.start({
  seed: '0123456789abcdef',
  team: 'solar',
  eventId: 'event-1',
  musicEnabled: true,
  ghostData: {
    seed: 'teammate-seed',
    inputs: 'compressed-input-data',
  },
});

// Pause the game
await GameBridge.pause();

// Resume the game
await GameBridge.resume();

// Toggle music
await GameBridge.setMusic(false);

// Quit the game
await GameBridge.quit();
```

### Listening to Events

```typescript
// Listen for specific event types
const unsubscribeReady = GameBridge.on('ready', (event) => {
  console.log('Game ready:', event.game_core_version);
});

const unsubscribeState = GameBridge.on('state', (event) => {
  console.log('Game state:', event.state, event.progress);
});

const unsubscribeResult = GameBridge.on('result', (event) => {
  console.log('Game completed:', event.score, event.metrics);
  // Submit result to server
});

const unsubscribeError = GameBridge.on('error', (event) => {
  console.error('Game error:', event.code, event.message);
});

// Listen to all events
const unsubscribeAll = GameBridge.onAny((event) => {
  console.log('Game event:', event.type);
});

// Unsubscribe when done
unsubscribeReady();
unsubscribeState();
unsubscribeResult();
unsubscribeError();
unsubscribeAll();
```

### Cleanup

```typescript
// Clean up all listeners and reset state
GameBridge.cleanup();
```

## Complete Example: Game Flow

```typescript
import { GameBridge } from './bridge';
import type { ResultEvent } from './bridge';

async function playGame(seed: string, team: string, eventId: string) {
  let resultPromise: Promise<ResultEvent>;
  
  // Set up result listener before opening game
  resultPromise = new Promise((resolve) => {
    const unsubscribe = GameBridge.on('result', (event) => {
      unsubscribe();
      resolve(event);
    });
  });

  // Set up error listener
  const unsubscribeError = GameBridge.on('error', (event) => {
    console.error('Game error:', event.code, event.message);
  });

  // Set up state listener for progress updates
  const unsubscribeState = GameBridge.on('state', (event) => {
    if (event.state === 'loading' && event.progress !== undefined) {
      console.log('Loading:', Math.round(event.progress * 100) + '%');
    }
  });

  try {
    // Open game and wait for ready
    const readyEvent = await GameBridge.open();
    console.log('Game ready, version:', readyEvent.game_core_version);

    // Start the game
    await GameBridge.start({
      seed,
      team,
      eventId,
      musicEnabled: true,
    });

    // Wait for game to complete
    const result = await resultPromise;
    
    // Clean up listeners
    unsubscribeError();
    unsubscribeState();

    return result;
  } catch (error) {
    // Clean up on error
    unsubscribeError();
    unsubscribeState();
    throw error;
  }
}

// Usage
playGame('0123456789abcdef', 'solar', 'event-1')
  .then((result) => {
    console.log('Game completed!');
    console.log('Score:', result.score);
    console.log('Metrics:', result.metrics);
    // Submit to server...
  })
  .catch((error) => {
    console.error('Game failed:', error);
  });
```

## Error Handling

### Ready Timeout

The `open()` method will timeout after 5000ms if the ready event is not received:

```typescript
try {
  await GameBridge.open();
} catch (error) {
  if (error.message === 'Flutter game ready timeout') {
    // Handle timeout - Flutter engine may not be initialized
    console.error('Game failed to initialize');
  }
}
```

### Native Module Unavailable

If the native module is not available (e.g., running in a simulator without proper setup):

```typescript
if (!GameBridge.isAvailable()) {
  console.warn('GameBridge not available');
  // Show fallback UI or error message
}
```

### Invalid Commands

Commands are validated before sending. Invalid commands will throw an error:

```typescript
try {
  await GameBridge.start({
    seed: 'invalid', // Must be 16-character hex string
    team: 'solar',
    eventId: 'event-1',
  });
} catch (error) {
  console.error('Invalid command:', error);
}
```

## Event Types

### ReadyEvent
Sent when Flutter engine is initialized and ready to receive commands.

```typescript
{
  type: 'ready',
  game_core_version: string
}
```

### StateEvent
Periodic updates about game state during gameplay.

```typescript
{
  type: 'state',
  state: 'playing' | 'paused' | 'loading',
  progress?: number // 0-1 for loading/level progress
}
```

### ResultEvent
Sent when game completes with final score and validation data.

```typescript
{
  type: 'result',
  score: number,
  metrics: {
    distance: number,
    time: number,
    enemiesDefeated: number,
    coinsCollected: number
  },
  clientHash: string, // SHA256 hex string
  game_core_version: string,
  inputs: string // RLE/delta compressed input timeline
}
```

### ErrorEvent
Sent when an error occurs in the Flutter game.

```typescript
{
  type: 'error',
  code: string,
  message: string
}
```

## Best Practices

1. **Always check availability** before using GameBridge in production
2. **Set up listeners before opening** the game to avoid missing events
3. **Clean up listeners** when components unmount to prevent memory leaks
4. **Handle timeouts gracefully** with user-friendly error messages
5. **Validate commands** are properly formatted before sending
6. **Use TypeScript types** for type safety and autocomplete

## React Component Example

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { GameBridge } from './bridge';
import type { ResultEvent } from './bridge';

export function GameScreen({ seed, team, eventId }) {
  const [gameState, setGameState] = useState<'idle' | 'loading' | 'playing' | 'completed'>('idle');
  const [result, setResult] = useState<ResultEvent | null>(null);

  useEffect(() => {
    // Set up listeners
    const unsubscribeState = GameBridge.on('state', (event) => {
      setGameState(event.state);
    });

    const unsubscribeResult = GameBridge.on('result', (event) => {
      setResult(event);
      setGameState('completed');
    });

    const unsubscribeError = GameBridge.on('error', (event) => {
      console.error('Game error:', event);
      setGameState('idle');
    });

    // Cleanup on unmount
    return () => {
      unsubscribeState();
      unsubscribeResult();
      unsubscribeError();
      GameBridge.cleanup();
    };
  }, []);

  const startGame = async () => {
    try {
      setGameState('loading');
      await GameBridge.open();
      await GameBridge.start({ seed, team, eventId, musicEnabled: true });
      setGameState('playing');
    } catch (error) {
      console.error('Failed to start game:', error);
      setGameState('idle');
    }
  };

  return (
    <View>
      {gameState === 'idle' && (
        <Button title="Start Game" onPress={startGame} />
      )}
      {gameState === 'loading' && <Text>Loading...</Text>}
      {gameState === 'playing' && <Text>Playing...</Text>}
      {gameState === 'completed' && result && (
        <View>
          <Text>Score: {result.score}</Text>
          <Text>Distance: {result.metrics.distance}</Text>
        </View>
      )}
    </View>
  );
}
```
