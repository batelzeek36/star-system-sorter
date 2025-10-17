# NativeWind Migration Accessibility Audit

## Overview

This document outlines the accessibility audit process for the NativeWind migration. The migration must maintain WCAG 2.1 AA compliance across all screens and components.

## Accessibility Requirements

Based on requirements 3.1-3.5:

| Requirement | Standard | Notes |
|-------------|----------|-------|
| Touch targets | ≥44px × 44px | WCAG 2.1 AA minimum |
| Text contrast | 4.5:1 (normal), 3:1 (large) | WCAG 2.1 AA |
| Focus indicators | Visible on all interactive elements | WCAG 2.1 AA |
| Screen reader support | All elements properly labeled | WCAG 2.1 AA |
| Keyboard navigation | All functions accessible | WCAG 2.1 AA |

## Audit Process

### 1. Touch Target Validation

**Automated Check:**
```bash
# Run touch target validation tests
npm test -- touch-target-validation.test.ts
```

**Manual Check:**
Use the validation utility on all screens:

```typescript
import { validateTouchTarget } from '@/theme/validation';

// Check button touch target
const isValid = validateTouchTarget(44); // Should return true

// Check all interactive elements
const elements = [
  { name: 'Primary Button', height: 44 },
  { name: 'Input Field', height: 44 },
  { name: 'Card Touch Area', height: 48 },
];

elements.forEach(el => {
  const valid = validateTouchTarget(el.height);
  console.log(`${el.name}: ${valid ? '✅' : '❌'}`);
});
```

**Screens to audit:**
- [ ] OnboardingScreen - All buttons and interactive elements
- [ ] InputScreen - All form fields and buttons
- [ ] ResultScreen - All cards and navigation buttons
- [ ] WhyScreen - All interactive elements
- [ ] ProfileScreen - All list items and buttons
- [ ] SettingsScreen - All toggles and buttons

### 2. Color Contrast Validation

**Automated Check:**
```bash
# Run color contrast tests
npm test -- theme-tokens.test.ts
```

**Manual Check:**
Use the validation utility for text/background combinations:

```typescript
import { validateTextContrast } from '@/theme/validation';

// Check text contrast
const isValid = validateTextContrast(
  '#ffffff',  // text color
  '#0a0612',  // background color
  16          // font size
);

console.log(`Contrast valid: ${isValid ? '✅' : '❌'}`);
```

**Color combinations to audit:**

