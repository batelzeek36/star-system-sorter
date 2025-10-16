/**
 * Onboarding Screen
 * App introduction and welcome flow with Figma design system
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {Button, Card, SectionHeader} from '@/components';

type Props = ScreenProps<'Onboarding'>;

export function OnboardingScreen({navigation}: Props) {
  const handleGetStarted = () => {
    navigation.navigate('Input');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SectionHeader
          title="Star System Sorter"
          subtitle="S³"
          align="center"
          testID="onboarding-header"
        />

        <Card variant="emphasis" style={styles.card} testID="onboarding-card">
          <Text style={styles.description} accessibilityRole="text">
            Discover your star system classification based on Human Design
            principles.
          </Text>
          <Text style={styles.disclaimer} accessibilityRole="text">
            For insight & entertainment. Not medical, financial, or legal
            advice.
          </Text>
        </Card>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleGetStarted}
          accessibilityLabel="Get Started"
          testID="get-started-button">
          Get Started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0612', // canvas-dark from design tokens
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginTop: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e5e7eb', // text-secondary
    textAlign: 'center',
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 14,
    lineHeight: 21,
    color: '#9ca3af', // text-muted
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});
