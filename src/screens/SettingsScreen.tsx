/**
 * Settings Screen
 * App preferences and configuration
 * TODO: Implement in task 7.5
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Settings'>;

export function SettingsScreen({}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Settings Screen - Coming Soon</Text>
      <Text style={styles.description}>
        App preferences and configuration will be implemented in task 7.5
      </Text>
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
  },
});
