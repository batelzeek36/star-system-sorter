# Design Document: Figma Design Restoration

## Overview

This design outlines the approach to restore pixel-perfect visual parity between the React Native mobile app and the original Figma React Web prototypes. The NativeWind migration lost critical visual design elements including gradients, shadows, color accuracy, and the overall "Ethereal Flow" aesthetic. This restoration will systematically audit, map, and reimplement all design tokens and component styles to match the Figma source of truth.

## Architecture

### Design Token Flow

```
Figma/design-tokens.json
    ↓
Token Audit & Analysis
    ↓
Tailwind Config Mapping
    ↓
NativeWind Theme Extension
    ↓
React Native Components
    ↓
Visual Verification
```

### Component Restoration Flow

```
Figma/components/s3/*.tsx (React Web)
    ↓
Style Extraction & Analysis
    ↓
NativeWind Class Mapping
    ↓
src/components/*.tsx (React Native)
    ↓
Visual Comparison & Iteration
```

## Components and Interfaces

### 1. Design Token Mapping System

**Purpose:** Convert Figma design tokens to NativeWind/Tailwind configuration

**Files:**
- `tailwind.config.js` - Extended with Figma tokens
- `src/theme/figma-tokens.ts` - TypeScript token definitions
- `src/theme/token-mapping.ts` - Mapping utilities

**Token Categories:**

#### Colors
```typescript
// Figma tokens → Tailwind config
colors: {
  'canvas-dark': '#0a0612',
  'canvas-darker': '#060408',
  'surface-subtle': '#1a0f2e',
  'surface-muted': '#0f0820',
  lavender: {
    100: '#f3f0ff',
    200: '#e9e3ff',
    300: '#d4c5ff',
    400: '#c4b5fd',
    500: '#a78bfa', // Primary
    600: '#8b5cf6',
    700: '#7c3aed',
    800: '#6d28d9',
    900: '#5b21b6',
  },
  gold: {
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24', // Primary highlight
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
  borders: {
    subtle: 'rgba(167, 139, 250, 0.1)',
    muted: 'rgba(167, 139, 250, 0.2)',
    emphasis: 'rgba(167, 139, 250, 0.4)',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
}
```

#### Spacing
```typescript
spacing: {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  11: '44px', // Touch target minimum
  12: '48px',
  16: '64px',
}
```

#### Border Radius
```typescript
borderRadius: {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
}
```

#### Shadows (Elevation)
```typescript
// React Native shadow properties
elevation: {
  0: { shadowOpacity: 0 },
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2, // Android
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
  },
}
```

### 2. Component Style Restoration

**Purpose:** Restore each component to match Figma visual design

#### Button Component

**Figma Reference:** `Figma/components/s3/Button.tsx`

**Key Visual Elements:**
- Gradient backgrounds (primary variant)
- Rounded full (pill shape)
- Elevation shadows
- Scale transform on press (0.98)
- Focus ring on keyboard navigation
- Loading spinner state

**NativeWind Implementation:**
```typescript
// Primary variant
className="
  bg-gradient-to-r from-lavender-500 to-lavender-400
  rounded-full
  min-h-[44px] px-6 py-3
  shadow-elevation-2
  active:scale-[0.98] active:shadow-elevation-1
  disabled:opacity-40
"
```

**React Native Gradient:**
```typescript
import LinearGradient from 'react-native-linear-gradient';

<LinearGradient
  colors={['#a78bfa', '#c4b5fd']} // lavender-500 to lavender-400
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={[styles.button, styles.primary]}
>
  {children}
</LinearGradient>
```

#### Field Component

**Figma Reference:** `Figma/components/s3/Field.tsx`

**Key Visual Elements:**
- Background: lavender-900/20 (rgba)
- Border: borders-muted
- Focus state: lavender-400 border + focus ring
- Error state: semantic-error border + icon
- Icon positioning: leading (left side)
- Border radius: xl (24px)

**NativeWind Implementation:**
```typescript
// Default state
className="
  bg-lavender-900/20
  border border-borders-muted
  rounded-xl
  min-h-[44px] px-4 py-3
  flex-row items-center gap-3
"

// Focus state
className="
  bg-lavender-900/30
  border-lavender-400
  shadow-focus-ring
"

// Error state
className="
  bg-semantic-error/10
  border-semantic-error
  shadow-focus-ring-error
"
```

