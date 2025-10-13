/**
 * Button Component (React Native)
 * Adapted from shadcn/ui button with same API surface
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import {colors, radius, fontSizes, fontWeights} from './theme';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  style,
  textStyle,
  children,
  ...props
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'default' || variant === 'destructive'
              ? colors.primaryForeground
              : colors.foreground
          }
        />
      ) : typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 0,
  },
  // Variants
  variant_default: {
    backgroundColor: colors.primary,
  },
  variant_destructive: {
    backgroundColor: colors.destructive,
  },
  variant_outline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_secondary: {
    backgroundColor: colors.secondary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_link: {
    backgroundColor: 'transparent',
  },
  // Sizes
  size_default: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  size_sm: {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  size_lg: {
    height: 40,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  size_icon: {
    width: 36,
    height: 36,
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  text_default: {
    color: colors.primaryForeground,
  },
  text_destructive: {
    color: colors.destructiveForeground,
  },
  text_outline: {
    color: colors.foreground,
  },
  text_secondary: {
    color: colors.secondaryForeground,
  },
  text_ghost: {
    color: colors.foreground,
  },
  text_link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  textSize_default: {
    fontSize: fontSizes.sm,
  },
  textSize_sm: {
    fontSize: fontSizes.xs,
  },
  textSize_lg: {
    fontSize: fontSizes.base,
  },
  textSize_icon: {
    fontSize: fontSizes.sm,
  },
});
