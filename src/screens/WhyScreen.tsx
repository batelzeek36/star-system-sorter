/**
 * Why Screen
 * Explain classification reasoning
 * TODO: Implement full explanation in task 7.4
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Why'>;

export function WhyScreen({}: Props) {
  // TODO: Use contributorsPerSystem and percentages in task 7.4

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Why Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Detailed explanation of classification reasoning will be implemented in
        task 7.4
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          This screen will display contributors per system and explain why you
          were classified into your star system.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  placeholder: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
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
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});
