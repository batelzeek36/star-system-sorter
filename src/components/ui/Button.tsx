/**
 * Button Component (React Native)
 * Based on Figma design system tokens
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  children,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    ...(disabled || loading ? [styles.disabled] : []),
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}`],
    ...(disabled || loading ? [styles.textDisabled] : []),
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      testID={testID}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : '#a78bfa'}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999, // full radius (pill shape)
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Size variants
  size_sm: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  size_md: {
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  size_lg: {
    minHeight: 48,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  // Variant styles
  variant_primary: {
    backgroundColor: '#a78bfa', // lavender-500
    shadowColor: '#8b5cf6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  variant_secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_destructive: {
    backgroundColor: '#ef4444', // error color
    shadowColor: '#ef4444',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabled: {
    opacity: 0.4,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  text_primary: {
    color: '#ffffff',
  },
  text_secondary: {
    color: '#ffffff',
  },
  text_ghost: {
    color: '#d4c5ff', // lavender-300
  },
  text_destructive: {
    color: '#ffffff',
  },
  textDisabled: {
    opacity: 1, // opacity handled by container
  },
});
