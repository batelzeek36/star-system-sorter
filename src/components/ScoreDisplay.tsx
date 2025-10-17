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
import {useTheme} from '../theme';

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
  const theme = useTheme();
  const displaySystem = classification === 'hybrid' && hybrid ? hybrid[0] : (primary || 'Unknown');
  
  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: `${theme.colors.lavender[900]}33`, // 20% opacity
          borderRadius: theme.borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.colors.borders.muted,
          padding: theme.spacing[5],
          ...theme.elevation[2],
        }
      ]}>
      {/* Header */}
      <View style={[styles.header, {marginBottom: theme.spacing[5]}]}>
        <View style={[styles.crestContainer, {marginRight: theme.spacing[4]}]}>
          <StarSystemCrest
            system={displaySystem as StarSystemName}
            size="lg"
            variant="default"
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.title,
              {
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[1],
              }
            ]}>
            {classification === 'hybrid' && hybrid
              ? `${hybrid[0]} / ${hybrid[1]}`
              : (primary || 'Unknown')}
          </Text>
          <Text 
            style={[
              styles.subtitle,
              {
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.muted,
                fontWeight: theme.typography.fontWeight.medium,
              }
            ]}>
            {classification === 'hybrid' ? 'Hybrid System' : 'Primary System'}
          </Text>
        </View>
      </View>

      {/* Percentage */}
      <View 
        style={[
          styles.percentageContainer,
          {
            alignItems: 'center',
            paddingVertical: theme.spacing[5],
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.colors.borders.subtle,
            marginBottom: theme.spacing[5],
          }
        ]}>
        <Text 
          style={[
            styles.percentageValue,
            {
              fontSize: theme.typography.fontSize['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.lavender[400],
              marginBottom: theme.spacing[1],
            }
          ]}>
          {percentage.toFixed(1)}%
        </Text>
        <Text 
          style={[
            styles.percentageLabel,
            {
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.muted,
              fontWeight: theme.typography.fontWeight.semibold,
            }
          ]}>
          Alignment
        </Text>
      </View>

      {/* Allies */}
      {allies.length > 0 && (
        <View style={[styles.alliesSection, {marginBottom: theme.spacing[5]}]}>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alliesContainer}>
            {allies.map((ally, index) => (
              <View 
                key={index} 
                style={[
                  styles.badge,
                  {
                    backgroundColor: `${theme.colors.lavender[500]}33`, // 20% opacity
                    borderRadius: theme.borderRadius.full,
                    paddingHorizontal: theme.spacing[3],
                    paddingVertical: theme.spacing[1],
                    borderWidth: 1,
                    borderColor: `${theme.colors.lavender[400]}4D`, // 30% opacity
                    marginRight: theme.spacing[2],
                  }
                ]}>
                <Text 
                  style={[
                    styles.badgeText,
                    {
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.lavender[300],
                    }
                  ]}>
                  {ally.system} {ally.percentage.toFixed(1)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Disclaimer */}
      <View 
        style={[
          styles.disclaimer,
          {
            backgroundColor: `${theme.colors.gold[400]}1A`, // 10% opacity
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing[3],
            borderWidth: 1,
            borderColor: `${theme.colors.gold[400]}33`, // 20% opacity
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
          ]}>
          For insight & entertainment. Not medical, financial, or legal advice.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Dynamic styles applied inline
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crestContainer: {
    // Dynamic styles applied inline
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    // Dynamic styles applied inline
  },
  subtitle: {
    // Dynamic styles applied inline
  },
  percentageContainer: {
    // Dynamic styles applied inline
  },
  percentageValue: {
    // Dynamic styles applied inline
  },
  percentageLabel: {
    // Dynamic styles applied inline
  },
  alliesSection: {
    // Dynamic styles applied inline
  },
  alliesTitle: {
    // Dynamic styles applied inline
  },
  alliesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    // Dynamic styles applied inline
  },
  badgeText: {
    // Dynamic styles applied inline
  },
  disclaimer: {
    // Dynamic styles applied inline
  },
  disclaimerText: {
    // Dynamic styles applied inline
  },
});
