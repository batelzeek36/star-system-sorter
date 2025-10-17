# NativeWind Primitive Components

This directory contains primitive UI components built with NativeWind (Tailwind CSS for React Native). These components provide a consistent, accessible foundation for building the Star System Sorter application.

## Overview

All primitives follow these principles:

- **Design Token Driven**: All styling values come from `Figma/design-tokens.json`
- **Accessibility First**: WCAG 2.1 AA compliant with minimum 44px touch targets
- **Platform Adaptive**: Handle iOS and Android differences gracefully
- **Composable**: Support `className` prop for custom styling
- **Type Safe**: Full TypeScript support with strict mode

## Design Token Reference

All components reference design tokens from `Figma/design-tokens.json`. The tokens are mapped to Tailwind utilities in `tailwind.config.js`:

| Figma Token | Tailwind Class | Value |
|-------------|----------------|-------|
| `colors.canvas.dark` | `bg-canvas-dark` | `#0a0612` |
| `colors.lavender.500` | `bg-lavender-500` | `#a78bfa` |
| `colors.surface.subtle` | `bg-surface-subtle` | `#1a0f2e` |
| `borderRadius.md` | `rounded-md` | `12px` |
| `borderRadius.xl` | `rounded-3xl` | `24px` |
| `spacing.4` | `p-4` | `16px` |
| `spacing.6` | `p-6` | `24px` |
| `components.touchTarget.minimum` | `min-h-[44px]` | `44px` |

See `Figma/design-tokens.json` for the complete token reference.

---

## Components

### Button

Interactive button component with multiple variants and sizes.

**Variants**: `primary`, `secondary`, `ghost`, `destructive`, `outline`, `link`  
**Sizes**: `sm`, `md`, `lg` (all enforce 44px minimum touch target)

#### Design Rationale

- **Touch Targets**: All sizes use `min-h-[44px]` to meet WCAG 2.1 AA requirements
- **Platform Elevation**: Uses `Platform.select` for Android elevation (4dp) and iOS shadow
- **Loading States**: Built-in `ActivityIndicator` support with variant-appropriate colors
- **Icon Support**: Optional `leadingIcon` prop for icon + text combinations

#### Usage

```tsx
import { Button } from '@/ui';

// Primary button (default)
<Button onPress={handleSubmit}>
  Submit
</Button>

// Secondary with icon
<Button 
  variant="secondary" 
  size="lg"
  leadingIcon={<Icon />}
  onPress={handleAction}
>
  Continue
</Button>

// Loading state
<Button loading disabled>
  Processing...
</Button>

// Custom styling
<Button className="mt-4 w-full">
  Full Width Button
</Button>
```

#### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  className?: string;
}
```

#### Design Tokens Used

- Colors: `lavender-500` (primary), `semantic.error` (destructive), `borders.emphasis`
- Border radius: `borderRadius.md` (12px)
- Elevation: `elevation.2` (Android shadow)
- Touch target: `components.touchTarget.minimum` (44px)

---

### Card

Container component with elevation and optional gradient overlays.

**Variants**: `default`, `emphasis`, `warning`  
**Structure**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`

#### Design Rationale

- **Gradient Simulation**: React Native doesn't support CSS gradients natively. We simulate gradients using layered Views with `StyleSheet.absoluteFill` and opacity
- **Overlay Positioning**: Uses `absolute inset-0` pattern with `pointerEvents="none"` to prevent interaction blocking
- **Elevation**: Only `emphasis` variant receives platform-specific shadows
- **Composable Structure**: Separate components for header, title, and description allow flexible layouts

#### Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/ui';

// Basic card
<Card>
  <Text>Card content</Text>
</Card>

// Card with header structure
<Card variant="emphasis">
  <CardHeader>
    <CardTitle>Star System Result</CardTitle>
    <CardDescription>
      Your classification based on birth data
    </CardDescription>
  </CardHeader>
  <View className="p-6">
    {/* Additional content */}
  </View>
</Card>

// Warning variant
<Card variant="warning" className="mb-4">
  <CardHeader>
    <CardTitle>Important Notice</CardTitle>
    <CardDescription>Please review carefully</CardDescription>
  </CardHeader>
</Card>
```

#### Props

```typescript
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
```

#### Design Tokens Used

- Background: `surface.subtle` (#1a0f2e)
- Border: `borders.subtle` (rgba(167, 139, 250, 0.1))
- Border radius: `borderRadius.xl` (24px)
- Padding: `spacing.6` (24px)
- Elevation: `elevation.1` (Android shadow)

#### Gradient Implementation

The gradient overlay is achieved through layered Views:

```tsx
<View style={[styles.container]}>
  {/* Gradient overlay layer */}
  <View
    style={[
      StyleSheet.absoluteFill,
      { backgroundColor: overlayColor }
    ]}
    pointerEvents="none"
  />
  
  {/* Content layer */}
  <View style={styles.content}>
    {children}
  </View>
