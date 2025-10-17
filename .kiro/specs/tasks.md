# Implementation Plan — MVP Star System Sorter

This plan focuses on **MVP classification only**: collect birth data → call BodyGraph proxy → score → show results/why.  
Scope is limited to core sorter functionality with Figma UI integration.  
**Out of scope**: Community features, game integration, leaderboards, music system.

---

## Definition of Done (MVP)

- ✅ Enter birth data → **/internal/hd** proxy fetch → **scorer** produces primary/hybrid + contributors
- ✅ Result & Why screens render (radial chart, crests, allies, disclaimers)
- ✅ Client + server caching works; offline/timeout UX is sane
- ✅ Jest unit tests pass (≥80% core, ≥60% app-wide); Detox E2E covers critical path
- ✅ CI runs lint, typecheck, tests, import-graph, file-size gates; Android build succeeds
- ✅ No secrets in mobile bundle; BODYGRAPH_API_KEY only on server
- ✅ Figma design system integrated (components, tokens, global styles functional)
- ✅ Accessibility compliance (WCAG 2.1 AA, screen reader support, 44px touch targets)

---

## MVP Rollout Checklist

- [ ] BodyGraph proxy with caching working (`/internal/hd`)
- [ ] Zod schemas for inputs/outputs; JSON Schemas generated
- [ ] Comprehensive test coverage (unit + E2E)
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Release builds configured with size optimizations
- [ ] Security review (no PII in logs, proper moderation)
- [ ] Docs updated (README, SECURITY, CANON_GUIDE)

---

## MVP Scope Boundaries

### In Scope (MVP)

- ✅ Birth data input and validation
- ✅ BodyGraph API integration with caching
- ✅ Deterministic star system classification
- ✅ Result display with radial charts and ally chips
- ✅ Why/explanation screen
- ✅ Basic profile and settings
- ✅ Comprehensive testing and accessibility
- ✅ Figma design system integration

### Out of Scope (Post-MVP)

- ❌ Community features (feed, quests, members)
- ❌ Subscription/paywall system
- ❌ AI avatar generation
- ❌ Complex tab navigation (using simple stack navigation)
- ❌ Game integration (Flutter/Flame)
- ❌ Leaderboards and competitions
- ❌ Music system
- ❌ Push notifications
- ❌ Authentication system
- ❌ Analytics/telemetry

---

## 1. Core App (Keep/Finish)

- [x] **1.1 RN foundation & deps**
- [x] **1.2 BodyGraph client & cache**
- [x] **1.3 Scorer library & tests**
- [x] **1.4 Moderation (trimmed)**

---

## 2. Figma UI Implementation

> **Use Your Figma Design System:** Adapt the complete Figma components from `Figma/` directory to React Native

### 2.1 Figma Design System Integration

- [x] **2.1.1 Design Tokens**
  - [x] Import `Figma/design-tokens.json` and convert to React Native StyleSheet
  - [x] Create theme provider with Figma color system (lavender primary, gold highlights)
  - [x] Implement spacing scale (4px grid), typography, and elevation
- [x] **2.1.2 Core Components (Adapt from Figma/components/s3/)**
  - [x] **Button.tsx** - Adapt with variants (Primary, Secondary, Ghost, Destructive) and proper touch targets
  - [x] **Field.tsx** - Form input with icons, validation states, and error handling
  - [x] **Card.tsx** - Gradient backgrounds and variants (Default, Emphasis, Warning)
  - [x] **Chip.tsx** - Star system ally chips with percentages (Gold, Lavender variants)
  - [x] **AppBar.tsx** - Navigation header with back button
  - [x] **Toast.tsx** - Toast notifications and InlineAlert components
  - [x] **StarSystemCrests.tsx** - 6 geometric SVG icons (Orion, Sirius, Pleiades, Andromeda, Lyra, Arcturus)

### 2.2 Figma Screens (Adapt to React Native)

- [x] **2.2.1 Onboarding Screen (01_Onboarding from Figma)**
  - [x] S³ hero with logo icon and starfield background
  - [x] "Begin Sorting" CTA using Figma Button component
  - [x] 3-step explanation (Input → Sort → Narrative)
  - [x] Navigate to Input screen
- [x] **2.2.2 Input Screen (02_Input_BirthData from Figma)**
  - [x] Tabs: Birth Data | Upload Chart PDF
  - [x] Fields with icons (calendar, clock, location) using Figma Field component
  - [x] "Compute Chart" CTA using Figma Button
  - [x] Toast notification on submit using Figma Toast
  - [x] Form validation and error states
