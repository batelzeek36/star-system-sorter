/**
 * Super Dash Screen
 * Flutter game integration
 * TODO: Implement in task 8.4
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, BackHandler} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'SuperDash'>;

export function SuperDashScreen({navigation, route}: Props) {
  const {teamId, seed} = route.params;

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // TODO: Show pause modal on first press, quit on second press
        // For now, just navigate back
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleMockGameComplete = () => {
    // Mock game result
    navigation.navigate('MatchResult', {
      score: 12450,
      validated: true,
      suspect: false,
      metrics: {
        distance: 5420,
        coins: 121,
        jumps: 87,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Super Dash Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Flutter game integration will be implemented in task 8.4
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Team: {teamId}</Text>
        <Text style={styles.infoText}>Seed: {seed.substring(0, 8)}...</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleMockGameComplete}
        accessibilityLabel="Complete Game (Mock)"
        accessibilityRole="button">
        <Text style={styles.buttonText}>Complete Game (Mock)</Text>
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
    backgroundColor: '#000000',
  },
  placeholder: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
