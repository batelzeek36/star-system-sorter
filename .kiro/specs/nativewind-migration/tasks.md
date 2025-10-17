# Implementation Plan

- [x] 1. Phase 0: Setup and Configuration

  - Install NativeWind and Tailwind CSS dependencies
  - Create tailwind.config.js with all custom tokens from src/theme/tokens.ts
  - Create global.css with Tailwind directives
  - Update babel.config.js to include nativewind/babel plugin
  - Update metro.config.js with NativeWind wrapper
  - Import global.css in App.tsx
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 1.1 Write unit tests to verify NativeWind configuration

  - Test that className prop is recognized on View components
  - Test that custom colors from tailwind.config.js are applied correctly
  - _Requirements: 1.1, 1.2_

- [x] 1.2 Verify build on iOS and Android platforms

  - Run npm run ios and verify app launches without errors
  - Run npm run android and verify app launches without errors
  - Verify no visual changes (no components migrated yet)
  - _Requirements: 1.1, 6.4, 6.5_

- [x] 1.3 Integrate Figma design tokens into Tailwind config

  - Review Figma/design-tokens.json and map all tokens to Tailwind config
  - Update tailwind.config.js to include Figma colors (canvas, surface, lavender, gold, text, semantic, borders)
  - Add Figma spacing values to Tailwind spacing scale
  - Add Figma borderRadius values to Tailwind borderRadius
  - Add Figma typography (fontSize, fontWeight, lineHeight) to Tailwind theme
  - Add Figma elevation shadows to Tailwind boxShadow
  - Document any tokens that cannot be directly mapped
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Phase 1: Create Primitive Components

  - Create src/ui/ directory for NativeWind primitives
  - Reference Figma/design-tokens.json for all design values
  - Ensure visual parity with Figma/components/ui/ designs
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2.1 Implement Button primitive with NativeWind

  - Create src/ui/Button.tsx with variants matching Figma/components/ui/button.tsx (default, destructive, outline, secondary, ghost, link)
  - Reference Figma/design-tokens.json for colors (lavender-500 for primary, semantic.error for destructive)
  - Implement sizes (sm, md, lg) using Figma button.sizes specs (all min-h-[44px])
  - Use Figma borderRadius.md (12px) for rounded corners
  - Use Figma elevation.2 for Android shadow
  - Add className prop support for custom styling
  - Maintain exact same API as existing Button component
  - _Requirements: 4.1, 3.1, 3.4, 6.1, 6.2_

- [x] 2.2 Write unit tests for Button primitive

  - Test all variants render with correct className
  - Test touch target minimum (44px) is enforced
  - Test platform-specific elevation on Android
  - Test accessibility props are preserved
  - _Requirements: 4.1, 3.1, 3.2, 3.3, 3.4_

- [x] 2.3 Implement Card primitive with NativeWind

  - Create src/ui/Card.tsx matching Figma/components/ui/card.tsx structure (Card, CardHeader, CardTitle, CardDescription)
  - Reference Figma/design-tokens.json for colors (surface.subtle for bg, borders.subtle for border)
  - Use Figma borderRadius.xl (24px) for rounded corners
  - Use Figma spacing.6 (24px) for padding
  - Use Figma elevation.1 for Android shadow
  - Simulate gradients using layered Views with opacity where needed
  - Use absolute inset-0 for overlay positioning
  - Add className prop support for custom styling
  - _Requirements: 4.2, 6.1, 6.2_

- [x] 2.4 Write unit tests for Card primitive

  - Test all variants render with correct gradient simulation
  - Test overlay layer positioning
  - Test platform-specific elevation on Android
  - _Requirements: 4.2, 6.1, 6.2_

