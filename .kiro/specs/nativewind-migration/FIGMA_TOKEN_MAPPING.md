# Figma Design Token Mapping to Tailwind CSS

This document describes how Figma design tokens from `Figma/design-tokens.json` are mapped to Tailwind CSS utilities in `tailwind.config.js`.

## Fully Supported Tokens

### Colors

All color tokens from Figma are fully supported in Tailwind and can be used with className utilities.

| Figma Token | Tailwind Class | Example Usage |
|-------------|----------------|---------------|
| `colors.canvas.dark` | `bg-canvas-dark` | `<View className="bg-canvas-dark">` |
| `colors.canvas.darker` | `bg-canvas-darker` | `<View className="bg-canvas-darker">` |
| `colors.surface.subtle` | `bg-surface-subtle` | `<View className="bg-surface-subtle">` |
| `colors.surface.muted` | `bg-surface-muted` | `<View className="bg-surface-muted">` |
| `colors.lavender.{100-900}` | `bg-lavender-{100-900}` | `<View className="bg-lavender-500">` |
| `colors.gold.{100-700}` | `bg-gold-{100-700}` | `<View className="bg-gold-400">` |
| `colors.text.primary` | `text-text-primary` | `<Text className="text-text-primary">` |
| `colors.text.secondary` | `text-text-secondary` | `<Text className="text-text-secondary">` |
| `colors.text.muted` | `text-text-muted` | `<Text className="text-text-muted">` |
| `colors.text.subtle` | `text-text-subtle` | `<Text className="text-text-subtle">` |
| `colors.semantic.success` | `bg-semantic-success` | `<View className="bg-semantic-success">` |
| `colors.semantic.error` | `bg-semantic-error` | `<View className="bg-semantic-error">` |
| `colors.semantic.warning` | `bg-semantic-warning` | `<View className="bg-semantic-warning">` |
| `colors.semantic.info` | `bg-semantic-info` | `<View className="bg-semantic-info">` |
| `colors.borders.subtle` | `border-borders-subtle` | `<View className="border border-borders-subtle">` |
| `colors.borders.muted` | `border-borders-muted` | `<View className="border border-borders-muted">` |
| `colors.borders.emphasis` | `border-borders-emphasis` | `<View className="border border-borders-emphasis">` |

### Spacing

All spacing tokens from Figma are fully supported. Based on 4px grid system.

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `spacing.1` | `p-1`, `m-1`, `gap-1` | 4px | `<View className="p-1">` |
| `spacing.2` | `p-2`, `m-2`, `gap-2` | 8px | `<View className="p-2">` |
| `spacing.3` | `p-3`, `m-3`, `gap-3` | 12px | `<View className="p-3">` |
| `spacing.4` | `p-4`, `m-4`, `gap-4` | 16px | `<View className="p-4">` |
| `spacing.5` | `p-5`, `m-5`, `gap-5` | 20px | `<View className="p-5">` |
| `spacing.6` | `p-6`, `m-6`, `gap-6` | 24px | `<View className="p-6">` |
| `spacing.8` | `p-8`, `m-8`, `gap-8` | 32px | `<View className="p-8">` |
| `spacing.10` | `p-10`, `m-10`, `gap-10` | 40px | `<View className="p-10">` |
| `spacing.11` | `p-11`, `m-11`, `min-h-11` | 44px | `<View className="min-h-11">` (touch target) |
| `spacing.12` | `p-12`, `m-12`, `gap-12` | 48px | `<View className="p-12">` |
| `spacing.16` | `p-16`, `m-16`, `gap-16` | 64px | `<View className="p-16">` |

**Note:** `spacing.11` (44px) is the WCAG 2.1 AA minimum touch target size.

### Border Radius

