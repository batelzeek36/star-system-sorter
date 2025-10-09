/**
 * Match Result Screen
 * Display game results and validation
 * TODO: Implement in task 8.5
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function MatchResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Match Result Screen - Coming Soon</Text>
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
