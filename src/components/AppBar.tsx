/**
 * AppBar Component
 * Adapted from Figma/components/s3/AppBar.tsx for React Native
 * 
 * Navigation header with back button
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography, components } from '../theme/tokens';

interface AppBarProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  testID?: string;
}

export function AppBar({ title, onBack, showBack, testID }: AppBarProps) {
  return (
    <View
      testID={testID}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        paddingHorizontal: spacing[4],
      }}
    >
      {showBack && onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: components.touchTarget.minimum,
            height: components.touchTarget.minimum,
            marginLeft: -spacing[2],
            borderRadius: borderRadius.full,
          }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          testID={testID ? `${testID}-back` : 'app-bar-back'}
        >
          <Text
            style={{
              color: colors.lavender[300],
              fontSize: typography.fontSize['2xl'],
              lineHeight: 24,
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: components.touchTarget.minimum }} />
      )}

      {title && (
        <Text
          style={{
            color: colors.lavender[200],
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.medium,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      )}

      <View style={{ width: components.touchTarget.minimum }} />
    </View>
  );
}
