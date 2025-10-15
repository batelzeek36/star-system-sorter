/**
 * Navigation Types
 * TypeScript definitions for React Navigation
 */

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Root navigation stack parameter list
 * Defines all routes and their params
 */
export type RootStackParamList = {
  Onboarding: undefined;
  Input: undefined;
  Result: {
    classification: 'primary' | 'hybrid' | 'unresolved';
    primary?: string;
    hybrid?: [string, string];
    percentage: number;
    allies: Array<{system: string; percentage: number}>;
    contributorsPerSystem: Record<string, string[]>;
    percentages: Record<string, number>;
  };
  Why: {
    contributorsPerSystem: Record<string, string[]>;
    percentages: Record<string, number>;
  };
  Profile: undefined;
  Settings: undefined;
};

/**
 * Screen props helper type
 * Usage: type Props = ScreenProps<'ScreenName'>
 */
export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Navigation prop helper type
 */
export type NavigationProp = ScreenProps<keyof RootStackParamList>['navigation'];

/**
 * Route prop helper type
 */
export type RouteProp<T extends keyof RootStackParamList> =
  ScreenProps<T>['route'];
