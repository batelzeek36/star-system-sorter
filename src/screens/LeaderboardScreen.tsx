/**
 * Leaderboard Screen
 * Team rankings and scores
 * TODO: Implement in task 8.6
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Leaderboard'>;

export function LeaderboardScreen({route}: Props) {
  const {eventId} = route.params;

  // Mock leaderboard data
  const mockTeams = [
    {rank: 1, name: 'Pleiades', score: 45230, runs: 127},
    {rank: 2, name: 'Sirius', score: 43890, runs: 115},
    {rank: 3, name: 'Arcturus', score: 41560, runs: 98},
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Leaderboard Screen - Coming Soon</Text>
      <Text style={styles.description}>
        Team rankings and filtering will be implemented in task 8.6
      </Text>

      {eventId && (
        <Text style={styles.eventInfo}>Event: {eventId}</Text>
      )}

      <View style={styles.leaderboardCard}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Rank</Text>
          <Text style={styles.headerText}>Team</Text>
          <Text style={styles.headerText}>Score</Text>
          <Text style={styles.headerText}>Runs</Text>
        </View>

        {mockTeams.map(team => (
          <View key={team.rank} style={styles.teamRow}>
            <Text style={styles.rankText}>{team.rank}</Text>
            <Text style={styles.teamText}>{team.name}</Text>
            <Text style={styles.scoreText}>{team.score.toLocaleString()}</Text>
            <Text style={styles.runsText}>{team.runs}</Text>
          </View>
        ))}
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
    marginBottom: 16,
  },
  eventInfo: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  leaderboardCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: 12,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  rankText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  teamText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  scoreText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  runsText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
