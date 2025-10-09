// @exception(max-lines) why: Component includes comprehensive styling (100+ LOC of StyleSheet) and complete UI layout with multiple sections
/**
 * ScoreDisplay Component
 * 
 * Displays star system classification results with primary system,
 * percentage, allies, and disclaimer text.
 * 
 * Requirements: 1.7, 1.10
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {StarSystemCrest, StarSystemName} from './StarSystemCrest';

export interface ScoreDisplayProps {
  /** Primary star system (optional for hybrid classifications) */
  primary?: string;
  /** Primary system percentage */
  percentage: number;
  /** Allied systems with percentages */
  allies: Array<{system: string; percentage: number}>;
  /** Optional hybrid systems */
  hybrid?: [string, string];
  /** Classification type */
  classification: 'primary' | 'hybrid' | 'unresolved';
}

/**
 * ScoreDisplay
 * 
 * Shows classification result with crest, percentage, allies, and disclaimer.
 * Uses Card-like styling and Badge-like components for allies.
 */
export function ScoreDisplay({
  primary,
  percentage,
  allies,
  hybrid,
  classification,
}: ScoreDisplayProps) {
  const displaySystem = classification === 'hybrid' && hybrid ? hybrid[0] : (primary || 'Unknown');
  
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.crestContainer}>
          <StarSystemCrest
            system={displaySystem as StarSystemName}
            size="lg"
            variant="default"
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {classification === 'hybrid' && hybrid
              ? `${hybrid[0]} / ${hybrid[1]}`
              : (primary || 'Unknown')}
          </Text>
          <Text style={styles.subtitle}>
            {classification === 'hybrid' ? 'Hybrid System' : 'Primary System'}
          </Text>
        </View>
      </View>

      {/* Percentage */}
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageValue}>{percentage.toFixed(1)}%</Text>
        <Text style={styles.percentageLabel}>Alignment</Text>
      </View>

      {/* Allies */}
      {allies.length > 0 && (
        <View style={styles.alliesSection}>
          <Text style={styles.alliesTitle}>Allied Systems</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alliesContainer}>
            {allies.map((ally, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>
                  {ally.system} {ally.percentage.toFixed(1)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          For insight & entertainment. Not medical, financial, or legal advice.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  crestContainer: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  percentageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  percentageValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  percentageLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  alliesSection: {
    marginBottom: 20,
  },
  alliesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  alliesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
