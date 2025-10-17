/**
 * Card Component
 * Adapted from Figma/components/s3/Card.tsx for React Native
 * 
 * Gradient backgrounds and variants: default, emphasis, warning
 * 
 * Note: React Native doesn't support CSS gradients natively.
 * This implementation uses layered Views with opacity to simulate
 * the gradient effect from the Figma design.
 */

import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'emphasis' | 'warning';
  style?: ViewStyle;
  testID?: string;
}

export function Card({ children, variant = 'default', style, testID }: CardProps) {
  const theme = useTheme();

  // Gradient simulation using layered backgrounds
  // Mimics: bg-gradient-to-br from-[color1] to-[color2]
  const gradientLayers = {
    default: {
      base: `${theme.colors.lavender[900]}33`, // 20% opacity (from color)
      overlay: `${theme.colors.lavender[800]}1A`, // 10% opacity (to color)
      border: theme.colors.borders.muted,
      elevation: theme.elevation[0],
    },
    emphasis: {
      base: `${theme.colors.lavender[600]}4D`, // 30% opacity (from color)
      overlay: `${theme.colors.lavender[700]}33`, // 20% opacity (to color)
      border: `${theme.colors.lavender[400]}66`, // 40% opacity
      elevation: theme.elevation[2],
    },
    warning: {
      base: `${theme.colors.semantic.warning}1A`, // 10% opacity (warning-muted)
      overlay: `${theme.colors.gold[600]}1A`, // 10% opacity (to color)
      border: `${theme.colors.gold[400]}66`, // 40% opacity
      elevation: theme.elevation[0],
    },
  };

  const currentGradient = gradientLayers[variant];

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: currentGradient.base,
          borderColor: currentGradient.border,
          borderWidth: 1,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing[4],
          ...currentGradient.elevation,
        },
        style,
      ]}
    >
      {/* Gradient overlay layer (simulates gradient-to-br effect) */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: currentGradient.overlay,
            borderRadius: theme.borderRadius.xl - 1, // Account for border
          },
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

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