- [x] 2.5 Implement Input primitive with NativeWind

  - Create src/ui/Input.tsx matching Figma/components/ui/input.tsx with label and error states
  - Reference Figma/design-tokens.json for colors (surface.muted for bg, borders.muted for border, lavender-500 for focus, semantic.error for error)
  - Use Figma borderRadius.md (12px) for rounded corners
  - Use Figma spacing.4 (16px) for padding
  - Use Figma typography.fontSize.base (16px) for text
  - Use Figma effects.focusRing.default for focus state
  - Use Figma effects.focusRing.error for error state
  - Implement focus state handling with conditional className
  - Use template literals for complex className composition
  - Add className prop support for custom styling
  - _Requirements: 4.3, 3.2, 3.3_

- [x] 2.6 Write unit tests for Input primitive

  - Test focus state changes border color
  - Test error state displays error message
  - Test label is associated with input for accessibility
  - _Requirements: 4.3, 3.2, 3.3_

- [x] 2.7 Implement Sheet primitive with NativeWind

  - Create src/ui/Sheet.tsx matching Figma/components/ui/sheet.tsx for modal presentations
  - Reference Figma/design-tokens.json for colors (canvas.dark for bg, overlay with 50% opacity)
  - Use React Native Modal with overlay (bg-black/50)
  - Use Figma borderRadius.xl (24px) for top corners (rounded-t-2xl)
  - Use Figma elevation.4 for shadow
  - Use Figma motion.duration.normal (200ms) for animations
  - Add className prop support for custom styling
  - _Requirements: 4.4_

- [x] 2.8 Write unit tests for Sheet primitive

  - Test modal opens and closes correctly
  - Test overlay dismisses sheet on press
  - Test content area prevents dismissal
  - _Requirements: 4.4_

- [x] 2.9 Create src/ui/index.ts for public API exports

  - Export all primitive components
  - _Requirements: 4.5_

- [x] 3. Phase 2: Convert Sample Screen (OnboardingScreen)

  - Convert OnboardingScreen to use NativeWind className utilities
  - Reference Figma/design-tokens.json for all spacing, colors, and typography
  - Verify visual parity with Figma designs and original implementation
  - _Requirements: 5.1, 5.2, 5.5, 7.1_

- [x] 3.1 Convert OnboardingScreen to NativeWind

  - Replace StyleSheet with className utilities
  - Update Button imports to use src/ui/Button
  - Update Card imports to use src/ui/Card
  - Convert all View, Text, ScrollView styles to className
  - Use Figma/design-tokens.json for spacing (spacing.4, spacing.6, spacing.8)
  - Use Figma colors (canvas.dark for bg, text.primary/secondary for text, lavender-500 for accents)
  - Use Figma typography (fontSize.2xl for headings, fontSize.base for body)
  - Maintain StarfieldBackground component (uses Animated API)
  - _Requirements: 5.2, 7.1_

- [x] 3.2 Update OnboardingScreen tests

  - Update test assertions to work with className
  - Verify snapshots match (or update after manual verification)
  - Run E2E tests to verify navigation flow
  - _Requirements: 5.5, 7.5_

- [x] 3.3 Verify OnboardingScreen visual parity and accessibility

  - Compare side-by-side with original implementation AND Figma designs
  - Verify colors match Figma/design-tokens.json exactly
  - Verify spacing matches Figma/design-tokens.json exactly
  - Verify typography matches Figma/design-tokens.json exactly
  - Verify touch targets are ≥44px (Figma components.touchTarget.minimum)
  - Test on both iOS and Android
  - Run accessibility validation utilities
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.2, 6.4_

- [x] 3.4 Document OnboardingScreen migration patterns

  - Document any edge cases encountered
  - Add common className patterns to CHANGELOG
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 4. Phase 3: Convert InputScreen

  - Convert InputScreen to use NativeWind className utilities
  - Reference Figma/design-tokens.json for form styling
  - Maintain all form validation and error handling
  - _Requirements: 5.3, 7.2, 7.5_

- [x] 4.1 Convert InputScreen to NativeWind

  - Replace StyleSheet with className utilities
  - Update Field component to use src/ui/Input
  - Convert all form field styles to className
  - Use Figma/design-tokens.json for form colors (surface.muted for inputs, semantic.error for errors)
  - Use Figma spacing.4 (16px) between form fields
  - Use Figma effects.focusRing for input focus states
  - Maintain all validation logic (no behavioral changes)
  - _Requirements: 5.3, 7.2_

