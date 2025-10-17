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
import {AppBar} from '@/components/AppBar';
import {Card} from '@/components/Card';
import {useTheme} from '@/theme';

type Props = ScreenProps<'Why'>;

export function WhyScreen({route, navigation}: Props) {
  const {contributorsPerSystem, percentages} = route.params;
  const theme = useTheme();

  // Sort systems by percentage (highest first)
  const sortedSystems = Object.keys(contributorsPerSystem).sort(
    (a, b) => (percentages[b] || 0) - (percentages[a] || 0)
  );

  // Get primary system (highest percentage)
  const primarySystem = sortedSystems[0] || 'Unknown';

  return (
    <View style={[styles.wrapper, {backgroundColor: theme.colors.canvas.dark}]}>
      {/* AppBar Header */}
      <AppBar
        title={`Why ${primarySystem}`}
        showBack
        onBack={() => navigation.goBack()}
        testID="why-screen-app-bar"
      />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        
        {/* Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, {color: theme.colors.text.secondary}]}>
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
            style={styles.card}
            testID={`why-card-${system.toLowerCase()}`}
          >
            {/* System Header */}
            <View style={styles.cardHeader}>
              <Text style={[styles.systemName, {color: theme.colors.text.primary}]}>
                {system}
              </Text>
              <Text style={[styles.percentage, {color: theme.colors.lavender[400]}]}>
                {percentage.toFixed(1)}%
              </Text>
            </View>

            {/* Contributors List */}
            <View style={styles.contributorsList}>
              {contributors.length > 0 ? (
                contributors.map((contributor, idx) => (
                  <View key={idx} style={styles.contributorItem}>
                    <View style={[styles.bullet, {backgroundColor: theme.colors.lavender[500]}]} />
                    <Text style={[styles.contributorText, {color: theme.colors.text.secondary}]}>
                      {formatContributor(contributor)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.noContributors, {color: theme.colors.text.muted}]}>
                  No contributing attributes
                </Text>
              )}
            </View>
          </Card>
        );
      })}

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, {color: theme.colors.text.muted}]}>
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20, // theme.spacing[5]
  },
  header: {
    marginBottom: 24, // theme.spacing[6]
  },
  subtitle: {
    fontSize: 16, // theme.typography.fontSize.base
    lineHeight: 24, // base * 1.5
  },
  card: {
    marginBottom: 16, // theme.spacing[4]
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // theme.spacing[3]
    paddingBottom: 12, // theme.spacing[3]
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 139, 250, 0.2)', // theme.colors.borders.muted
  },
  systemName: {
    fontSize: 20, // theme.typography.fontSize.xl
    fontWeight: '600', // theme.typography.fontWeight.semibold
  },
  percentage: {
    fontSize: 18, // theme.typography.fontSize.lg
    fontWeight: '700', // theme.typography.fontWeight.bold
  },
  contributorsList: {
    gap: 8, // theme.spacing[2]
  },
  contributorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8, // theme.spacing[2]
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  contributorText: {
    flex: 1,
    fontSize: 14, // theme.typography.fontSize.sm
    lineHeight: 20, // sm * ~1.43
  },
  noContributors: {
    fontSize: 14, // theme.typography.fontSize.sm
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 24, // theme.spacing[6]
    paddingTop: 16, // theme.spacing[4]
    borderTopWidth: 1,
    borderTopColor: 'rgba(167, 139, 250, 0.2)', // theme.colors.borders.muted
  },
  footerText: {
    fontSize: 12, // theme.typography.fontSize.xs
    textAlign: 'center',
    lineHeight: 18, // xs * 1.5
  },
});
