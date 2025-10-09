/**
 * Result Screen
 * Display classification results
 * TODO: Implement full result display in task 7.3
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Result Screen - Coming Soon</Text>
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
  },
});
