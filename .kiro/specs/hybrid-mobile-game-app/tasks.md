# Implementation Plan

This document outlines the implementation tasks for Star System Sorter (S³). Each task is focused on writing, modifying, or testing code, building incrementally on previous tasks.

## Definition of Done

The MVP is complete when:

- ✅ App screens load and navigate correctly on Android and iOS
- ✅ Native bridge handshake works (ready → start → result)
- ✅ One leaderboard day computes correctly with team aggregation
- ✅ Scorer golden fixtures pass (known inputs → expected outputs)
- ✅ Moderation soft/hard block messages match copy
- ✅ Cross-lang determinism verified (Dart and Node produce identical scores)
- ✅ All CI gates pass (lint, typecheck, tests, import graph, file size)
- ✅ App runs on both Android and iOS with target performance metrics

## Rollout Checklist

Before deployment:

- [ ] FlutterEngine caching working on Android and iOS
- [ ] MethodChannel/EventChannel bridge tested on both platforms
- [ ] Native bridge contract tests passing
- [ ] Super Dash Flutter module integrated correctly
- [ ] Seeds reproducible in both Dart and Node
- [ ] App runs on Android mid-tier devices (≤2.5s launch, ≥55 FPS)
- [ ] App runs on iOS A-series devices (≤1.8s launch, ≥55 FPS)
- [ ] Flutter module size ≤25MB (compressed)

## Task List

- [ ] 0. Preflight and native module setup

  - [x] 0.1 Set up React Native project structure

    - Initialize React Native project with TypeScript
    - Configure Metro bundler
    - Set up Android and iOS native projects
    - Document in README.md
    - _Requirements: 1.1, 1.2, 9.1_

  - [ ] 0.2 Configure Flutter module integration
    - Create Flutter module structure for Super Dash
    - Configure Android build.gradle to include Flutter module
    - Configure iOS Podfile to include Flutter module
    - Set up FlutterEngine caching strategy
    - _Requirements: 2.1, 3.1, 3.2, 3.11_

- [ ] 1. Set up React Native project and dependencies

  - [x] 1.1 Install and configure core dependencies

    - Install: zod, @hookform/resolvers, react-hook-form
    - Install: zustand (for minimal global state)
    - Install: @react-navigation/native, @react-navigation/native-stack
    - Install: react-native-svg (for crests and charts)
    - Install: pako (for gzip/deflate compression)
    - Optional: react-native-document-picker (for chart PDF upload)
    - Configure Zod as single source of truth for validation
    - _Requirements: 12.1, 12.7, 12.8_

  - [x] 1.2 Install and configure dev dependencies

    - Install: jest (already present in RN)
    - Install: @testing-library/react-native
    - Install: detox (for E2E tests)
    - Install: msw@2.x, @mswjs/interceptors (for API mocking in Jest)
    - Install: dependency-cruiser (for import graph enforcement)
    - Install: zod-to-json-schema (for schema generation)
    - Configure detox to hit local dev API (not mocked network)
    - Configure MSW v2 with @mswjs/interceptors/fetch in Jest setup
    - _Requirements: 12.3, 12.7_

  - [x] 1.3 Configure dependency-cruiser rules

    - Create .dependency-cruiser.js config
    - Enforce no import cycles
    - Enforce no deep imports (only via index.ts)
    - Enforce layering: Screens → Components → Theme → Utils
    - Add to CI pipeline
    - _Requirements: 11.6, 11.7_

  - [ ] 1.4 Adapt existing shadcn/ui components for React Native

    - Review components/ui folder
    - Create React Native equivalents using react-native primitives
    - Maintain same API surface where possible
    - Use StyleSheet for styling based on globals.css tokens
    - _Requirements: 1.2, 1.3, 1.4, 1.8_

  - [x] 1.5 Set up React Navigation
    - Configure native-stack navigator for main screens (faster than stack)
    - Set up navigation types with TypeScript
    - Configure deep linking if needed
    - _Requirements: 1.7_

