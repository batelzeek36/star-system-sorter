/**
 * Bridge Fixtures Tests
 * 
 * Tests JSON fixtures for round-trip validation with Zod schemas.
 * Ensures all fixture data is valid and can be serialized/deserialized.
 * 
 * Requirements: 3.5, 2.9
 */

import {
  validateGameCommand,
  validateGameEvent,
  validateGameResult,
  type GameCommand,
  type GameEvent,
  type GameResult,
} from '../src/bridge';

import commandFixtures from '../src/bridge/__fixtures__/commands.json';
import eventFixtures from '../src/bridge/__fixtures__/events.json';
import gameResultFixtures from '../src/bridge/__fixtures__/game-results.json';

describe('Bridge Fixtures - Round-trip Validation', () => {
  describe('Command Fixtures', () => {
    it('validates startCommand fixture', () => {
      const command = validateGameCommand(commandFixtures.startCommand);
      expect(command.type).toBe('start');
      expect(command.seed).toBe('0123456789abcdef');
      expect(command.team).toBe('Manifestor');
      expect(command.eventId).toBe('event-001');
      expect(command.musicEnabled).toBe(true);
    });

    it('validates startCommandWithGhost fixture', () => {
      const command = validateGameCommand(commandFixtures.startCommandWithGhost);
      expect(command.type).toBe('start');
      expect(command.ghostData).toBeDefined();
      expect(command.ghostData?.seed).toBe('fedcba9876543210');
      expect(command.ghostData?.inputs).toBe('R5L3D2U1R10L5');
    });

    it('validates pauseCommand fixture', () => {
      const command = validateGameCommand(commandFixtures.pauseCommand);
      expect(command.type).toBe('pause');
    });

    it('validates resumeCommand fixture', () => {
      const command = validateGameCommand(commandFixtures.resumeCommand);
      expect(command.type).toBe('resume');
    });

    it('validates quitCommand fixture', () => {
      const command = validateGameCommand(commandFixtures.quitCommand);
      expect(command.type).toBe('quit');
    });

    it('validates setMusicCommandEnabled fixture', () => {
      const command = validateGameCommand(commandFixtures.setMusicCommandEnabled);
      expect(command.type).toBe('set-music');
      if (command.type === 'set-music') {
        expect(command.enabled).toBe(true);
      }
    });

    it('validates setMusicCommandDisabled fixture', () => {
      const command = validateGameCommand(commandFixtures.setMusicCommandDisabled);
      expect(command.type).toBe('set-music');
      if (command.type === 'set-music') {
        expect(command.enabled).toBe(false);
      }
    });

    it('round-trips all command fixtures through JSON', () => {
      Object.entries(commandFixtures).forEach(([name, fixture]) => {
        // Parse and validate
        const validated = validateGameCommand(fixture);
        
        // Serialize back to JSON
        const serialized = JSON.stringify(validated);
        const deserialized = JSON.parse(serialized);
        
        // Validate again
        const revalidated = validateGameCommand(deserialized);
        
        // Should be identical
        expect(revalidated).toEqual(validated);
      });
    });
  });

  describe('Event Fixtures', () => {
    it('validates readyEvent fixture', () => {
      const event = validateGameEvent(eventFixtures.readyEvent);
      expect(event.type).toBe('ready');
      if (event.type === 'ready') {
        expect(event.game_core_version).toBe('1.0.0');
      }
    });

    it('validates stateEventPlaying fixture', () => {
      const event = validateGameEvent(eventFixtures.stateEventPlaying);
      expect(event.type).toBe('state');
      if (event.type === 'state') {
        expect(event.state).toBe('playing');
        expect(event.progress).toBe(0.75);
      }
    });

    it('validates stateEventPaused fixture', () => {
      const event = validateGameEvent(eventFixtures.stateEventPaused);
      expect(event.type).toBe('state');
      if (event.type === 'state') {
        expect(event.state).toBe('paused');
      }
    });

    it('validates stateEventLoading fixture', () => {
      const event = validateGameEvent(eventFixtures.stateEventLoading);
      expect(event.type).toBe('state');
      if (event.type === 'state') {
        expect(event.state).toBe('loading');
        expect(event.progress).toBe(0.33);
      }
    });

    it('validates resultEvent fixture', () => {
      const event = validateGameEvent(eventFixtures.resultEvent);
      expect(event.type).toBe('result');
      if (event.type === 'result') {
        expect(event.score).toBe(15420);
        expect(event.metrics.distance).toBe(1250.75);
        expect(event.metrics.time).toBe(125000);
        expect(event.metrics.enemiesDefeated).toBe(42);
        expect(event.metrics.coinsCollected).toBe(87);
        expect(event.clientHash).toMatch(/^[0-9a-fA-F]{64}$/);
        expect(event.game_core_version).toBe('1.0.0');
      }
    });

    it('validates errorEventGameCrash fixture', () => {
      const event = validateGameEvent(eventFixtures.errorEventGameCrash);
      expect(event.type).toBe('error');
      if (event.type === 'error') {
        expect(event.code).toBe('GAME_CRASH');
        expect(event.message).toContain('null pointer');
      }
    });

    it('validates errorEventInvalidSeed fixture', () => {
      const event = validateGameEvent(eventFixtures.errorEventInvalidSeed);
      expect(event.type).toBe('error');
      if (event.type === 'error') {
        expect(event.code).toBe('INVALID_SEED');
        expect(event.message).toContain('Seed format');
      }
    });

    it('round-trips all event fixtures through JSON', () => {
      Object.entries(eventFixtures).forEach(([name, fixture]) => {
        // Parse and validate
        const validated = validateGameEvent(fixture);
        
        // Serialize back to JSON
        const serialized = JSON.stringify(validated);
        const deserialized = JSON.parse(serialized);
        
        // Validate again
        const revalidated = validateGameEvent(deserialized);
        
        // Should be identical
        expect(revalidated).toEqual(validated);
      });
    });
  });

  describe('GameResult Fixtures', () => {
    it('validates gameResultHighScore fixture', () => {
      const result = validateGameResult(gameResultFixtures.gameResultHighScore);
      expect(result.score).toBe(25680);
      expect(result.metrics.distance).toBe(2150.5);
      expect(result.metrics.time).toBe(180000);
      expect(result.metrics.enemiesDefeated).toBe(68);
      expect(result.metrics.coinsCollected).toBe(142);
      expect(result.clientHash).toMatch(/^[0-9a-fA-F]{64}$/);
      expect(result.game_core_version).toBe('1.0.0');
      expect(result.seed).toMatch(/^[0-9a-fA-F]{16}$/);
      expect(result.team).toBe('Manifestor');
      expect(result.eventId).toBe('event-001');
    });

    it('validates gameResultLowScore fixture', () => {
      const result = validateGameResult(gameResultFixtures.gameResultLowScore);
      expect(result.score).toBe(500);
      expect(result.metrics.distance).toBe(125.25);
      expect(result.team).toBe('Generator');
      expect(result.eventId).toBe('event-002');
    });

    it('validates gameResultPerfectRun fixture', () => {
      const result = validateGameResult(gameResultFixtures.gameResultPerfectRun);
      expect(result.score).toBe(50000);
      expect(result.metrics.distance).toBe(5000.0);
      expect(result.metrics.enemiesDefeated).toBe(150);
      expect(result.metrics.coinsCollected).toBe(300);
      expect(result.game_core_version).toBe('1.0.1');
      expect(result.team).toBe('Projector');
    });

    it('round-trips all game result fixtures through JSON', () => {
      Object.entries(gameResultFixtures).forEach(([name, fixture]) => {
        // Parse and validate
        const validated = validateGameResult(fixture);
        
        // Serialize back to JSON
        const serialized = JSON.stringify(validated);
        const deserialized = JSON.parse(serialized);
        
        // Validate again
        const revalidated = validateGameResult(deserialized);
        
        // Should be identical
        expect(revalidated).toEqual(validated);
      });
    });
  });

  describe('Fixture Integrity', () => {
    it('has all expected command fixtures', () => {
      const expectedCommands = [
        'startCommand',
        'startCommandWithGhost',
        'pauseCommand',
        'resumeCommand',
        'quitCommand',
        'setMusicCommandEnabled',
        'setMusicCommandDisabled',
      ];

      expectedCommands.forEach(name => {
        expect(commandFixtures).toHaveProperty(name);
      });
    });

    it('has all expected event fixtures', () => {
      const expectedEvents = [
        'readyEvent',
        'stateEventPlaying',
        'stateEventPaused',
        'stateEventLoading',
        'resultEvent',
        'errorEventGameCrash',
        'errorEventInvalidSeed',
      ];

      expectedEvents.forEach(name => {
        expect(eventFixtures).toHaveProperty(name);
      });
    });

    it('has all expected game result fixtures', () => {
      const expectedResults = [
        'gameResultHighScore',
        'gameResultLowScore',
        'gameResultPerfectRun',
      ];

      expectedResults.forEach(name => {
        expect(gameResultFixtures).toHaveProperty(name);
      });
    });

    it('all fixtures are valid JSON', () => {
      // If we got here, JSON.parse worked during import
      expect(commandFixtures).toBeDefined();
      expect(eventFixtures).toBeDefined();
      expect(gameResultFixtures).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('command fixtures match GameCommand type', () => {
      Object.values(commandFixtures).forEach(fixture => {
        const validated: GameCommand = validateGameCommand(fixture);
        expect(validated).toBeDefined();
      });
    });

    it('event fixtures match GameEvent type', () => {
      Object.values(eventFixtures).forEach(fixture => {
        const validated: GameEvent = validateGameEvent(fixture);
        expect(validated).toBeDefined();
      });
    });

    it('game result fixtures match GameResult type', () => {
      Object.values(gameResultFixtures).forEach(fixture => {
        const validated: GameResult = validateGameResult(fixture);
        expect(validated).toBeDefined();
      });
    });
  });

  describe('Snapshot Testing', () => {
    it('matches command fixtures snapshot', () => {
      expect(commandFixtures).toMatchSnapshot();
    });

    it('matches event fixtures snapshot', () => {
      expect(eventFixtures).toMatchSnapshot();
    });

    it('matches game result fixtures snapshot', () => {
      expect(gameResultFixtures).toMatchSnapshot();
    });
  });
});
