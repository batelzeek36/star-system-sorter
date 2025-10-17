/**
 * Button Component
 * Adapted from Figma/components/s3/Button.tsx for React Native
 * 
 * Variants: primary, secondary, ghost, destructive
 * Sizes: sm, md, lg (all meet 44px minimum touch target)
 */

import React, { type ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors, borderRadius, typography, elevation, components } from '../theme/tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  loading = false,
  disabled = false,
  onPress,
  children,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles: Record<string, ViewStyle & TextStyle> = {
    sm: {
      minHeight: components.button.sizes.sm.minHeight,
      paddingHorizontal: components.button.sizes.sm.paddingX,
      paddingVertical: components.button.sizes.sm.paddingY,
      fontSize: components.button.sizes.sm.fontSize,
    },
    md: {
      minHeight: components.button.sizes.md.minHeight,
      paddingHorizontal: components.button.sizes.md.paddingX,
      paddingVertical: components.button.sizes.md.paddingY,
      fontSize: components.button.sizes.md.fontSize,
    },
    lg: {
      minHeight: components.button.sizes.lg.minHeight,
      paddingHorizontal: components.button.sizes.lg.paddingX,
      paddingVertical: components.button.sizes.lg.paddingY,
      fontSize: components.button.sizes.lg.fontSize,
    },
  };

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: colors.lavender[500],
        ...elevation[2],
      },
      text: {
        color: colors.text.primary,
      },
    },
    secondary: {
      container: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: colors.borders.emphasis,
      },
      text: {
        color: colors.text.primary,
      },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      },
      text: {
        color: colors.lavender[300],
      },
    },
    destructive: {
      container: {
        backgroundColor: colors.semantic.error,
        ...elevation[2],
      },
      text: {
        color: colors.text.primary,
      },
    },
  };

  const currentSizeStyle = sizeStyles[size];
  const currentVariantStyle = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: currentSizeStyle.minHeight,
          paddingHorizontal: currentSizeStyle.paddingHorizontal,
          paddingVertical: currentSizeStyle.paddingVertical,
          borderRadius: borderRadius.full,
          opacity: isDisabled ? 0.4 : 1,
        },
        currentVariantStyle.container,
      ]}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={currentVariantStyle.text.color}
            style={{flexShrink: 0}}
          />
        ) : leadingIcon ? (
          <View style={{flexShrink: 0}}>{leadingIcon}</View>
        ) : null}
        <Text
          style={[
            {
              textAlign: 'center',
              fontSize: currentSizeStyle.fontSize,
              fontWeight: typography.fontWeight.semibold,
            },
            currentVariantStyle.text,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
