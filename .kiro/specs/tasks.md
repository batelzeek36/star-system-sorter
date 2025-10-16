# Implementation Plan — Sorter-Only (No Flutter/Game)

This replaces the previous plan. Scope is **classification only**: collect birth data → call BodyGraph proxy → score → show results/why.  
All Flutter/game/bridge/leaderboard/music/features are removed.  
Additionally, this plan incorporates the **Figma UI system** from the local folder  
`/Users/kingkamehameha/Documents/Kiro/GF_App/star-system-sorter/Figma`.

---

## Definition of Done (Sorter-Only)

- ✅ Enter birth data → **/internal/hd** proxy fetch → **scorer** produces primary/hybrid + contributors
- ✅ Result & Why screens render (radial chart, crests, allies, disclaimers)
- ✅ Client + server caching works; offline/timeout UX is sane
- ✅ Jest unit tests pass; Detox covers Onboarding → Input → Result → Why
- ✅ CI runs lint, typecheck, tests, import-graph, file-size gates; Android build succeeds (iOS optional on macOS)
- ✅ No secrets in mobile bundle; BODYGRAPH_API_KEY only on server
- ✅ Figma design system successfully integrated (components, tokens, and global styles functional)

---

## Rollout Checklist (Trimmed)

- [ ] BodyGraph proxy with caching working (`/internal/hd`)
- [ ] Zod schemas for inputs/outputs; JSON Schemas generated for docs (optional but recommended)
- [ ] Accessibility pass (labels, 44px targets, screen reader flow)
- [ ] Release builds configured (RN only), size optimizations enabled
- [ ] Docs updated (README, SECURITY, CANON_GUIDE)

---

## 0. Cutover & Removal (Do These First)

> Branch & snapshot before changes.

- [x] **0.1 Create cutover branch**

  - `git checkout -b no-flutter`
  - `git push -u origin no-flutter`

- [x] **0.2 Remove Flutter module & game directories**

  - `git rm -r --ignore-unmatch runner_game/ super_dash/`
  - `git rm -r --ignore-unmatch docs/FLUTTER_MODULE_INTEGRATION.md docs/!!!FLUTTER_TOGGLE_REFERENCE.md docs/ANDROID_TOOLCHAIN_MATRIX.md`
  - `git rm -r --ignore-unmatch apps/server/src/routes/leaderboard.ts apps/server/src/routes/events.ts apps/server/src/routes/runs.ts apps/server/src/routes/music.ts`
  - `git rm -r --ignore-unmatch apps/server/src/validate.ts apps/server/src/store/`

- [x] **0.3 Delete native bridge code & references**

  - **Android (Kotlin/Java)**
    - `git rm --ignore-unmatch android/app/src/main/java/**/GameBridgeModule.*`
    - `git rm --ignore-unmatch android/app/src/main/java/**/GameBridgePackage.*`
    - Edit `android/app/src/main/java/**/MainApplication.kt`:
      - Remove FlutterEngine caching (`s3_engine`) and any GameBridge registration.
    - Edit `android/app/build.gradle`:
      - Remove `flutter_debug/flutter_release` dependencies and any `implementation(name: ...)` from Flutter AARs.
    - Edit `android/settings.gradle`:
      - Remove `mavenLocal()`/`runner_game/build/host/outputs/repo` repository entries.
    - Edit `android/app/src/main/AndroidManifest.xml`:
      - Remove any Flutter Activity entries and custom landscape locks related to RunnerGame.
  - **iOS**
    - `git rm --ignore-unmatch ios/S3App/GameBridgeModule.m ios/S3App/GameBridgeModule.swift`
    - Edit `ios/Podfile`:
      - Remove `flutter_application_path` and any `runner_game` pod integration.
      - Run: `cd ios && bundle exec pod install && cd ..`
    - Edit `ios/S3App/AppDelegate.swift`:
      - Remove FlutterEngine caching and warm-up calls.
    - Edit `ios/S3App/Info.plist`:
      - Remove game/landscape-only orientation overrides (restore standard portrait set).

- [x] **0.4 Remove RN wrapper & game screens**

  - `git rm --ignore-unmatch src/native/GameBridge.ts src/GameBridge.ts`
  - `git rm --ignore-unmatch src/screens/GameHub.tsx src/screens/TeamSelect.tsx src/screens/Lobby.tsx src/screens/RunnerGame.tsx src/screens/MatchResult.tsx src/screens/Leaderboard.tsx`
  - Update navigator:
    - Remove routes for the above screens.
    - Ensure only core routes remain: Onboarding, Input, Result, Why, Profile, Settings.

