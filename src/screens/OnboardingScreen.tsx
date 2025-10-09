/**
 * Onboarding Screen
 * App introduction and welcome flow
 * TODO: Implement full onboarding in task 7.1
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Onboarding'>;

export function OnboardingScreen({navigation}: Props) {
  const handleGetStarted = () => {
    navigation.navigate('Input');
  };

  const handleGoToGameHub = () => {
    navigation.navigate('GameHub');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Star System Sorter</Text>
      <Text style={styles.subtitle}>S³</Text>
      <Text style={styles.placeholder}>Onboarding Screen - Coming Soon</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          accessibilityLabel="Get Started"
          accessibilityRole="button">
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleGoToGameHub}
          accessibilityLabel="Go to Game Hub"
          accessibilityRole="button">
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Game Hub
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
