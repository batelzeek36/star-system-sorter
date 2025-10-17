# Requirements Document: Figma Design Restoration

## Introduction

The NativeWind migration (completed in `.kiro/specs/nativewind-migration/`) successfully converted all components and screens to use NativeWind className utilities, but failed to preserve the visual design from the original Figma React Web prototypes. While the technical migration is complete (all StyleSheet code removed, NativeWind configured, tests passing), the current React Native implementation looks nothing like the intended "Ethereal Flow" design direction with its dark mystic canvas, lavender/gold color scheme, soft gradients, and polished visual hierarchy. 

**What's Already Done:**
- ✅ NativeWind and Tailwind CSS installed and configured
- ✅ All components converted from StyleSheet to className
- ✅ Basic design tokens mapped to Tailwind config
- ✅ All screens migrated (Onboarding, Input, Result, Why, Profile, Settings)
- ✅ Primitive components created (Button, Card, Input, Sheet)
- ✅ Tests updated and passing
- ✅ Build verified on iOS and Android

**What's Missing:**
- ❌ Visual parity with Figma designs (colors, gradients, shadows don't match)
- ❌ Proper gradient implementation (LinearGradient not used)
- ❌ Accurate shadow/elevation system
- ❌ Starfield background animation quality
- ❌ Component state styling (focus rings, press states)
- ❌ Exact color values from Figma tokens

This spec defines requirements to restore pixel-perfect visual parity with the Figma designs while building on the completed NativeWind migration.

## Glossary

- **Figma Design System**: The original React Web component library in `Figma/components/s3/` that defines the visual design language
- **Design Tokens**: Color, spacing, typography, and effect values defined in `Figma/design-tokens.json`
- **Ethereal Flow**: The design direction featuring soft gradients, rounded shapes, dark backgrounds, and lavender/gold accents
- **Visual Parity**: Pixel-perfect match between React Native implementation and Figma React Web designs
- **NativeWind**: Tailwind CSS for React Native, the styling system being used
- **React Native Components**: The mobile app components in `src/components/` and `src/screens/`

## Requirements

### Requirement 1: Design Token Audit and Mapping

**User Story:** As a developer, I want all Figma design tokens properly mapped to NativeWind/Tailwind, so that the visual design can be accurately reproduced in React Native.

#### Acceptance Criteria

1. WHEN auditing design tokens, THE System SHALL identify all color, spacing, typography, shadow, and effect tokens from `Figma/design-tokens.json`
2. WHEN mapping tokens to NativeWind, THE System SHALL create exact Tailwind config mappings for each Figma token
3. WHEN tokens use CSS variables, THE System SHALL convert them to equivalent NativeWind utilities or custom theme extensions
4. WHERE gradients are defined, THE System SHALL map them to React Native LinearGradient or NativeWind gradient utilities
5. WHERE shadows are defined, THE System SHALL map elevation tokens to React Native shadow properties with proper iOS/Android handling

### Requirement 2: Component Visual Restoration

**User Story:** As a designer, I want each React Native component to match its Figma counterpart exactly, so that the app looks like the approved designs.

#### Acceptance Criteria

1. WHEN comparing Button components, THE React Native Button SHALL match Figma Button in colors, gradients, shadows, border radius, and spacing
2. WHEN comparing Field components, THE React Native Field SHALL match Figma Field in background colors, borders, focus states, and icon positioning
3. WHEN comparing Card components, THE React Native Card SHALL match Figma Card in gradient backgrounds, borders, backdrop blur effects, and padding
4. WHEN comparing Chip components, THE React Native Chip SHALL match Figma Chip in colors, states (default/selected/dismissible), and touch targets
5. WHERE components have variants, THE System SHALL implement all variant styles matching Figma specifications

### Requirement 3: Screen Layout Restoration

**User Story:** As a user, I want each screen to look like the Figma designs, so that the app has the intended visual polish and hierarchy.

#### Acceptance Criteria

1. WHEN viewing OnboardingScreen, THE System SHALL display starfield background, centered hero icon, gradient title, and properly spaced step indicators matching Figma
2. WHEN viewing InputScreen, THE System SHALL display tabs, form fields with icons, proper spacing, and gradient button matching Figma
3. WHEN viewing ResultScreen, THE System SHALL display radial chart, star system header, ally chips, and disclaimer matching Figma layout and colors
4. WHEN viewing WhyScreen, THE System SHALL display contributor cards with gradients, icons, and percentage weights matching Figma
5. WHEN viewing ProfileScreen, THE System SHALL display avatar, star system cards, and settings icon matching Figma layout

### Requirement 4: Color System Restoration

**User Story:** As a designer, I want the exact color palette from Figma applied throughout the app, so that the "Ethereal Flow" aesthetic is preserved.

#### Acceptance Criteria

1. WHEN applying canvas colors, THE System SHALL use `#0a0612` (canvas-dark) and `#060408` (canvas-darker) as defined in Figma tokens
2. WHEN applying lavender colors, THE System SHALL use the exact 9-step scale from `#f3f0ff` (100) to `#5b21b6` (900) as defined in Figma
3. WHEN applying gold colors, THE System SHALL use the exact 7-step scale from `#fef3c7` (100) to `#b45309` (700) as defined in Figma
4. WHEN applying text colors, THE System SHALL use white (#ffffff), secondary (#e5e7eb), muted (#9ca3af), and subtle (#6b7280) with proper contrast ratios
5. WHERE borders are used, THE System SHALL apply rgba(167, 139, 250, 0.1/0.2/0.4) for subtle/muted/emphasis variants

### Requirement 5: Gradient and Effect Restoration

**User Story:** As a designer, I want gradients, shadows, and visual effects from Figma applied correctly, so that the app has depth and polish.

#### Acceptance Criteria

1. WHEN applying button gradients, THE System SHALL use `from-lavender-500 to-lavender-400` for primary buttons matching Figma
2. WHEN applying card gradients, THE System SHALL use `from-lavender-900/20 to-lavender-800/10` for default cards matching Figma
3. WHEN applying shadows, THE System SHALL implement 5 elevation levels (0-4) with proper iOS/Android shadow properties matching Figma
4. WHEN applying focus rings, THE System SHALL use `0 0 0 3px rgba(167, 139, 250, 0.4)` for default focus state matching Figma
5. WHERE backdrop blur is specified, THE System SHALL implement blur effects on cards and overlays matching Figma

### Requirement 6: Typography and Spacing Restoration

**User Story:** As a designer, I want typography and spacing to match Figma exactly, so that text hierarchy and layout rhythm are preserved.

#### Acceptance Criteria

1. WHEN applying font sizes, THE System SHALL use the 8-step scale from 12px (xs) to 36px (4xl) as defined in Figma
2. WHEN applying font weights, THE System SHALL use 400 (normal), 500 (medium), 600 (semibold), and 700 (bold) as defined in Figma
3. WHEN applying spacing, THE System SHALL use the 4px grid system (4, 8, 12, 16, 20, 24, 32, 40, 44, 48, 64) as defined in Figma
4. WHEN applying border radius, THE System SHALL use 8px (sm), 12px (md), 16px (lg), 24px (xl), and 9999px (full) as defined in Figma
5. WHERE touch targets are specified, THE System SHALL ensure minimum 44px height/width for all interactive elements

### Requirement 7: Starfield Background Restoration

**User Story:** As a user, I want the animated starfield background on appropriate screens, so that the app has the intended cosmic atmosphere.

#### Acceptance Criteria

1. WHEN viewing OnboardingScreen, THE System SHALL display animated starfield with 50+ stars twinkling at random intervals
2. WHEN viewing InputScreen, THE System SHALL display starfield background with proper z-index layering
3. WHEN rendering stars, THE System SHALL use white color at 0.3 opacity with 0.5px size matching Figma
4. WHEN animating stars, THE System SHALL use 2-5 second twinkle cycles with random delays matching Figma
5. WHERE starfield is displayed, THE System SHALL ensure it does not interfere with touch interactions (pointer-events-none equivalent)

### Requirement 8: Component State Restoration

**User Story:** As a user, I want interactive components to have proper hover, focus, active, and disabled states matching Figma, so that interactions feel polished.

#### Acceptance Criteria

1. WHEN pressing buttons, THE System SHALL apply scale(0.98) transform and adjust shadows matching Figma active state
2. WHEN focusing fields, THE System SHALL apply lavender border and focus ring shadow matching Figma focus state
3. WHEN hovering buttons (on supported platforms), THE System SHALL adjust gradients and shadows matching Figma hover state
4. WHEN components are disabled, THE System SHALL apply 0.4 opacity and prevent interactions matching Figma disabled state
5. WHERE loading states exist, THE System SHALL display spinner with proper color and size matching Figma

### Requirement 9: Icon and Crest Restoration

**User Story:** As a designer, I want all icons and star system crests to match Figma styling, so that visual consistency is maintained.

#### Acceptance Criteria

1. WHEN displaying form field icons, THE System SHALL use lavender-400 color and proper size (20px) matching Figma
2. WHEN displaying star system crests, THE System SHALL use geometric SVG designs at 24px, 28px, or 48px sizes matching Figma
3. WHEN applying icon colors, THE System SHALL use currentColor for themeable icons matching Figma
4. WHEN displaying error icons, THE System SHALL use semantic-error color matching Figma
5. WHERE icons are interactive, THE System SHALL ensure 44px minimum touch target matching Figma

### Requirement 10: Visual Verification and Testing

**User Story:** As a QA engineer, I want automated visual regression tests, so that design parity is maintained over time.

#### Acceptance Criteria

1. WHEN running visual tests, THE System SHALL capture screenshots of all screens in both light and dark modes
2. WHEN comparing screenshots, THE System SHALL identify pixel differences between current and Figma reference designs
3. WHEN design tokens change, THE System SHALL validate that all components update correctly
4. WHEN new components are added, THE System SHALL require visual approval against Figma designs
5. WHERE visual regressions are detected, THE System SHALL fail CI/CD pipeline and report differences
