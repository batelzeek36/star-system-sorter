# Ethereal Flow Style Guide

This document defines the exact styling requirements for the Star System Sorter (S³) app to match the Figma design system.

## Color Palette

### Primary Colors
- **Lavender Primary**: `#a78bfa` (lavender-500) - Main brand color
- **Lavender Accent**: `#c4b5fd` (lavender-400) - Interactive elements
- **Gold Highlight**: `#fbbf24` (gold-400) - Emphasis and highlights

### Canvas & Surfaces
- **Dark Canvas**: `#0a0612` - Primary background
- **Darker Canvas**: `#060408` - Deeper contrast areas
- **Subtle Surface**: `#1a0f2e` - Elevated surfaces
- **Muted Surface**: `#0f0820` - Alternative surfaces

### Text Colors
- **Primary Text**: `#ffffff` (21:1 contrast on dark canvas)
- **Secondary Text**: `#e5e7eb` (14.8:1 contrast)
- **Muted Text**: `#9ca3af` (7.2:1 contrast)
- **Subtle Text**: `#6b7280` (4.7:1 contrast)

### Semantic Colors
- **Success**: `#10b981`
- **Error**: `#ef4444`
- **Warning**: `#f59e0b`
- **Info**: `#3b82f6`

### Borders
- **Subtle**: `rgba(167, 139, 250, 0.1)` - 10% lavender
- **Muted**: `rgba(167, 139, 250, 0.2)` - 20% lavender
- **Emphasis**: `rgba(167, 139, 250, 0.4)` - 40% lavender

## Spacing System

All spacing follows a **4px grid system**:

- `spacing[1]` = 4px
- `spacing[2]` = 8px
- `spacing[3]` = 12px
- `spacing[4]` = 16px
- `spacing[5]` = 20px
- `spacing[6]` = 24px
- `spacing[8]` = 32px
- `spacing[10]` = 40px
- `spacing[11]` = 44px (minimum touch target)
- `spacing[12]` = 48px
- `spacing[16]` = 64px

## Typography

### Font Sizes
- `xs`: 12px - Helper text, disclaimers
- `sm`: 14px - Secondary content, labels
- `base`: 16px - Body text
- `lg`: 18px - Emphasized body text
- `xl`: 20px - Subheadings
- `2xl`: 24px - Section headings
- `3xl`: 30px - Page titles
- `4xl`: 36px - Hero text

### Font Weights
- `normal`: 400 - Body text
- `medium`: 500 - Labels, emphasized text
- `semibold`: 600 - Buttons, important text
- `bold`: 700 - Headings

### Line Heights
- `tight`: 1.25 - Headings
- `normal`: 1.5 - Body text
- `relaxed`: 1.75 - Long-form content

## Border Radius

- `sm`: 8px - Small elements
- `md`: 12px - Cards, containers
- `lg`: 16px - Large cards
- `xl`: 24px - Prominent containers
- `full`: 9999px - Pills, circular elements

## Touch Targets

**WCAG 2.1 AA Requirement**: All interactive elements must have a minimum touch target of **44px × 44px**.

### Button Sizes
- **Small**: 44px min height
- **Medium**: 44px min height
- **Large**: 48px min height

## Component Styling

### Buttons

