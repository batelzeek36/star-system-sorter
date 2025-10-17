/**
 * Field Component
 * Adapted from Figma/components/s3/Field.tsx for React Native
 * 
 * Form input with icons, validation states, and error handling
 * Supports default, focus, and error states with proper accessibility
 * 
 * NOTE: This component is a wrapper around src/ui/Input for backward compatibility.
 * New code should use src/ui/Input directly.
 */

import React, { type ReactNode } from 'react';
import { type TextInputProps, type ViewStyle } from 'react-native';
import { Input } from '../ui/Input';

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
  ...props
}: FieldProps) {
  // Convert containerStyle to className if needed
  // For now, we'll pass it through as containerClassName
  const containerClassName = containerStyle ? '' : '';

  return (
    <Input
      label={label}
      icon={icon}
      error={error}
      helperText={helperText}
      containerClassName={containerClassName}
      testID={testID}
      {...props}
    />
  );
}
