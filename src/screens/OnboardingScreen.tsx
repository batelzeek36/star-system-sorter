/**
 * Onboarding Screen
 * App introduction and welcome flow
 * TODO: Implement full onboarding in task 7.1
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Star System Sorter</Text>
      <Text style={styles.subtitle}>S³</Text>
      <Text style={styles.placeholder}>Onboarding Screen - Coming Soon</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666666',
  },
  placeholder: {
    fontSize: 16,
    color: '#888888',
  },
});
