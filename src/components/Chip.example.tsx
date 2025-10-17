/**
 * Chip Component Examples
 * Visual examples demonstrating Chip component usage
 * 
 * This file shows how to use the Chip component for star system ally chips
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Chip } from './Chip';
import { useTheme } from '../theme';

export function ChipExamples() {
  const theme = useTheme();
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [dismissedChips, setDismissedChips] = useState<Set<string>>(new Set());

  const allies = [
    { system: 'Sirius', percentage: 18 },
    { system: 'Lyra', percentage: 12 },
    { system: 'Andromeda', percentage: 8 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Basic Chips */}
      <View style={[styles.section, { marginBottom: theme.spacing[6] }]}>
        <Text style={[styles.heading, { color: theme.colors.text.primary }]}>
          Basic Chips
        </Text>
        <View style={styles.chipRow}>
          <Chip starSystem="Orion" percentage={62} variant="gold" />
          <Chip starSystem="Sirius" percentage={18} variant="lavender" />
          <Chip starSystem="Pleiades" percentage={15} variant="gold" />
        </View>
      </View>

      {/* Chips without Percentages */}
      <View style={[styles.section, { marginBottom: theme.spacing[6] }]}>
        <Text style={[styles.heading, { color: theme.colors.text.primary }]}>
          Without Percentages
        </Text>
        <View style={styles.chipRow}>
          <Chip starSystem="Andromeda" variant="lavender" />
          <Chip starSystem="Lyra" variant="gold" />
          <Chip starSystem="Arcturus" variant="lavender" />
        </View>
      </View>

      {/* Selectable Chips */}
      <View style={[styles.section, { marginBottom: theme.spacing[6] }]}>
        <Text style={[styles.heading, { color: theme.colors.text.primary }]}>
          Selectable Chips
        </Text>
        <View style={styles.chipRow}>
          {allies.map((ally, index) => (
            <Chip
              key={ally.system}
              starSystem={ally.system}
              percentage={ally.percentage}
              variant={index % 2 === 0 ? 'gold' : 'lavender'}
              selectable={true}
              selected={selectedChip === ally.system}
              onSelect={() => setSelectedChip(ally.system)}
            />
          ))}
        </View>
      </View>

      {/* Dismissible Chips */}
      <View style={[styles.section, { marginBottom: theme.spacing[6] }]}>
        <Text style={[styles.heading, { color: theme.colors.text.primary }]}>
          Dismissible Chips
        </Text>
        <View style={styles.chipRow}>
          {allies
            .filter((ally) => !dismissedChips.has(ally.system))
            .map((ally, index) => (
              <Chip
                key={ally.system}
                starSystem={ally.system}
                percentage={ally.percentage}
                variant={index % 2 === 0 ? 'gold' : 'lavender'}
                dismissible={true}
                onDismiss={() => {
                  setDismissedChips(new Set([...dismissedChips, ally.system]));
                }}
              />
            ))}
        </View>
      </View>

      {/* All Star Systems */}
      <View style={[styles.section, { marginBottom: theme.spacing[6] }]}>
        <Text style={[styles.heading, { color: theme.colors.text.primary }]}>
          All Star Systems
        </Text>
        <View style={styles.chipRow}>
          <Chip starSystem="Orion" percentage={25} variant="gold" />
          <Chip starSystem="Sirius" percentage={20} variant="lavender" />
          <Chip starSystem="Pleiades" percentage={18} variant="gold" />
          <Chip starSystem="Andromeda" percentage={15} variant="lavender" />
          <Chip starSystem="Lyra" percentage={12} variant="gold" />
          <Chip starSystem="Arcturus" percentage={10} variant="lavender" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
