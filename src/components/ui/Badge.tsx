/**
 * Badge Component (React Native)
 * Adapted from shadcn/ui badge with same API surface
 */

import React from 'react';
import {View, Text, StyleSheet, type ViewProps, type TextStyle} from 'react-native';
import {colors, radius, fontSizes, fontWeights} from './theme';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  textStyle?: TextStyle;
}

export function Badge({
  variant = 'default',
  style,
  textStyle,
  children,
  ...props
}: BadgeProps) {
  return (
    <View
      style={[styles.base, styles[`variant_${variant}`], style]}
      {...props}>
      {typeof children === 'string' ? (
        <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  // Variants
  variant_default: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  variant_secondary: {
    backgroundColor: colors.secondary,
    borderColor: 'transparent',
  },
  variant_destructive: {
    backgroundColor: colors.destructive,
    borderColor: 'transparent',
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  // Text styles
  text: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
  },
  text_default: {
    color: colors.primaryForeground,
  },
  text_secondary: {
    color: colors.secondaryForeground,
  },
  text_destructive: {
    color: colors.destructiveForeground,
  },
  text_outline: {
    color: colors.foreground,
  },
});
