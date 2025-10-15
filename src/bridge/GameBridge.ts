/**
 * GameBridge Module Wrapper
 * 
 * Wraps NativeModules.GameBridge and provides typed API for React Native ↔ Flutter communication.
 * Handles timeout logic, event listening, and command validation.
 * 
 * Requirements: 3.4, 3.10
 */

import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import type {
  GameCommand,
  GameEvent,
  StartCommand,
  PauseCommand,
  ResumeCommand,
  QuitCommand,
  SetMusicCommand,
  ReadyEvent,
  StateEvent,
  ResultEvent,
  ErrorEvent,
} from './types';
import { validateGameCommand, safeValidateGameEvent } from './types';

// ============================================================================
// Native Module Interface
// ============================================================================

interface NativeGameBridge {
  open(): Promise<void>;
  sendCommand(command: string): Promise<void>;
}

const { GameBridge: NativeGameBridge } = NativeModules as {
  GameBridge: NativeGameBridge | undefined;
};

// ============================================================================
// Constants (from §9.4.1)
// ============================================================================

/**
 * Channel constants - must match Flutter bridge schema.dart
 * These are the single source of truth defined in §9.4.1
 */
export const S3_CMD_CHANNEL = 's3/game/cmd';
export const S3_EVT_CHANNEL = 's3/game/events';

const READY_TIMEOUT_MS = 5000;

// ============================================================================
// Event Listener Types
// ============================================================================

type EventListener<T extends GameEvent> = (event: T) => void;

interface EventListeners {
  ready: Set<EventListener<ReadyEvent>>;
  state: Set<EventListener<StateEvent>>;
  result: Set<EventListener<ResultEvent>>;
  error: Set<EventListener<ErrorEvent>>;
  all: Set<EventListener<GameEvent>>;
}

// ============================================================================
// Error Types
// ============================================================================

export class GameBridgeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = false
  ) {
    super(message);
    this.name = 'GameBridgeError';
  }
}

// ============================================================================
// GameBridge Class
// ============================================================================

class GameBridgeWrapper {
  private eventSubscription: any = null;
  private listeners: EventListeners = {
    ready: new Set(),
    state: new Set(),
    result: new Set(),
    error: new Set(),
    all: new Set(),
  };
  private isInitialized = false;
  private readyPromise: Promise<ReadyEvent> | null = null;
  private readyResolve: ((event: ReadyEvent) => void) | null = null;
  private readyReject: ((error: Error) => void) | null = null;

  constructor() {
    // Lazy initialization - don't initialize until first use
  }

  /**
   * Initializes the DeviceEventEmitter listener
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (!NativeGameBridge) {
      console.warn('GameBridge native module not available');
      return;
    }

    // Set up DeviceEventEmitter listener using S3_EVT_CHANNEL constant
    this.setupEventListener();
    this.isInitialized = true;
  }

  /**
   * Sets up the native event listener using DeviceEventEmitter
   */
  private setupEventListener(): void {
    // Use DeviceEventEmitter for cross-platform event handling
    this.eventSubscription = DeviceEventEmitter.addListener(
      S3_EVT_CHANNEL,
      (rawEvent: unknown) => {
        this.handleEvent(rawEvent);
      }
    );
  }