- [ ] 2. Integrate hdkit for Human Design data generation

  - [ ] 2.0 Inspect and integrate local hdkit

    - Inspect hdkit/ at repo root: hdkit.js, constants.js, bodygraph-data.js, sample-apps/v1/
    - Find utilities that yield type, authority, profile, centers, channels, gates from date/time/location
    - Identify pure/offline computation path (no API keys)
    - Document hdkit API surface in comments
    - _Requirements: 4.1_

  - [ ] 2.1 Configure hdkit path alias

    - Add path alias in tsconfig.json: `@hdkit/*` → `hdkit/*`
    - Add to metro.config.js: watchFolders for repo root, resolver extraNodeModules
    - Ensure Metro can see hdkit/ at repo root
    - Add minimal ambient types if needed (no new deps)
    - Test import works: `import { ... } from '@hdkit/hdkit'`
    - _Requirements: 12.10_

  - [ ] 2.2 Create hdkit adapter

    - Write src/hd/hdkit-adapter.ts (≤120 LOC)
    - Export `computeHDExtract({ dateISO, time, timeZone, lat?, lon? }): Promise<HDExtract>`
    - Call hdkit internally and map to HDExtract shape (type, authority, profile, centers[], channels[], gates[])
    - Convert local wall time + IANA timeZone to UTC using platform APIs (no new time libs)
    - Keep computation deterministic (same inputs → same outputs)
    - Functions ≤40 LOC each
    - _Requirements: 4.1, 11.1, 11.3_

  - [x] 2.3 Add timezone selection to Input screen

    - Add Time Zone select with IANA IDs to Input form
    - Default to `Intl.DateTimeFormat().resolvedOptions().timeZone`
    - No geocoder or timezone libraries
    - Use react-hook-form + Zod validation
    - _Requirements: 1.3, 12.10_

  - [ ] 2.4 Wire Input screen to hdkit adapter

    - On form submit: validate with Zod + react-hook-form
    - Call `computeHDExtract(...)` with form data
    - Pass result to `classify()` from scorer
    - Navigate to Result/Why screens with classification
    - Handle errors gracefully with user-friendly messages
    - _Requirements: 4.1, 4.10_

  - [ ] 2.5 Add hdkit licensing

    - Copy hdkit/LICENSE to third_party/hdkit-LICENSE
    - Add entry in NOTICE.md or Attributions.md
    - Document hdkit usage and attribution
    - _Requirements: 1.14, 12.10_

  - [ ] 2.6 Write hdkit adapter tests (REQUIRED)
    - Create tests/hdkit-adapter.test.ts
    - Add 2-3 fixtures with known date/time/location → expected HDExtract
    - Assert full, typed HDExtract returned
    - Test timezone conversion correctness
    - Light integration test: Input → adapter → classify() path (can stub scorer)
    - _Requirements: 10.1_

- [ ] 3. Implement scorer library with deterministic classification

  - [ ] 3.1 Create scorer types and interfaces

    - Write TypeScript interfaces for HDExtract, Canon, ScorerResult, TiePolicy
    - Define SystemWeights and contributor types
    - _Requirements: 4.1, 4.7_

  - [ ] 3.2 Implement canon loading and checksum

    - Write canon.ts to load mock canon YAML
    - Implement SHA256 checksum computation for canonicalized JSON
    - Validate canon structure with Zod schema
    - _Requirements: 4.2, 4.8_

  - [ ] 3.3 Implement core scoring algorithm

    - Write score.ts with weighted scoring logic
    - Normalize scores to 0.1% precision
    - Calculate per-system percentages and contributors
    - _Requirements: 4.3, 4.10_

  - [ ] 3.4 Implement tie-breaking logic

    - Write tie.ts with hybridWindowPct logic (default 6.0)
    - Implement tie-break by contributor count, then lexicographic order
    - Return primary, hybrid, or unresolved classification
    - _Requirements: 4.4, 4.5, 4.6_

  - [ ] 3.5 Create scorer public API

    - Write index.ts with exported classify() function
    - Include meta information (canonVersion, canonChecksum)
    - _Requirements: 4.7, 4.9_

  - [ ] 3.6 Write scorer unit tests (REQUIRED)
    - Test each system's scoring with known inputs
    - Test tie-breaking edge cases
    - Test canon checksum computation
    - Create golden fixtures: HD extracts → expected results
    - _Requirements: 10.1_

