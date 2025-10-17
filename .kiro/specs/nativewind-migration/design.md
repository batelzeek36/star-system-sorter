# Design Document: NativeWind Migration

## Overview

This document outlines the technical design for migrating Star System Sorter (S³) from StyleSheet-based styling to NativeWind (Tailwind CSS for React Native).

**Key Principles:**
- Zero behavioral changes (pure styling refactor)
- Incremental migration (screen-by-screen)
- Maintain WCAG 2.1 AA accessibility
- Preserve performance characteristics
- Keep TypeScript strict mode

## Architecture

### Current State
- Components use StyleSheet + useTheme() hook
- Design tokens in `src/theme/tokens.ts`
- ThemeProvider wraps app

### Target State
- Components use className with Tailwind utilities
- Design tokens preserved in `tailwind.config.js`
- New `src/ui/` directory for NativeWind primitives
- ThemeProvider deprecated (tokens remain source of truth)

### Configuration Changes
- `tailwind.config.js` - Custom tokens from theme
- `global.css` - Tailwind directives
- `metro.config.js` - NativeWind wrapper
- `babel.config.js` - nativewind/babel plugin

## Components and Interfaces

### Tailwind Configuration
Map all tokens from `src/theme/tokens.ts` to `tailwind.config.js`:
- Colors: canvas, lavender (100-900), gold (100-700), text, semantic
- Spacing: 4px grid system (1-16, plus 11 for 44px touch targets)
- Border radius: sm, md, lg, xl, full
- Typography: fontSize, fontWeight, lineHeight

### Primitive Components (src/ui/)

**Button** - Variants (primary, secondary, ghost, destructive), sizes (sm, md, lg)
- Use className for styling, Platform.select for Android elevation
- Enforce min-h-[44px] for accessibility

**Card** - Variants (default, emphasis, warning)
- Simulate gradients with layered Views (RN limitation)
- Use absolute inset-0 for overlay positioning

**Input** - Label, error states, focus handling
- Conditional className based on state
- Template literals for complex class composition

**Sheet** - Modal presentation with overlay
- Use bg-black/50 for dimming
- rounded-t-2xl for top corners

## Data Models

No new data models required. Migration is a styling refactor only.

## Error Handling

**Build Errors:**
- Metro fails: Check nativewind/babel plugin, clear cache, verify global.css import
- TypeScript errors: Install NativeWind types, restart TS server

**Runtime Errors:**
- Styles not applying: Verify Metro wrapper, check className syntax
- Platform issues: Use Platform.select for Android elevation, test both platforms

## Testing Strategy

**Unit Tests:** Update to verify className or computed styles. All existing tests must pass.

**Component Tests:** Use snapshot testing to verify visual regression. Update snapshots only after manual verification.

**E2E Tests:** No changes required (use testID). Run full suite after each screen migration.

**Accessibility Tests:** Keep existing validation utilities. Verify touch targets (≥44px) and color contrast after each migration.

## Migration Phases

**Phase 0: Setup**
- Install nativewind, tailwindcss
- Configure tailwind.config.js, global.css, metro, babel
- Verify build on both platforms (no visual changes)

**Phase 1: Primitives**
- Create src/ui/ with Button, Card, Input, Sheet
- Write unit tests
- Verify touch targets and platform-specific styles

**Phase 2: Sample Screen**
- Convert OnboardingScreen to NativeWind
- Verify visual parity and test pass rate
- Document patterns

**Phase 3: Rolling Conversion**
- Convert screens one-by-one: Input → Result → Why → Profile → Settings
- Convert remaining components
- Run tests after each conversion

**Phase 4: Cleanup**
- Remove unused StyleSheet code
- Deprecate ThemeProvider
- Update documentation
- Final accessibility and performance audit

## Performance Considerations

**Metrics to Monitor:**
- Build time (≤120s), hot reload (≤3s), bundle size (within 10%)
- Cold launch (Android ≤2.5s, iOS ≤1.8s), memory (≤350MB), frame rate (60fps)

**Optimization:**
- Use className strings over template literals where possible
- Avoid inline styles for static values
- Leverage React.memo for expensive components

## Rollback Strategy

**Triggers:** Build time >50% increase, performance >20% degradation, critical accessibility issues, test pass rate <95%

**Options:**
1. Full rollback: `git checkout main && npm run rebuild:all`
2. Partial: Keep primitives, revert screens
3. Gradual: Revert problematic screens only

## Key Design Decisions

**Gradient Simulation:** Use layered Views with opacity (RN doesn't support CSS gradients)

**Platform-Specific Styles:** Platform.select for Android elevation, shadow utilities for iOS

**Touch Targets:** Enforce min-h-[44px] for WCAG 2.1 AA compliance

**Conditional Classes:** Template literals with trim/replace for dynamic className composition

**File Size:** Keep files small and modular (target 100-200 LOC, soft limit 300 LOC, hard limit 500 LOC). Split large components into multiple focused files for easy reading and editing.