  /**
   * Handles incoming events from Flutter with validation and error handling
   */
  private handleEvent(rawEvent: unknown): void {
    try {
      // Validate event using Zod schema
      const validation = safeValidateGameEvent(rawEvent);
      
      if (!validation.success) {
        console.error('[GameBridge] Invalid game event received:', {
          error: validation.error.message,
          raw: rawEvent,
        });
        
        // Emit error event to listeners for graceful handling
        const errorEvent: ErrorEvent = {
          type: 'error',
          code: 'INVALID_EVENT',
          message: 'Received invalid event from Flutter game',
        };
        this.listeners.error.forEach(listener => listener(errorEvent));
        return;
      }

      const event = validation.data;

      // Log event for debugging
      if (__DEV__) {
        console.log('[GameBridge] Event received:', event.type, event);
      }

      // Dispatch to type-specific listeners
      switch (event.type) {
        case 'ready':
          this.listeners.ready.forEach(listener => {
            try {
              listener(event);
            } catch (err) {
              console.error('[GameBridge] Error in ready listener:', err);
            }
          });
          if (this.readyResolve) {
            this.readyResolve(event);
            this.readyResolve = null;
            this.readyReject = null;
          }
          break;
        case 'state':
          this.listeners.state.forEach(listener => {
            try {
              listener(event);
            } catch (err) {
              console.error('[GameBridge] Error in state listener:', err);
            }
          });
          break;
        case 'result':
          this.listeners.result.forEach(listener => {
            try {
              listener(event);
            } catch (err) {
              console.error('[GameBridge] Error in result listener:', err);
            }
          });
          break;
        case 'error':
          this.listeners.error.forEach(listener => {
            try {
              listener(event);
            } catch (err) {
              console.error('[GameBridge] Error in error listener:', err);
            }
          });
          break;
      }

      // Dispatch to all-event listeners with error handling
      this.listeners.all.forEach(listener => {
        try {
          listener(event);
        } catch (err) {
          console.error('[GameBridge] Error in all-event listener:', err);
        }
      });
    } catch (err) {
      console.error('[GameBridge] Unexpected error handling event:', err);
    }
  }

  /**
   * Opens the Flutter game view and waits for ready event
   * @throws {GameBridgeError} If native module is not available or ready timeout occurs
   */
  async open(): Promise<ReadyEvent> {
    // Ensure initialized
    this.initialize();

    if (!NativeGameBridge) {
      throw new GameBridgeError(
        'GameBridge native module not available. Please ensure Flutter integration is enabled.',
        'MODULE_NOT_AVAILABLE',
        false
      );
    }

    // Create ready promise if not already waiting
    if (!this.readyPromise) {
      let timeoutId: NodeJS.Timeout | null = null;
      
      this.readyPromise = new Promise<ReadyEvent>((resolve, reject) => {
        this.readyResolve = resolve;
        this.readyReject = reject;

        // Set timeout for ready event
        timeoutId = setTimeout(() => {
          if (this.readyReject) {
            this.readyReject(
              new GameBridgeError(
                'Flutter game failed to send ready event within timeout',
                'READY_TIMEOUT',
                true
              )
            );
            this.readyResolve = null;
            this.readyReject = null;
            this.readyPromise = null;
          }
        }, READY_TIMEOUT_MS);
      });
      
      // Store timeout ID for cleanup
      (this.readyPromise as any)._timeoutId = timeoutId;
    }

    try {
      // Open Flutter view
      await NativeGameBridge.open();

      // Wait for ready event
      const readyEvent = await this.readyPromise;
      
      // Clear timeout
      const timeoutId = (this.readyPromise as any)._timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      return readyEvent;
    } catch (err) {
      // Clear timeout on error
      if (this.readyPromise) {
        const timeoutId = (this.readyPromise as any)._timeoutId;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
      
      // Reset ready promise state
      this.readyPromise = null;
      this.readyResolve = null;
      this.readyReject = null;
      
      // Re-throw with better error context
      if (err instanceof GameBridgeError) {
        throw err;
      }
      throw new GameBridgeError(
        `Failed to open Flutter game: ${err instanceof Error ? err.message : String(err)}`,
        'OPEN_FAILED',
        true
      );
    }
  }

  /**
   * Sends a command to the Flutter game with validation
   * @throws {GameBridgeError} If native module is not available or command is invalid
   */
  async sendCommand(command: GameCommand): Promise<void> {
    if (!NativeGameBridge) {
      throw new GameBridgeError(
        'GameBridge native module not available',
        'MODULE_NOT_AVAILABLE',
        false
      );
    }

    try {
      // Validate command using Zod schema
      const validatedCommand = validateGameCommand(command);

      if (__DEV__) {
        console.log('[GameBridge] Sending command:', validatedCommand.type, validatedCommand);
      }

      // Serialize and send
      const commandJson = JSON.stringify(validatedCommand);
      await NativeGameBridge.sendCommand(commandJson);
    } catch (err) {
      // Handle validation errors
      if (err instanceof Error && err.name === 'ZodError') {
        throw new GameBridgeError(
          `Invalid command: ${err.message}`,
          'INVALID_COMMAND',
          false
        );
      }
      
      // Handle native module errors
      throw new GameBridgeError(
        `Failed to send command: ${err instanceof Error ? err.message : String(err)}`,
        'SEND_FAILED',
        true
      );
    }
  }

  /**
   * Sends a start command
   */
  async start(command: Omit<StartCommand, 'type'>): Promise<void> {
    return this.sendCommand({ type: 'start', ...command });
  }

  /**
   * Sends a pause command
   */
  async pause(): Promise<void> {
    return this.sendCommand({ type: 'pause' });
  }

  /**
   * Sends a resume command
   */
  async resume(): Promise<void> {
    return this.sendCommand({ type: 'resume' });
  }

  /**
   * Sends a quit command
   */
  async quit(): Promise<void> {
    return this.sendCommand({ type: 'quit' });
  }

  /**
   * Sends a set-music command
   */
  async setMusic(enabled: boolean): Promise<void> {
    return this.sendCommand({ type: 'set-music', enabled });
  }

  /**
   * Adds an event listener for a specific event type
   */
  on<T extends GameEvent['type']>(
    eventType: T,
    listener: EventListener<Extract<GameEvent, { type: T }>>
  ): () => void {
    // Ensure initialized when adding listeners
    this.initialize();

    const listeners = this.listeners[eventType];
    if (listeners) {
      listeners.add(listener as any);
    }

    // Return unsubscribe function
    return () => {
      if (listeners) {
        listeners.delete(listener as any);
      }
    };
  }

  /**
   * Adds a listener for all events
   */
  onAny(listener: EventListener<GameEvent>): () => void {
    // Ensure initialized when adding listeners
    this.initialize();

    this.listeners.all.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.all.delete(listener);
    };
  }

