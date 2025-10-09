/**
 * Lobby Screen
 * Pre-game information and setup
 * TODO: Implement in task 8.3
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Lobby'>;

export function LobbyScreen({navigation, route}: Props) {
  const {eventId, teamId, seed} = route.params;

  const handleStartGame = () => {
    navigation.navigate('SuperDash', {eventId, teamId, seed});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Lobby Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Pre-game information and setup will be implemented in task 8.3
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Event ID:</Text>
        <Text style={styles.infoValue}>{eventId}</Text>

        <Text style={styles.infoLabel}>Team:</Text>
        <Text style={styles.infoValue}>{teamId}</Text>

        <Text style={styles.infoLabel}>Seed:</Text>
        <Text style={styles.infoValue}>{seed.substring(0, 8)}...</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartGame}
        accessibilityLabel="Start Game"
        accessibilityRole="button">
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
