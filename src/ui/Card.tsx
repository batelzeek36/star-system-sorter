/**
 * Card Primitive Component (NativeWind)
 * 
 * Matches Figma/components/ui/card.tsx structure with React Native adaptations.
 * Uses design tokens from Figma/design-tokens.json.
 * 
 * Structure: Card, CardHeader, CardTitle, CardDescription
 * 
 * Design tokens:
 * - Background: surface.subtle (#1a0f2e)
 * - Border: borders.subtle (rgba(167, 139, 250, 0.1))
 * - Border radius: borderRadius.xl (24px)
 * - Padding: spacing.6 (24px)
 * - Elevation: elevation.1 (Android shadow)
 * 
 * Note: React Native doesn't support CSS gradients natively.
 * Gradients are simulated using layered Views with opacity.
 */

import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet, Platform, type ViewStyle, type TextStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'emphasis' | 'warning';
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle;
}

/**
 * Card container with elevation and rounded corners
 * Supports variants: default, emphasis, warning
 * Default styling: bg-surface-subtle, border-borders-subtle, rounded-3xl (24px), p-6 (24px)
 */
export function Card({ children, variant = 'default', className = '', style, testID }: CardProps) {
  // Variant-specific styling using NativeWind classes
  const variantClasses = {
    default: 'bg-surface-subtle border-borders-subtle',
    emphasis: 'bg-lavender-900/20 border-lavender-400/40',
    warning: 'bg-gold-600/10 border-gold-400/40',
  };

  const baseClasses = `border rounded-3xl p-6 ${variantClasses[variant]}`;
  const combinedClassName = `${baseClasses} ${className}`.trim();

  // Platform-specific elevation (only for emphasis variant)
  const platformStyle = variant === 'emphasis' ? Platform.select({
    android: {
      elevation: 2,
      shadowColor: '#000000',
    },
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  }) : {};

  // Overlay colors for gradient simulation
  const overlayColors = {
    default: 'rgba(124, 58, 237, 0.1)', // lavender-800 at 10%
    emphasis: 'rgba(124, 58, 237, 0.2)', // lavender-700 at 20%
    warning: 'rgba(217, 119, 6, 0.1)', // gold-600 at 10%
  };

  return (
    <View
      testID={testID}
      className={combinedClassName}
      style={[platformStyle, styles.container, style]}
    >
      {/* Gradient overlay layer (simulates gradient-to-br effect) */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.overlay,
          { backgroundColor: overlayColors[variant] },
        ]}
        pointerEvents="none"
      />
      
      {/* Content layer */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

/**
 * Card header section
 * Contains title and description with consistent spacing
 */
export function CardHeader({ children, className = '', style }: CardHeaderProps) {
  const baseClasses = 'flex flex-col gap-1.5';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <View className={combinedClassName} style={style}>
      {children}
    </View>
  );
}

/**
 * Card title text
 * Default styling: text-text-primary, font-semibold, text-lg
 */
export function CardTitle({ children, className = '', style }: CardTitleProps) {
  const baseClasses = 'text-text-primary font-semibold text-lg leading-tight';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <Text className={combinedClassName} style={style}>
      {children}
    </Text>
  );
}

/**
 * Card description text
 * Default styling: text-text-muted, text-sm
 */
export function CardDescription({ children, className = '', style }: CardDescriptionProps) {
  const baseClasses = 'text-text-muted text-sm leading-normal';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <Text className={combinedClassName} style={style}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    borderRadius: 23, // 24px - 1px for border
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