All borderRadius tokens from Figma are fully supported.

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `borderRadius.sm` | `rounded-sm` | 8px | `<View className="rounded-sm">` |
| `borderRadius.md` | `rounded-md` | 12px | `<View className="rounded-md">` |
| `borderRadius.lg` | `rounded-lg` | 16px | `<View className="rounded-lg">` |
| `borderRadius.xl` | `rounded-xl` | 24px | `<View className="rounded-xl">` |
| `borderRadius.full` | `rounded-full` | 9999px | `<View className="rounded-full">` (pill shape) |

### Typography

All typography tokens from Figma are fully supported.

#### Font Size

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `typography.fontSize.xs` | `text-xs` | 12px | `<Text className="text-xs">` |
| `typography.fontSize.sm` | `text-sm` | 14px | `<Text className="text-sm">` |
| `typography.fontSize.base` | `text-base` | 16px | `<Text className="text-base">` |
| `typography.fontSize.lg` | `text-lg` | 18px | `<Text className="text-lg">` |
| `typography.fontSize.xl` | `text-xl` | 20px | `<Text className="text-xl">` |
| `typography.fontSize.2xl` | `text-2xl` | 24px | `<Text className="text-2xl">` |
| `typography.fontSize.3xl` | `text-3xl` | 30px | `<Text className="text-3xl">` |
| `typography.fontSize.4xl` | `text-4xl` | 36px | `<Text className="text-4xl">` |

#### Font Weight

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `typography.fontWeight.normal` | `font-normal` | 400 | `<Text className="font-normal">` |
| `typography.fontWeight.medium` | `font-medium` | 500 | `<Text className="font-medium">` |
| `typography.fontWeight.semibold` | `font-semibold` | 600 | `<Text className="font-semibold">` |
| `typography.fontWeight.bold` | `font-bold` | 700 | `<Text className="font-bold">` |

#### Line Height

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `typography.lineHeight.tight` | `leading-tight` | 1.25 | `<Text className="leading-tight">` |
| `typography.lineHeight.normal` | `leading-normal` | 1.5 | `<Text className="leading-normal">` |
| `typography.lineHeight.relaxed` | `leading-relaxed` | 1.75 | `<Text className="leading-relaxed">` |

### Motion/Animation

All motion tokens from Figma are mapped to Tailwind transition utilities.

#### Duration

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `motion.duration.fast` | `duration-fast` | 150ms | `<View className="transition duration-fast">` |
| `motion.duration.normal` | `duration-normal` | 200ms | `<View className="transition duration-normal">` |
| `motion.duration.slow` | `duration-slow` | 300ms | `<View className="transition duration-slow">` |
| `motion.duration.slower` | `duration-slower` | 500ms | `<View className="transition duration-slower">` |

#### Easing

| Figma Token | Tailwind Class | Value | Example Usage |
|-------------|----------------|-------|---------------|
| `motion.easing.default` | `ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | `<View className="transition ease-default">` |
| `motion.easing.in` | `ease-in` | cubic-bezier(0.4, 0, 1, 1) | `<View className="transition ease-in">` |
| `motion.easing.out` | `ease-out` | cubic-bezier(0, 0, 0.2, 1) | `<View className="transition ease-out">` |
| `motion.easing.inOut` | `ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | `<View className="transition ease-in-out">` |

## Partially Supported Tokens

### Elevation (boxShadow)

**Status:** Mapped to Tailwind but requires platform-specific implementation in React Native.

| Figma Token | Tailwind Class | iOS Implementation | Android Implementation |
|-------------|----------------|-------------------|------------------------|
| `elevation.0` | `shadow-elevation-0` | No shadow | `elevation: 0` |
| `elevation.1` | `shadow-elevation-1` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` | `elevation: 2` |
| `elevation.2` | `shadow-elevation-2` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` | `elevation: 4` |
| `elevation.3` | `shadow-elevation-3` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` | `elevation: 8` |
| `elevation.4` | `shadow-elevation-4` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` | `elevation: 12` |

**Implementation Pattern:**

```typescript
// iOS: Use Tailwind shadow utilities
<View className="shadow-md shadow-black/50">

// Android: Use Platform.select for elevation
<View 
  className="shadow-md shadow-black/50"
  style={Platform.select({
    android: { elevation: 4 }
  })}
>
```

