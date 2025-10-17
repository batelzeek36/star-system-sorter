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
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../theme';

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
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const sizeStyles: Record<string, ViewStyle & TextStyle> = {
    sm: {
      minHeight: theme.components.button.sizes.sm.minHeight,
      paddingHorizontal: theme.components.button.sizes.sm.paddingX,
      paddingVertical: theme.components.button.sizes.sm.paddingY,
      fontSize: theme.components.button.sizes.sm.fontSize,
    },
    md: {
      minHeight: theme.components.button.sizes.md.minHeight,
      paddingHorizontal: theme.components.button.sizes.md.paddingX,
      paddingVertical: theme.components.button.sizes.md.paddingY,
      fontSize: theme.components.button.sizes.md.fontSize,
    },
    lg: {
      minHeight: theme.components.button.sizes.lg.minHeight,
      paddingHorizontal: theme.components.button.sizes.lg.paddingX,
      paddingVertical: theme.components.button.sizes.lg.paddingY,
      fontSize: theme.components.button.sizes.lg.fontSize,
    },
  };

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: theme.colors.lavender[500],
        ...theme.elevation[2],
      },
      text: {
        color: theme.colors.text.primary,
      },
    },
    secondary: {
      container: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: theme.colors.borders.emphasis,
      },
      text: {
        color: theme.colors.text.primary,
      },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      },
      text: {
        color: theme.colors.lavender[300],
      },
    },
    destructive: {
      container: {
        backgroundColor: theme.colors.semantic.error,
        ...theme.elevation[2],
      },
      text: {
        color: theme.colors.text.primary,
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
        styles.container,
        currentVariantStyle.container,
        {
          minHeight: currentSizeStyle.minHeight,
          paddingHorizontal: currentSizeStyle.paddingHorizontal,
          paddingVertical: currentSizeStyle.paddingVertical,
          borderRadius: theme.borderRadius.full,
          opacity: isDisabled ? 0.4 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={currentVariantStyle.text.color}
            style={styles.icon}
          />
        ) : leadingIcon ? (
          <View style={styles.icon}>{leadingIcon}</View>
        ) : null}
        <Text
          style={[
            styles.text,
            currentVariantStyle.text,
            {
              fontSize: currentSizeStyle.fontSize,
              fontWeight: theme.typography.fontWeight.semibold,
            },
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    textAlign: 'center',
  },
});
