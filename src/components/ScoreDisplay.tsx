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
import {View, Text, ScrollView} from 'react-native';
import {StarSystemCrest, StarSystemName} from './StarSystemCrest';
import {colors, spacing, borderRadius, typography, elevation} from '../theme/tokens';

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
    <View 
      style={{
        backgroundColor: `${colors.lavender[900]}33`, // 20% opacity
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.borders.muted,
        padding: spacing[5],
        ...elevation[2],
      }}>
      {/* Header */}
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: spacing[5]}}>
        <View style={{marginRight: spacing[4]}}>
          <StarSystemCrest
            system={displaySystem as StarSystemName}
            size="lg"
            variant="default"
          />
        </View>
        
        <View style={{flex: 1}}>
          <Text 
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing[1],
            }}>
            {classification === 'hybrid' && hybrid
              ? `${hybrid[0]} / ${hybrid[1]}`
              : (primary || 'Unknown')}
          </Text>
          <Text 
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.muted,
              fontWeight: typography.fontWeight.medium,
            }}>
            {classification === 'hybrid' ? 'Hybrid System' : 'Primary System'}
          </Text>
        </View>
      </View>

      {/* Percentage */}
      <View 
        style={{
          alignItems: 'center',
          paddingVertical: spacing[5],
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.borders.subtle,
          marginBottom: spacing[5],
        }}>
        <Text 
          style={{
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.lavender[400],
            marginBottom: spacing[1],
          }}>
          {percentage.toFixed(1)}%
        </Text>
        <Text 
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.muted,
            fontWeight: typography.fontWeight.semibold,
          }}>
          Alignment
        </Text>
      </View>

      {/* Allies */}
      {allies.length > 0 && (
        <View style={{marginBottom: spacing[5]}}>
          <Text 
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.secondary,
              marginBottom: spacing[3],
            }}>
            Allied Systems
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexDirection: 'row', gap: 8}}>
            {allies.map((ally, index) => (
              <View 
                key={index} 
                style={{
                  backgroundColor: `${colors.lavender[500]}33`, // 20% opacity
                  borderRadius: borderRadius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                  borderWidth: 1,
                  borderColor: `${colors.lavender[400]}4D`, // 30% opacity
                  marginRight: spacing[2],
                }}>
                <Text 
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.lavender[300],
                  }}>
                  {ally.system} {ally.percentage.toFixed(1)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Disclaimer */}
      <View 
        style={{
          backgroundColor: `${colors.gold[400]}1A`, // 10% opacity
          borderRadius: borderRadius.md,
          padding: spacing[3],
          borderWidth: 1,
          borderColor: `${colors.gold[400]}33`, // 20% opacity
        }}>
        <Text 
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.gold[300],
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
          For insight & entertainment. Not medical, financial, or legal advice.
        </Text>
      </View>
    </View>
  );
}
