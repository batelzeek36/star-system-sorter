# Theme System

Design tokens and theme utilities for Star System Sorter (S³).

## Overview

The theme system provides:
- **Design Tokens**: Colors, spacing, typography, elevation from Figma
- **Theme Provider**: React context for accessing theme values
- **Style Utilities**: Helper functions for common styling patterns

## Source of Truth

All design tokens are derived from `Figma/design-tokens.json`.

## Usage

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from '@/theme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use the useTheme hook

```tsx
import { useTheme } from '@/theme';
import { View, Text } from 'react-native';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.colors.canvas.dark,
      padding: theme.spacing[4]
    }}>
      <Text style={{ 
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.lg
      }}>
        Hello World
      </Text>
    </View>
  );
}
```

### 3. Use direct imports for static styles

```tsx
import { colors, spacing, typography, elevation } from '@/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.canvas.dark,
    padding: spacing[4],
    ...elevation[2],
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
});
```

### 4. Use style presets

```tsx
import { stylePresets } from '@/theme';

function MyScreen() {
  return (
    <View style={stylePresets.containerPadded}>
      <Text style={stylePresets.heading2}>Title</Text>
      <Text style={stylePresets.textSecondary}>Description</Text>
    </View>
  );
}
```

### 5. Use utility functions

```tsx
import { createTextStyle, createElevatedStyle, createBorderedStyle } from '@/theme';

const styles = StyleSheet.create({
  heading: createTextStyle('2xl', 'bold', 'tight'),
  card: createElevatedStyle(2, colors.surface.subtle),
  input: createBorderedStyle(colors.borders.muted, 'md', 1),
});
```

## Design Tokens

### Colors

```tsx
colors.canvas.dark        // #0a0612 - Primary background
colors.lavender[500]      // #a78bfa - Primary lavender
colors.gold[400]          // #fbbf24 - Primary gold highlight
colors.text.primary       // #ffffff - Primary text
colors.semantic.success   // #10b981 - Success state
```

### Spacing (4px grid)

```tsx
spacing[1]   // 4px
spacing[2]   // 8px
spacing[4]   // 16px
spacing[6]   // 24px
spacing[11]  // 44px - Minimum touch target (WCAG 2.1 AA)
```

### Typography

```tsx
typography.fontSize.base      // 16
typography.fontSize['2xl']    // 24
typography.fontWeight.bold    // '700'
typography.lineHeight.normal  // 1.5
```

### Elevation

```tsx
elevation[0]  // No shadow
elevation[1]  // Subtle lift
elevation[2]  // Small elevation
elevation[3]  // Medium elevation
elevation[4]  // High elevation
```

### Motion

```tsx
motion.duration.fast    // 150ms
motion.duration.normal  // 200ms
motion.duration.slow    // 300ms
```

## Accessibility

- All touch targets meet WCAG 2.1 AA minimum size (44px)
- Text colors meet WCAG contrast requirements
- Semantic colors for success, error, warning, info states

## Component Tokens

```tsx
components.button.sizes.md.minHeight  // 44px
components.touchTarget.minimum        // 44px
```

## Star Systems

```tsx
starSystems.names              // ['Orion', 'Sirius', ...]
starSystems.crestExportSizes   // [24, 28, 48]
```
