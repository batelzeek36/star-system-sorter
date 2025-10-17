/**
 * Result Screen (03_Sort_Result from Figma)
 * 
 * Displays classification results with Figma design system.
 * Shows "Your Primary Star System" header, radial chart, primary system display,
 * ally chips, "View Why" button, and disclaimer.
 * 
 * Requirements: 1.3, 1.7, 1.10
 * Task: 2.2.3, 5.1 (NativeWind migration)
 */

import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {
  StarSystemCrest,
  RadialChart,
  Chip,
  type StarSystemName,
} from '@/components';
import {Button, Card} from '@/ui';
import {StarfieldBackground} from '@/components/StarfieldBackground';

type Props = ScreenProps<'Result'>;

export function ResultScreen({navigation, route}: Props) {
  const {classification, primary, hybrid, percentage, allies, contributorsPerSystem, percentages} = route.params;

  // Determine which system to display crest for
  const displaySystem = (primary || (hybrid && hybrid[0])) as StarSystemName | undefined;
  
  // Get color for the primary/hybrid system
  const systemColor = displaySystem ? getSystemColor(displaySystem) : '#a78bfa';

  const handleViewWhy = () => {
    navigation.navigate('Why', {
      contributorsPerSystem,
      percentages,
    });
  };

  return (
    <View className="flex-1 bg-canvas-dark">
      <StarfieldBackground />
      <ScrollView 
        contentContainerStyle={{flexGrow: 1}}
        className="p-6"
        showsVerticalScrollIndicator={false}
        testID="result-screen">
        
        {/* Header: "Your Primary Star System" */}
        <View className="items-center mb-6">
          <Text 
            className="text-3xl font-bold text-text-primary text-center"
            testID="result-header">
            Your Primary Star System
          </Text>
        </View>

        {/* Radial percentage chart (62% example) */}
        <View className="items-center mb-6">
          <RadialChart
            percentage={percentage}
            label={displaySystem || 'System'}
            color={systemColor}
            size={200}
            strokeWidth={16}
          />
        </View>

        {/* Primary star system display with crest */}
        {displaySystem && (
          <View className="items-center mb-6">
            <View className="items-center mb-4">
              <StarSystemCrest
                system={displaySystem}
                size="lg"
                variant="default"
              />
            </View>
            <Text 
              className="text-3xl font-bold text-text-primary text-center"
              testID="primary-system-name">
              {classification === 'hybrid' && hybrid
                ? `${hybrid[0]} / ${hybrid[1]}`
                : (primary || 'Unknown')}
            </Text>
            <Text className="text-sm text-text-muted text-center mt-1">
              {classification === 'hybrid' ? 'Hybrid System' : 'Primary System'}
            </Text>
          </View>
        )}

        {/* Ally chips (e.g., Sirius 18%, Lyra 12%, Andromeda 8%) using Figma Chip */}
        {allies.length > 0 && (
          <View className="items-center mb-6">
            <Text className="text-lg font-semibold text-text-secondary text-center mb-3">
              Allied Systems
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              {allies.map((ally, index) => (
                <Chip
                  key={index}
                  starSystem={ally.system}
                  percentage={Math.round(ally.percentage)}
                  variant={index % 2 === 0 ? 'gold' : 'lavender'}
                  testID={`ally-chip-${index}`}
                />
              ))}
            </View>
          </View>
        )}

        {/* "View Why" button using Figma Button */}
        <View className="w-full mb-6">
          <Button
            variant="primary"
            size="lg"
            onPress={handleViewWhy}
            testID="view-why-button"
            accessibilityLabel="View Why - See detailed explanation">
            View Why
          </Button>
        </View>

        {/* Disclaimer: "For insight & entertainment. Not medical, financial, or legal advice." */}
        <Card variant="warning" className="items-center p-4">
          <Text 
            className="text-xs text-gold-300 text-center italic leading-[18px]"
            testID="disclaimer-text">
            For insight & entertainment. Not medical, financial, or legal advice.
          </Text>
        </Card>
      </ScrollView>
    </View>
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
  return colors[system] || '#a78bfa';
}
