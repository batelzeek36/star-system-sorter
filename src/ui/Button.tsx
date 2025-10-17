/**
 * Button Primitive Component (NativeWind)
 * 
 * Variants: primary, secondary, ghost, destructive, outline, link
 * Sizes: sm, md, lg (all meet 44px minimum touch target)
 * 
 * Design tokens from Figma/design-tokens.json:
 * - Colors: lavender-500 (primary), semantic.error (destructive)
 * - Border radius: md (12px)
 * - Elevation: elevation-2 for Android shadow
 * - Touch targets: min-h-[44px] (WCAG 2.1 AA)
 */

import React, { type ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Platform,
  type ViewStyle,
} from 'react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  className?: string;
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
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Base classes for all buttons
  const baseClasses = 'items-center justify-center rounded-md';

  // Size classes (all enforce min-h-[44px] for WCAG 2.1 AA)
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2',
    md: 'min-h-[44px] px-6 py-3',
    lg: 'min-h-[48px] px-8 py-4',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-lavender-500',
    secondary: 'bg-white/5 border border-borders-emphasis',
    ghost: 'bg-transparent',
    destructive: 'bg-semantic-error',
    outline: 'bg-transparent border border-borders-muted',
    link: 'bg-transparent',
  };

  // Text color classes
  const textColorClasses = {
    primary: 'text-text-primary',
    secondary: 'text-text-primary',
    ghost: 'text-lavender-300',
    destructive: 'text-text-primary',
    outline: 'text-text-primary',
    link: 'text-lavender-500',
  };

  // Font size classes
  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Combine all classes
  const containerClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();
  const textClasses = `${textColorClasses[variant]} ${fontSizeClasses[size]} font-semibold text-center`.trim();

  // Platform-specific elevation for Android (iOS uses shadow utilities)
  const platformStyle: ViewStyle =
    variant === 'primary' || variant === 'destructive'
      ? (Platform.select({
          android: { elevation: 4 },
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          },
          default: {},
        }) as ViewStyle)
      : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      className={containerClasses}
      style={[platformStyle, { opacity: isDisabled ? 0.4 : 1 }]}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'ghost' ? '#d4c5ff' : '#ffffff'}
            className="shrink-0"
          />
        ) : leadingIcon ? (
          <View className="shrink-0">{leadingIcon}</View>
        ) : null}
        <Text className={textClasses}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
