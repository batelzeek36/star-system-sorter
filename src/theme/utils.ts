/**
 * Theme Utilities
 * Helper functions for working with design tokens
 */

import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { colors, spacing, borderRadius, typography, elevation } from './tokens';

/**
 * Create a style object with spacing values
 */
export function createSpacing(
  top?: keyof typeof spacing,
  right?: keyof typeof spacing,
  bottom?: keyof typeof spacing,
  left?: keyof typeof spacing
): ViewStyle {
  return {
    paddingTop: top !== undefined ? spacing[top] : undefined,
    paddingRight: right !== undefined ? spacing[right] : undefined,
    paddingBottom: bottom !== undefined ? spacing[bottom] : undefined,
    paddingLeft: left !== undefined ? spacing[left] : undefined,
  };
}

/**
 * Create a text style with typography tokens
 */
export function createTextStyle(
  size: keyof typeof typography.fontSize,
  weight?: keyof typeof typography.fontWeight,
  lineHeightKey?: keyof typeof typography.lineHeight
): TextStyle {
  return {
    fontSize: typography.fontSize[size],
    fontWeight: weight ? typography.fontWeight[weight] : typography.fontWeight.normal,
    lineHeight: lineHeightKey
      ? typography.fontSize[size] * typography.lineHeight[lineHeightKey]
      : typography.fontSize[size] * typography.lineHeight.normal,
  };
}

/**
 * Create a container style with elevation
 */
export function createElevatedStyle(
  level: keyof typeof elevation,
  backgroundColor?: string
): ViewStyle {
  return {
    ...elevation[level],
    backgroundColor: backgroundColor || colors.surface.subtle,
  };
}

/**
 * Create a bordered style
 */
export function createBorderedStyle(
  borderColor: string = colors.borders.subtle,
  radius: keyof typeof borderRadius = 'md',
  width: number = 1
): ViewStyle {
  return {
    borderWidth: width,
    borderColor,
    borderRadius: borderRadius[radius],
  };
}

/**
 * Common style presets
 */
export const stylePresets = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.canvas.dark,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: colors.canvas.dark,
    padding: spacing[4],
  },
  
  // Card styles
  card: {
    backgroundColor: colors.surface.subtle,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    ...elevation[2],
  },
  cardEmphasis: {
    backgroundColor: colors.surface.subtle,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.borders.emphasis,
    ...elevation[3],
  },
  
  // Text styles
  textPrimary: {
    color: colors.text.primary,
    ...createTextStyle('base', 'normal'),
  },
  textSecondary: {
    color: colors.text.secondary,
    ...createTextStyle('sm', 'normal'),
  },
  textMuted: {
    color: colors.text.muted,
    ...createTextStyle('sm', 'normal'),
  },
  
  // Heading styles
  heading1: {
    color: colors.text.primary,
    ...createTextStyle('4xl', 'bold', 'tight'),
  },
  heading2: {
    color: colors.text.primary,
    ...createTextStyle('3xl', 'bold', 'tight'),
  },
  heading3: {
    color: colors.text.primary,
    ...createTextStyle('2xl', 'semibold', 'tight'),
  },
  heading4: {
    color: colors.text.primary,
    ...createTextStyle('xl', 'semibold', 'normal'),
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Touch target (WCAG 2.1 AA)
  touchTarget: {
    minHeight: spacing[11],
    minWidth: spacing[11],
  },
});
