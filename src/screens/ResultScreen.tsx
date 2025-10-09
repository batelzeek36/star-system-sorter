/**
 * Result Screen
 * Display classification results
 * TODO: Implement full result display in task 7.3
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Result'>;

export function ResultScreen({navigation, route}: Props) {
  const {classification, primary, hybrid, percentage, allies} = route.params;

  const handleViewWhy = () => {
    // TODO: Pass actual contributors data in task 7.3
    navigation.navigate('Why', {
      contributorsPerSystem: {},
      percentages: {},
    });
  };

  const handleGoToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Result Screen - Coming Soon</Text>

      <View style={styles.resultCard}>
        <Text style={styles.label}>Classification:</Text>
        <Text style={styles.value}>{classification}</Text>

        {primary && (
          <>
            <Text style={styles.label}>Primary System:</Text>
            <Text style={styles.value}>{primary}</Text>
          </>
        )}

        {hybrid && (
          <>
            <Text style={styles.label}>Hybrid Systems:</Text>
            <Text style={styles.value}>{hybrid.join(' + ')}</Text>
          </>
        )}

        <Text style={styles.label}>Percentage:</Text>
        <Text style={styles.value}>{percentage.toFixed(1)}%</Text>

        {allies.length > 0 && (
          <>
            <Text style={styles.label}>Allies:</Text>
            {allies.map(ally => (
              <Text key={ally.system} style={styles.allyText}>
                {ally.system}: {ally.percentage.toFixed(1)}%
              </Text>
            ))}
          </>
        )}
      </View>

      <Text style={styles.disclaimer}>
        For insight & entertainment. Not medical, financial, or legal advice.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleViewWhy}
          accessibilityLabel="View Why"
          accessibilityRole="button">
          <Text style={styles.buttonText}>View Why</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleGoToProfile}
          accessibilityLabel="Go to Profile"
          accessibilityRole="button">
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Go to Profile
          </Text>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  allyText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
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
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  secondaryButtonText: {
    color: '#000000',
  },
});
