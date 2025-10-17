# Requirements Document

## Introduction

This document outlines the requirements for migrating the Star System Sorter (S³) React Native application from StyleSheet-based styling to NativeWind (Tailwind CSS utilities for React Native). The migration aims to improve developer experience, reduce code verbosity, and maintain design consistency while preserving all existing functionality, accessibility features, and visual design.

## Glossary

- **NativeWind**: A utility-first styling library that brings Tailwind CSS to React Native, allowing developers to use className props with Tailwind utilities
- **StyleSheet**: React Native's built-in styling API using JavaScript objects
- **Theme System**: The current custom theme implementation in `src/theme/` that defines design tokens (colors, spacing, typography, etc.)
- **Design Tokens**: Reusable design values (colors, spacing, typography) defined in `src/theme/tokens.ts`
- **Touch Target**: The interactive area of a UI element; must be ≥44px for WCAG 2.1 AA compliance
- **Bare React Native**: A React Native project without Expo framework
- **Metro**: The JavaScript bundler used by React Native
- **OLED Dark Theme**: Dark color scheme optimized for OLED displays with deep blacks

## Requirements

### Requirement 1

**User Story:** As a developer, I want to use Tailwind-style className utilities in React Native components, so that I can write styles more efficiently and maintain consistency with modern web development patterns.

#### Acceptance Criteria

1. WHEN NativeWind is installed and configured, THE Application SHALL compile successfully on both iOS and Android platforms
2. WHEN a developer writes `className="bg-lavender-500 rounded-xl p-4"` on a View component, THE Application SHALL render the component with the correct background color, border radius, and padding
3. WHEN the Metro bundler processes files with className attributes, THE Application SHALL transform Tailwind utilities into React Native styles without errors
4. WHEN the application runs in development mode, THE Application SHALL support hot reloading with NativeWind styles updating immediately
5. WHERE a component uses computed styles at runtime, THE Application SHALL continue to support inline style objects alongside className utilities

### Requirement 2

**User Story:** As a developer, I want to preserve all existing design tokens in Tailwind configuration, so that the visual design remains identical after migration.

#### Acceptance Criteria

1. THE Application SHALL define all custom colors from `src/theme/tokens.ts` in `tailwind.config.js` (canvas.dark, canvas.darker, lavender.100-900, gold.100-700, semantic colors)
2. THE Application SHALL define all spacing values from the 4px grid system in Tailwind configuration
3. THE Application SHALL define all border radius values (sm, md, lg, xl, full) in Tailwind configuration
4. THE Application SHALL define all typography scales (fontSize, fontWeight, lineHeight) in Tailwind configuration
5. WHEN a component uses `className="bg-canvas-dark"`, THE Application SHALL render with the exact color value #0a0612 from the original tokens

### Requirement 3

**User Story:** As a developer, I want to maintain WCAG 2.1 AA accessibility compliance, so that all users can interact with the application effectively.

#### Acceptance Criteria

1. THE Application SHALL preserve all touch targets at minimum 44px height after migration
2. THE Application SHALL maintain all existing testID attributes on interactive elements
3. THE Application SHALL preserve all accessibilityLabel, accessibilityRole, and accessibilityState props
4. WHEN a Button component is rendered with size="sm", THE Application SHALL enforce minHeight of 44px using `min-h-[44px]` utility
5. THE Application SHALL maintain all existing color contrast ratios for text and interactive elements

### Requirement 4

**User Story:** As a developer, I want to create reusable primitive components with NativeWind, so that I can build consistent UI patterns across the application.

#### Acceptance Criteria

1. THE Application SHALL provide a Button primitive in `src/ui/` with variants (primary, secondary, ghost, destructive) using className utilities
2. THE Application SHALL provide a Card primitive in `src/ui/` with gradient backgrounds using className utilities
3. THE Application SHALL provide an Input primitive in `src/ui/` with focus states using className utilities
4. THE Application SHALL provide a Sheet primitive in `src/ui/` for modal presentations using className utilities
5. WHEN a primitive component is imported, THE Application SHALL expose a consistent API with className prop support for custom styling

### Requirement 5

**User Story:** As a developer, I want to convert existing screens incrementally, so that I can migrate the codebase safely without breaking functionality.

#### Acceptance Criteria

1. THE Application SHALL support both StyleSheet and className styling patterns simultaneously during migration
2. WHEN OnboardingScreen is converted to NativeWind, THE Application SHALL render identically to the StyleSheet version
3. WHEN InputScreen is converted to NativeWind, THE Application SHALL maintain all form validation and error states
4. WHEN ResultScreen is converted to NativeWind, THE Application SHALL preserve all chart visualizations and animations
5. THE Application SHALL pass all existing Jest and Detox tests after each screen conversion

### Requirement 6

**User Story:** As a developer, I want to handle platform-specific styling, so that the application looks native on both iOS and Android.

#### Acceptance Criteria

1. WHERE elevation shadows are needed on iOS, THE Application SHALL use `shadow-md shadow-black/50` utilities
2. WHERE elevation is needed on Android, THE Application SHALL use Platform.select to apply elevation property
3. WHEN a component requires platform-specific spacing, THE Application SHALL use conditional className based on Platform.OS
4. THE Application SHALL maintain all existing platform-specific visual differences after migration
5. THE Application SHALL compile and run without warnings on both iOS and Android after migration

### Requirement 7

**User Story:** As a developer, I want to preserve all existing functionality, so that the migration is purely a styling refactor with no behavioral changes.

#### Acceptance Criteria

1. THE Application SHALL maintain all navigation flows (Onboarding → Input → Result → Why → Profile → Settings)
2. THE Application SHALL preserve all form validation logic and error handling
3. THE Application SHALL maintain all API integrations (BodyGraph API, caching, moderation)
4. THE Application SHALL preserve all state management (Zustand stores)
5. WHEN the migration is complete, THE Application SHALL pass 100% of existing unit tests, component tests, and E2E tests

### Requirement 8

**User Story:** As a developer, I want clear documentation of the migration process, so that I can understand design decisions and maintain the codebase.

#### Acceptance Criteria

1. THE Application SHALL include a CHANGELOG documenting all className design patterns used
2. THE Application SHALL document gradient implementation patterns for React Native
3. THE Application SHALL document touch target enforcement patterns
4. THE Application SHALL provide examples of common styling patterns in primitive components
5. THE Application SHALL update the project README with NativeWind setup instructions

### Requirement 9

**User Story:** As a developer, I want to maintain build performance, so that development and production builds remain fast.

#### Acceptance Criteria

1. WHEN Metro bundler processes the application, THE Application SHALL complete initial build within 120 seconds
2. WHEN hot reload is triggered, THE Application SHALL update within 3 seconds
3. THE Application SHALL maintain bundle size within 10% of pre-migration size
4. THE Application SHALL not introduce additional runtime dependencies beyond NativeWind and Tailwind CSS
5. THE Application SHALL maintain cold launch time ≤2.5s on Android and ≤1.8s on iOS

### Requirement 10

**User Story:** As a developer, I want to follow the project's architectural constraints, so that the migration respects existing code quality standards.

#### Acceptance Criteria

1. THE Application SHALL maintain all files within the 500 LOC hard limit
2. THE Application SHALL pass dependency-cruiser validation with no circular dependencies
3. THE Application SHALL maintain strict TypeScript mode with no type errors
4. THE Application SHALL pass ESLint validation with no warnings
5. THE Application SHALL maintain the layered architecture (Screens → Components → Theme → Utils)
