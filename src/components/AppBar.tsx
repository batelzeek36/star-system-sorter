/**
 * AppBar Component
 * Adapted from Figma/components/s3/AppBar.tsx for React Native
 * 
 * Navigation header with back button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface AppBarProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  testID?: string;
}

export function AppBar({ title, onBack, showBack, testID }: AppBarProps) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          height: 56,
          paddingHorizontal: theme.spacing[4],
        },
      ]}
    >
      {showBack && onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backButton,
            {
              width: theme.components.touchTarget.minimum,
              height: theme.components.touchTarget.minimum,
              marginLeft: -theme.spacing[2],
              borderRadius: theme.borderRadius.full,
            },
          ]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          testID={testID ? `${testID}-back` : 'app-bar-back'}
        >
          <Text
            style={[
              styles.backIcon,
              {
                color: theme.colors.lavender[300],
                fontSize: theme.typography.fontSize['2xl'],
              },
            ]}
          >
            ‹
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: theme.components.touchTarget.minimum }} />
      )}

      {title && (
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.lavender[200],
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.medium,
            },
          ]}
        >
          {title}
        </Text>
      )}

      <View style={{ width: theme.components.touchTarget.minimum }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    lineHeight: 24,
  },
  title: {
    textAlign: 'center',
  },
});
