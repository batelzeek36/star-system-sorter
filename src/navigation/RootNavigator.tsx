/**
 * Root Navigator
 * Main navigation stack using native-stack for performance
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import {useNavigationGuards} from './guards';

// Import screens (will be created in task 7.x)
// For now, we'll use placeholder screens
import {
  OnboardingScreen,
  InputScreen,
  ResultScreen,
  WhyScreen,
  ProfileScreen,
  SettingsScreen,
  GameHubScreen,
  TeamSelectScreen,
  LobbyScreen,
  SuperDashScreen,
  MatchResultScreen,
  LeaderboardScreen,
} from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Navigator Component
 * Configures all app screens with native-stack for optimal performance
 */
export function RootNavigator() {
  // Apply navigation guards
  useNavigationGuards();

  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: '#ffffff',
        },
      }}>
      {/* Onboarding & Core Flow */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
          title: 'Welcome',
        }}
      />
      <Stack.Screen
        name="Input"
        component={InputScreen}
        options={{
          title: 'Enter Birth Data',
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: 'Your Star System',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Why"
        component={WhyScreen}
        options={{
          title: 'Why This System?',
        }}
      />

      {/* Profile & Settings */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />

      {/* Game Flow */}
      <Stack.Screen
        name="GameHub"
        component={GameHubScreen}
        options={{
          title: 'Game Hub',
        }}
      />
      <Stack.Screen
        name="TeamSelect"
        component={TeamSelectScreen}
        options={{
          title: 'Choose Your Team',
        }}
      />
      <Stack.Screen
        name="Lobby"
        component={LobbyScreen}
        options={{
          title: 'Game Lobby',
        }}
      />
      <Stack.Screen
        name="SuperDash"
        component={SuperDashScreen}
        options={{
          headerShown: false,
          orientation: 'landscape',
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="MatchResult"
        component={MatchResultScreen}
        options={{
          title: 'Match Result',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: 'Leaderboard',
        }}
      />
    </Stack.Navigator>
  );
}
