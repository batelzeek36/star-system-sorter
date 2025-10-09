/**
 * Match Result Screen
 * Display game results and validation
 * TODO: Implement in task 8.5
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'MatchResult'>;

export function MatchResultScreen({navigation, route}: Props) {
  const {score, validated, suspect, metrics} = route.params;

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard', {});
  };

  const handlePlayAgain = () => {
    navigation.navigate('GameHub');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Match Result Screen - Coming Soon</Text>

      <View style={styles.resultCard}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Validated:</Text>
          <Text style={[styles.statusValue, validated && styles.statusSuccess]}>
            {validated ? 'Yes' : 'No'}
          </Text>
        </View>

        {suspect && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>⚠️ Flagged as suspect</Text>
          </View>
        )}

        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>Metrics</Text>
          {Object.entries(metrics).map(([key, value]) => (
            <View key={key} style={styles.metricRow}>
              <Text style={styles.metricLabel}>{key}:</Text>
              <Text style={styles.metricValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleViewLeaderboard}
          accessibilityLabel="View Leaderboard"
          accessibilityRole="button">
          <Text style={styles.buttonText}>View Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handlePlayAgain}
          accessibilityLabel="Play Again"
          accessibilityRole="button">
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Play Again
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
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  statusSuccess: {
    color: '#22c55e',
  },
  warningContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
  },
  metricsContainer: {
    marginTop: 16,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666666',
    textTransform: 'capitalize',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
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
