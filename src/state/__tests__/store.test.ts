/**
 * Zustand Store Tests
 * Verify store hooks work correctly without warnings
 */

import { renderHook, act } from '@testing-library/react-native';
import { useUserSession, useGameState, useToast } from '../store';

describe('Zustand Store', () => {
  describe('useUserSession', () => {
    beforeEach(() => {
      // Reset store state before each test
      const { result } = renderHook(() => useUserSession());
      act(() => {
        result.current.clearSession();
      });
    });

    it('should initialize with unauthenticated session', () => {
      const { result } = renderHook(() => useUserSession());
      
      expect(result.current.session.isAuthenticated).toBe(false);
      expect(result.current.session.userId).toBeUndefined();
    });

    it('should set session', () => {
      const { result } = renderHook(() => useUserSession());
      
      act(() => {
        result.current.setSession({ isAuthenticated: true, userId: 'user123' });
      });
      
      expect(result.current.session.isAuthenticated).toBe(true);
      expect(result.current.session.userId).toBe('user123');
    });

    it('should clear session', () => {
      const { result } = renderHook(() => useUserSession());
      
      act(() => {
        result.current.setSession({ isAuthenticated: true, userId: 'user123' });
      });
      
      act(() => {
        result.current.clearSession();
      });
      
      expect(result.current.session.isAuthenticated).toBe(false);
      expect(result.current.session.userId).toBeUndefined();
    });
  });

  describe('useGameState', () => {
    beforeEach(() => {
      // Reset store state before each test
      const { result } = renderHook(() => useGameState());
      act(() => {
        result.current.clearGameState();
      });
    });

    it('should initialize with empty game state', () => {
      const { result } = renderHook(() => useGameState());
      
      expect(result.current.gameState).toEqual({});
    });

    it('should set game state', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameState({
          activeGame: 'super-dash',
          seed: 'abc123',
          team: 'manifestor',
        });
      });
      
      expect(result.current.gameState.activeGame).toBe('super-dash');
      expect(result.current.gameState.seed).toBe('abc123');
      expect(result.current.gameState.team).toBe('manifestor');
    });

    it('should clear game state', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameState({ activeGame: 'super-dash' });
      });
      
      act(() => {
        result.current.clearGameState();
      });
      
      expect(result.current.gameState).toEqual({});
    });
  });

  describe('useToast', () => {
    it('should work with toast operations', () => {
      const { result } = renderHook(() => useToast());
      
      // Clear any existing toasts first
      act(() => {
        result.current.toasts.forEach(toast => {
          result.current.removeToast(toast.id);
        });
      });
      
      // Verify empty
      expect(result.current.toasts).toEqual([]);
      
      // Add first toast
      act(() => {
        result.current.addToast({ message: 'First', type: 'info' });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].id).toBeDefined();
      
      const firstToastId = result.current.toasts[0].id;
      
      // Add second toast
      act(() => {
        result.current.addToast({ message: 'Second', type: 'success' });
      });
      
      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[1].message).toBe('Second');
      
      // Remove first toast
      act(() => {
        result.current.removeToast(firstToastId);
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Second');
      
      // Clean up
      act(() => {
        result.current.toasts.forEach(toast => {
          result.current.removeToast(toast.id);
        });
      });
    });
  });
});