</View>
```

This pattern simulates the `gradient-to-br` effect from web CSS while maintaining React Native compatibility.

---

### Input

Form input component with label, icon, and error states.

**Features**: Label support, icon integration, focus states, error handling

#### Design Rationale

- **Focus Ring Simulation**: Uses platform-specific shadows to simulate CSS focus rings (`effects.focusRing`)
- **Conditional Styling**: Template literals compose className based on focus/error state
- **Icon Color Adaptation**: Clones icon element with appropriate color based on state
- **Accessibility**: Associates label with input, announces errors via `accessibilityLiveRegion`
- **Flexible Layout**: Supports both standalone input and input-with-icon layouts

#### Usage

```tsx
import { Input } from '@/ui';

// Basic input with label
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// Input with icon
<Input
  label="Location"
  icon={<LocationIcon />}
  placeholder="City name"
  value={location}
  onChangeText={setLocation}
/>

// Error state
<Input
  label="Birth Time"
  value={time}
  onChangeText={setTime}
  error="Invalid time format"
/>

// Helper text
<Input
  label="Name"
  helperText="Enter your full name"
  value={name}
  onChangeText={setName}
/>
```

#### Props

```typescript
interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
  containerClassName?: string;
  testID?: string;
}
```

#### Design Tokens Used

- Background: `surface.muted` (#0f0820)
- Border: `borders.muted` (rgba(167, 139, 250, 0.2))
- Focus border: `lavender-500` (#a78bfa)
- Error border: `semantic.error` (#ef4444)
- Border radius: `borderRadius.md` (12px)
- Padding: `spacing.4` (16px)
- Font size: `typography.fontSize.base` (16px)
- Focus ring: `effects.focusRing.default` (0 0 0 3px rgba(167, 139, 250, 0.4))
- Touch target: `min-h-[44px]` (44px)

#### Focus State Implementation

Focus states use conditional className composition:

```tsx
const borderClasses = hasError
  ? 'border-semantic-error'
  : isFocused
  ? 'border-lavender-500'
  : 'border-borders-muted';
```

Platform-specific shadows simulate the focus ring effect:

```tsx
const focusRingStyle: ViewStyle = isFocused
  ? Platform.select({
      ios: {
        shadowColor: hasError ? '#ef4444' : '#a78bfa',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: {
        elevation: hasError ? 3 : 2,
      },
    })
  : {};
```

---

### Sheet

Modal presentation component with overlay and slide-up animation.

**Structure**: `Sheet`, `SheetHeader`, `SheetTitle`, `SheetDescription`  
**Animation**: Slide from bottom with 200ms duration

#### Design Rationale

- **Modal API**: Uses React Native's `Modal` component with `transparent` and `animationType="slide"`
- **Overlay Dismissal**: `TouchableWithoutFeedback` on overlay allows tap-to-dismiss
- **Content Protection**: Inner `TouchableWithoutFeedback` prevents dismissal when tapping content
- **Top Corners**: Uses `rounded-t-3xl` (24px) for top-only border radius
- **High Elevation**: `elevation.4` provides strong visual separation from background

#### Usage

```tsx
import { Sheet, SheetHeader, SheetTitle, SheetDescription } from '@/ui';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>
        Open Sheet
      </Button>

      <Sheet visible={isOpen} onClose={() => setIsOpen(false)}>
        <SheetHeader>
          <SheetTitle>Confirmation</SheetTitle>
          <SheetDescription>
            Are you sure you want to proceed?
          </SheetDescription>
        </SheetHeader>
        
        <View className="p-6 gap-4">
          <Button onPress={handleConfirm}>Confirm</Button>
          <Button variant="ghost" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
        </View>
      </Sheet>
    </>
  );
}
```

#### Props

```typescript
interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle;
}