  /**
   * Removes a specific event listener
   */
  off<T extends GameEvent['type']>(
    eventType: T,
    listener: EventListener<Extract<GameEvent, { type: T }>>
  ): void {
    const listeners = this.listeners[eventType];
    if (listeners) {
      listeners.delete(listener as any);
    }
  }

  /**
   * Removes all listeners for a specific event type or all events
   */
  removeAllListeners(eventType?: GameEvent['type']): void {
    if (eventType) {
      const listeners = this.listeners[eventType];
      if (listeners) {
        listeners.clear();
      }
    } else {
      // Clear all listeners
      Object.values(this.listeners).forEach(set => set.clear());
    }
  }

  /**
   * Checks if the native module is available
   */
  isAvailable(): boolean {
    return !!NativeGameBridge;
  }

  /**
   * Cleans up resources and removes all listeners
   */
  cleanup(): void {
    // Remove all event listeners
    this.removeAllListeners();
    
    // Remove DeviceEventEmitter subscription
    if (this.eventSubscription) {
      this.eventSubscription.remove();
      this.eventSubscription = null;
    }
    
    // Clear ready promise state
    if (this.readyPromise && (this.readyPromise as any)._timeoutId) {
      clearTimeout((this.readyPromise as any)._timeoutId);
    }
    this.readyPromise = null;
    this.readyResolve = null;
    this.readyReject = null;
    
    // Reset initialization state
    this.isInitialized = false;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const GameBridge = new GameBridgeWrapper();

// ============================================================================
// Exports
// ============================================================================

export type { EventListener };