- [x] **2.2.3 Result Screen (03_Sort_Result from Figma)**
  - [x] "Your Primary Star System" header
  - [x] Radial percentage chart (62% example)
  - [x] Primary star system display with crest
  - [x] Ally chips (e.g., Sirius 18%, Lyra 12%, Andromeda 8%) using Figma Chip
  - [x] "View Why" button using Figma Button
  - [x] **Disclaimer:** "For insight & entertainment. Not medical, financial, or legal advice."
- [x] **2.2.4 Why Screen (04_Why_This_Result from Figma)**
  - [x] Header: "Why [Star System]" using Figma AppBar
  - [x] Contributors list with weights and icons using Figma Card
  - [x] Gradient backgrounds from design tokens
  - [x] Back navigation
- [x] **2.2.5 Profile Screen (06_Profile from Figma - Simplified)**
  - [x] User type display (e.g., "Manifesting Generator • 1/3")
  - [x] Star system profile cards (Primary + Allies) using Figma Card
  - [x] Settings icon → Settings screen
- [x] **2.2.6 Settings Screen (Figma/components/s3/screens/SettingsScreen.tsx)**
  - [x] Adapt existing SettingsScreen.tsx to React Native
  - [x] Privacy notice using Figma InlineAlert
  - [x] Essential settings groups
  - [x] Legal links and back navigation
- [x] **2.2.7 Empty States & Errors (Figma/components/s3/screens/EmptyStatesScreen.tsx)**
  - [x] Adapt existing EmptyStatesScreen.tsx to React Native
  - [x] Error states (Network, Invalid Data)
  - [x] Empty state examples

### 2.3 Figma Assets Integration

- [x] **2.3.1 Star System Crests**
  - [x] Export SVG crests from Figma/components/s3/StarSystemCrests.tsx
  - [x] Convert to react-native-svg components
  - [x] Support sizes: 24px, 28px, 48px
  - [x] Ensure currentColor fill for theming
- [x] **2.3.2 Design Consistency**
  - [x] Match exact Figma styling (Ethereal Flow aesthetic)
  - [x] Use Figma color tokens (lavender primary, gold highlights, dark canvas)
  - [x] Implement proper spacing and typography from design tokens
  - [x] Ensure all touch targets ≥44px (WCAG 2.1 AA)

---

## 3. Server (Minimal)

- [x] **3.1 BodyGraph proxy `/internal/hd`**
- [x] **3.2 HTTP server bootstrap**
  - [x] `apps/server/src/http.ts`
  - [x] `apps/server/src/index.ts`
- [x] **3.3 Tests**
  - [x] Happy path, 400/401, 429, 5xx, caching

---

## 4. Validation & Schemas

- [x] **4.1 Zod schemas**
  - [x] Define client/server schemas for sorter flow
- [x] **4.2 Generate JSON Schemas**
  - [x] `zod-to-json-schema` → `schemas/*.json`

---

## 5. Basic Build Setup

- [x] **5.1 Android & ios debug build**
  - [x] Ensure app builds and runs on Android
  - [x] Ensure app builds and runs on iOS
- [x] **5.2 Basic CI (optional for MVP)**
  - [x] Lint + typecheck
  - [x] Basic Jest tests

---

## 6. Comprehensive Testing (Leverage Existing Infrastructure)

> **Note**: Solid testing foundation already exists in `__tests__/` and `e2e/` directories

### 6.1 Unit Tests

- [x] **Scorer Library**: `scorer.test.ts`, `canon.test.ts`, `tie.test.ts`, `score.test.ts`
- [x] **API Integration**: `api-client.test.ts`, `cache-integration.test.ts`, `hdkit-adapter.test.ts`
- [x] **Core Components**: `star-system-crest.test.tsx`, `star-system-crests.test.tsx`, `radial-chart.test.tsx`, `score-display.test.tsx`
- [x] **Figma UI Components**: `button.test.tsx`, `field.test.tsx`, `card.test.tsx`, `chip.test.tsx`, `app-bar.test.tsx`, `toast.test.tsx`
- [x] **Screens**: `onboarding-screen.test.tsx`, `input-screen-integration.test.tsx`, `why-screen.test.tsx`, `settings-screen.test.tsx`, `profile-screen.test.tsx`, `empty-states-screen.test.tsx`
- [x] **Moderation**: `moderation-service.test.ts`, `moderation-blocklists.test.ts`, `moderation-sanitizer.test.ts`
- [x] **Validation**: `birth-data-schema.test.ts`, `birth-data-validation.test.ts`, `scorer-types.test.ts`, `schemas.test.ts`
- [x] **Theme/Design System**: `theme-tokens.test.ts`, `touch-target-validation.test.ts`
- [x] **Icons**: `field-icons.test.tsx`, `empty-state-icons.test.tsx`

