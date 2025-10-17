/**
 * Chip Component Examples
 * Visual examples demonstrating Chip component usage
 * 
 * This file shows how to use the Chip component for star system ally chips
 * Migrated to NativeWind - uses className utilities
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Chip } from './Chip';

export function ChipExamples() {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [dismissedChips, setDismissedChips] = useState<Set<string>>(new Set());

  const allies = [
    { system: 'Sirius', percentage: 18 },
    { system: 'Lyra', percentage: 12 },
    { system: 'Andromeda', percentage: 8 },
  ];

  return (
    <ScrollView className="flex-1 p-4">
      {/* Basic Chips */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-text-primary">
          Basic Chips
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <Chip starSystem="Orion" percentage={62} variant="gold" />
          <Chip starSystem="Sirius" percentage={18} variant="lavender" />
          <Chip starSystem="Pleiades" percentage={15} variant="gold" />
        </View>
      </View>

      {/* Chips without Percentages */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-text-primary">
          Without Percentages
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <Chip starSystem="Andromeda" variant="lavender" />
          <Chip starSystem="Lyra" variant="gold" />
          <Chip starSystem="Arcturus" variant="lavender" />
        </View>
      </View>

      {/* Selectable Chips */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-text-primary">
          Selectable Chips
        </Text>
        <View className="flex-row flex-wrap gap-2">
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
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-text-primary">
          Dismissible Chips
        </Text>
        <View className="flex-row flex-wrap gap-2">
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
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-text-primary">
          All Star Systems
        </Text>
        <View className="flex-row flex-wrap gap-2">
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