- [x] **0.5 Purge code references (safety sweep)**

  - Search & remove:
    - Channels/strings: `S3_CMD_CHANNEL`, `S3_EVT_CHANNEL`, `"s3/game/cmd"`, `"s3/game/events"`
    - Types: `GameCommand`, `GameEvent`, `GameResult`, `game_core_version`, `clientHash`
    - Screens: `GameHub`, `TeamSelect`, `Lobby`, `RunnerGame`, `MatchResult`, `Leaderboard`
  - Suggested commands:
    - `rg -n "S3_CMD_CHANNEL|S3_EVT_CHANNEL|s3/game|GameBridge|GameHub|RunnerGame|MatchResult|Leaderboard|game_core_version|clientHash"`
    - Edit or delete matches as appropriate.

- [x] **0.6 Clean scripts & CI**

  - `git rm --ignore-unmatch scripts/build-flutter-aar.sh scripts/release-flutter.sh`
  - Edit `scripts/dev.sh`:
    - Remove any Flutter build steps; keep Metro + server only.
  - Edit CI config (e.g., `.github/workflows/*.yml` or similar):
    - Remove steps that run `fvm flutter doctor/build aar`, bridge contract tests, cross-lang vectors, iOS build unless you want it.
    - Keep: lint, typecheck, Jest, Detox (Android), dependency-cruiser, file size gate.

- [x] **0.7 Remove unused docs**

  - `git rm --ignore-unmatch docs/PROJECT_STATUS.md`
  - Ensure `README.md` will be rewritten later (§7.1).
  - Ensure `SECURITY.md` and `CANON_GUIDE.md` will be created/updated (§7.2–§7.3).

- [x] **0.8 Dependency & cache cleanup**

  - Remove dead deps in `package.json`:
    - `flame`, Flutter tool runners, game/bridge libs.
  - Keep RN deps, testing, MSW, zod, dependency-cruiser, pako, react-native-svg, etc.
  - Reinstall:
    - `rm -rf node_modules && pnpm i`
  - Native rebuild:
    - `cd android && ./gradlew clean && cd ..`
    - `cd ios && bundle exec pod deintegrate && bundle exec pod install && cd ..`

- [x] **0.9 Sanity builds**
  - `npm run android`
  - `npm run ios` (optional on macOS)

---

## 1. Core App (Keep/Finish)

- [x] **1.1 RN foundation & deps**
- [x] **1.2 BodyGraph client & cache**
- [x] **1.3 Scorer library & tests**
- [x] **1.4 Moderation (trimmed)**

---

## 2. UI Components & Screens (Figma Integrated)

> **CRITICAL:** All UI implementation MUST use the complete Figma design system from:  
> `/Users/kingkamehameha/Documents/Kiro/GF_App/star-system-sorter/Figma`

### 2.0 Figma Design System Reference

**Location:** `/Users/kingkamehameha/Documents/Kiro/GF_App/star-system-sorter/Figma`

#### Design Tokens & Guidelines (Reference Files - Not Yet Integrated)
- [ ] **design-tokens.json** - Complete token system (colors, spacing, typography, elevation, effects) - NEEDS INTEGRATION
- [ ] **game-tokens.json** - Game layer tokens (HUD controls, team colors, game modes) - NEEDS INTEGRATION
- [ ] **globals.css** - CSS variables for design tokens - NEEDS CONVERSION TO RN
- [ ] **Guidelines.md** - Design system usage guidelines - REFERENCE ONLY
- [ ] **IMPLEMENTATION_CHECKLIST.md** - 9 core screens implementation status - REFERENCE ONLY
- [ ] **GAME_LAYER_CHECKLIST.md** - 10 game screens implementation status (screens 10-19) - REFERENCE ONLY
- [ ] **Attributions.md** - Third-party asset attributions - REFERENCE ONLY
- [ ] **App.tsx** - Complete Figma prototype with all screens - REFERENCE ONLY

#### Core S³ Components (`Figma/components/s3/`)
- [x] **AppBar.tsx** - Navigation header with back button
- [x] **Button.tsx** - Button variants (Primary, Secondary, Ghost, Destructive)
- [x] **Card.tsx** - Card variants (Default, Emphasis, Warning)
- [x] **Chip.tsx** - Chip variants (Gold, Lavender, Selectable, Dismissible)
- [x] **Field.tsx** - Form input with error states and icons
- [x] **TabBar.tsx** - Bottom navigation (Home, Community, Profile)
- [x] **Toast.tsx** - Toast notifications and InlineAlert
- [x] **StarSystemCrests.tsx** - 6 star system SVG icons (Orion, Sirius, Pleiades, Andromeda, Lyra, Arcturus)

