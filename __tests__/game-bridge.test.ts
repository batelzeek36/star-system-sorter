/**
 * GameBridge Tests
 * 
 * Tests for the GameBridge module wrapper
 */

// Mock React Native modules BEFORE importing GameBridge
const mockAddListener = jest.fn();
const mockRemoveAllListeners = jest.fn();

jest.mock('react-native', () => ({
  NativeModules: {
    GameBridge: {
      open: jest.fn(),
      sendCommand: jest.fn(),
    },
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: mockAddListener,
    removeAllListeners: mockRemoveAllListeners,
  })),
  Platform: {
    OS: 'ios',
  },
}));

import { NativeModules, NativeEventEmitter } from 'react-native';
import { GameBridge } from '../src/bridge/GameBridge';
import type { ReadyEvent, StateEvent, ResultEvent, ErrorEvent } from '../src/bridge/types';

describe('GameBridge', () => {
  let eventListeners: Map<string, Function>;

  beforeEach(() => {
    // Setup event emitter mock BEFORE clearing mocks
    eventListeners = new Map();
    mockAddListener.mockImplementation((eventName: string, callback: Function) => {
      eventListeners.set(eventName, callback);
      return { remove: jest.fn() };
    });
    
    // Reset GameBridge state
    GameBridge.removeAllListeners();
    GameBridge.cleanup();
  });

  afterEach(() => {
    GameBridge.cleanup();
  });

  describe('isAvailable', () => {
    it('should return true when native module is available', () => {
      expect(GameBridge.isAvailable()).toBe(true);
    });
  });

  describe('open', () => {
    it('should call native open method', async () => {
      const mockOpen = NativeModules.GameBridge.open as jest.Mock;
      mockOpen.mockResolvedValue(undefined);

      // Emit ready event after a short delay
      setTimeout(() => {
        const listener = eventListeners.get('s3/game/events');
        if (listener) {
          listener({
            type: 'ready',
            game_core_version: '1.0.0',
          });
        }
      }, 100);

      const readyEvent = await GameBridge.open();

      expect(mockOpen).toHaveBeenCalled();
      expect(readyEvent.type).toBe('ready');
      expect(readyEvent.game_core_version).toBe('1.0.0');
    });

    it('should timeout if ready event not received within 5000ms', async () => {
      const mockOpen = NativeModules.GameBridge.open as jest.Mock;
      mockOpen.mockResolvedValue(undefined);

      // Don't emit ready event
      await expect(GameBridge.open()).rejects.toThrow('Flutter game ready timeout');
    }, 6000);
  });

  describe('sendCommand', () => {
    it('should validate and send start command', async () => {
      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      mockSendCommand.mockResolvedValue(undefined);

      await GameBridge.start({
        seed: '0123456789abcdef',
        team: 'solar',
        eventId: 'event-1',
        musicEnabled: true,
      });

      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'start',
          seed: '0123456789abcdef',
          team: 'solar',
          eventId: 'event-1',
          musicEnabled: true,
        })
      );
    });

    it('should send pause command', async () => {
      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      mockSendCommand.mockResolvedValue(undefined);

      await GameBridge.pause();

      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'pause' })
      );
    });

    it('should send resume command', async () => {
      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      mockSendCommand.mockResolvedValue(undefined);

      await GameBridge.resume();

      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'resume' })
      );
    });

    it('should send quit command', async () => {
      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      mockSendCommand.mockResolvedValue(undefined);

      await GameBridge.quit();

      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'quit' })
      );
    });

    it('should send set-music command', async () => {
      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      mockSendCommand.mockResolvedValue(undefined);

      await GameBridge.setMusic(false);

      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'set-music', enabled: false })
      );
    });

    it('should throw error for invalid command', async () => {
      await expect(
        GameBridge.sendCommand({ type: 'invalid' } as any)
      ).rejects.toThrow();
    });
  });

  describe('event listeners', () => {
    it('should call ready event listeners', () => {
      const listener = jest.fn();
      GameBridge.on('ready', listener);

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(readyEvent);

      expect(listener).toHaveBeenCalledWith(readyEvent);
    });

    it('should call state event listeners', () => {
      const listener = jest.fn();
      GameBridge.on('state', listener);

      const stateEvent: StateEvent = {
        type: 'state',
        state: 'playing',
        progress: 0.5,
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(stateEvent);

      expect(listener).toHaveBeenCalledWith(stateEvent);
    });

    it('should call result event listeners', () => {
      const listener = jest.fn();
      GameBridge.on('result', listener);

      const resultEvent: ResultEvent = {
        type: 'result',
        score: 1000,
        metrics: {
          distance: 500,
          time: 60000,
          enemiesDefeated: 10,
          coinsCollected: 50,
        },
        clientHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        game_core_version: '1.0.0',
        inputs: 'compressed-input-data',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(resultEvent);

      expect(listener).toHaveBeenCalledWith(resultEvent);
    });

    it('should call error event listeners', () => {
      const listener = jest.fn();
      GameBridge.on('error', listener);

      const errorEvent: ErrorEvent = {
        type: 'error',
        code: 'GAME_ERROR',
        message: 'Something went wrong',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(errorEvent);

      expect(listener).toHaveBeenCalledWith(errorEvent);
    });

    it('should call all-event listeners', () => {
      const listener = jest.fn();
      GameBridge.onAny(listener);

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(readyEvent);

      expect(listener).toHaveBeenCalledWith(readyEvent);
    });

    it('should unsubscribe listeners', () => {
      const listener = jest.fn();
      const unsubscribe = GameBridge.on('ready', listener);

      unsubscribe();

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(readyEvent);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove specific listener with off', () => {
      const listener = jest.fn();
      GameBridge.on('ready', listener);
      GameBridge.off('ready', listener);

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(readyEvent);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove all listeners for specific event type', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      GameBridge.on('ready', listener1);
      GameBridge.on('ready', listener2);

      GameBridge.removeAllListeners('ready');

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(readyEvent);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should not call listeners for invalid events', () => {
      const listener = jest.fn();
      GameBridge.on('ready', listener);

      const invalidEvent = {
        type: 'ready',
        // missing game_core_version
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(invalidEvent);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should remove all listeners and reset state', () => {
      const listener = jest.fn();
      GameBridge.on('ready', listener);

      GameBridge.cleanup();

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get('s3/game/events');
      eventListener?.(readyEvent);

      expect(listener).not.toHaveBeenCalled();
      expect(mockRemoveAllListeners).toHaveBeenCalledWith('s3/game/events');
    });
  });
});
