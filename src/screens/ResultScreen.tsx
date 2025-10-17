/**
 * Result Screen (03_Sort_Result from Figma)
 * 
 * Displays classification results with Figma design system.
 * Shows "Your Primary Star System" header, radial chart, primary system display,
 * ally chips, "View Why" button, and disclaimer.
 * 
 * Requirements: 1.3, 1.7, 1.10
 * Task: 2.2.3
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {
  StarSystemCrest,
  RadialChart,
  Chip,
  Button,
  type StarSystemName,
} from '@/components';
import {useTheme} from '@/theme';
import {StarfieldBackground} from '@/components/StarfieldBackground';

type Props = ScreenProps<'Result'>;

export function ResultScreen({navigation, route}: Props) {
  const theme = useTheme();
  const {classification, primary, hybrid, percentage, allies, contributorsPerSystem, percentages} = route.params;

  // Determine which system to display crest for
  const displaySystem = (primary || (hybrid && hybrid[0])) as StarSystemName | undefined;
  
  // Get color for the primary/hybrid system
  const systemColor = displaySystem ? getSystemColor(displaySystem) : theme.colors.lavender[500];

  const handleViewWhy = () => {
    navigation.navigate('Why', {
      contributorsPerSystem,
      percentages,
    });
  };

  return (
    <View style={styles.root}>
      <StarfieldBackground />
      <ScrollView 
        contentContainerStyle={[styles.container, {padding: theme.spacing[5]}]}
        showsVerticalScrollIndicator={false}
        testID="result-screen">
        
        {/* Header: "Your Primary Star System" */}
        <View style={[styles.header, {marginBottom: theme.spacing[8]}]}>
          <Text 
            style={[
              styles.title, 
              {
                fontSize: theme.typography.fontSize['3xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }
            ]}
            testID="result-header">
            Your Primary Star System
          </Text>
        </View>

        {/* Radial percentage chart (62% example) */}
        <View style={[styles.chartContainer, {marginBottom: theme.spacing[8]}]}>
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
          <View style={[styles.primarySystemContainer, {marginBottom: theme.spacing[6]}]}>
            <View style={[styles.crestContainer, {marginBottom: theme.spacing[4]}]}>
              <StarSystemCrest
                system={displaySystem}
                size="lg"
                variant="default"
              />
            </View>
            <Text 
              style={[
                styles.systemName,
                {
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }
              ]}
              testID="primary-system-name">
              {classification === 'hybrid' && hybrid
                ? `${hybrid[0]} / ${hybrid[1]}`
                : (primary || 'Unknown')}
            </Text>
            <Text 
              style={[
                styles.systemType,
                {
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.muted,
                  marginTop: theme.spacing[1],
                }
              ]}>
              {classification === 'hybrid' ? 'Hybrid System' : 'Primary System'}
            </Text>
          </View>
        )}

        {/* Ally chips (e.g., Sirius 18%, Lyra 12%, Andromeda 8%) using Figma Chip */}
        {allies.length > 0 && (
          <View style={[styles.alliesSection, {marginBottom: theme.spacing[8]}]}>
            <Text 
              style={[
                styles.alliesTitle,
                {
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing[3],
                }
              ]}>
              Allied Systems
            </Text>
            <View style={styles.chipsContainer}>
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
        <View style={[styles.buttonContainer, {marginBottom: theme.spacing[6]}]}>
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
        <View 
          style={[
            styles.disclaimer,
            {
              backgroundColor: `${theme.colors.gold[400]}1A`, // 10% opacity
              borderColor: `${theme.colors.gold[400]}33`, // 20% opacity
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing[4],
              borderWidth: 1,
            }
          ]}>
          <Text 
            style={[
              styles.disclaimerText,
              {
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.gold[300],
                textAlign: 'center',
                fontStyle: 'italic',
              }
            ]}
            testID="disclaimer-text">
            For insight & entertainment. Not medical, financial, or legal advice.
          </Text>
        </View>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0612', // canvas.dark
  },
  container: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  primarySystemContainer: {
    alignItems: 'center',
  },
  crestContainer: {
    alignItems: 'center',
  },
  systemName: {
    textAlign: 'center',
  },
  systemType: {
    textAlign: 'center',
  },
  alliesSection: {
    alignItems: 'center',
  },
  alliesTitle: {
    textAlign: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  disclaimer: {
    alignItems: 'center',
  },
  disclaimerText: {
    lineHeight: 18,
  },
});
