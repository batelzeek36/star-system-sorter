/**
 * Design Tokens
 * Converted from Figma/design-tokens.json for React Native
 * 
 * @see Figma/design-tokens.json for source of truth
 */

// Colors
export const colors = {
  canvas: {
    dark: '#0a0612',
    darker: '#060408',
  },
  surface: {
    subtle: '#1a0f2e',
    muted: '#0f0820',
  },
  lavender: {
    100: '#f3f0ff',
    200: '#e9e3ff',
    300: '#d4c5ff',
    400: '#c4b5fd',
    500: '#a78bfa', // Primary lavender
    600: '#8b5cf6',
    700: '#7c3aed',
    800: '#6d28d9',
    900: '#5b21b6',
  },
  gold: {
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24', // Primary gold highlight
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  text: {
    primary: '#ffffff',
    secondary: '#e5e7eb',
    muted: '#9ca3af',
    subtle: '#6b7280',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  borders: {
    subtle: 'rgba(167, 139, 250, 0.1)',
    muted: 'rgba(167, 139, 250, 0.2)',
    emphasis: 'rgba(167, 139, 250, 0.4)',
  },
} as const;

// Spacing (4px grid system)
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  11: 44, // Minimum touch target size (WCAG 2.1 AA)
  12: 48,
  16: 64,
} as const;

// Border Radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999, // Pill shape
} as const;

// Typography
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Elevation (React Native shadow properties)
export const elevation = {
  0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 3,
  },
  4: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 4,
  },
} as const;

// Motion
export const motion = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
} as const;

// Component Tokens
export const components = {
  button: {
    sizes: {
      sm: {
        minHeight: 44,
        paddingX: 16,
        paddingY: 8,
        fontSize: 14,
      },
      md: {
        minHeight: 44,
        paddingX: 24,
        paddingY: 12,
        fontSize: 16,
      },
      lg: {
        minHeight: 48,
        paddingX: 32,
        paddingY: 16,
        fontSize: 18,
      },
    },
  },
  touchTarget: {
    minimum: 44, // WCAG 2.1 AA minimum
  },
} as const;

// Star Systems
export const starSystems = {
  names: [
    'Orion',
    'Osirian',
    'Sirius',
    'Pleiades',
    'Andromeda',
    'Lyra',
    'Arcturus',
  ] as const,
  crestExportSizes: [24, 28, 48] as const,
} as const;