- [x] 4.2 Update InputScreen tests

  - Update test assertions to work with className
  - Verify form validation still works correctly
  - Run E2E tests to verify input → result flow
  - _Requirements: 5.5, 7.5_

- [x] 4.3 Verify InputScreen visual parity and accessibility

  - Compare with original implementation AND Figma designs
  - Verify form colors match Figma/design-tokens.json (especially error states)
  - Verify focus ring matches Figma effects.focusRing specs
  - Test form validation error states
  - Verify touch targets on all form fields (≥44px)
  - Test on both iOS and Android
  - _Requirements: 3.1, 3.2, 3.3, 5.3, 6.4_

- [x] 5. Phase 3: Convert ResultScreen

  - Convert ResultScreen to use NativeWind className utilities
  - Reference Figma/design-tokens.json for result display styling
  - Maintain all chart visualizations and animations
  - _Requirements: 5.4, 7.5_

- [x] 5.1 Convert ResultScreen to NativeWind

  - Replace StyleSheet with className utilities
  - Update Card imports to use src/ui/Card
  - Convert all layout and text styles to className
  - Use Figma/design-tokens.json for star system colors (lavender, gold)
  - Use Figma spacing.6 (24px) for card spacing
  - Use Figma typography for result text (fontSize.3xl for scores, fontSize.lg for labels)
  - Maintain RadialChart and ScoreDisplay components (use Animated/SVG APIs)
  - _Requirements: 5.4_

- [x] 5.2 Update ResultScreen tests

  - Update test assertions to work with className
  - Verify chart rendering still works correctly
  - Run E2E tests to verify result → why flow
  - _Requirements: 5.5, 7.5_

- [x] 5.3 Verify ResultScreen visual parity and accessibility

  - Compare with original implementation AND Figma designs
  - Verify star system colors match Figma/design-tokens.json (lavender, gold)
  - Verify chart visualizations are identical
  - Verify spacing and typography match Figma specs
  - Test on both iOS and Android
  - _Requirements: 3.1, 3.2, 3.3, 5.4, 6.4_

- [x] 6. Phase 3: Convert WhyScreen

  - Convert WhyScreen to use NativeWind className utilities
  - _Requirements: 7.1, 7.5_

- [x] 6.1 Convert WhyScreen to NativeWind

  - Replace StyleSheet with className utilities
  - Update Card imports to use src/ui/Card
  - Convert all text and layout styles to className
  - _Requirements: 7.1_

- [x] 6.2 Update WhyScreen tests and verify

  - Update test assertions to work with className
  - Run E2E tests to verify navigation
  - Verify visual parity on both platforms
  - _Requirements: 5.5, 7.5, 6.4_

- [x] 7. Phase 3: Convert ProfileScreen

  - Convert ProfileScreen to use NativeWind className utilities
  - _Requirements: 7.1, 7.5_

- [x] 7.1 Convert ProfileScreen to NativeWind

  - Replace StyleSheet with className utilities
  - Update Button imports to use src/ui/Button
  - Convert all list and layout styles to className
  - _Requirements: 7.1_

- [x] 7.2 Update ProfileScreen tests and verify

  - Update test assertions to work with className
  - Run E2E tests to verify navigation
  - Verify visual parity on both platforms
  - _Requirements: 5.5, 7.5, 6.4_

- [x] 8. Phase 3: Convert SettingsScreen

  - Convert SettingsScreen to use NativeWind className utilities
  - _Requirements: 7.1, 7.5_

- [x] 8.1 Convert SettingsScreen to NativeWind

  - Replace StyleSheet with className utilities
  - Update Button imports to use src/ui/Button
  - Convert all form and toggle styles to className
  - _Requirements: 7.1_

- [x] 8.2 Update SettingsScreen tests and verify

  - Update test assertions to work with className
  - Run E2E tests to verify settings functionality
  - Verify visual parity on both platforms
  - _Requirements: 5.5, 7.5, 6.4_

