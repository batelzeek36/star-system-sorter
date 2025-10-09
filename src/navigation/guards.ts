/**
 * Navigation Guards
 * Implements route protection and validation logic
 */

import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NavigationProp} from './types';

/**
 * Navigation guard hook
 * Validates navigation state and enforces route rules
 */
export function useNavigationGuards() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Listen for navigation state changes
    const unsubscribe = navigation.addListener('state', e => {
      const state = e.data.state;
      if (!state) return;

      // Get current route
      const currentRoute = state.routes[state.index];
      if (!currentRoute) return;

      // Validate route params based on route name
      validateRouteParams(currentRoute.name, currentRoute.params);
    });

    return unsubscribe;
  }, [navigation]);
}

/**
 * Validates route parameters for specific screens
 * Redirects to safe screen if params are invalid
 */
function validateRouteParams(routeName: string, params: any): boolean {
  switch (routeName) {
    case 'Result':
      // Result screen requires classification data
      if (!params?.classification || !params?.percentage) {
        console.warn('[Navigation] Invalid Result params, missing required data');
        return false;
      }
      break;

    case 'Why':
      // Why screen requires contributors data
      if (!params?.contributorsPerSystem || !params?.percentages) {
        console.warn('[Navigation] Invalid Why params, missing required data');
        return false;
      }
      break;

    case 'TeamSelect':
      // TeamSelect requires eventId
      if (!params?.eventId) {
        console.warn('[Navigation] Invalid TeamSelect params, missing eventId');
        return false;
      }
      break;

    case 'Lobby':
      // Lobby requires eventId, teamId, and seed
      if (!params?.eventId || !params?.teamId || !params?.seed) {
        console.warn('[Navigation] Invalid Lobby params, missing required data');
        return false;
      }
      break;

    case 'SuperDash':
      // SuperDash requires eventId, teamId, and seed
      if (!params?.eventId || !params?.teamId || !params?.seed) {
        console.warn('[Navigation] Invalid SuperDash params, missing required data');
        return false;
      }
      break;

    case 'MatchResult':
      // MatchResult requires score and validation status
      if (
        params?.score === undefined ||
        params?.validated === undefined ||
        !params?.metrics
      ) {
        console.warn('[Navigation] Invalid MatchResult params, missing required data');
        return false;
      }
      break;
  }

  return true;
}

/**
 * Navigation guard for game flow
 * Ensures user has completed required steps before accessing game screens
 */
export function useGameFlowGuard(requiredStep: 'team' | 'lobby' | 'game') {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // This can be extended to check global state for game flow completion
    // For now, it's a placeholder for future implementation
  }, [navigation, requiredStep]);
}