### Focus Ring Effects

**Status:** Mapped to Tailwind but requires custom implementation in React Native.

| Figma Token | Tailwind Class | React Native Implementation |
|-------------|----------------|----------------------------|
| `effects.focusRing.default` | `shadow-focus-default` | Custom border or outline on focus state |
| `effects.focusRing.error` | `shadow-focus-error` | Custom border or outline on error state |

**Implementation Pattern:**

```typescript
// Use conditional className based on focus state
<TextInput
  className={`border-2 ${isFocused ? 'border-lavender-500' : 'border-borders-muted'}`}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
/>
```

## Unsupported Tokens

### Blur Effects

**Status:** Not supported in React Native without third-party libraries.

| Figma Token | Tailwind Class | React Native Alternative |
|-------------|----------------|--------------------------|
| `effects.blur.sm` | `blur-sm` | Use `@react-native-community/blur` or `expo-blur` |
| `effects.blur.md` | `blur-md` | Use `@react-native-community/blur` or `expo-blur` |
| `effects.blur.lg` | `blur-lg` | Use `@react-native-community/blur` or `expo-blur` |
| `effects.blur.xl` | `blur-xl` | Use `@react-native-community/blur` or `expo-blur` |

**Reason:** React Native does not support CSS `filter: blur()` natively. Blur effects require platform-specific native modules.

**Recommendation:** If blur effects are needed, use a dedicated blur library like `@react-native-community/blur` or implement platform-specific blur views.

## Component-Specific Tokens

### Button Sizes

Figma defines button sizes with specific dimensions. These should be implemented in the Button primitive component:

| Size | Min Height | Padding X | Padding Y | Font Size |
|------|-----------|-----------|-----------|-----------|
| sm | 44px | 16px | 8px | 14px |
| md | 44px | 24px | 12px | 16px |
| lg | 48px | 32px | 16px | 18px |

**Implementation:**

```typescript
const buttonSizes = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-11 px-6 py-3 text-base',
  lg: 'min-h-12 px-8 py-4 text-lg',
};
```

### Touch Target Minimum

**Value:** 44px (WCAG 2.1 AA compliance)

**Usage:** Always use `min-h-11` (44px) for interactive elements.

```typescript
<Pressable className="min-h-11">
```

## Star System Names

The following star system names are defined in Figma tokens for reference:

- Orion
- Osirian (synonym for Orion)
- Sirius
- Pleiades
- Andromeda
- Lyra
- Arcturus

**Note:** These are data values, not design tokens, and are not mapped to Tailwind.

## Summary

### ✅ Fully Supported (100%)
- Colors (canvas, surface, lavender, gold, text, semantic, borders)
- Spacing (4px grid system)
- Border Radius
- Typography (fontSize, fontWeight, lineHeight)
- Motion (duration, easing)

### ⚠️ Partially Supported (requires platform-specific code)
- Elevation/Shadows (use Platform.select for Android)
- Focus Ring Effects (use conditional className)

### ❌ Not Supported (requires third-party libraries)
- Blur Effects (use @react-native-community/blur)

## Migration Checklist

When converting components from StyleSheet to NativeWind:

1. ✅ Replace color values with Tailwind color classes
2. ✅ Replace spacing values with Tailwind spacing classes
3. ✅ Replace borderRadius with Tailwind rounded classes
4. ✅ Replace fontSize/fontWeight/lineHeight with Tailwind text classes
5. ⚠️ Replace shadows with Platform.select for Android elevation
6. ⚠️ Replace focus states with conditional className
7. ❌ Replace blur effects with native blur libraries (if needed)
8. ✅ Ensure all touch targets use min-h-11 (44px)

## References

- Figma Design Tokens: `Figma/design-tokens.json`
- Tailwind Config: `tailwind.config.js`
- NativeWind Documentation: https://www.nativewind.dev/