#### Core Screens (`Figma/components/s3/screens/`)
- [x] **PaywallScreen.tsx** - Subscription paywall
- [x] **SettingsScreen.tsx** - Settings and privacy
- [x] **EmptyStatesScreen.tsx** - Empty states and errors

#### Game Components (`Figma/components/s3/game/`)
- [x] **HUDComponents.tsx** - Joystick, HUDButton, PauseButton, HPHearts, XPBar, DistanceMeter, Timer, Counter
- [x] **GameCards.tsx** - GameModeCard, QuestCard
- [x] **GameBadges.tsx** - TeamBadge (all 6 star systems)
- [x] **PartyMember.tsx** - Party member list item
- [x] **GameModals.tsx** - PauseModal, ConfirmExitModal, MusicThemeModal

#### shadcn/ui Components (`Figma/components/ui/`)
- [x] 50+ shadcn/ui components adapted for React Native (accordion, alert, avatar, badge, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, tooltip, etc.)

#### Figma Utilities
- [x] **ImageWithFallback.tsx** - Image component with fallback handling

#### Core Screens (from IMPLEMENTATION_CHECKLIST.md)
1. **01_Onboarding** - Hero with "Begin Sorting" CTA, 3-step explanation
2. **02_Input_BirthData** - Birth data form with tabs (Birth Data | Upload Chart PDF)
3. **03_Sort_Result** - Primary star system with radial chart, ally chips, disclaimer
4. **04_Why_This_Result** - Contributors list with weights and icons
5. **05_Community_StarSystem** - Community feed, quests, members (tabs)
6. **06_Profile & Avatar** - User profile with star system cards
7. **07_Subscription_Paywall** - Feature list and pricing
8. **08_Settings_Privacy** - Privacy settings and preferences
9. **09_EmptyStates & Errors** - Empty states and error handling

#### Game Screens (from GAME_LAYER_CHECKLIST.md)
10. **10_Game_Hub** - Game entry point with team status
11. **11_Team_Select** - 6 star system selection
12. **12_Mode_Select** - Survivor Arena vs Side Runner
13. **13_Lobby_Matchmaking** - Party and matchmaking
14. **14_HUD_Survivor** - Survivor Arena HUD with joystick and action buttons
15. **15_HUD_Runner** - Side Runner HUD with distance meter
16. **16_Match_Result** - Victory screen with stats and rewards
17. **17_Leaderboard_Season** - Global, team, and friends leaderboards
18. **18_Music_Theme** - Star system music theme selection
19. **19_Quests_Pass** - Daily, weekly, and season pass quests

### 2.1 Implementation Tasks

- [ ] **2.1.1 RadialChart**
  - [ ] Re-implement with Figma design tokens (lavender/gold gradients)
  - [ ] Match exact styling from 03_Sort_Result screen
  - [ ] Use design-tokens.json for colors and spacing
- [ ] **2.1.2 ScoreDisplay**
  - [ ] Re-implement using Figma typography and spacing tokens
  - [ ] Match exact styling from 03_Sort_Result screen
  - [ ] Use design-tokens.json for font sizes and weights
- [ ] **2.1.3 StarSystemCrest**
  - [ ] Re-implement SVG crests from Figma/components/s3/StarSystemCrests.tsx
  - [ ] Export sizes: 24px, 28px, 48px
  - [ ] Ensure currentColor fill for theming
  - [ ] Fallback for missing crests
- [ ] **2.1.4 Onboarding Screen**
  - [ ] Implement using Figma Button, Card, and layout from 01_Onboarding
  - [ ] Starfield background with gradient blobs
  - [ ] S³ hero with logo icon
  - [ ] "Begin Sorting" CTA
  - [ ] 3-step explanation (Input → Sort → Narrative)
- [ ] **2.1.5 Input Screen**
  - [ ] Re-implement using Figma Field component from 02_Input_BirthData
  - [ ] Tabs: Birth Data | Upload Chart PDF
  - [ ] Fields with icons (calendar, clock, location)
  - [ ] "Compute Chart" CTA
  - [ ] Toast notification on submit
  - [ ] Match exact Figma styling and spacing