interface SheetDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle;
}
```

#### Design Tokens Used

- Background: `canvas.dark` (#0a0612)
- Overlay: `bg-black/50` (50% opacity)
- Border radius: `borderRadius.xl` (24px) for top corners
- Elevation: `elevation.4` (high elevation shadow)
- Animation: `motion.duration.normal` (200ms)
- Padding: `spacing.6` (24px)

---

## Common Patterns

### Conditional className Composition

Use template literals for dynamic styling:

```tsx
const className = `base-classes ${
  isActive ? 'active-classes' : 'inactive-classes'
} ${customClassName}`.trim();
```

### Platform-Specific Styling

Use `Platform.select` for elevation and shadows:

```tsx
const platformStyle = Platform.select({
  android: { elevation: 4 },
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
```

### Touch Target Enforcement

Always use `min-h-[44px]` for interactive elements:

```tsx
<TouchableOpacity className="min-h-[44px] px-4 py-2">
  <Text>Tap Me</Text>
</TouchableOpacity>
```

### Gradient Simulation

Layer Views with `StyleSheet.absoluteFill`:

```tsx
<View style={styles.container}>
  <View
    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(...)' }]}
    pointerEvents="none"
  />
  <View style={styles.content}>
    {children}
  </View>
</View>
```

---

## Matching Figma Designs

All primitives are designed to match `Figma/components/ui/` designs:

- **Button**: Matches `Figma/components/ui/button.tsx` variants and sizes
- **Card**: Matches `Figma/components/ui/card.tsx` structure and styling
- **Input**: Matches `Figma/components/ui/input.tsx` with label and error states
- **Sheet**: Matches `Figma/components/ui/sheet.tsx` modal presentation

### Visual Parity Checklist

When implementing screens with these primitives:

- ✅ Colors match `Figma/design-tokens.json` exactly
- ✅ Spacing uses 4px grid system (`spacing.1` through `spacing.16`)
- ✅ Border radius matches token values (`sm`, `md`, `lg`, `xl`)
- ✅ Typography uses token font sizes and weights
- ✅ Touch targets are ≥44px (WCAG 2.1 AA)
- ✅ Platform-specific shadows match elevation tokens
- ✅ Focus states use `effects.focusRing` values

---

## Accessibility

All primitives follow WCAG 2.1 AA guidelines:

### Touch Targets

Minimum 44x44px for all interactive elements:

```tsx
// ✅ Good
<Button size="sm">Tap Me</Button> // min-h-[44px]

// ❌ Bad
<TouchableOpacity className="h-8 px-2">
  <Text>Too Small</Text>
</TouchableOpacity>
```

### Color Contrast

All text colors meet contrast requirements:

- `text-primary` (#ffffff): 21:1 on `canvas-dark`
- `text-secondary` (#e5e7eb): 14.8:1 on `canvas-dark`
- `text-muted` (#9ca3af): 7.2:1 on `canvas-dark`

### Screen Reader Support

All components include proper accessibility props:

```tsx
<Button
  accessibilityLabel="Submit form"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
>
  Submit
</Button>
```

### Focus Management

Input components announce errors via `accessibilityLiveRegion`:

```tsx
<Text
  accessibilityRole="text"
  accessibilityLiveRegion={hasError ? 'polite' : 'none'}
>
  {error || helperText}
</Text>
```

---

## Testing

All primitives have comprehensive unit tests in `__tests__/ui-*.test.tsx`:

- **Button**: Variant rendering, touch targets, platform elevation, loading states
- **Card**: Gradient simulation, overlay positioning, platform elevation
- **Input**: Focus states, error states, label association, icon integration
- **Sheet**: Modal open/close, overlay dismissal, content area protection

Run tests:

```bash
npm test -- ui-button
npm test -- ui-card
npm test -- ui-input
npm test -- ui-sheet
```

---

## Migration Guide

When converting existing components to use these primitives:

1. **Replace StyleSheet with className**:
   ```tsx
   // Before
   <View style={styles.container}>
   
   // After
   <View className="bg-surface-subtle rounded-3xl p-6">
   ```

2. **Update component imports**:
   ```tsx
   // Before
   import { Button } from '@/components/Button';
   
   // After
   import { Button } from '@/ui';
   ```

3. **Preserve existing props**:
   ```tsx
   // Primitives maintain same API as original components
   <Button
     variant="primary"
     onPress={handlePress}
     testID="submit-button"
   >
     Submit
   </Button>
   ```

4. **Add custom styling via className**:
   ```tsx
   <Button className="mt-4 w-full">
     Full Width Button
   </Button>
   ```

See `.kiro/specs/nativewind-migration/CHANGELOG.md` for detailed migration patterns.

---

## Resources

- **Design Tokens**: `Figma/design-tokens.json`
- **Tailwind Config**: `tailwind.config.js`
- **Migration Guide**: `.kiro/specs/nativewind-migration/CHANGELOG.md`
- **Figma Components**: `Figma/components/ui/`
- **Test Examples**: `__tests__/ui-*.test.tsx`

---

## Contributing

When adding new primitives:

1. Reference `Figma/design-tokens.json` for all design values
2. Enforce 44px minimum touch targets for interactive elements
3. Use `Platform.select` for platform-specific styling
4. Support `className` prop for custom styling
5. Include comprehensive unit tests
6. Document usage examples and design rationale
7. Maintain file size within 300 LOC soft limit

---

**Last Updated**: Phase 4 - NativeWind Migration Complete
