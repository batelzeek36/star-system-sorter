/**
 * Input Screen
 * Birth data entry form
 * TODO: Implement full form in task 7.2
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Input'>;

export function InputScreen({navigation}: Props) {
  // Mock navigation to Result screen
  const handleSubmit = () => {
    // TODO: Replace with actual classification logic in task 7.2
    navigation.navigate('Result', {
      classification: 'primary',
      primary: 'Pleiades',
      percentage: 67.5,
      allies: [
        {system: 'Sirius', percentage: 18.2},
        {system: 'Arcturus', percentage: 14.3},
      ],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Input Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Form for birth date, time, and location will be implemented in task 7.2
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        accessibilityLabel="Submit (Mock)"
        accessibilityRole="button">
        <Text style={styles.buttonText}>Submit (Mock)</Text>
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
