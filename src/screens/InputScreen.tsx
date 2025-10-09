/**
 * Input Screen
 * Birth data entry form
 * TODO: Implement full form in task 7.2
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function InputScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Input Screen - Coming Soon</Text>
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
