/**
 * Onboarding Screen
 * App introduction and welcome flow with Figma design system
 * 
 * Features:
 * - S³ hero with logo icon and starfield background
 * - "Begin Sorting" CTA using NativeWind Button primitive
 * - 3-step explanation (Input → Sort → Narrative)
 * - Navigate to Input screen
 * 
 * Styling: NativeWind (Tailwind CSS utilities)
 * Design tokens: Figma/design-tokens.json
 */

import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {StarfieldBackground} from '@/components';
import {Button} from '@/ui/Button';
import {Card} from '@/ui/Card';

type Props = ScreenProps<'Onboarding'>;

export function OnboardingScreen({navigation}: Props) {
  const handleBeginSorting = () => {
    navigation.navigate('Input');
  };

  return (
    <View className="flex-1 bg-canvas-dark">
      {/* Starfield background effect */}
      <StarfieldBackground />
      
      <ScrollView 
        contentContainerStyle={{flexGrow: 1}}
        className="px-5 pt-16 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with S³ Logo */}
        <View className="items-center mb-12">
          <View className="items-center mb-6" testID="onboarding-header">
            <Text 
              className="text-4xl text-lavender-400 mb-3 text-center"
              accessibilityRole="text"
            >
              ✦
            </Text>
            <Text 
              className="text-3xl font-bold text-text-primary text-center mb-2"
              accessibilityRole="header"
            >
              Star System Sorter
            </Text>
            <Text 
              className="text-2xl font-medium text-lavender-500 text-center"
              style={{letterSpacing: 2}}
              accessibilityRole="text"
            >
              S³
            </Text>
          </View>
          
          <Text 
            className="text-lg leading-relaxed text-text-secondary text-center px-4"
            accessibilityRole="text"
          >
            Discover your star system classification based on Human Design principles.
          </Text>
        </View>

        {/* 3-Step Explanation */}
        <View className="flex-1 justify-center">
          <Card variant="default" testID="onboarding-card" className="mb-6">
            <View className="flex-row items-start py-4">
              <View className="w-10 h-10 rounded-full bg-lavender-900 border-2 border-lavender-500 items-center justify-center mr-4">
                <Text className="text-lg font-bold text-lavender-400">1</Text>
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-xl font-semibold text-text-primary mb-1">
                  Input
                </Text>
                <Text className="text-base leading-normal text-text-muted">
                  Enter your birth data (date, time, location)
                </Text>
              </View>
            </View>

            <View className="h-px bg-borders-subtle ml-5" />

            <View className="flex-row items-start py-4">
              <View className="w-10 h-10 rounded-full bg-lavender-900 border-2 border-lavender-500 items-center justify-center mr-4">
                <Text className="text-lg font-bold text-lavender-400">2</Text>
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-xl font-semibold text-text-primary mb-1">
                  Sort
                </Text>
                <Text className="text-base leading-normal text-text-muted">
                  We compute your Human Design chart and classify your star system
                </Text>
              </View>
            </View>

            <View className="h-px bg-borders-subtle ml-5" />

            <View className="flex-row items-start py-4">
              <View className="w-10 h-10 rounded-full bg-lavender-900 border-2 border-lavender-500 items-center justify-center mr-4">
                <Text className="text-lg font-bold text-lavender-400">3</Text>
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-xl font-semibold text-text-primary mb-1">
                  Narrative
                </Text>
                <Text className="text-base leading-normal text-text-muted">
                  View your results, allies, and understand why
                </Text>
              </View>
            </View>
          </Card>

          {/* Disclaimer */}
          <Text 
            className="text-sm leading-normal text-text-subtle text-center italic px-4"
            accessibilityRole="text"
          >
            For insight & entertainment. Not medical, financial, or legal advice.
          </Text>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View className="px-5 pb-6 pt-4">
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
