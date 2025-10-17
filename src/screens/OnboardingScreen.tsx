/**
 * Onboarding Screen
 * App introduction and welcome flow with Figma design system
 * 
 * Features:
 * - S³ hero with logo icon and starfield background
 * - "Begin Sorting" CTA using Figma Button component
 * - 3-step explanation (Input → Sort → Narrative)
 * - Navigate to Input screen
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {Button, Card, StarfieldBackground} from '@/components';
import {colors, spacing, typography, borderRadius} from '@/theme/tokens';

type Props = ScreenProps<'Onboarding'>;

export function OnboardingScreen({navigation}: Props) {
  const handleBeginSorting = () => {
    navigation.navigate('Input');
  };

  return (
    <View style={styles.container}>
      {/* Starfield background effect */}
      <StarfieldBackground />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with S³ Logo */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer} testID="onboarding-header">
            <Text style={styles.logoIcon} accessibilityRole="text">
              ✦
            </Text>
            <Text style={styles.appTitle} accessibilityRole="header">
              Star System Sorter
            </Text>
            <Text style={styles.appSubtitle} accessibilityRole="text">
              S³
            </Text>
          </View>
          
          <Text style={styles.tagline} accessibilityRole="text">
            Discover your star system classification based on Human Design principles.
          </Text>
        </View>

        {/* 3-Step Explanation */}
        <View style={styles.stepsSection}>
          <Card variant="default" style={styles.stepCard} testID="onboarding-card">
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Input</Text>
                <Text style={styles.stepDescription}>
                  Enter your birth data (date, time, location)
                </Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Sort</Text>
                <Text style={styles.stepDescription}>
                  We compute your Human Design chart and classify your star system
                </Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Narrative</Text>
                <Text style={styles.stepDescription}>
                  View your results, allies, and understand why
                </Text>
              </View>
            </View>
          </Card>

          {/* Disclaimer */}
          <Text style={styles.disclaimer} accessibilityRole="text">
            For insight & entertainment. Not medical, financial, or legal advice.
          </Text>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleBeginSorting}
          accessibilityLabel="Begin Sorting"
          testID="get-started-button">
          Begin Sorting
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[16],
    paddingBottom: spacing[6],
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing[12],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoIcon: {
    fontSize: typography.fontSize['4xl'],
    color: colors.lavender[400],
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  appTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  appSubtitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.medium,
    color: colors.lavender[500],
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  stepsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  stepCard: {
    marginBottom: spacing[6],
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing[4],
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.lavender[900],
    borderWidth: 2,
    borderColor: colors.lavender[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  stepNumberText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.lavender[400],
  },
  stepContent: {
    flex: 1,
    paddingTop: spacing[1],
  },
  stepTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  stepDescription: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    color: colors.text.muted,
  },
  stepDivider: {
    height: 1,
    backgroundColor: colors.borders.subtle,
    marginLeft: 20,
  },
  disclaimer: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: colors.text.subtle,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing[4],
  },
  buttonContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    paddingTop: spacing[4],
  },
});