- [ ] 4. Implement moderation system

  - [ ] 4.1 Create moderation types and blocklists

    - Write types.ts with ModResult and ModContext interfaces
    - Write blocklists.ts with hard/soft block patterns
    - Organize by category (sexual, harassment, PII, etc.)
    - _Requirements: 5.1, 5.11_

  - [ ] 4.2 Implement text and prompt sanitization

    - Write sanitizer.ts with pattern matching logic
    - Implement avatar prompt allowlist (abstract/crest/cosmic)
    - Block body/age/sexual terms and real names
    - _Requirements: 5.7, 5.8_

  - [ ] 4.3 Implement ModerationService class

    - Write service.ts with checkText() and checkImage() methods
    - Implement decision logic (allow/soft_block/hard_block/review)
    - Add rate limiting per user per action type
    - Track flagged content with 30-day retention
    - _Requirements: 5.3, 5.4, 5.9, 5.11_

  - [ ] 4.4 Create moderation public API

    - Write index.ts with exported ModerationService
    - Document usage patterns and error messages
    - _Requirements: 5.5, 5.6, 5.12_

  - [ ] 4.5 Write moderation unit tests (REQUIRED)
    - Test blocklist patterns for each category
    - Test avatar sanitizer with various prompts
    - Test rate limiting logic
    - Test decision handlers and error messages
    - _Requirements: 10.2_

- [ ] 5. Create UI components and utilities

  - [ ] 5.0 Set up global state with zustand

    - Create src/state/store.ts with zustand store
    - Define 2-3 atoms: userSession, gameState, toastNotifications
    - Keep usage minimal, prefer local component state
    - Export typed hooks for accessing state
    - _Requirements: 12.1, 12.8_

  - [ ] 5.1 Create StarSystemCrest component

    - Write StarSystemCrest.tsx with size and variant props
    - Render SVG crests using react-native-svg
    - Implement fallback for missing crests
    - _Requirements: 1.3, 1.15_

  - [ ] 5.2 Create RadialChart component

    - Write RadialChart.tsx with percentage, label, color props
    - Implement SVG-based radial progress chart using react-native-svg
    - Add animation using Animated API
    - _Requirements: 1.3_

  - [ ] 5.3 Create ScoreDisplay component

    - Write ScoreDisplay.tsx using adapted Card and Badge components
    - Display primary system, percentage, and allies
    - Show disclaimer text
    - _Requirements: 1.7, 1.10_

  - [ ] 5.4 Create GameBridge module wrapper
    - Write GameBridge.ts wrapping NativeModules.GameBridge
    - Implement timeout logic (expect ready within 5000ms)
    - Handle DeviceEventEmitter for game events
    - Provide typed API for commands and events
    - _Requirements: 3.3, 3.4, 3.10, 3.11_

- [ ] 6. Implement native game bridge

  - [ ] 6.1 Create bridge types and schemas

    - Write types.ts with GameCommand and GameEvent types
    - Define GameResult interface with clientHash and game_core_version
    - Use Zod as runtime validator (source of truth)
    - Generate JSON Schemas via zod-to-json-schema for docs/clients
    - _Requirements: 3.5, 2.9_

  - [ ] 6.2 Implement Android native bridge

    - Write GameBridgeModule.java with MethodChannel and EventChannel
    - Cache FlutterEngine in Application class as "s3_engine"
    - Implement open() method to launch Flutter activity
    - Implement sendCommand() method for MethodChannel
    - Set up EventChannel for game events
    - Register module in GameBridgePackage.java
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 6.3 Implement iOS native bridge

    - Write GameBridgeModule.m with MethodChannel and EventChannel
    - Cache FlutterEngine in AppDelegate
    - Implement open() method to present Flutter view controller
    - Implement sendCommand() method for MethodChannel
    - Set up EventChannel for game events
    - Register module in RCTBridgeModule
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 6.4 Wire React Native to native bridge

    - Create GameBridge.ts wrapper for NativeModules
    - Implement DeviceEventEmitter listener for events
    - Add command validation before sending
    - Handle errors gracefully with fallback UI
    - _Requirements: 3.4, 3.10_

  - [ ] 6.5 Write bridge contract tests (REQUIRED)
    - Test MethodChannel command serialization
    - Test EventChannel event deserialization
    - Test FlutterEngine caching and reuse
    - Create golden JSON fixtures for all message types
    - Test timeout and retry logic
    - _Requirements: 10.3_