#### Card Component

**Figma Reference:** `Figma/components/s3/Card.tsx`

**Key Visual Elements:**
- Gradient background: from-lavender-900/20 to-lavender-800/10
- Border: borders-muted
- Border radius: xl (24px)
- Backdrop blur (if supported)
- Padding: 4 (16px)

**NativeWind Implementation:**
```typescript
// Default variant
className="
  bg-gradient-to-br from-lavender-900/20 to-lavender-800/10
  border border-borders-muted
  rounded-xl
  p-4
"

// Emphasis variant
className="
  bg-gradient-to-br from-lavender-600/30 to-lavender-700/20
  border border-lavender-400/40
  shadow-elevation-2
  rounded-xl
  p-4
"
```

**React Native Gradient:**
```typescript
<LinearGradient
  colors={['rgba(91, 33, 182, 0.2)', 'rgba(109, 40, 217, 0.1)']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 1}}
  style={styles.card}
>
  {children}
</LinearGradient>
```

### 3. Screen Layout Restoration

**Purpose:** Restore screen layouts to match Figma prototypes

#### InputScreen Layout

**Figma Reference:** `Figma/App.tsx` - Screen 02_Input_BirthData

**Layout Structure:**
```
┌─────────────────────────────────┐
│ AppBar (Back + Title)           │
├─────────────────────────────────┤
│ Starfield Background            │
│                                 │
│ Title + Subtitle                │
│                                 │
│ Tabs (Birth Data | Upload PDF)  │
│                                 │
│ Form Fields:                    │
│   - Birth Date (Calendar icon)  │
│   - Birth Time (Clock icon)     │
│   - Birth Location (Pin icon)   │
│   - Time Zone (Dropdown)        │
│                                 │
│ Compute Chart Button            │
│                                 │
└─────────────────────────────────┘
```