| Text Color | Background | Font Size | Expected Ratio | Pass? |
|------------|------------|-----------|----------------|-------|
| text.primary (#ffffff) | canvas.dark (#0a0612) | 16px | 21:1 | ✅ |
| text.secondary (#e5e7eb) | canvas.dark (#0a0612) | 14px | 14.8:1 | ✅ |
| text.muted (#9ca3af) | canvas.dark (#0a0612) | 14px | 7.2:1 | ✅ |
| text.subtle (#6b7280) | canvas.dark (#0a0612) | 12px | 4.7:1 | ✅ |
| lavender-300 | canvas.dark | 16px | TBD | TBD |
| gold-300 | canvas.dark | 16px | TBD | TBD |

### 3. Focus Indicators

**Manual Check:**
Test keyboard navigation on all interactive elements:

**iOS (VoiceOver):**
1. Enable VoiceOver: Settings > Accessibility > VoiceOver
2. Navigate through each screen
3. Verify focus ring is visible on all interactive elements
4. Verify focus order is logical (top to bottom, left to right)

**Android (TalkBack):**
1. Enable TalkBack: Settings > Accessibility > TalkBack
2. Navigate through each screen
3. Verify focus ring is visible on all interactive elements
4. Verify focus order is logical

**Screens to audit:**
- [ ] OnboardingScreen - Button focus states
- [ ] InputScreen - Form field focus states
- [ ] ResultScreen - Card and button focus states
- [ ] WhyScreen - Interactive element focus states
- [ ] ProfileScreen - List item focus states
- [ ] SettingsScreen - Toggle and button focus states

### 4. Screen Reader Support

**iOS (VoiceOver) Testing:**

```bash
# Run app on iOS simulator
npm run ios

# Enable VoiceOver in simulator:
# Hardware > Accessibility > VoiceOver
```

**Test checklist:**
- [ ] All buttons have proper labels
- [ ] All form fields have associated labels
- [ ] All images have alt text (if applicable)
- [ ] All interactive elements have proper roles
- [ ] All state changes are announced
- [ ] Navigation is logical and predictable

**Android (TalkBack) Testing:**

```bash
# Run app on Android emulator
npm run android

# Enable TalkBack in emulator:
# Settings > Accessibility > TalkBack
```

**Test checklist:**
- [ ] All buttons have proper labels
- [ ] All form fields have associated labels
- [ ] All images have alt text (if applicable)
- [ ] All interactive elements have proper roles
- [ ] All state changes are announced
- [ ] Navigation is logical and predictable

### 5. Accessibility Props Validation

**Automated Check:**
```bash
# Run component tests that verify accessibility props
npm test -- --testNamePattern="accessibility"
```

**Manual Check:**
Verify all interactive components have proper accessibility props:

```typescript
// Button
<Button
  accessibilityLabel="Get Started"
  accessibilityRole="button"
  accessibilityState={{ disabled: false }}
>

// Input
<Input
  accessibilityLabel="Email address"
  accessibilityRole="text"
  accessibilityHint="Enter your email to continue"
>

// Card (if interactive)
<TouchableOpacity
  accessibilityLabel="View details"
  accessibilityRole="button"
>
  <Card>...</Card>
</TouchableOpacity>
```

## Audit Checklist

### OnboardingScreen
- [ ] "Get Started" button has 44px min height
- [ ] "Get Started" button has proper accessibility label
- [ ] Text contrast meets WCAG AA (white on dark)
- [ ] Focus indicator visible on button
- [ ] VoiceOver announces button correctly
- [ ] TalkBack announces button correctly

### InputScreen
- [ ] All form fields have 44px min height
- [ ] All form fields have associated labels
- [ ] Error messages are announced by screen readers
- [ ] Focus indicators visible on all fields
- [ ] Text contrast meets WCAG AA
- [ ] Submit button has proper accessibility label
- [ ] VoiceOver navigation is logical
- [ ] TalkBack navigation is logical

### ResultScreen
- [ ] All interactive cards have 44px min height
- [ ] All buttons have proper accessibility labels
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible on all interactive elements
- [ ] VoiceOver announces results correctly
- [ ] TalkBack announces results correctly
- [ ] Navigation buttons are properly labeled

### WhyScreen
- [ ] Back button has 44px min height
- [ ] Back button has proper accessibility label
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicator visible on back button
- [ ] VoiceOver navigation is logical
- [ ] TalkBack navigation is logical

### ProfileScreen
- [ ] All list items have 44px min height
- [ ] All interactive elements have proper labels
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible on all items
- [ ] VoiceOver announces list items correctly
- [ ] TalkBack announces list items correctly

### SettingsScreen
- [ ] All toggles have 44px min height
- [ ] All toggles have proper accessibility labels
- [ ] Toggle states are announced by screen readers
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible on all toggles
- [ ] VoiceOver announces settings correctly
- [ ] TalkBack announces settings correctly

## UI Primitives Audit

### Button
- [ ] All sizes (sm, md, lg) meet 44px minimum
- [ ] All variants have proper contrast
- [ ] Disabled state is announced by screen readers
- [ ] Loading state is announced by screen readers
- [ ] Focus indicator visible on all variants
- [ ] accessibilityRole="button" is set
- [ ] accessibilityState includes disabled state

### Card
- [ ] All variants have proper contrast
- [ ] Interactive cards have proper touch targets
- [ ] Content is readable by screen readers
- [ ] Focus indicator visible if interactive

### Input
- [ ] Minimum 44px height
- [ ] Label is associated with input
- [ ] Error messages are announced
- [ ] Focus indicator visible
- [ ] Placeholder text has proper contrast
- [ ] accessibilityRole="text" is set
- [ ] accessibilityHint provides context

### Sheet
- [ ] Close button has 44px min height
- [ ] Close button has proper accessibility label
- [ ] Modal is announced by screen readers
- [ ] Focus is trapped within modal
- [ ] Escape/back closes modal
- [ ] Content is readable by screen readers

## Validation Utilities

### Touch Target Validation

```typescript
import { validateTouchTarget } from '@/theme/validation';

// Validate button
const button = { height: 44, width: 100 };
const isValid = validateTouchTarget(button.height);
console.log(`Button touch target: ${isValid ? '✅' : '❌'}`);
```

### Text Contrast Validation

```typescript
import { validateTextContrast } from '@/theme/validation';

// Validate text/background combination
const isValid = validateTextContrast(
  '#ffffff',  // text
  '#0a0612',  // background
  16          // font size
);
console.log(`Text contrast: ${isValid ? '✅' : '❌'}`);
```

### Ethereal Flow Validation

```typescript
import { validateEtherealFlow } from '@/theme/validation';

// Validate entire component
const validation = validateEtherealFlow({
  backgroundColor: '#0a0612',
  primaryColor: '#a78bfa',
  highlightColor: '#fbbf24',
  touchTargetSize: 44,
});

console.log('Validation results:', validation);
```

## Common Accessibility Issues

### Issue: Touch Target Too Small

**Symptom**: Interactive element < 44px

**Solution**:
```typescript
// ❌ Too small
<TouchableOpacity className="h-8 w-8">

// ✅ Proper size
<TouchableOpacity className="min-h-[44px] min-w-[44px]">
```

### Issue: Missing Accessibility Label

**Symptom**: Screen reader announces "button" without context

**Solution**:
```typescript
// ❌ No label
<Button onPress={handlePress}>
  <Icon name="close" />
</Button>

// ✅ Proper label
<Button 
  onPress={handlePress}
  accessibilityLabel="Close modal"
>
  <Icon name="close" />
</Button>
```

### Issue: Poor Text Contrast

**Symptom**: Text is hard to read

**Solution**:
```typescript
// ❌ Poor contrast
<Text className="text-text-subtle">  // 4.7:1 ratio

// ✅ Better contrast
<Text className="text-text-secondary">  // 14.8:1 ratio
```

### Issue: No Focus Indicator

**Symptom**: Can't see which element has focus

**Solution**:
```typescript
// Add focus ring to interactive elements
<TouchableOpacity
  className="..."
  style={isFocused ? {
    shadowColor: colors.lavender[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  } : undefined}
>
```

## Testing Tools

### Automated Testing
- Jest tests for touch targets
- Jest tests for color contrast
- Component tests for accessibility props

### Manual Testing
- iOS VoiceOver
- Android TalkBack
- Physical device testing
- Multiple device sizes

### Third-Party Tools
- [Accessibility Scanner (Android)](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor)
- [Xcode Accessibility Inspector (iOS)](https://developer.apple.com/documentation/accessibility/accessibility-inspector)

## Audit Report Template

```markdown
# Accessibility Audit Report

**Date**: [Date]
**Auditor**: [Name]
**Platform**: [iOS/Android]
**Device**: [Device model]

## Summary
- Total issues found: [Number]
- Critical issues: [Number]
- Medium issues: [Number]
- Minor issues: [Number]

## Issues

### Issue 1: [Title]
- **Severity**: [Critical/Medium/Minor]
- **Screen**: [Screen name]
- **Component**: [Component name]
- **Description**: [Description]
- **WCAG Criterion**: [Criterion number]
- **Recommendation**: [How to fix]

[Repeat for each issue]

## Conclusion
[Overall assessment and next steps]
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Theme Validation Utilities](../../../src/theme/validation.ts)
