/**
 * Label Component (React Native)
 * Adapted from shadcn/ui label with same API surface
 */

import React from 'react';
import {Text, StyleSheet, type TextProps} from 'react-native';
import {colors, fontSizes, fontWeights} from './theme';

export interface LabelProps extends TextProps {
  error?: boolean;
}

export function Label({style, error, ...props}: LabelProps) {
  return (
    <Text
      style={[styles.label, error && styles.labelError, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
    lineHeight: fontSizes.sm * 1.2,
  },
  labelError: {
    color: colors.destructive,
  },
});