- [x] 9. Phase 3: Convert Remaining Components

  - Convert all remaining components to use NativeWind className utilities
  - _Requirements: 7.1, 7.5_

- [x] 9.1 Convert StarSystemCrest component to NativeWind

  - Replace StyleSheet with className utilities
  - Maintain SVG rendering (react-native-svg)
  - _Requirements: 7.1_

- [x] 9.2 Convert Toast component to NativeWind

  - Replace StyleSheet with className utilities
  - Maintain animation logic
  - _Requirements: 7.1_

- [x] 9.3 Convert Chip component to NativeWind

  - Replace StyleSheet with className utilities
  - Update to use src/ui/ patterns
  - _Requirements: 7.1_

- [x] 9.4 Convert Field component to NativeWind

  - Replace StyleSheet with className utilities
  - Update to use src/ui/Input
  - _Requirements: 7.1_

- [x] 9.5 Update all component tests

  - Update test assertions for converted components
  - Verify snapshots match (or update after manual verification)
  - _Requirements: 5.5, 7.5_

- [x] 10. Phase 4: Cleanup and Documentation

  - Remove unused StyleSheet code and update documentation
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 10.1 Remove unused StyleSheet imports and code

  - Search for unused StyleSheet.create calls
  - Remove unused style objects
  - Clean up unused theme imports (useTheme hooks)
  - _Requirements: 10.1, 10.2_

- [x] 10.2 Deprecate ThemeProvider (keep tokens.ts)

  - Add deprecation notice to ThemeProvider
  - Update App.tsx to remove ThemeProvider wrapper
  - Keep src/theme/tokens.ts as source of truth
  - Keep validation.ts and audit.ts utilities
  - _Requirements: 10.1, 10.2_

- [x] 10.3 Create CHANGELOG.md with className patterns

  - Document common className patterns used
  - Document how Figma/design-tokens.json maps to Tailwind classes
  - Document gradient simulation approach
  - Document platform-specific styling patterns
  - Document conditional className composition
  - Include troubleshooting tips
  - Add reference table: Figma token → Tailwind class
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 10.4 Update README.md with NativeWind setup

  - Add NativeWind installation instructions
  - Update styling section with className examples
  - Add link to CHANGELOG for patterns
  - _Requirements: 8.5_

- [x] 10.5 Update src/theme/STYLE_GUIDE.md

  - Document NativeWind migration guide
  - Add common StyleSheet → className mappings
  - Include file size guidelines (100-200 LOC target, 300 LOC soft limit)
  - _Requirements: 8.1, 8.4_

- [x] 10.6 Create src/ui/README.md

  - Document all primitive components
  - Show usage examples for each primitive
  - Explain design rationale (gradient simulation, touch targets, etc.)
  - Document how primitives match Figma/components/ui/ designs
  - Include reference to Figma/design-tokens.json for design values
  - _Requirements: 8.4_

- [x] 10.7 Run full test suite and verify 100% pass rate

  - Run npm test to verify all unit tests pass
  - Run npm run test:e2e:ios to verify iOS E2E tests pass
  - Run npm run test:e2e:android to verify Android E2E tests pass
  - _Requirements: 7.5, 9.5_

- [x] 10.8 Performance benchmarking

  - Measure initial build time (target ≤120s)
  - Measure hot reload time (target ≤3s)
  - Measure bundle size (target within 10% of original)
  - Measure cold launch time (Android ≤2.5s, iOS ≤1.8s)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 10.9 Final accessibility audit

  - Run src/theme/validation.ts utilities on all screens
  - Verify all touch targets are ≥44px
  - Verify all color contrast ratios are maintained
  - Test with VoiceOver (iOS) and TalkBack (Android)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 10.10 Verify dependency-cruiser and linting
  - Run npm run lint:graph to verify no circular dependencies
  - Run npm run lint to verify ESLint passes
  - Run npm run typecheck to verify TypeScript strict mode
  - _Requirements: 10.2, 10.3, 10.4_