- [ ] **2.1.6 Result Screen**
  - [ ] Re-implement using Figma Card and layout from 03_Sort_Result
  - [ ] "Your Primary Star System" header
  - [ ] Radial percentage chart (using updated RadialChart)
  - [ ] Ally chips (Sirius, Lyra, Andromeda) using Figma Chip component
  - [ ] "View Why" and "Generate Narrative" buttons using Figma Button
  - [ ] **Disclaimer:** "For insight & entertainment. Not medical, financial, or legal advice."
  - [ ] TabBar navigation using Figma TabBar
- [ ] **2.1.7 Why Screen**
  - [ ] Re-implement using Figma layout from 04_Why_This_Result
  - [ ] Contributors list with weights and icons
  - [ ] Gradient backgrounds from design-tokens.json
  - [ ] Back navigation using Figma AppBar
- [ ] **2.1.8 Profile Screen**
  - [ ] Implement using Figma layout from 06_Profile & Avatar
  - [ ] Avatar placeholder
  - [ ] User type display (Manifesting Generator • 1/3)
  - [ ] Star system profile cards (Primary + Allies)
  - [ ] "Generate Avatar" CTA
  - [ ] Settings icon → Settings screen
  - [ ] TabBar navigation
- [ ] **2.1.9 Settings Screen**
  - [ ] Implement using Figma SettingsScreen.tsx from 08_Settings_Privacy
  - [ ] Privacy notice (inline alert)
  - [ ] Data & Privacy settings
  - [ ] Notification preferences
  - [ ] Display preferences
  - [ ] Account actions (Sign Out, Delete Account)
  - [ ] Legal links (Terms, Privacy Policy)
- [ ] **2.1.10 Empty States & Errors**
  - [ ] Implement using Figma EmptyStatesScreen.tsx from 09_EmptyStates & Errors
  - [ ] Empty state examples (No Chart, No Posts)
  - [ ] Error states (Network, Invalid Data)
  - [ ] Inline alerts (all 4 types: success, info, warning, error)
- [ ] **2.1.11 Accessibility Pass**
  - [ ] Add `accessibilityLabel`/`Hint` on all interactive elements
  - [ ] Verify screen reader flow (TalkBack/VoiceOver)
  - [ ] Ensure all touch targets ≥44px (WCAG 2.1 AA)
  - [ ] Verify text contrast ratios (≥4.5:1 for body text)
  - [ ] Test focus ring on keyboard navigation

### 2.2 Design Token Integration

- [ ] **2.2.1 Import design-tokens.json**
  - [ ] Parse and convert to React Native StyleSheet constants
  - [ ] Create theme provider with Figma tokens
- [ ] **2.2.2 Typography System**
  - [ ] Implement font sizes (xs to 4xl)
  - [ ] Implement font weights (normal, medium, semibold, bold)
  - [ ] Implement line heights (tight, normal, relaxed)
- [ ] **2.2.3 Color System**
  - [ ] Canvas colors (dark, darker, surface variants)
  - [ ] Lavender primary scale (100-900)
  - [ ] Gold highlight scale (100-700)
  - [ ] Text colors with WCAG AA contrast
  - [ ] Semantic colors (success, error, warning, info)
  - [ ] Border colors (subtle, muted, emphasis)
- [ ] **2.2.4 Spacing & Layout**
  - [ ] Spacing scale (4px grid: 1-16)
  - [ ] Border radius scale (sm/md/lg/xl/full)
  - [ ] Touch target minimum: 44px
- [ ] **2.2.5 Elevation & Effects**
  - [ ] Elevation shadows (0-4 levels)
  - [ ] Focus ring (default + error variants)
  - [ ] Blur effects (sm/md/lg/xl)

### 2.3 Component Adaptation

- [ ] **2.3.1 Adapt Figma Button Component**
  - [ ] Variants: Primary, Secondary, Ghost, Destructive
  - [ ] Sizes: sm (44px), md (44px), lg (48px)
  - [ ] States: default, hover, active, focus, disabled, loading
  - [ ] leadingIcon prop
  - [ ] Scale animation on press (0.98)
- [ ] **2.3.2 Adapt Figma Chip Component**
  - [ ] Variants: Gold, Lavender
  - [ ] Selectable state (toggleable)
  - [ ] Selected state (filled background)
  - [ ] Dismissible with X icon
  - [ ] Touch targets ≥44px
- [ ] **2.3.3 Adapt Figma Field Component**
  - [ ] Variants: default, focus, error
  - [ ] Icon slot (leading)
  - [ ] Helper text slot
  - [ ] Error message display
  - [ ] Focus ring animation
