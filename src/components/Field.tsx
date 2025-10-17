/**
 * Field Component
 * Adapted from Figma/components/s3/Field.tsx for React Native
 * 
 * Form input with icons, validation states, and error handling
 * Supports default, focus, and error states with proper accessibility
 */

import React, { useState, type ReactNode, cloneElement, isValidElement } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

interface FieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'focus' | 'error';
  containerStyle?: ViewStyle;
  testID?: string;
}

export function Field({
  label,
  icon,
  error,
  helperText,
  variant = 'default',
  containerStyle,
  testID,
  onFocus,
  onBlur,
  ...props
}: FieldProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const currentVariant = hasError ? 'error' : isFocused ? 'focus' : variant;

  // Variant styles for different states
  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: 'rgba(91, 33, 182, 0.2)', // lavender-900 at 20% opacity
      borderColor: theme.colors.borders.muted,
    },
    focus: {
      backgroundColor: 'rgba(91, 33, 182, 0.3)', // lavender-900 at 30% opacity
      borderColor: theme.colors.lavender[400],
      ...theme.elevation[1],
    },
    error: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)', // error at 10% opacity
      borderColor: theme.colors.semantic.error,
      ...theme.elevation[1],
    },
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Determine icon color based on state
  const iconColor = hasError
    ? theme.colors.semantic.error
    : isFocused
    ? theme.colors.lavender[400]
    : theme.colors.lavender[400];

  // Clone icon element with color prop if it's a valid React element
  const iconWithColor = icon && isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<any>, { color: iconColor })
    : icon;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.lavender[300],
            fontSize: theme.typography.fontSize.sm,
            marginBottom: theme.spacing[2],
            fontWeight: theme.typography.fontWeight.medium,
          },
        ]}
        accessibilityRole="text"
      >
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          variantStyles[currentVariant],
          {
            minHeight: theme.components.touchTarget.minimum,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[3],
            borderRadius: theme.borderRadius.xl,
            borderWidth: 1,
          },
        ]}
      >
        {iconWithColor && (
          <View
            style={styles.iconContainer}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {iconWithColor}
          </View>
        )}
        <TextInput
          style={{
            flex: 1,
            padding: 0,
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.sm,
          }}
          placeholderTextColor={theme.colors.text.subtle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          accessibilityState={{ disabled: props.editable === false }}
          testID={testID ? `${testID}-input` : undefined}
          {...props}
        />
      </View>
      {(helperText || error) && (
        <Text
          style={[
            styles.helperText,
            {
              color: hasError
                ? theme.colors.semantic.error
                : theme.colors.text.subtle,
              fontSize: theme.typography.fontSize.xs,
              marginTop: theme.spacing[2],
            },
          ]}
          accessibilityRole="text"
          accessibilityLiveRegion={hasError ? 'polite' : 'none'}
          testID={testID ? `${testID}-helper` : undefined}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    flexShrink: 0,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    lineHeight: 18,
  },
});
