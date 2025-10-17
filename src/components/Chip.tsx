/**
 * Chip Component
 * Adapted from Figma/components/s3/Chip.tsx for React Native
 * 
 * Star system ally chips with percentages
 * Variants: gold, lavender
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../theme';

interface ChipProps {
  starSystem: string;
  percentage?: number;
  variant?: 'gold' | 'lavender';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  testID?: string;
}

export function Chip({
  starSystem,
  percentage,
  variant = 'lavender',
  selectable = false,
  selected = false,
  onSelect,
  dismissible = false,
  onDismiss,
  testID,
}: ChipProps) {
  const theme = useTheme();

  const variantStyles: Record<
    string,
    { container: ViewStyle; text: TextStyle; selectedContainer: ViewStyle; selectedText: TextStyle }
  > = {
    gold: {
      container: {
        backgroundColor: `${theme.colors.gold[500]}33`, // 20% opacity
        borderColor: `${theme.colors.gold[400]}66`, // 40% opacity
      },
      text: {
        color: theme.colors.gold[300],
      },
      selectedContainer: {
        backgroundColor: theme.colors.gold[500],
        borderColor: theme.colors.gold[400],
      },
      selectedText: {
        color: theme.colors.text.primary,
      },
    },
    lavender: {
      container: {
        backgroundColor: `${theme.colors.lavender[500]}33`, // 20% opacity
        borderColor: `${theme.colors.lavender[400]}4D`, // 30% opacity
      },
      text: {
        color: theme.colors.lavender[300],
      },
      selectedContainer: {
        backgroundColor: theme.colors.lavender[500],
        borderColor: theme.colors.lavender[400],
      },
      selectedText: {
        color: theme.colors.text.primary,
      },
    },
  };

  const currentVariant = variantStyles[variant];
  const containerStyle = selected ? currentVariant.selectedContainer : currentVariant.container;
  const textStyle = selected ? currentVariant.selectedText : currentVariant.text;

  const content = (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[1],
          borderRadius: theme.borderRadius.full,
          borderWidth: 1,
          minHeight: selectable ? theme.components.touchTarget.minimum : undefined,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          textStyle,
          {
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
          },
        ]}
      >
        {starSystem} {percentage !== undefined && `${percentage}%`}
      </Text>
      {dismissible && onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Dismiss ${starSystem}`}
          accessibilityRole="button"
        >
          <Text style={[styles.dismissIcon, textStyle]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (selectable && onSelect) {
    return (
      <TouchableOpacity
        onPress={onSelect}
        activeOpacity={0.7}
        testID={testID}
        accessibilityLabel={`${starSystem}${percentage !== undefined ? ` ${percentage}%` : ''}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View testID={testID}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
  dismissButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissIcon: {
    fontSize: 16,
    lineHeight: 16,
  },
});
