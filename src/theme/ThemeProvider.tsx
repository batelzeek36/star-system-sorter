/**
 * Theme Provider
 * Provides design tokens and theme utilities to the app
 * 
 * @deprecated This component is deprecated after NativeWind migration.
 * Most components now use className utilities with Tailwind.
 * For components that need runtime theme values (animations, SVG, complex calculations),
 * continue using useTheme() hook. The ThemeProvider wrapper in App.tsx can be removed
 * once all components are migrated to NativeWind or use direct token imports.
 * 
 * Migration path:
 * - Static styles: Use className utilities (e.g., className="bg-lavender-500 p-4")
 * - Dynamic styles: Import tokens directly from './tokens' (e.g., import { colors } from '@/theme/tokens')
 * - Complex runtime styles: Continue using useTheme() hook (e.g., animations, SVG, calculations)
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { colors, spacing, borderRadius, typography, elevation, motion, components } from './tokens';

export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  elevation: typeof elevation;
  motion: typeof motion;
  components: typeof components;
}

const theme: Theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  elevation,
  motion,
  components,
};

const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * @deprecated Use className utilities or import tokens directly.
 * This provider is kept for backward compatibility with components
 * that still use useTheme() for runtime styling (animations, SVG, etc.).
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * @deprecated For new components, use className utilities or import tokens directly.
 * This hook is kept for components that need runtime theme values (animations, SVG, calculations).
 * 
 * @example
 * // ❌ Old way (deprecated for static styles)
 * const theme = useTheme();
 * <View style={{ backgroundColor: theme.colors.lavender[500] }} />
 * 
 * // ✅ New way (use className)
 * <View className="bg-lavender-500" />
 * 
 * // ✅ Still valid (for runtime/dynamic styles)
 * const theme = useTheme();
 * <Animated.View style={{ backgroundColor: animatedColor }} />
 */
export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
