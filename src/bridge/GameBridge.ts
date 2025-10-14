/**
 * GameBridge Module Wrapper
 * 
 * Wraps NativeModules.GameBridge and provides typed API for React Native ↔ Flutter communication.
 * Handles timeout logic, event listening, and command validation.
 * 
 * Requirements: 3.3, 3.4, 3.10, 3.11
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
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
// Constants
// ============================================================================

const READY_TIMEOUT_MS = 5000;
const EVENT_CHANNEL_NAME = 's3/game/events';

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
// GameBridge Class
// ============================================================================

class GameBridgeWrapper {
  private eventEmitter: NativeEventEmitter | null = null;
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
   * Initializes the event emitter and listener
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (!NativeGameBridge) {
      console.warn('GameBridge native module not available');
      return;
    }

    // Initialize event emitter
    this.eventEmitter = new NativeEventEmitter(NativeModules.GameBridge);
    this.setupEventListener();
    this.isInitialized = true;
  }

  /**
   * Sets up the native event listener
   */
  private setupEventListener(): void {
    if (!this.eventEmitter) return;

    this.eventEmitter.addListener(EVENT_CHANNEL_NAME, (rawEvent: unknown) => {
      this.handleEvent(rawEvent);
    });
  }

  /**
   * Handles incoming events from Flutter
   */
  private handleEvent(rawEvent: unknown): void {
    // Validate event
    const validation = safeValidateGameEvent(rawEvent);
    
    if (!validation.success) {
      console.error('Invalid game event received:', validation.error);
      return;
    }

    const event = validation.data;

    // Dispatch to type-specific listeners
    switch (event.type) {
      case 'ready':
        this.listeners.ready.forEach(listener => listener(event));
        if (this.readyResolve) {
          this.readyResolve(event);
          this.readyResolve = null;
          this.readyReject = null;
        }
        break;
      case 'state':
        this.listeners.state.forEach(listener => listener(event));
        break;
      case 'result':
        this.listeners.result.forEach(listener => listener(event));
        break;
      case 'error':
        this.listeners.error.forEach(listener => listener(event));
        break;
    }

    // Dispatch to all-event listeners
    this.listeners.all.forEach(listener => listener(event));
  }

  /**
   * Opens the Flutter game view and waits for ready event
   * @throws {Error} If native module is not available or ready timeout occurs
   */
  async open(): Promise<ReadyEvent> {
    // Ensure initialized
    this.initialize();

    if (!NativeGameBridge) {
      throw new Error('GameBridge native module not available');
    }

    // Create ready promise if not already waiting
    if (!this.readyPromise) {
      this.readyPromise = new Promise<ReadyEvent>((resolve, reject) => {
        this.readyResolve = resolve;
        this.readyReject = reject;

        // Set timeout for ready event
        setTimeout(() => {
          if (this.readyReject) {
            this.readyReject(new Error('Flutter game ready timeout'));
            this.readyResolve = null;
            this.readyReject = null;
            this.readyPromise = null;
          }
        }, READY_TIMEOUT_MS);
      });
    }

    // Open Flutter view
    await NativeGameBridge.open();

    // Wait for ready event
    return this.readyPromise;
  }

  /**
   * Sends a command to the Flutter game
   * @throws {Error} If native module is not available or command is invalid
   */
  async sendCommand(command: GameCommand): Promise<void> {
    if (!NativeGameBridge) {
      throw new Error('GameBridge native module not available');
    }

    // Validate command
    const validatedCommand = validateGameCommand(command);

    // Serialize and send
    const commandJson = JSON.stringify(validatedCommand);
    await NativeGameBridge.sendCommand(commandJson);
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
   * Cleans up resources
   */
  cleanup(): void {
    this.removeAllListeners();
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners(EVENT_CHANNEL_NAME);
    }
    this.readyPromise = null;
    this.readyResolve = null;
    this.readyReject = null;
    this.isInitialized = false;
    this.eventEmitter = null;
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
