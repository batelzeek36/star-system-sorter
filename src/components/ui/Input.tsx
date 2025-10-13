/**
 * Input Component (React Native)
 * Adapted from shadcn/ui input with same API surface
 */

import React from 'react';
import {TextInput, StyleSheet, type TextInputProps} from 'react-native';
import {colors, radius, fontSizes, fontWeights} from './theme';

export interface InputProps extends TextInputProps {
  error?: boolean;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({style, error, ...props}, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    color: colors.foreground,
    backgroundColor: colors.inputBackground,
  },
  inputError: {
    borderColor: colors.destructive,
  },
});