- [ ] 7. Create core UI screens

  - [ ] 7.0 Create compression utility

    - Write src/lib/compression.ts using pako for gzip/deflate
    - Export compress() and decompress() functions
    - Note: native compression modules are optional for later optimization
    - _Requirements: 12.1_

  - [ ] 7.1 Create Onboarding screen

    - Write Onboarding.tsx with app intro and steps
    - Use adapted Button component for CTA
    - Apply StyleSheet styling from design tokens
    - _Requirements: 1.3, 1.6_

  - [x] 7.2 Create Input screen

    - Write Input.tsx with form for birth data
    - Use react-hook-form with zodResolver for validation
    - Use adapted Form, TextInput, Label components
    - Define Zod schema as single source of truth
    - Optional: Add file picker for chart PDF using react-native-document-picker
    - Validate inputs before submission
    - _Requirements: 1.3, 1.4, 12.1, 12.7_

  - [ ] 7.3 Create Result screen

    - Write Result.tsx displaying classification result
    - Use ScoreDisplay, RadialChart, StarSystemCrest components
    - Show allies with adapted Badge components
    - Add "View Why" and "Generate Narrative" buttons
    - _Requirements: 1.3, 1.7, 1.10_

  - [ ] 7.4 Create Why screen

    - Write Why.tsx explaining classification reasoning
    - Display contributors per system
    - Use adapted Card component for layout
    - _Requirements: 1.3_

  - [ ] 7.5 Create Profile and Settings screens

    - Write Profile.tsx with user info display
    - Write Settings.tsx with app preferences
    - Use adapted React Native components
    - _Requirements: 1.3_

  - [ ] 7.6 Accessibility pass on all screens
    - Add accessibilityLabel to all interactive elements
    - Ensure 44px minimum touch targets
    - Test with TalkBack (Android) and VoiceOver (iOS)
    - Add accessibilityHint where needed
    - Verify screen reader navigation flow
    - _Requirements: 1.6, 1.10, 13.5, 13.6_

- [ ] 8. Create game-related screens

  - [ ] 8.1 Create GameHub screen

    - Write GameHub.tsx as entry point to games
    - Display available events with adapted Card components
    - Use adapted Button component for navigation
    - _Requirements: 1.3_

  - [ ] 8.2 Create TeamSelect screen

    - Write TeamSelect.tsx for choosing star system team
    - Display StarSystemCrest for each team
    - Use adapted Button or Card for selection
    - _Requirements: 1.3, 1.4_

  - [ ] 8.3 Create Lobby screen

    - Write Lobby.tsx showing pre-game info
    - Display team, seed, and game rules
    - Add "Start Game" button
    - _Requirements: 1.3_

  - [ ] 8.4 Create SuperDash screen

    - Write SuperDash.tsx calling GameBridge.open()
    - Handle game lifecycle via MethodChannel commands
    - Listen for result event via DeviceEventEmitter
    - Navigate to MatchResult on game completion
    - Handle back button: pause on first press, quit on second
    - Lock orientation to landscape natively (Android: AndroidManifest activity, iOS: supported orientations)
    - _Requirements: 1.3, 2.5, 3.1, 3.7, 3.8, 3.9_

  - [ ] 8.5 Create MatchResult screen

    - Write MatchResult.tsx displaying game result
    - Show score, metrics, and validation status
    - Use adapted Card and Badge components
    - Add "View Leaderboard" button
    - _Requirements: 1.3_

  - [ ] 8.6 Create Leaderboard screen
    - Write Leaderboard.tsx with team rankings
    - Use FlatList for efficient rendering
    - Add filtering by event and date
    - _Requirements: 1.3_

