/**
 * Design tokens from globals.css
 * Converted to React Native compatible values
 */

export const colors = {
  // Light theme (default)
  background: '#ffffff',
  foreground: '#030213',
  card: '#ffffff',
  cardForeground: '#030213',
  primary: '#030213',
  primaryForeground: '#ffffff',
  secondary: '#ececf0',
  secondaryForeground: '#030213',
  muted: '#ececf0',
  mutedForeground: '#717182',
  accent: '#e9ebef',
  accentForeground: '#030213',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  border: 'rgba(0, 0, 0, 0.1)',
  input: 'transparent',
  inputBackground: '#f3f3f5',
  ring: '#b3b3b3',
};

export const radius = {
  sm: 6, // 10px - 4px
  md: 8, // 10px - 2px
  lg: 10, // 10px
  xl: 14, // 10px + 4px
};

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};
