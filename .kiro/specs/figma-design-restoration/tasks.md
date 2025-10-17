# Implementation Plan: Figma Design Restoration

## Phase 1: Foundation - Token Audit and Mapping

**Note:** NativeWind is already installed and configured. This phase focuses on fixing the token mappings to match Figma exactly.

- [ ] 1. Audit Existing Token Mappings
  - Review current `tailwind.config.js` against `Figma/design-tokens.json`
  - Compare current color values with Figma exact hex codes
  - Identify missing gradient configurations
  - Identify incorrect shadow/elevation mappings
  - Document all discrepancies in audit report
  - _Requirements: 1.1, 1.2_

- [ ] 1.1 Fix Color Token Mappings in Tailwind
  - Verify canvas colors match Figma exactly: dark (#0a0612), darker (#060408)
  - Verify surface colors match Figma: subtle (#1a0f2e), muted (#0f0820)
  - Fix lavender scale if any values are incorrect (100: #f3f0ff → 900: #5b21b6)
  - Fix gold scale if any values are incorrect (100: #fef3c7 → 700: #b45309)
  - Verify text colors: primary (#ffffff), secondary (#e5e7eb), muted (#9ca3af), subtle (#6b7280)
  - Fix border rgba values: subtle (rgba(167,139,250,0.1)), muted (0.2), emphasis (0.4)
  - Verify semantic colors: success (#10b981), error (#ef4444), warning (#f59e0b), info (#3b82f6)
  - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 1.2 Map Spacing and Layout Tokens
  - Add spacing scale (1-16) to Tailwind config
  - Ensure 44px (spacing-11) is available for touch targets
  - Add border radius scale (sm, md, lg, xl, full)
  - Verify all spacing values match Figma exactly
  - _Requirements: 1.2, 6.3, 6.4, 6.5_

- [ ] 1.3 Map Typography Tokens
  - Add font size scale (xs to 4xl) to Tailwind config
  - Add font weight values (normal, medium, semibold, bold)
  - Add line height values (tight, normal, relaxed)
  - Create typography utility classes
  - _Requirements: 1.2, 6.1, 6.2_

- [ ] 1.4 Create Shadow/Elevation System
  - Define React Native shadow properties for elevation 0-4
  - Create iOS-specific shadow configurations
  - Create Android-specific elevation values
  - Add shadow utility functions to theme
  - Document shadow usage patterns
  - _Requirements: 1.5, 5.3_

- [ ] 1.5 Create Token Validation Tests
  - Write tests to validate all Figma tokens are mapped
  - Test color value accuracy (hex codes match exactly)
  - Test spacing value accuracy
  - Test typography value accuracy
  - Create CI check for token mapping completeness
  - _Requirements: 1.1, 1.2, 1.3_

## Phase 2: Core Components - Visual Restoration

**Note:** Components already use NativeWind className. This phase focuses on fixing the visual styling to match Figma.

- [ ] 2. Audit Button Component Visual Differences
  - Compare current `src/components/Button.tsx` with `Figma/components/s3/Button.tsx`
  - Document color differences (gradients, borders, text)
  - Document shadow/elevation differences
  - Document state styling differences (press, focus, disabled)
  - Create side-by-side screenshot comparison
  - _Requirements: 2.1_

- [ ] 2.1 Implement Button Gradient System
  - Install and configure `react-native-linear-gradient`
  - Create GradientButton component wrapper
  - Implement primary variant gradient (lavender-500 to lavender-400)
  - Implement destructive variant gradient
  - Test gradient rendering on iOS and Android
  - _Requirements: 2.1, 5.1_

- [ ] 2.2 Restore Button States and Animations
  - Implement scale(0.98) transform on press
  - Add elevation shadow changes on press
  - Implement focus ring for keyboard navigation
  - Add loading spinner state with proper styling
  - Implement disabled state (0.4 opacity)
  - Test all states match Figma designs
  - _Requirements: 2.1, 8.1, 8.3, 8.4, 8.5_

- [ ] 2.3 Restore Button Sizes and Spacing
  - Ensure sm size: min-h-[44px], px-4, py-2, text-sm
  - Ensure md size: min-h-[44px], px-6, py-3, text-base
  - Ensure lg size: min-h-[48px], px-8, py-4, text-lg
  - Verify rounded-full (pill shape) border radius
  - Test touch target sizes meet 44px minimum
  - _Requirements: 2.1, 6.5_

- [ ] 3. Restore Field Component
  - Review Figma Field component (`Figma/components/s3/Field.tsx`)
  - Identify all visual differences from current implementation
  - Create restoration plan for Field component
  - _Requirements: 2.2_

- [ ] 3.1 Restore Field Background and Borders
  - Implement lavender-900/20 background for default state
  - Implement borders-muted border color
  - Implement rounded-xl (24px) border radius
  - Ensure min-h-[44px] for touch targets
  - Add proper padding (px-4 py-3)
  - _Requirements: 2.2, 4.5_

- [ ] 3.2 Restore Field Focus and Error States
  - Implement focus state: lavender-900/30 bg, lavender-400 border
  - Add focus ring shadow effect
  - Implement error state: semantic-error/10 bg, semantic-error border
  - Add error focus ring shadow
  - Add AlertCircle icon for error state
  - Test state transitions match Figma
  - _Requirements: 2.2, 5.4, 8.2_

- [ ] 3.3 Restore Field Icon Positioning
  - Ensure icons are positioned leading (left side)
  - Apply lavender-400 color to icons in default state
  - Apply semantic-error color to icons in error state
  - Verify icon size (20px) and spacing (gap-3)
  - Test icon alignment with input text
  - _Requirements: 2.2, 9.1_

- [ ] 4. Restore Card Component
  - Review Figma Card component (`Figma/components/s3/Card.tsx`)
  - Identify all visual differences from current implementation
  - Create restoration plan for Card component
  - _Requirements: 2.3_

- [ ] 4.1 Implement Card Gradient Backgrounds
  - Create GradientCard component wrapper
  - Implement default variant: from-lavender-900/20 to-lavender-800/10
  - Implement emphasis variant: from-lavender-600/30 to-lavender-700/20
  - Implement warning variant: from-warning-muted to-gold-600/10
  - Test gradient rendering on iOS and Android
  - _Requirements: 2.3, 5.2_

- [ ] 4.2 Restore Card Borders and Shadows
  - Apply borders-muted border for default variant
  - Apply lavender-400/40 border for emphasis variant
  - Apply gold-400/40 border for warning variant
  - Add elevation-2 shadow for emphasis variant
  - Verify rounded-xl (24px) border radius
  - _Requirements: 2.3, 5.3_

- [ ] 4.3 Restore Card Padding and Layout
  - Ensure p-4 (16px) padding on all variants
  - Test backdrop blur effect (if supported on platform)
  - Verify card content layout matches Figma
  - Test card stacking and spacing
  - _Requirements: 2.3_

- [ ] 5. Restore Chip Component
  - Review Figma Chip component (`Figma/components/s3/Chip.tsx`)
  - Restore default state (star system + percentage)
  - Restore selectable state (toggleable)
  - Restore selected state (filled background)
  - Restore dismissible variant with X icon
  - Ensure 44px minimum touch targets for interactive chips
  - Test all states match Figma designs
  - _Requirements: 2.4, 6.5_

## Phase 3: Screen Layouts - Integration

- [ ] 6. Restore InputScreen Layout
  - Review Figma InputScreen design (`Figma/App.tsx` - Screen 02)
  - Create side-by-side comparison with current implementation
  - Document all layout and styling differences
  - _Requirements: 3.2_

- [ ] 6.1 Restore InputScreen Background and Header
  - Implement starfield background component
  - Apply canvas-dark (#0a0612) background color
  - Restore AppBar with proper styling
  - Add title and subtitle with correct typography
  - Verify spacing matches Figma
  - _Requirements: 3.2, 4.1, 7.2_

- [ ] 6.2 Restore InputScreen Tabs
  - Implement tab bar (Birth Data | Upload Chart PDF)
  - Style active tab with lavender-400 border
  - Style inactive tab with text-muted color
  - Ensure 44px minimum touch target height
  - Test tab switching interaction
  - _Requirements: 3.2, 6.5_

- [ ] 6.3 Restore InputScreen Form Fields
  - Apply restored Field component to all inputs
  - Add Calendar icon to Birth Date field
  - Add Clock icon to Birth Time field
  - Add MapPin icon to Birth Location field
  - Ensure proper spacing (gap-4) between fields
  - Verify field labels use lavender-300 color
  - _Requirements: 3.2, 9.1_

- [ ] 6.4 Restore InputScreen Button and Layout
  - Apply restored Button component to "Compute Chart" CTA
  - Ensure button uses primary variant with gradient
  - Position button at bottom with proper spacing
  - Test overall layout matches Figma
  - Verify keyboard avoidance behavior
  - _Requirements: 3.2_

- [ ] 7. Restore OnboardingScreen Layout
  - Review Figma OnboardingScreen design (`Figma/App.tsx` - Screen 01)
  - Implement starfield background
  - Restore hero icon with gradient background
  - Restore gradient title text
  - Restore 3-step explanation cards
  - Restore "Begin Sorting" CTA button
  - Test overall layout matches Figma
  - _Requirements: 3.1, 7.1_

- [ ] 8. Restore ResultScreen Layout
  - Review Figma ResultScreen design (`Figma/App.tsx` - Screen 03)
  - Restore "Your Primary Star System" header with gradient text
  - Implement radial percentage chart with gradient stroke
  - Restore ally chips with proper styling
  - Restore "View Why" and "Generate Narrative" buttons
  - Add disclaimer text with proper styling
  - Test overall layout matches Figma
  - _Requirements: 3.3_

- [ ] 9. Restore WhyScreen Layout
  - Review Figma WhyScreen design (`Figma/App.tsx` - Screen 04)
  - Restore "Why [System]" header
  - Implement contributor cards with gradients
  - Add icons to contributor cards
  - Display percentage weights with proper styling
  - Test overall layout matches Figma
  - _Requirements: 3.4_

- [ ] 10. Restore ProfileScreen Layout
  - Review Figma ProfileScreen design (`Figma/App.tsx` - Screen 06)
  - Restore avatar placeholder
  - Restore user type display
  - Implement star system profile cards
  - Add settings icon with proper styling
  - Test overall layout matches Figma
  - _Requirements: 3.5_

## Phase 4: Effects and Polish - Enhancement

- [ ] 11. Implement Starfield Background Animation
  - Create StarfieldBackground component
  - Generate 50+ stars with random positions
  - Implement twinkle animation (2-5 second cycles)
  - Use random delays for natural effect
  - Ensure pointer-events-none equivalent (no touch interference)
  - Optimize animation performance with useNativeDriver
  - Test on iOS and Android devices
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. Implement Gradient Utility System
  - Create GradientView component wrapper
  - Define gradient presets (button-primary, card-default, etc.)
  - Implement gradient configuration system
  - Add TypeScript types for gradient presets
  - Document gradient usage patterns
  - Test gradient rendering performance
  - _Requirements: 5.1, 5.2_

- [ ] 13. Implement Focus Ring Effects
  - Create focus ring utility for keyboard navigation
  - Implement default focus ring (lavender-400 with 0.4 opacity)
  - Implement error focus ring (semantic-error with 0.4 opacity)
  - Add focus ring to all interactive components
  - Test focus ring visibility and accessibility
  - _Requirements: 5.4, 8.2_

- [ ] 14. Implement Press/Active State Animations
  - Add scale(0.98) transform to buttons on press
  - Add shadow elevation changes on press
  - Implement smooth transitions (200ms duration)
  - Test animations on iOS and Android
  - Ensure animations don't interfere with functionality
  - _Requirements: 8.1, 8.3_

- [ ] 15. Optimize Gradient and Animation Performance
  - Profile gradient rendering performance
  - Optimize starfield animation for low-end devices
  - Implement shouldComponentUpdate for static elements
  - Cache gradient configurations
  - Test performance on target devices
  - _Requirements: 7.1, 7.2_

## Phase 5: Verification and Testing - Quality

- [ ] 16. Create Visual Comparison Tool
  - Set up screenshot capture for all screens
  - Capture reference screenshots from Figma prototypes
  - Create side-by-side comparison viewer
  - Document comparison methodology
  - _Requirements: 10.1, 10.2_

- [ ] 16.1 Implement Visual Regression Tests
  - Set up visual regression testing framework
  - Capture baseline screenshots for all screens
  - Implement pixel difference detection
  - Set acceptable difference threshold (1%)
  - Create CI/CD integration for visual tests
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [ ] 16.2 Create Component Visual Tests
  - Write visual tests for Button component (all variants)
  - Write visual tests for Field component (all states)
  - Write visual tests for Card component (all variants)
  - Write visual tests for Chip component (all states)
  - Test gradient rendering accuracy
  - Test shadow rendering accuracy
  - _Requirements: 10.3, 10.4_

- [ ] 17. Conduct Final Visual Audit
  - Compare all screens side-by-side with Figma
  - Document any remaining visual differences
  - Verify all design tokens are correctly applied
  - Check color accuracy with color picker
  - Verify spacing and layout measurements
  - Test on multiple device sizes
  - _Requirements: 10.1, 10.2_

- [ ] 18. Create Documentation
  - Document token mapping reference
  - Create component style guide with Figma comparisons
  - Write gradient usage guide
  - Write shadow/elevation usage guide
  - Capture before/after screenshots for all components
  - Document any intentional deviations from Figma
  - _Requirements: 10.4_

- [ ] 19. Final QA and Approval
  - Conduct QA review of all screens
  - Test on iOS devices (iPhone 12+, iPad)
  - Test on Android devices (Pixel, Samsung)
  - Verify accessibility standards maintained
  - Get stakeholder approval on visual design
  - Address any final feedback
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
