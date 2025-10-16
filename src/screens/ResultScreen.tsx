/**
 * Result Screen
 * 
 * Displays classification results with visual components.
 * Shows star system crest, radial chart, score display, and action buttons.
 * 
 * Requirements: 1.3, 1.7, 1.10
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {
  StarSystemCrest,
  RadialChart,
  ScoreDisplay,
  type StarSystemName,
} from '@/components';

type Props = ScreenProps<'Result'>;

export function ResultScreen({navigation, route}: Props) {
  const {classification, primary, hybrid, percentage, allies, contributorsPerSystem, percentages} = route.params;

  // Determine which system to display crest for
  const displaySystem = (primary || (hybrid && hybrid[0])) as StarSystemName | undefined;
  
  // Get color for the primary/hybrid system
  const systemColor = displaySystem ? getSystemColor(displaySystem) : '#4F46E5';

  const handleViewWhy = () => {
    navigation.navigate('Why', {
      contributorsPerSystem,
      percentages,
    });
  };

  const handleGenerateNarrative = () => {
    // TODO: Implement narrative generation in future task
    // For now, navigate to Profile as placeholder
    navigation.navigate('Profile');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Classification</Text>
      </View>

      {/* Star System Crest */}
      {displaySystem && (
        <View style={styles.crestContainer}>
          <StarSystemCrest
            system={displaySystem}
            size="lg"
            variant="default"
          />
        </View>
      )}

      {/* Radial Chart */}
      <View style={styles.chartContainer}>
        <RadialChart
          percentage={percentage}
          label={displaySystem || 'System'}
          color={systemColor}
          size={160}
          strokeWidth={12}
        />
      </View>

      {/* Score Display Card */}
      <View style={styles.scoreContainer}>
        <ScoreDisplay
          classification={classification}
          primary={primary}
          hybrid={hybrid}
          percentage={percentage}
          allies={allies}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewWhy}
          accessibilityLabel="View Why - See detailed explanation"
          accessibilityRole="button"
          accessibilityHint="Opens explanation of your classification">
          <Text style={styles.primaryButtonText}>View Why</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGenerateNarrative}
          accessibilityLabel="Generate Narrative"
          accessibilityRole="button"
          accessibilityHint="Creates a personalized narrative">
          <Text style={styles.secondaryButtonText}>Generate Narrative</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * Get color for a star system
 */
function getSystemColor(system: StarSystemName): string {
  const colors: Record<StarSystemName, string> = {
    Pleiades: '#4A90E2',
    Sirius: '#50E3C2',
    Arcturus: '#F5A623',
    Andromeda: '#BD10E0',
    Orion: '#D0021B',
  };
  return colors[system] || '#4F46E5';
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  crestContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 44,
    shadowColor: '#4F46E5',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 44,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
