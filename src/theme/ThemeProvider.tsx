/**
 * Theme Provider
 * Provides design tokens and theme utilities to the app
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

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
