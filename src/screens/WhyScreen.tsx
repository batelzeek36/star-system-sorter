/**
 * Why Screen
 * 
 * Explains classification reasoning by displaying contributors per system.
 * Shows which Human Design attributes contributed to each star system's score.
 * 
 * Requirements: 1.3
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Why'>;

export function WhyScreen({route}: Props) {
  const {contributorsPerSystem, percentages} = route.params;

  // Sort systems by percentage (highest first)
  const sortedSystems = Object.keys(contributorsPerSystem).sort(
    (a, b) => (percentages[b] || 0) - (percentages[a] || 0)
  );

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Why This Classification?</Text>
        <Text style={styles.subtitle}>
          Your Human Design attributes contributed to these star systems
        </Text>
      </View>

      {/* System Cards */}
      {sortedSystems.map((system) => {
        const contributors = contributorsPerSystem[system] || [];
        const percentage = percentages[system] || 0;

        return (
          <View key={system} style={styles.card}>
            {/* System Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.systemName}>{system}</Text>
              <Text style={styles.percentage}>
                {percentage.toFixed(1)}%
              </Text>
            </View>

            {/* Contributors List */}
            <View style={styles.contributorsList}>
              {contributors.length > 0 ? (
                contributors.map((contributor, index) => (
                  <View key={index} style={styles.contributorItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.contributorText}>
                      {formatContributor(contributor)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noContributors}>
                  No contributing attributes
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For insight & entertainment. Not medical, financial, or legal advice.
        </Text>
      </View>
    </ScrollView>
  );
}

/**
 * Format contributor key into human-readable label
 */
function formatContributor(key: string): string {
  // Handle different contributor key formats
  if (key.startsWith('type_')) {
    return `Type: ${capitalize(key.replace('type_', ''))}`;
  }
  if (key.startsWith('authority_')) {
    return `Authority: ${capitalize(key.replace('authority_', ''))}`;
  }
  if (key.startsWith('profile_')) {
    return `Profile: ${key.replace('profile_', '')}`;
  }
  if (key.startsWith('center_')) {
    return `Center: ${capitalize(key.replace('center_', ''))}`;
  }
  if (key.startsWith('gate_')) {
    return `Gate ${key.replace('gate_', '')}`;
  }
  if (key.startsWith('channel_')) {
    return `Channel ${key.replace('channel_', '')}`;
  }
  
  // Fallback: capitalize and replace underscores
  return capitalize(key.replace(/_/g, ' '));
}

/**
 * Capitalize first letter of string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  systemName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  percentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  contributorsList: {
    gap: 8,
  },
  contributorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginTop: 7,
  },
  contributorText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  noContributors: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
