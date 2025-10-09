/**
 * Team Select Screen
 * Choose star system team
 * TODO: Implement in task 8.2
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'TeamSelect'>;

export function TeamSelectScreen({navigation, route}: Props) {
  const {eventId} = route.params;

  const handleSelectTeam = (teamId: string) => {
    // Generate mock seed
    const seed = Math.random().toString(36).substring(2, 18);
    navigation.navigate('Lobby', {eventId, teamId, seed});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Team Select Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Star system team selection will be implemented in task 8.2
      </Text>

      <View style={styles.teamContainer}>
        <TouchableOpacity
          style={styles.teamButton}
          onPress={() => handleSelectTeam('pleiades')}
          accessibilityLabel="Select Pleiades"
          accessibilityRole="button">
          <Text style={styles.teamButtonText}>Pleiades (Mock)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.teamButton}
          onPress={() => handleSelectTeam('sirius')}
          accessibilityLabel="Select Sirius"
          accessibilityRole="button">
          <Text style={styles.teamButtonText}>Sirius (Mock)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.teamButton}
          onPress={() => handleSelectTeam('arcturus')}
          accessibilityLabel="Select Arcturus"
          accessibilityRole="button">
          <Text style={styles.teamButtonText}>Arcturus (Mock)</Text>
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
  teamContainer: {
    width: '100%',
    gap: 12,
  },
  teamButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  teamButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
