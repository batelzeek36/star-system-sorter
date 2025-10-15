/**
 * GameBridge Tests
 * 
 * Tests for the GameBridge module wrapper
 */

// Mock React Native modules BEFORE importing GameBridge
const mockAddListener = jest.fn();
const mockRemove = jest.fn();

jest.mock('react-native', () => ({
  NativeModules: {
    GameBridge: {
      open: jest.fn(),
      sendCommand: jest.fn(),
    },
  },
  DeviceEventEmitter: {
    addListener: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

import { NativeModules, DeviceEventEmitter } from 'react-native';
import { GameBridge, GameBridgeError, S3_CMD_CHANNEL, S3_EVT_CHANNEL } from '../src/bridge/GameBridge';
import type { ReadyEvent, StateEvent, ResultEvent, ErrorEvent } from '../src/bridge/types';

describe('GameBridge', () => {
  let eventListeners: Map<string, Function>;

  beforeEach(() => {
    // Reset GameBridge state FIRST
    GameBridge.removeAllListeners();
    GameBridge.cleanup();
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Ensure native module is available with fresh mocks
    (NativeModules as any).GameBridge = {
      open: jest.fn().mockResolvedValue(undefined),
      sendCommand: jest.fn().mockResolvedValue(undefined),
    };
    
    // Setup DeviceEventEmitter mock
    eventListeners = new Map();
    (DeviceEventEmitter.addListener as jest.Mock).mockImplementation(
      (eventName: string, callback: Function) => {
        eventListeners.set(eventName, callback);
        return { remove: mockRemove };
      }
    );
  });

  afterEach(() => {
    GameBridge.cleanup();
  });

  describe('constants', () => {
    it('should export channel constants from §9.4.1', () => {
      expect(S3_CMD_CHANNEL).toBe('s3/game/cmd');
      expect(S3_EVT_CHANNEL).toBe('s3/game/events');
    });
  });

  describe('isAvailable', () => {
    it('should return true when native module is available', () => {
      expect(GameBridge.isAvailable()).toBe(true);
    });
  });

  describe('open', () => {
    it('should call native open method and wait for ready event', async () => {
      const mockOpen = NativeModules.GameBridge.open as jest.Mock;
      mockOpen.mockResolvedValue(undefined);

      // Emit ready event after a short delay
      setTimeout(() => {
        const listener = eventListeners.get(S3_EVT_CHANNEL);
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

    it('should throw GameBridgeError with READY_TIMEOUT if ready event not received', async () => {
      const mockOpen = NativeModules.GameBridge.open as jest.Mock;
      mockOpen.mockResolvedValue(undefined);

      // Don't emit ready event - should timeout after 5000ms
      const openPromise = GameBridge.open();
      
      await expect(openPromise).rejects.toThrow(GameBridgeError);
      await expect(openPromise).rejects.toMatchObject({
        code: 'READY_TIMEOUT',
        recoverable: true,
      });
    }, 7000);

    it('should throw GameBridgeError with MODULE_NOT_AVAILABLE if native module missing', async () => {
      // Temporarily remove native module
      const originalModule = NativeModules.GameBridge;
      (NativeModules as any).GameBridge = undefined;

      const openPromise = GameBridge.open();
      
      await expect(openPromise).rejects.toThrow(GameBridgeError);
      await expect(openPromise).rejects.toMatchObject({
        code: 'MODULE_NOT_AVAILABLE',
        recoverable: false,
      });

      // Restore native module
      (NativeModules as any).GameBridge = originalModule;
    });
  });

  describe('sendCommand', () => {
    it('should validate and send start command', async () => {
      await GameBridge.start({
        seed: '0123456789abcdef',
        team: 'solar',
        eventId: 'event-1',
        musicEnabled: true,
      });

      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
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
      await GameBridge.pause();

      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'pause' })
      );
    });

    it('should send resume command', async () => {
      await GameBridge.resume();

      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'resume' })
      );
    });

    it('should send quit command', async () => {
      await GameBridge.quit();

      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'quit' })
      );
    });

    it('should send set-music command', async () => {
      await GameBridge.setMusic(false);

      const mockSendCommand = NativeModules.GameBridge.sendCommand as jest.Mock;
      expect(mockSendCommand).toHaveBeenCalledWith(
        JSON.stringify({ type: 'set-music', enabled: false })
      );
    });

    it('should throw GameBridgeError for invalid command', async () => {
      await expect(
        GameBridge.sendCommand({ type: 'invalid' } as any)
      ).rejects.toThrow(GameBridgeError);
      await expect(
        GameBridge.sendCommand({ type: 'invalid' } as any)
      ).rejects.toMatchObject({
        code: 'INVALID_COMMAND',
      });
    });

    it('should handle errors gracefully when sending commands', async () => {
      // Create a new mock that rejects
      (NativeModules as any).GameBridge = {
        open: jest.fn().mockResolvedValue(undefined),
        sendCommand: jest.fn().mockRejectedValue(new Error('Native error')),
      };

      await expect(GameBridge.pause()).rejects.toThrow(GameBridgeError);
      
      // Try again to check the error details
      try {
        await GameBridge.pause();
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(GameBridgeError);
        expect((err as GameBridgeError).code).toBe('SEND_FAILED');
        expect((err as GameBridgeError).recoverable).toBe(true);
      }
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
      eventListener?.(invalidEvent);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should emit error event for invalid events', () => {
      const errorListener = jest.fn();
      GameBridge.on('error', errorListener);

      const invalidEvent = {
        type: 'ready',
        // missing game_core_version
      };

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
      eventListener?.(invalidEvent);

      expect(errorListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          code: 'INVALID_EVENT',
        })
      );
    });

    it('should handle errors in event listeners gracefully', () => {
      const throwingListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();

      GameBridge.on('ready', throwingListener);
      GameBridge.on('ready', normalListener);

      const readyEvent: ReadyEvent = {
        type: 'ready',
        game_core_version: '1.0.0',
      };

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
      
      // Should not throw
      expect(() => eventListener?.(readyEvent)).not.toThrow();
      
      // Both listeners should be called
      expect(throwingListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalled();
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

      const eventListener = eventListeners.get(S3_EVT_CHANNEL);
      eventListener?.(readyEvent);

      expect(listener).not.toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
    });

    it('should clear ready promise timeout on cleanup', async () => {
      const mockOpen = NativeModules.GameBridge.open as jest.Mock;
      mockOpen.mockResolvedValue(undefined);

      // Start open but don't emit ready
      const openPromise = GameBridge.open();

      // Cleanup should clear the timeout
      GameBridge.cleanup();

      // The promise should still reject but cleanup should have cleared timeout
      await expect(openPromise).rejects.toThrow();
    }, 6000);
  });
});