- [ ] 9. Implement Super Dash Flutter module adapter

  - [ ] 9.0 Convert Super Dash to Flutter module

    - Copy existing Super Dash from `/Users/kingkamehameha/Documents/Kiro/GF App/super_dash`
    - Convert to Flutter module structure (flutter create --template=module)
    - Update pubspec.yaml for module configuration
    - Document integration in README.md
    - _Requirements: 2.1, 9.6_

  - [ ] 9.1 Create MethodChannel/EventChannel bridge in Flutter

    - Write lib/bridge/method_channel_bridge.dart
    - Set up MethodChannel `s3/game/cmd` for commands
    - Set up EventChannel `s3/game/events` for events
    - Implement command handler (start/pause/resume/quit/set-music)
    - Implement event sender (ready/state/result/error)
    - _Requirements: 2.1, 2.2, 3.2_

  - [ ] 9.2 Create bridge schemas in Dart

    - Write lib/bridge/schema.dart with command/event classes
    - Implement JSON serialization/deserialization
    - Add validation logic with pattern matching
    - _Requirements: 2.1, 2.2, 3.5_

  - [ ] 9.3 Audit and replace randomness/time in Super Dash

    - Search for all Random() and DateTime.now() usage in vendor code
    - Route through seeded_rng.dart and fixed_timestep.dart
    - Document replacements in CHANGES.md
    - _Requirements: 2.7, 2.12_

  - [ ] 9.4 Implement PCG32 seeded RNG

    - Write lib/core/seeded_rng.dart with PCG32 algorithm
    - Document multiplier/increment constants
    - Accept 64-bit seed as hex string
    - Implement Random interface for drop-in replacement
    - _Requirements: 2.7, 2.12_

  - [ ] 9.5 Implement fixed timestep loop

    - Write lib/core/fixed_timestep.dart with 16.6667ms timestep
    - Use frame index as time source (no DateTime.now())
    - Implement accumulator pattern for consistent updates
    - _Requirements: 2.6, 2.12_

  - [ ] 9.6 Implement fixed-point arithmetic (Q16.16)

    - Write lib/core/fixed_point.dart with Q16.16 helpers
    - Implement add, mul, div operations with fixed precision
    - Add conversion to/from double
    - Replace critical physics/scoring hot paths in game
    - _Requirements: 2.8_

  - [ ] 9.7 Implement input recorder

    - Write lib/core/input_recorder.dart for frame-indexed inputs
    - Record jump/dash with frame numbers
    - Implement RLE/delta compression
    - Compute clientHash: SHA256({seed, inputs, game_core_version})
    - _Requirements: 2.9, 2.10_

  - [ ] 9.8 Implement team theming

    - Write lib/theming/team_theme.dart mapping teams to colors
    - Apply visual overlays (particles, trails, effects)
    - Modify UI elements (HUD colors, backgrounds)
    - _Requirements: 2.10_

  - [ ] 9.9 Create game adapter with DI

    - Write lib/adapter/game_adapter.dart as DI container
    - Provide: seeded RNG, fixed timestep, input recorder, team theme
    - Replace default implementations in game initialization
    - _Requirements: 2.6, 2.7, 2.8, 2.9_

  - [ ] 9.10 Implement ghost overlay (minimal)

    - Parse teammate input timeline + seed
    - Render translucent actor with collisions disabled
    - Toggle via command from React Native
    - _Requirements: 2.11_

  - [ ] 9.11 Wire adapter to main.dart
    - Modify lib/main.dart to initialize MethodChannel/EventChannel bridge
    - Handle start command: apply seed, inject adapter, apply theme
    - Handle pause/resume/quit commands via MethodChannel
    - Send ready event on initialization via EventChannel
    - Send result event on game end with clientHash via EventChannel
    - Handle app lifecycle (background/foreground)
    - _Requirements: 2.1, 2.2, 2.5, 2.9, 3.8, 9.6_

