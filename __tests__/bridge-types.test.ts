/**
 * Bridge Types Tests
 * 
 * Tests for bridge type validation and schemas
 * 
 * Requirements: 3.5, 2.9
 */

import {
  validateGameCommand,
  validateGameEvent,
  validateGameResult,
  safeValidateGameCommand,
  safeValidateGameEvent,
  type StartCommand,
  type GameResult,
  type ResultEvent,
} from '../src/bridge';

describe('Bridge Types', () => {
  describe('GameCommand validation', () => {
    it('validates a valid StartCommand', () => {
      const command: StartCommand = {
        type: 'start',
        seed: '0123456789abcdef',
        team: 'Manifestor',
        eventId: 'event-001',
        musicEnabled: true,
      };

      const result = validateGameCommand(command);
      expect(result).toEqual(command);
    });

    it('validates StartCommand with ghost data', () => {
      const command = {
        type: 'start',
        seed: '0123456789abcdef',
        team: 'Generator',
        eventId: 'event-001',
        ghostData: {
          seed: 'fedcba9876543210',
          inputs: 'compressed-input-data',
        },
      };

      const result = validateGameCommand(command);
      expect(result).toMatchObject(command);
    });

    it('validates PauseCommand', () => {
      const command = { type: 'pause' };
      const result = validateGameCommand(command);
      expect(result).toEqual(command);
    });

    it('validates ResumeCommand', () => {
      const command = { type: 'resume' };
      const result = validateGameCommand(command);
      expect(result).toEqual(command);
    });

    it('validates QuitCommand', () => {
      const command = { type: 'quit' };
      const result = validateGameCommand(command);
      expect(result).toEqual(command);
    });

    it('validates SetMusicCommand', () => {
      const command = { type: 'set-music', enabled: false };
      const result = validateGameCommand(command);
      expect(result).toEqual(command);
    });

    it('rejects invalid seed format', () => {
      const command = {
        type: 'start',
        seed: 'invalid-seed',
        team: 'Manifestor',
        eventId: 'event-001',
      };

      expect(() => validateGameCommand(command)).toThrow();
    });

    it('rejects missing required fields', () => {
      const command = {
        type: 'start',
        seed: '0123456789abcdef',
      };

      expect(() => validateGameCommand(command)).toThrow();
    });

    it('returns error for invalid command with safeValidate', () => {
      const command = { type: 'invalid' };
      const result = safeValidateGameCommand(command);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('GameEvent validation', () => {
    it('validates ReadyEvent', () => {
      const event = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const result = validateGameEvent(event);
      expect(result).toEqual(event);
    });

    it('validates StateEvent', () => {
      const event = {
        type: 'state',
        state: 'playing',
        progress: 0.5,
      };

      const result = validateGameEvent(event);
      expect(result).toEqual(event);
    });

    it('validates ResultEvent', () => {
      const event: ResultEvent = {
        type: 'result',
        score: 1000,
        metrics: {
          distance: 500.5,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 25,
        },
        clientHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        game_core_version: '1.0.0',
        inputs: 'compressed-inputs',
      };

      const result = validateGameEvent(event);
      expect(result).toEqual(event);
    });

    it('validates ErrorEvent', () => {
      const event = {
        type: 'error',
        code: 'GAME_CRASH',
        message: 'Game crashed unexpectedly',
      };

      const result = validateGameEvent(event);
      expect(result).toEqual(event);
    });

    it('rejects invalid state value', () => {
      const event = {
        type: 'state',
        state: 'invalid-state',
      };

      expect(() => validateGameEvent(event)).toThrow();
    });

    it('rejects invalid clientHash format', () => {
      const event = {
        type: 'result',
        score: 1000,
        metrics: {
          distance: 500,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 25,
        },
        clientHash: 'invalid-hash',
        game_core_version: '1.0.0',
        inputs: 'compressed-inputs',
      };

      expect(() => validateGameEvent(event)).toThrow();
    });

    it('returns error for invalid event with safeValidate', () => {
      const event = { type: 'unknown' };
      const result = safeValidateGameEvent(event);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('GameResult validation', () => {
    it('validates a complete GameResult', () => {
      const gameResult: GameResult = {
        score: 1500,
        metrics: {
          distance: 750.25,
          time: 90000,
          enemiesDefeated: 15,
          coinsCollected: 40,
        },
        clientHash: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
        game_core_version: '1.0.0',
        inputs: 'compressed-input-timeline',
        seed: 'abcdef0123456789',
        team: 'Projector',
        eventId: 'event-002',
      };

      const result = validateGameResult(gameResult);
      expect(result).toEqual(gameResult);
    });

    it('rejects GameResult with negative score', () => {
      const gameResult = {
        score: -100,
        metrics: {
          distance: 500,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 25,
        },
        clientHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        game_core_version: '1.0.0',
        inputs: 'compressed-inputs',
        seed: '0123456789abcdef',
        team: 'Manifestor',
        eventId: 'event-001',
      };

      expect(() => validateGameResult(gameResult)).toThrow();
    });

    it('rejects GameResult with invalid seed format', () => {
      const gameResult = {
        score: 1000,
        metrics: {
          distance: 500,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 25,
        },
        clientHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        game_core_version: '1.0.0',
        inputs: 'compressed-inputs',
        seed: 'invalid',
        team: 'Manifestor',
        eventId: 'event-001',
      };

      expect(() => validateGameResult(gameResult)).toThrow();
    });

    it('rejects GameResult with missing required fields', () => {
      const gameResult = {
        score: 1000,
        metrics: {
          distance: 500,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 25,
        },
        clientHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        game_core_version: '1.0.0',
        inputs: 'compressed-inputs',
        seed: '0123456789abcdef',
        // Missing team and eventId
      };

      expect(() => validateGameResult(gameResult)).toThrow();
    });
  });

  describe('Type discrimination', () => {
    it('correctly discriminates command types', () => {
      const startCmd = validateGameCommand({
        type: 'start',
        seed: '0123456789abcdef',
        team: 'Manifestor',
        eventId: 'event-001',
      });

      expect(startCmd.type).toBe('start');
      if (startCmd.type === 'start') {
        expect(startCmd.seed).toBe('0123456789abcdef');
      }
    });

    it('correctly discriminates event types', () => {
      const resultEvent = validateGameEvent({
        type: 'result',
        score: 1000,
        metrics: {
          distance: 500,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 25,
        },
        clientHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        game_core_version: '1.0.0',
        inputs: 'compressed-inputs',
      });

      expect(resultEvent.type).toBe('result');
      if (resultEvent.type === 'result') {
        expect(resultEvent.score).toBe(1000);
        expect(resultEvent.clientHash).toBeDefined();
      }
    });
  });
});
