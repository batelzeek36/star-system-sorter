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
import { View, type ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, elevation } from '../theme/tokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'emphasis' | 'warning';
  style?: ViewStyle;
  testID?: string;
}

export function Card({ children, variant = 'default', style, testID }: CardProps) {
  // Gradient simulation using layered backgrounds
  // Mimics: bg-gradient-to-br from-[color1] to-[color2]
  const gradientLayers = {
    default: {
      base: `${colors.lavender[900]}33`, // 20% opacity (from color)
      overlay: `${colors.lavender[800]}1A`, // 10% opacity (to color)
      border: colors.borders.muted,
      elevation: elevation[0],
    },
    emphasis: {
      base: `${colors.lavender[600]}4D`, // 30% opacity (from color)
      overlay: `${colors.lavender[700]}33`, // 20% opacity (to color)
      border: `${colors.lavender[400]}66`, // 40% opacity
      elevation: elevation[2],
    },
    warning: {
      base: `${colors.semantic.warning}1A`, // 10% opacity (warning-muted)
      overlay: `${colors.gold[600]}1A`, // 10% opacity (to color)
      border: `${colors.gold[400]}66`, // 40% opacity
      elevation: elevation[0],
    },
  };

  const currentGradient = gradientLayers[variant];

  return (
    <View
      testID={testID}
      style={[
        {
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: currentGradient.base,
          borderColor: currentGradient.border,
          borderWidth: 1,
          borderRadius: borderRadius.xl,
          padding: spacing[4],
          ...currentGradient.elevation,
        },
        style,
      ]}
    >
      {/* Gradient overlay layer (simulates gradient-to-br effect) */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: currentGradient.overlay,
          borderRadius: borderRadius.xl - 1, // Account for border
        }}
        pointerEvents="none"
      />
      
      {/* Content layer */}
      <View style={{position: 'relative', zIndex: 1}}>
        {children}
      </View>
    </View>
  );
}
