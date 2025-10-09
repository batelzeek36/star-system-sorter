/**
 * Why Screen
 * Explain classification reasoning
 * TODO: Implement full explanation in task 7.4
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function WhyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Why Screen - Coming Soon</Text>
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
