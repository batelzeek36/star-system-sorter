/**
 * Lobby Screen
 * Pre-game information and setup
 * TODO: Implement in task 8.3
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function LobbyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Lobby Screen - Coming Soon</Text>
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
