/**
 * Global State Store (Zustand)
 * 
 * IMPORTANT: Keep usage minimal (2-3 atoms maximum)
 * Prefer local component state whenever possible
 * 
 * Current atoms:
 * - userSession: User authentication and profile data
 * - gameState: Active game session data
 * - toastNotifications: Global toast messages
 */

import { create } from 'zustand';

// User session state
interface UserSession {
  isAuthenticated: boolean;
  userId?: string;
}

interface UserSessionStore {
  session: UserSession;
  setSession: (session: UserSession) => void;
  clearSession: () => void;
}

export const useUserSession = create<UserSessionStore>((set) => ({
  session: { isAuthenticated: false },
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: { isAuthenticated: false } }),
}));

// Game state
interface GameState {
  activeGame?: string;
  seed?: string;
  team?: string;
}

interface GameStateStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  clearGameState: () => void;
}

export const useGameState = create<GameStateStore>((set) => ({
  gameState: {},
  setGameState: (gameState) => set({ gameState }),
  clearGameState: () => set({ gameState: {} }),
}));

// Toast notifications
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
