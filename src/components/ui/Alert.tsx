/**
 * Alert Component (React Native)
 * Adapted from shadcn/ui alert
 */

import React from 'react';
import {View, Text, StyleSheet, type ViewProps, type TextProps} from 'react-native';
import {colors, radius, spacing, fontSizes, fontWeights} from './theme';

export type AlertVariant = 'default' | 'destructive';

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;
}

export function Alert({variant = 'default', style, ...props}: AlertProps) {
  return (
    <View style={[styles.alert, styles[`variant_${variant}`], style]} {...props} />
  );
}

export interface AlertTitleProps extends TextProps {}

export function AlertTitle({style, ...props}: AlertTitleProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

export interface AlertDescriptionProps extends TextProps {}

export function AlertDescription({style, ...props}: AlertDescriptionProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  variant_default: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  variant_destructive: {
    backgroundColor: colors.destructive,
    borderColor: colors.destructive,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
    lineHeight: fontSizes.base * 1.2,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    lineHeight: fontSizes.sm * 1.5,
  },
});