- [ ] 10. Implement server API

  - [ ] 10.1 Create HTTP server setup

    - Write apps/server/src/http.ts with node:http
    - Configure CORS permissively for dev (native apps don't enforce CORS)
    - Add request routing and error handling
    - _Requirements: 6.12_

  - [ ] 10.2 Create in-memory data store

    - Write apps/server/src/store/memory.ts
    - Implement Maps for runs, events, leaderboards, musicPrefs
    - Add Set for nonce tracking (replay protection)
    - Implement cleanup for expired data (90 days runs, 30 days flagged)
    - _Requirements: 6.12, 6.13, 11.3_

  - [ ] 10.3 Implement headless validator (truth source)

    - Write apps/server/src/validate.ts with re-simulation logic
    - Implement PCG32 RNG matching Flutter implementation exactly
    - Compute score from metrics using same formula as game
    - Validate within tolerance: abs(client - server) <= min(1%, 5 pts)
    - Check statistical bounds as additional guards (max speed/DPS/interval)
    - Mark suspect if anomalies detected
    - _Requirements: 6.3, 6.4, 6.5, 8.2, 8.3, 8.4, 8.5_

  - [ ] 10.4 Implement POST /api/runs/submit endpoint

    - Write apps/server/src/routes/runs.ts
    - Validate request against JSON Schema
    - Check game_core_version matches expected
    - Verify nonce hasn't been used (replay protection)
    - Call headless validator to re-simulate
    - Store run and update leaderboard
    - Return score, validated, suspect, reason
    - _Requirements: 6.1, 6.2, 6.4, 6.6, 6.7_

  - [ ] 10.5 Implement leaderboard aggregation

    - Write apps/server/src/routes/leaderboard.ts
    - Implement daily team score formula: sum(top K) + median(all)
    - Calculate K = clamp(round(sqrt(N)), 5, 25)
    - Sort teams by score and assign ranks
    - _Requirements: 6.8_

  - [ ] 10.6 Implement GET /api/leaderboard/daily endpoint

    - Add route handler in leaderboard.ts
    - Filter by event_id query parameter
    - Return teams with scores, ranks, and stats
    - _Requirements: 6.10_

  - [ ] 10.7 Implement GET /api/events/active endpoint

    - Write apps/server/src/routes/events.ts
    - Return list of active events
    - _Requirements: 6.11_

  - [ ] 10.8 Implement music preference endpoints

    - Write apps/server/src/routes/music.ts
    - Add GET /api/music/packs endpoint
    - Add POST /api/music/prefs endpoint
    - _Requirements: 7.4_

  - [ ] 10.9 Configure CORS for mobile clients

    - Note: Native apps don't enforce CORS, but set permissive headers for dev
    - Configure CORS to allow all origins in dev, restrict in production
    - _Requirements: 6.12_

  - [ ] 10.10 Wire all routes to HTTP server

    - Update apps/server/src/index.ts
    - Add route handlers for all endpoints
    - Start server on configured PORT
    - _Requirements: 6.12_

  - [ ] 10.11 Write server API tests (REQUIRED)
    - Test each endpoint with valid/invalid inputs
    - Test leaderboard aggregation formula
    - Test nonce replay protection
    - Test concurrent submissions
    - Test CORS with allowed origins
    - _Requirements: 10.4_

- [ ] 11. Implement routing and navigation

  - [x] 11.1 Set up React Navigation

    - Configure native-stack navigator for all screens
    - Add navigation guards if needed
    - Implement error handling for invalid routes
    - _Requirements: 1.3, 1.7_

  - [x] 11.2 Wire screens to navigator
    - Connect all screen components to navigation stack
    - Add navigation between screens with proper params
    - Test navigation flows on Android and iOS
    - _Requirements: 1.3_

- [ ] 12. Create JSON Schemas for validation

  - [ ] 12.1 Implement Zod schemas (source of truth)

    - Write Zod schemas for all API requests/responses
    - Use Zod for runtime validation in server
    - Return 400 with field errors on validation failure
    - _Requirements: 6.2_

  - [ ] 12.2 Generate JSON Schemas from Zod
    - Use zod-to-json-schema to generate schemas/\*.json
    - Commit generated schemas for docs/clients
    - Do not hand-write JSON Schemas
    - _Requirements: 6.2_

- [ ] 13. Build and deployment setup

  - [ ] 13.1 Configure Android build

    - Set up release signing configuration
    - Configure ProGuard rules for Flutter module
    - Optimize APK size (target: Flutter module ≤25MB)
    - Set up build variants (debug/release)
    - _Requirements: 9.5, 13.1, 13.4_

  - [ ] 13.2 Configure iOS build

    - Set up code signing and provisioning profiles
    - Configure build settings for Flutter module
    - Optimize IPA size (target: Flutter module ≤25MB)
    - Set up build schemes (debug/release)
    - _Requirements: 9.5, 13.1, 13.4_

  - [ ] 13.3 Create development and build scripts

    - Write scripts/dev.sh for local development (Metro + Node server)
    - Write scripts/build-android.sh for Android builds
    - Write scripts/build-ios.sh for iOS builds
    - Configure environment variables
    - _Requirements: 9.1, 9.4_

  - [ ] 13.4 Set up CI gates
    - Configure CI to run: lint + typecheck + Jest tests
    - Add native bridge contract tests + cross-lang golden vectors
    - Add import-graph check (no cycles, no deep imports)
    - Fail on files >150 LOC unless annotated `// @exception(max-lines)`
    - Minimum viable: Android build + all tests (iOS build only if macOS runners available)
    - _Requirements: 10.5, 10.6, 10.7, 10.12, 11.7_

- [ ] 14. Integration and E2E testing

  - [ ] 14.0 Set up MSW v2 for API mocking in Jest

    - Create src/mocks/handlers.ts with MSW v2 handlers
    - Mock all /api/_ endpoints (runs/submit, leaderboard/daily, events/active, music/_)
    - Configure MSW v2 with @mswjs/interceptors/fetch in Jest setup
    - Use for unit and integration tests only (Detox hits real dev API)
    - _Requirements: 12.3_

  - [ ] 14.1 Write Detox E2E tests (REQUIRED)

    - Test user flows: Onboarding → Input → Result → Why
    - Test game flow: GameHub → TeamSelect → Lobby → SuperDash → MatchResult
    - Test native bridge: ready → start → result path
    - Test deterministic behavior (same seed → same result)
    - Test leaderboard viewing and filtering
    - Test on both Android and iOS
    - _Requirements: 10.5, 10.6, 10.12_

  - [ ] 14.2 Write cross-lang golden vector tests (REQUIRED)
    - Create test fixtures with {seed, inputs, version}
    - Run in both Dart (Flutter) and Node (validator)
    - Assert identical scores produced
    - Verify determinism across platforms
    - Test on both Android and iOS
    - _Requirements: 10.4, 10.7, 10.13_

- [ ] 15. Documentation

  - [ ] 15.1 Write README.md

    - Document dev setup for React Native app, Flutter module, and server
    - Add commands for running on Android and iOS
    - Include environment variable configuration
    - Document FlutterEngine caching setup
    - _Requirements: 11.1_

  - [ ] 15.2 Write CANON_GUIDE.md

    - Explain how to author real canon data
    - Document canon YAML structure
    - Provide examples and validation rules
    - _Requirements: 11.2_

  - [ ] 15.3 Write SECURITY.md
    - Document PII handling stance
    - Explain moderation policies
    - Detail age gating rules
    - Document data retention (90 days runs, 30 days flagged)
    - _Requirements: 11.3_

## Notes

- Tasks marked "(REQUIRED)" are critical for MVP and must not be skipped
- Each task should result in working, tested code
- Follow file size limits: ≤150 LOC per file (prefer 60-120)
- Annotate exceptions with `// @exception(max-lines) why:<reason>`
- Maintain cyclomatic complexity ≤10 per function
- Adapt existing shadcn/ui components for React Native where possible
- Use StyleSheet for styling based on design tokens from globals.css
- Ensure acyclic import graph with proper layering
- Test on both Android and iOS throughout development
- Zod is the runtime source of truth; JSON Schemas are generated for docs
- FlutterEngine must be cached and warmed before first game launch
- Use MethodChannel for commands, EventChannel for events
