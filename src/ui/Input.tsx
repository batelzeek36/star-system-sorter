/**
 * Input Primitive Component (NativeWind)
 * 
 * Form input with label and error states using className utilities.
 * Matches Figma/components/ui/input.tsx with React Native adaptations.
 * 
 * Design tokens from Figma/design-tokens.json:
 * - Background: surface.muted (#0f0820)
 * - Border: borders.muted (rgba(167, 139, 250, 0.2))
 * - Focus border: lavender-500 (#a78bfa)
 * - Error border: semantic.error (#ef4444)
 * - Border radius: md (12px)
 * - Padding: spacing.4 (16px)
 * - Font size: typography.fontSize.base (16px)
 * - Focus ring: effects.focusRing.default (0 0 0 3px rgba(167, 139, 250, 0.4))
 * - Error ring: effects.focusRing.error (0 0 0 3px rgba(239, 68, 68, 0.4))
 */

import React, { useState, cloneElement, isValidElement, type ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
  containerClassName?: string;
  testID?: string;
}

export function Input({
  label,
  icon,
  error,
  helperText,
  className = '',
  containerClassName = '',
  testID,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

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
    ? '#ef4444' // semantic.error
    : '#c4b5fd'; // lavender-400

  // Clone icon element with color prop if it's a valid React element
  const iconWithColor = icon && isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<any>, { color: iconColor })
    : icon;

  // Base input container classes (when icon is present, use flex-row)
  const baseContainerClasses = icon
    ? 'bg-surface-muted border rounded-md px-4 py-3 min-h-[44px] flex-row items-center gap-3'
    : '';

  // Base input classes (when no icon, apply full styling to TextInput)
  const baseInputClasses = icon
    ? 'flex-1 text-base text-text-primary p-0'
    : 'bg-surface-muted border rounded-md px-4 py-4 text-base text-text-primary min-h-[44px]';

  // Conditional border classes using template literals
  const borderClasses = hasError
    ? 'border-semantic-error'
    : isFocused
    ? 'border-lavender-500'
    : 'border-borders-muted';

  // Combine classes based on whether icon is present
  const containerClasses = icon
    ? `${baseContainerClasses} ${borderClasses}`.trim()
    : '';
  const inputClasses = icon
    ? baseInputClasses
    : `${baseInputClasses} ${borderClasses} ${className}`.trim();

  // Platform-specific focus ring shadow (simulates effects.focusRing)
  const focusRingStyle: ViewStyle = isFocused
    ? Platform.select({
        ios: {
          shadowColor: hasError ? '#ef4444' : '#a78bfa',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 3,
        },
        android: {
          elevation: hasError ? 3 : 2,
        },
        default: {},
      }) as ViewStyle
    : {};

  return (
    <View className={`w-full ${containerClassName}`.trim()} testID={testID}>
      {label && (
        <Text
          className="text-lavender-300 text-sm font-medium mb-2"
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      {icon ? (
        <View
          className={`${containerClasses} ${className}`.trim()}
          style={focusRingStyle}
        >
          <View
            className="shrink-0 w-5 h-5 items-center justify-center"
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {iconWithColor}
          </View>
          <TextInput
            className={inputClasses}
            placeholderTextColor="#6b7280"
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={label}
            accessibilityHint={helperText || error}
            accessibilityState={{ disabled: props.editable === false }}
            testID={testID ? `${testID}-input` : undefined}
            {...props}
          />
        </View>
      ) : (
        <TextInput
          className={inputClasses}
          style={focusRingStyle}
          placeholderTextColor="#6b7280"
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityHint={helperText || error}
          accessibilityState={{ disabled: props.editable === false }}
          testID={testID ? `${testID}-input` : undefined}
          {...props}
        />
      )}
      {(helperText || error) && (
        <Text
          className={`text-xs mt-2 ${
            hasError ? 'text-semantic-error' : 'text-text-subtle'
          }`}
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
