/**
 * Why Screen
 * 
 * Explains classification reasoning by displaying contributors per system.
 * Shows which Human Design attributes contributed to each star system's score.
 * 
 * Requirements: 1.3
 */

import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {AppBar} from '@/components/AppBar';
import {Card} from '@/ui/Card';

type Props = ScreenProps<'Why'>;

export function WhyScreen({route, navigation}: Props) {
  const {contributorsPerSystem, percentages} = route.params;

  // Sort systems by percentage (highest first)
  const sortedSystems = Object.keys(contributorsPerSystem).sort(
    (a, b) => (percentages[b] || 0) - (percentages[a] || 0)
  );

  // Get primary system (highest percentage)
  const primarySystem = sortedSystems[0] || 'Unknown';

  return (
    <View className="flex-1 bg-canvas-dark">
      {/* AppBar Header */}
      <AppBar
        title={`Why ${primarySystem}`}
        showBack
        onBack={() => navigation.goBack()}
        testID="why-screen-app-bar"
      />
      
      <ScrollView 
        className="flex-grow p-5"
        showsVerticalScrollIndicator={false}>
        
        {/* Subtitle */}
        <View className="mb-6">
          <Text className="text-base leading-6 text-text-secondary">
            Your Human Design attributes contributed to these star systems
          </Text>
        </View>

      {/* System Cards */}
      {sortedSystems.map((system, index) => {
        const contributors = contributorsPerSystem[system] || [];
        const percentage = percentages[system] || 0;
        
        // Use emphasis variant for primary system, default for others
        const variant = index === 0 ? 'emphasis' : 'default';

        return (
          <Card 
            key={system} 
            variant={variant}
            className="mb-4"
            testID={`why-card-${system.toLowerCase()}`}
          >
            {/* System Header */}
            <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-borders-muted">
              <Text className="text-xl font-semibold text-text-primary">
                {system}
              </Text>
              <Text className="text-lg font-bold text-lavender-400">
                {percentage.toFixed(1)}%
              </Text>
            </View>

            {/* Contributors List */}
            <View className="gap-2">
              {contributors.length > 0 ? (
                contributors.map((contributor, idx) => (
                  <View key={idx} className="flex-row items-start gap-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-lavender-500 mt-1.5" />
                    <Text className="flex-1 text-sm leading-5 text-text-secondary">
                      {formatContributor(contributor)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm italic text-text-muted">
                  No contributing attributes
                </Text>
              )}
            </View>
          </Card>
        );
      })}

      {/* Footer Note */}
      <View className="mt-6 pt-4 border-t border-borders-muted">
        <Text className="text-xs text-center leading-[18px] text-text-muted">
          For insight & entertainment. Not medical, financial, or legal advice.
        </Text>
      </View>
    </ScrollView>
    </View>
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