- [ ] **2.3.4 Adapt Figma Card Component**
  - [ ] Variants: Default, Emphasis, Warning
  - [ ] Gradient backgrounds
  - [ ] Border styling
  - [ ] Backdrop blur
- [ ] **2.3.5 Adapt Figma Toast & InlineAlert**
  - [ ] Types: success, info, warning, error
  - [ ] Toast: auto-dismiss (3s default)
  - [ ] Toast: top-center positioning
  - [ ] InlineAlert: dismissible variant
  - [ ] Icon indicators
- [ ] **2.3.6 Adapt Figma AppBar**
  - [ ] Title prop
  - [ ] Back button with onBack handler
  - [ ] Height: 56px
  - [ ] Touch targets ≥44px
- [ ] **2.3.7 Adapt Figma TabBar**
  - [ ] Tabs: Home, Community, Profile
  - [ ] Active state indicator
  - [ ] Icon + label
  - [ ] onTabChange handler
  - [ ] Touch targets ≥44px

### 2.4 Figma Reference Documentation

**When implementing any UI component or screen, you MUST:**
1. Reference the corresponding Figma component in `/Users/kingkamehameha/Documents/Kiro/GF_App/star-system-sorter/Figma`
2. Use design tokens from `design-tokens.json` and `game-tokens.json`
3. Follow the implementation checklists in `IMPLEMENTATION_CHECKLIST.md` and `GAME_LAYER_CHECKLIST.md`
4. Maintain the "Ethereal Flow" aesthetic (dark-mystic canvas, lavender primary, gold highlights)
5. Ensure all touch targets are ≥44px (WCAG 2.1 AA)
6. Apply proper accessibility labels and screen reader support
7. Use the exact copy and disclaimers specified in the Figma screens

---

## 3. Server (Minimal)

- [x] **3.1 BodyGraph proxy `/internal/hd`**
- [ ] **3.2 HTTP server bootstrap**
  - [ ] `apps/server/src/http.ts`
  - [ ] `apps/server/src/index.ts`
- [ ] **3.3 Tests**
  - [ ] Happy path, 400/401, 429, 5xx, caching

---

## 4. Validation & Schemas

- [ ] **4.1 Zod schemas**
  - [ ] Define client/server schemas for sorter flow
- [ ] **4.2 Generate JSON Schemas**
  - [ ] `zod-to-json-schema` → `schemas/*.json`

---

## 5. Build & CI (RN-Only)

- [ ] **5.1 Android release config**
  - [ ] Signing config; enable `minifyEnabled true` & `shrinkResources true`
- [ ] **5.2 iOS release config (optional)**
  - [ ] Signing/profiles; verify smaller build size
- [ ] **5.3 CI gates**
  - [ ] Lint + typecheck + Jest
  - [ ] Detox (Android)
  - [ ] dependency-cruiser (no cycles, no deep imports)
  - [ ] File-size gate ≤150 LOC/file (`// @exception(max-lines)` allowed)

---

## 6. Testing

- [ ] **6.1 MSW v2 setup**
  - [ ] `src/mocks/handlers.ts` for `/internal/hd`
- [ ] **6.2 Detox E2E**
  - [ ] Onboarding → Input → Result → Why
  - [ ] Offline/timeout & caching
- [ ] **6.3 Scorer goldens**
  - [ ] Fixtures → expected classification

---

## 7. Documentation

- [ ] **7.1 README.md**
  - [ ] Dev setup for RN app + Figma integration guide
- [ ] **7.2 SECURITY.md**
  - [ ] Add data-handling & PII policy
- [ ] **7.3 CANON_GUIDE.md**
  - [ ] Canon authoring structure & validation

---

## 8. Post-Cutover Cleanup (Automatable)

- [ ] **8.1 Remove dead imports/exports**
  - Run `ts-prune`; remove unused exports.
  - Run `depcruise`; verify no deep imports or cycles.
- [ ] **8.2 Repo hygiene**
  - Ensure no references: `Flutter|GameBridge|RunnerGame`
- [ ] **8.3 Final builds**
  - `npm run android`
  - `npm run build:android`
  - `npm run ios` (optional)

---

## Notes & Conventions

- Keep files ≤300 LOC.
- Use **React Native primitives** — no CSS runtime.
- All new UI components come from Figma design system in `/Users/kingkamehameha/Documents/Kiro/GF_App/star-system-sorter/Figma`.
- Add `testID` and a11y props to every interactive element.
- No secrets in mobile bundle; all keys on server.
