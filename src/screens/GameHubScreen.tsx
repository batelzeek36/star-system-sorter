/**
 * Game Hub Screen
 * Entry point to games and events
 * TODO: Implement in task 8.1
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'GameHub'>;

export function GameHubScreen({navigation}: Props) {
  const handleStartGame = () => {
    // Mock event ID
    navigation.navigate('TeamSelect', {eventId: 'event_001'});
  };

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard', {eventId: 'event_001'});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Game Hub Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Available events and game entry will be implemented in task 8.1
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStartGame}
          accessibilityLabel="Start Game"
          accessibilityRole="button">
          <Text style={styles.buttonText}>Start Game (Mock)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleViewLeaderboard}
          accessibilityLabel="View Leaderboard"
          accessibilityRole="button">
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            View Leaderboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  placeholder: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  secondaryButtonText: {
    color: '#000000',
  },
});