**Primary Button**:
- Background: `lavender[500]` (#a78bfa)
- Text: `text.primary` (#ffffff)
- Border radius: `full` (pill shape)
- Elevation: `elevation[2]`
- Font weight: `semibold`

**Secondary Button**:
- Background: `rgba(255, 255, 255, 0.05)`
- Border: 1px `borders.emphasis`
- Text: `text.primary`
- Border radius: `full`

**Ghost Button**:
- Background: transparent
- Text: `lavender[300]`
- Border radius: `full`

**Destructive Button**:
- Background: `semantic.error` (#ef4444)
- Text: `text.primary`
- Elevation: `elevation[2]`
- Border radius: `full`

### Fields (Input)

**Default State**:
- Background: `rgba(91, 33, 182, 0.2)` (lavender-900 at 20%)
- Border: 1px `borders.muted`
- Border radius: `xl` (24px)
- Min height: 44px
- Padding: 16px horizontal, 12px vertical

**Focus State**:
- Background: `rgba(91, 33, 182, 0.3)` (lavender-900 at 30%)
- Border: 1px `lavender[400]`
- Elevation: `elevation[1]`

**Error State**:
- Background: `rgba(239, 68, 68, 0.1)` (error at 10%)
- Border: 1px `semantic.error`
- Elevation: `elevation[1]`

### Cards

**Default Card**:
- Background: `rgba(91, 33, 182, 0.2)` (lavender-900 at 20%)
- Border: 1px `borders.muted`
- Border radius: `xl` (24px)
- Padding: 16px

**Emphasis Card**:
- Background: `rgba(139, 92, 246, 0.3)` (lavender-600 at 30%)
- Border: 1px `rgba(196, 181, 253, 0.4)` (lavender-400 at 40%)
- Elevation: `elevation[2]`
- Border radius: `xl`

**Warning Card**:
- Background: `rgba(217, 119, 6, 0.1)` (gold-600 at 10%)
- Border: 1px `rgba(251, 191, 36, 0.4)` (gold-400 at 40%)
- Border radius: `xl`

### Chips

**Lavender Chip**:
- Background: `rgba(167, 139, 250, 0.2)` (lavender-500 at 20%)
- Border: 1px `rgba(196, 181, 253, 0.3)` (lavender-400 at 30%)
- Text: `lavender[300]`
- Border radius: `full`
- Padding: 12px horizontal, 4px vertical

**Gold Chip**:
- Background: `rgba(245, 158, 11, 0.2)` (gold-500 at 20%)
- Border: 1px `rgba(251, 191, 36, 0.4)` (gold-400 at 40%)
- Text: `gold[300]`
- Border radius: `full`

**Selected State**:
- Background: Solid color (lavender-500 or gold-500)
- Text: `text.primary`

## Elevation (Shadows)

React Native shadow properties:

**Level 1** (Subtle lift):
```typescript
{
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 1, // Android
}
```

**Level 2** (Small elevation):
```typescript
{
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 2,
}
```

**Level 3** (Medium elevation):
```typescript
{
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 15,
  elevation: 3,
}
```

**Level 4** (High elevation):
```typescript
{
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.4,
  shadowRadius: 25,
  elevation: 4,
}
```

## Motion & Animation

### Durations
- **Fast**: 150ms - Micro-interactions
- **Normal**: 200ms - Standard transitions
- **Slow**: 300ms - Complex animations
- **Slower**: 500ms - Page transitions

### Easing
Use default easing for all animations: `cubic-bezier(0.4, 0, 0.2, 1)`

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Touch Targets**: Minimum 44px × 44px
2. **Text Contrast**: 
   - Normal text: 4.5:1 minimum
   - Large text (18px+): 3:1 minimum
3. **Focus Indicators**: Visible focus ring on all interactive elements
4. **Screen Reader Support**: All interactive elements have proper labels

### Focus Ring
```typescript
{
  shadowColor: colors.lavender[500],
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.4,
  shadowRadius: 3,
}
```

## Usage Examples

### Creating a Styled Button
```typescript
import { useTheme } from '@/theme';

const theme = useTheme();

const buttonStyle = {
  backgroundColor: theme.colors.lavender[500],
  minHeight: theme.components.button.sizes.md.minHeight,
  paddingHorizontal: theme.components.button.sizes.md.paddingX,
  paddingVertical: theme.components.button.sizes.md.paddingY,
  borderRadius: theme.borderRadius.full,
  ...theme.elevation[2],
};
```

### Creating a Styled Card
```typescript
const cardStyle = {
  backgroundColor: `${theme.colors.lavender[900]}33`, // 20% opacity
  borderWidth: 1,
  borderColor: theme.colors.borders.muted,
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing[4],
};
```

### Creating Styled Text
```typescript
const headingStyle = {
  fontSize: theme.typography.fontSize['2xl'],
  fontWeight: theme.typography.fontWeight.bold,
  color: theme.colors.text.primary,
  lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight,
};
```

## Validation

Use the validation utilities to ensure compliance:

```typescript
import { validateTouchTarget, validateEtherealFlow } from '@/theme';

// Validate touch target
const isValid = validateTouchTarget(44); // true

// Validate component styling
const validation = validateEtherealFlow({
  backgroundColor: colors.canvas.dark,
  primaryColor: colors.lavender[500],
  highlightColor: colors.gold[400],
  touchTargetSize: 44,
});
```

## Common Mistakes to Avoid

1. ❌ Using hardcoded colors instead of theme tokens
2. ❌ Using spacing values not on the 4px grid
3. ❌ Touch targets smaller than 44px
4. ❌ Text contrast below WCAG AA standards
5. ❌ Mixing different border radius values inconsistently
6. ❌ Using font sizes not in the typography scale
7. ❌ Forgetting elevation on elevated surfaces
8. ❌ Not using lavender as primary brand color
9. ❌ Not using gold for highlights and emphasis
10. ❌ Using light backgrounds instead of dark canvas

## Checklist for New Components

- [ ] Uses theme tokens (no hardcoded values)
- [ ] Follows 4px spacing grid
- [ ] Touch targets ≥44px
- [ ] Text contrast meets WCAG AA
- [ ] Uses lavender primary color
- [ ] Uses gold for highlights
- [ ] Uses dark canvas background
- [ ] Proper border radius from tokens
- [ ] Elevation applied where needed
- [ ] Accessibility labels present
- [ ] Focus states defined
- [ ] Matches Figma design exactly
