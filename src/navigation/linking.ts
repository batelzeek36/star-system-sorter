/**
 * Deep Linking Configuration
 * Defines URL patterns for deep linking support
 */

import type {LinkingOptions} from '@react-navigation/native';
import type {RootStackParamList} from './types';

/**
 * Deep linking configuration
 * Enables navigation via URLs (e.g., s3://result, s3://game/lobby)
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['s3://', 'starsystemsorter://'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Input: 'input',
      Result: 'result',
      Why: 'why',
      Profile: 'profile',
      Settings: 'settings',
      GameHub: 'game',
      TeamSelect: 'game/team-select',
      Lobby: 'game/lobby',
      SuperDash: 'game/play',
      MatchResult: 'game/result',
      Leaderboard: 'leaderboard',
    },
  },
};
