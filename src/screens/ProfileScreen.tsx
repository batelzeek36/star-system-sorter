/**
 * Profile Screen
 * User profile display
 * TODO: Implement in task 7.5
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Profile'>;

export function ProfileScreen({navigation}: Props) {
  const handleGoToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Profile Screen - Coming Soon</Text>
      <Text style={styles.description}>
        User profile information will be implemented in task 7.5
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGoToSettings}
        accessibilityLabel="Go to Settings"
        accessibilityRole="button">
        <Text style={styles.buttonText}>Settings</Text>
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
    marginBottom: 32,
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
});
