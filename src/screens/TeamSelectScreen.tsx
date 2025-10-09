/**
 * Team Select Screen
 * Choose star system team
 * TODO: Implement in task 8.2
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function TeamSelectScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Team Select Screen - Coming Soon</Text>
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