### 6.2 Integration Tests

- [x] **Classification Flow**: `classify-integration.test.ts`
- [x] **Cache Behavior**: `cache-integration.test.ts`
- [x] **Determinism**: `canon-determinism.test.ts`
- [x] **Navigation**: `navigation.test.tsx`

### 6.3 E2E Tests (Maestro)

- [x] **Test Infrastructure**: `e2e/` directory with Maestro setup
- [x] **Critical Flows**:
  - [x] `e2e/flows/full_journey.yaml` - Complete user journey
  - [x] `e2e/flows/onboarding.yaml` - Onboarding flow
  - [x] `e2e/flows/input_chart.yaml` - Input and chart generation
  - [x] `e2e/flows/moderation.yaml` - Content moderation testing

### 6.4 Additional Testing Tasks

- [x] **6.4.1 Result Screen Test**
  - [x] Create dedicated `result-screen.test.tsx` (currently only covered in navigation.test.tsx)
  - [x] Test radial chart rendering with classification data
  - [x] Test ally chips display and interaction
  - [x] Test "View Why" navigation
- [x] **6.4.2 E2E Flow Verification**
  - [x] Verify Maestro flows work with current UI and testIDs
  - [x] Update flows if testIDs have changed
  - [x] Test complete user journey with new Figma UI
  - [x] Verify accessibility with screen readers
- [ ] **6.4.3 Performance Tests**
  - [ ] Test app launch time (≤2.5s Android, ≤1.8s iOS)
  - [ ] Test memory usage (≤350MB peak)
  - [ ] Test UI responsiveness and animations

### 6.5 Test Coverage Goals

- **Existing Coverage**: Already strong coverage on core business logic
- **Target for New Code**: ≥80% coverage on Figma component adaptations
- **E2E Coverage**: 100% critical path (Onboarding → Input → Result → Why)
- **Accessibility**: Full screen reader navigation testing

---

## 7. Documentation

- [ ] **7.1 README.md**
  - [ ] Dev setup for RN app + Figma integration guide
- [ ] **7.2 SECURITY.md**
  - [ ] Add data-handling & PII policy
- [ ] **7.3 CANON_GUIDE.md**
  - [ ] Canon authoring structure & validation

---

## 8. Final Validation

- [ ] **8.1 App functionality**
  - [ ] Complete user flow works end-to-end
  - [ ] No critical crashes or errors
- [ ] **8.2 Basic polish**
  - [ ] App looks presentable
  - [ ] Essential accessibility features work

---

## MVP Testing Goals (Building on Solid Foundation)

> **Strong Foundation**: Comprehensive test suite already exists with 20+ test files covering core business logic, API integration, components, and E2E flows

### Testing Priorities for MVP

- **Leverage Existing Tests**: 20+ unit tests already cover scorer, API client, moderation, and core components
- **Figma Component Testing**: Ensure adapted Figma components work correctly in React Native
- **Critical Path Validation**: E2E tests already exist for full user journey (Maestro flows)
- **Accessibility Compliance**: Test Figma design system meets WCAG 2.1 AA standards
- **Performance Validation**: Verify app meets performance targets (launch time, memory usage)

### Test Quality Standards

- **Unit Tests**: ≥80% coverage on new Figma component adaptations
- **Integration Tests**: All API flows and caching behavior validated
- **E2E Tests**: Complete user journey tested with Maestro
- **Accessibility**: Full screen reader navigation and WCAG compliance
- **Performance**: Launch time ≤2.5s, memory ≤350MB, smooth animations

---

## Notes & Conventions

- Keep files ≤300 LOC (target 100-200 LOC).
- Use **React Native primitives** — no CSS runtime.
- **CRITICAL**: Implement your actual Figma design system from `Figma/` directory, not basic mock components.
- Adapt Figma components (`Figma/components/s3/`) to React Native equivalents.
- Use design tokens from `Figma/design-tokens.json` for consistent styling.
- Reference `Figma/IMPLEMENTATION_CHECKLIST.md` for complete feature list.
- Add `testID` and a11y props to every interactive element.
- No secrets in mobile bundle; all keys on server.
- **MVP Focus**: Use your Figma screens but exclude community, paywall, and game features.
- **Design Fidelity**: Match the Ethereal Flow aesthetic from your Figma designs.