**Key Visual Elements:**
- Dark canvas background (#0a0612)
- Starfield animation layer
- Lavender-300 text for labels
- White text for inputs
- Gradient button at bottom
- Proper spacing (gap-4 between fields)

#### ResultScreen Layout

**Figma Reference:** `Figma/App.tsx` - Screen 03_Sort_Result

**Layout Structure:**
```
┌─────────────────────────────────┐
│ "Your Primary Star System"      │
│ Pleiades (gradient text)        │
│                                 │
│ ┌───────────────────────────┐   │
│ │   Radial Chart (62%)      │   │
│ │   with gradient stroke    │   │
│ └───────────────────────────┘   │
│                                 │
│ Ally Chips:                     │
│ [Sirius 18%] [Lyra 12%]        │
│                                 │
│ [View Why] [Generate Narrative] │
│                                 │
│ Disclaimer text                 │
│                                 │
│ TabBar (Home | Community | ...)  │
└─────────────────────────────────┘
```

**Key Visual Elements:**
- Gradient title text
- Radial chart with lavender gradient
- Gold chips for allies
- Gradient buttons
- Subtle disclaimer text
- TabBar with active state

### 4. Starfield Background Component

**Purpose:** Animated cosmic background matching Figma

**Implementation:**
```typescript
// src/components/StarfieldBackground.tsx
import React from 'react';
import { View, Animated } from 'react-native';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  duration: number;
  delay: number;
}

export function StarfieldBackground() {
  const stars = React.useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100,
      opacity: new Animated.Value(0.1),
      duration: 2000 + Math.random() * 3000,
      delay: Math.random() * 2000,
    }));
  }, []);

  React.useEffect(() => {
    stars.forEach(star => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(star.delay),
          Animated.timing(star.opacity, {
            toValue: 0.5,
            duration: star.duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.1,
            duration: star.duration / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [stars]);

  return (
    <View className="absolute inset-0 pointer-events-none">
      {stars.map(star => (
        <Animated.View
          key={star.id}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
}
```

### 5. Gradient Utility System

**Purpose:** Reusable gradient components for React Native

**Implementation:**
```typescript
// src/components/GradientView.tsx
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ViewProps } from 'react-native';

type GradientPreset = 
  | 'button-primary'
  | 'button-secondary'
  | 'card-default'
  | 'card-emphasis'
  | 'text-title';

interface GradientViewProps extends ViewProps {
  preset: GradientPreset;
  children: React.ReactNode;
}

const GRADIENT_PRESETS = {
  'button-primary': {
    colors: ['#a78bfa', '#c4b5fd'], // lavender-500 to lavender-400
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  'card-default': {
    colors: ['rgba(91, 33, 182, 0.2)', 'rgba(109, 40, 217, 0.1)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  'card-emphasis': {
    colors: ['rgba(139, 92, 246, 0.3)', 'rgba(124, 58, 237, 0.2)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  'text-title': {
    colors: ['#e9e3ff', '#c4b5fd'], // lavender-200 to lavender-400
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

export function GradientView({ preset, children, style, ...props }: GradientViewProps) {
  const config = GRADIENT_PRESETS[preset];
  
  return (
    <LinearGradient
      colors={config.colors}
      start={config.start}
      end={config.end}
      style={style}
      {...props}
    >
      {children}
    </LinearGradient>
  );
}
```

## Data Models

### Design Token Schema

```typescript
interface DesignTokens {
  meta: {
    name: string;
    version: string;
    description: string;
    lastUpdated: string;
  };
  colors: {
    canvas: Record<string, ColorToken>;
    surface: Record<string, ColorToken>;
    lavender: Record<string, ColorToken>;
    gold: Record<string, ColorToken>;
    text: Record<string, ColorToken>;
    semantic: Record<string, ColorToken>;
    borders: Record<string, ColorToken>;
  };
  spacing: Record<string, DimensionToken>;
  borderRadius: Record<string, DimensionToken>;
  typography: {
    fontSize: Record<string, DimensionToken>;
    fontWeight: Record<string, NumberToken>;
    lineHeight: Record<string, NumberToken>;
  };
  elevation: Record<string, ShadowToken>;
  effects: {
    focusRing: Record<string, ShadowToken>;
    blur: Record<string, DimensionToken>;
  };
  motion: {
    duration: Record<string, DurationToken>;
    easing: Record<string, CubicBezierToken>;
  };
}

interface ColorToken {
  value: string;
  type: 'color';
  description?: string;
  contrast?: string;
}

interface DimensionToken {
  value: string;
  type: 'dimension';
  description?: string;
}

interface ShadowToken {
  value: string;
  type: 'shadow';
  description?: string;
}
```

### Component Style Schema

```typescript
interface ComponentStyles {
  button: {
    variants: {
      primary: StyleDefinition;
      secondary: StyleDefinition;
      ghost: StyleDefinition;
      destructive: StyleDefinition;
    };
    sizes: {
      sm: StyleDefinition;
      md: StyleDefinition;
      lg: StyleDefinition;
    };
    states: {
      default: StyleDefinition;
      hover: StyleDefinition;
      active: StyleDefinition;
      focus: StyleDefinition;
      disabled: StyleDefinition;
      loading: StyleDefinition;
    };
  };
  field: {
    variants: {
      default: StyleDefinition;
      focus: StyleDefinition;
      error: StyleDefinition;
    };
  };
  card: {
    variants: {
      default: StyleDefinition;
      emphasis: StyleDefinition;
      warning: StyleDefinition;
    };
  };
}

interface StyleDefinition {
  className?: string; // NativeWind classes
  style?: object; // React Native style object
  gradient?: GradientConfig;
  shadow?: ShadowConfig;
}
```

## Error Handling

### Design Token Validation

```typescript
// Validate that all Figma tokens are mapped
function validateTokenMapping(
  figmaTokens: DesignTokens,
  tailwindConfig: TailwindConfig
): ValidationResult {
  const errors: string[] = [];
  
  // Check color mappings
  Object.keys(figmaTokens.colors).forEach(category => {
    if (!tailwindConfig.theme.colors[category]) {
      errors.push(`Missing color category: ${category}`);
    }
  });
  
  // Check spacing mappings
  Object.keys(figmaTokens.spacing).forEach(key => {
    if (!tailwindConfig.theme.spacing[key]) {
      errors.push(`Missing spacing value: ${key}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Visual Regression Detection

```typescript
// Compare screenshots for visual differences
async function detectVisualRegression(
  currentScreenshot: string,
  referenceScreenshot: string,
  threshold: number = 0.01 // 1% difference threshold
): Promise<RegressionResult> {
  const diff = await compareImages(currentScreenshot, referenceScreenshot);
  
  return {
    passed: diff.percentageDifference < threshold,
    percentageDifference: diff.percentageDifference,
    diffImage: diff.diffImagePath,
    affectedAreas: diff.regions,
  };
}
```

## Testing Strategy

### 1. Token Mapping Tests

```typescript
describe('Design Token Mapping', () => {
  it('should map all Figma color tokens to Tailwind', () => {
    const figmaTokens = loadFigmaTokens();
    const tailwindConfig = loadTailwindConfig();
    
    const result = validateTokenMapping(figmaTokens, tailwindConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should preserve exact color values', () => {
    expect(theme.colors['lavender-500']).toBe('#a78bfa');
    expect(theme.colors['canvas-dark']).toBe('#0a0612');
  });
});
```

### 2. Component Visual Tests

```typescript
describe('Button Visual Parity', () => {
  it('should match Figma primary button styling', () => {
    const { getByTestId } = render(
      <Button variant="primary" testID="button">
        Test Button
      </Button>
    );
    
    const button = getByTestId('button');
    const styles = getComputedStyles(button);
    
    expect(styles.backgroundColor).toContain('gradient');
    expect(styles.borderRadius).toBe('9999px');
    expect(styles.minHeight).toBe('44px');
  });
});
```

### 3. Screenshot Comparison Tests

```typescript
describe('Screen Visual Regression', () => {
  it('should match Figma InputScreen design', async () => {
    const { toJSON } = render(<InputScreen />);
    const screenshot = await captureScreenshot(toJSON());
    
    const result = await detectVisualRegression(
      screenshot,
      'figma-references/input-screen.png'
    );
    
    expect(result.passed).toBe(true);
    expect(result.percentageDifference).toBeLessThan(0.01);
  });
});
```

### 4. Gradient Rendering Tests

```typescript
describe('Gradient Rendering', () => {
  it('should render LinearGradient with correct colors', () => {
    const { UNSAFE_getByType } = render(
      <GradientView preset="button-primary">
        <Text>Content</Text>
      </GradientView>
    );
    
    const gradient = UNSAFE_getByType(LinearGradient);
    expect(gradient.props.colors).toEqual(['#a78bfa', '#c4b5fd']);
  });
});
```

## Implementation Phases

### Phase 1: Token Audit and Mapping (Foundation)
- Audit all Figma design tokens
- Create comprehensive Tailwind config
- Implement token validation tests
- Document token usage patterns

### Phase 2: Component Restoration (Core)
- Restore Button component styling
- Restore Field component styling
- Restore Card component styling
- Restore Chip component styling
- Implement gradient utilities
- Add shadow/elevation utilities

### Phase 3: Screen Layout Restoration (Integration)
- Restore InputScreen layout and styling
- Restore OnboardingScreen with starfield
- Restore ResultScreen with radial chart
- Restore WhyScreen with contributor cards
- Restore ProfileScreen layout

### Phase 4: Effects and Polish (Enhancement)
- Implement starfield background animation
- Add focus ring effects
- Implement backdrop blur (where supported)
- Add press/active state animations
- Optimize gradient performance

### Phase 5: Verification and Testing (Quality)
- Capture reference screenshots from Figma
- Implement visual regression tests
- Create side-by-side comparison tool
- Document any intentional deviations
- Final QA approval

## Performance Considerations

### Gradient Optimization
- Use `react-native-linear-gradient` for native performance
- Cache gradient configurations
- Avoid re-creating gradient instances on re-render

### Shadow Optimization
- Use platform-specific shadow properties
- Avoid excessive elevation levels
- Consider using images for complex shadows on Android

### Animation Performance
- Use `useNativeDriver: true` for starfield animations
- Limit number of animated stars on low-end devices
- Implement shouldComponentUpdate for static elements

## Accessibility Considerations

- Maintain WCAG AA contrast ratios from Figma tokens
- Ensure 44px minimum touch targets
- Preserve focus ring visibility
- Test with screen readers
- Support reduced motion preferences

## Documentation Requirements

- Token mapping reference guide
- Component style guide with Figma comparisons
- Visual regression test setup guide
- Gradient usage patterns
- Shadow/elevation usage guide
- Before/after screenshots for all components
