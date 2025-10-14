# Requirements Document

## Introduction

This document outlines the requirements for building **Star System Sorter (S³)**, a hybrid mobile application that combines React Native for UI with an embedded Flutter/Flame game (Super Dash). The app features a deterministic star system classification system, the Super Dash game with team-based scoring and validation, async team competition, comprehensive moderation, and a Node.js validation server. 

**Critical**: The system MUST leverage existing project assets including:
- **UI components** in `/Users/kingkamehameha/Documents/Kiro/GF App/components/ui` (shadcn/ui: 40+ components including accordion, alert-dialog, button, card, checkbox, dialog, dropdown-menu, form, input, select, tabs, toast, etc.)
- **Figma components** in `/Users/kingkamehameha/Documents/Kiro/GF App/components/figma` (ImageWithFallback, etc.)
- **Root files**: App.tsx, globals.css, Guidelines.md, Attributions.md
- **Super Dash game** at `/Users/kingkamehameha/Documents/Kiro/GF App/super_dash`

The system prioritizes safety, modularity, small file sizes, and cross-platform compatibility while maintaining a strict dependency budget and maximizing reuse of existing code.

## Requirements

### Requirement 1: React Native UI Foundation and Existing Assets

**User Story:** As a mobile user, I want a native-feeling app called Star System Sorter with core screens built using design tokens and existing components, so that I have a consistent and accessible experience across all features.

#### Acceptance Criteria

1. WHEN starting development THEN the system SHALL review and integrate existing project files including App.tsx, globals.css, Guidelines.md, and Attributions.md from the root folder
2. WHEN building UI THEN the system SHALL prioritize using existing components from `/Users/kingkamehameha/Documents/Kiro/GF App/components/ui` (shadcn/ui: accordion, alert, button, card, input, etc.) and `/Users/kingkamehameha/Documents/Kiro/GF App/components/figma` (ImageWithFallback, etc.)
3. WHEN creating new components THEN the system SHALL first check if suitable components exist in components/ui or components/figma before creating new ones
4. WHEN needing UI primitives THEN the system SHALL use existing shadcn/ui components from components/ui folder as the foundation
5. WHEN the app launches THEN the system SHALL display "Star System Sorter" or "S³" as the app name
6. WHEN loading design THEN the system SHALL use existing globals.css for styling and extend it with design tokens from `design-tokens.json` and `game-tokens.json` if needed
7. WHEN navigating the app THEN the system SHALL provide access to core screens including: Onboarding, Input, Result, Why, Profile, Settings, GameHub, TeamSelect, Lobby, SuperDash (game), MatchResult, and Leaderboard
8. WHEN rendering UI components THEN the system SHALL use existing shadcn/ui components from components/ui folder (button, card, input, dialog, tabs, form, select, etc.) directly without modification unless absolutely necessary
9. WHEN organizing components THEN the system SHALL keep each component file small (≤150 LOC, prefer 60-120) and focused on a single responsibility
10. WHEN displaying interactive elements THEN the system SHALL ensure touch targets are at least 44px and meet WCAG AA contrast requirements
11. WHEN showing result screens THEN the system SHALL display the disclaimer "For insight & entertainment. Not medical, financial, or legal advice."
12. WHEN referring to classification systems THEN the system SHALL use the term "star system" and never "house"
13. WHEN following guidelines THEN the system SHALL reference Guidelines.md for design and development standards
14. WHEN using third-party assets THEN the system SHALL maintain proper attribution as documented in Attributions.md
15. WHEN needing ImageWithFallback functionality THEN the system SHALL use the existing component from components/figma folder

### Requirement 2: Flutter/Flame Game Module (Super Dash Integration)

**User Story:** As a player, I want to play the Super Dash game embedded in the React Native app with team-based scoring, so that I can compete with my team in a validated environment.

#### Acceptance Criteria

1. WHEN integrating the game THEN the system SHALL use the existing Super Dash Flutter/Flame game from `/Users/kingkamehameha/Documents/Kiro/GF App/super_dash` as the base
2. WHEN the Flutter module initializes THEN the system SHALL set up MethodChannel `s3/game/cmd` for commands and EventChannel `s3/game/events` for results
3. WHEN starting a game THEN the system SHALL accept JSON commands with `{"type":"start","payload":{"game":"super_dash","seed":"<string>","team":"<team_name>"}}`
4. WHEN Super Dash runs THEN the system SHALL provide the existing auto-run platformer with jump/dash mechanics using Flame engine
5. WHEN a game completes THEN the system SHALL emit a result event with `{"type":"result","payload":{"game":"super_dash","score":N,"durationMs":N,"suspect":false,"clientHash":"...","metrics":{...}}}`
6. WHEN adapting the game THEN the system SHALL add deterministic seeding to the existing RNG for reproducible runs
7. WHEN recording gameplay THEN the system SHALL capture input timeline (frame-indexed jumps/dashes) and compute a clientHash
8. WHEN building the client THEN the system SHALL embed a game_core_version string and include it in every run payload
9. WHEN rendering teammate ghosts THEN the system SHALL add support for replaying saved input timelines as translucent silhouettes (optional enhancement)
10. WHEN theming the game THEN the system SHALL add team-specific visual themes (colors/effects) based on the selected star system
11. WHEN wall-clock time is needed THEN the system SHALL NOT use it in game logic for deterministic scoring

### Requirement 3: Native Bridge Integration

**User Story:** As a developer, I want seamless communication between React Native and Flutter, so that games can be launched, controlled, and report results reliably on both Android and iOS.

#### Acceptance Criteria

1. WHEN integrating on Android THEN the system SHALL cache a FlutterEngine in the Application class and register it in FlutterEngineCache as "s3_engine"
2. WHEN integrating on iOS THEN the system SHALL cache a FlutterEngine in AppDelegate and register plugins
3. WHEN launching a game from React Native THEN the system SHALL use NativeModules.GameBridge.open(game, seed, team) to start the Flutter activity/view controller
4. WHEN receiving game events THEN the system SHALL use DeviceEventEmitter on the RN side to handle typed events from Flutter
5. WHEN sending commands THEN the system SHALL validate JSON schema for start/pause/resume/quit/set-music commands
6. WHEN the bridge contract changes THEN the system SHALL have golden JSON fixtures in tests/bridge.contract.test.ts that validate message schemas
7. WHEN launching game routes THEN the system SHALL lock orientation to landscape for Runner and portrait/landscape per design for Horde
8. WHEN the app backgrounds THEN the system SHALL pause the game and resume on foreground
9. WHEN the RN back action triggers THEN the system SHALL show a pause modal in Flutter; a second back confirms exit
10. WHEN the Flutter engine fails to start THEN the system SHALL fall back to an RN error screen with retry option
11. WHEN first launching THEN the system SHALL warm and cache the Flutter engine before game start

### Requirement 4: Deterministic Scoring System

**User Story:** As a user, I want my personality profile classified into a primary or hybrid star system based on deterministic rules, so that I receive consistent and explainable results.

#### Acceptance Criteria

1. WHEN receiving HD extract data THEN the system SHALL validate inputs including type, authority, profile, centers, channels, and gates
2. WHEN loading canon THEN the system SHALL use a mock canon.yaml for tests with weights and "why" explanations per star system
3. WHEN computing scores THEN the system SHALL calculate per-system scores and normalize to 0.1% precision
4. WHEN applying tie policy THEN the system SHALL use hybridWindowPct as a single numeric percentage (default 6.0)
5. WHEN the lead margin is less than hybridWindowPct THEN the system SHALL return hybrid:[A,B] with A having higher percentage
6. WHEN breaking ties THEN the system SHALL use total positive contributor count, then canonical lexicographic order of star system label
7. WHEN determining classification THEN the system SHALL return `{primary | hybrid | unresolved, allies[], percentages, contributorsPerSystem[], meta:{canonVersion, canonChecksum}}`
8. WHEN computing canonChecksum THEN the system SHALL use SHA256 of canonicalized canon JSON with sorted keys and stripped comments
9. WHEN generating narrative THEN the system SHALL provide an LLM prompt template in `prompts/narrative.md` that outputs JSON-only: `{"ceremony":"<=140 words","traits":["..."],"practices":["..."]}`
10. WHEN scorer executes THEN the system SHALL produce identical results for identical inputs across all platforms

### Requirement 5: Safety and Moderation System

**User Story:** As a community member, I want comprehensive content moderation across chats, posts, and avatar generation, so that I feel safe and the platform remains appropriate for all users.

#### Acceptance Criteria

1. WHEN moderating content THEN the system SHALL hard block sexual content, nudity, fetish content, any sexualization of minors, harassment, hate speech, slurs, threats, bullying, stalking, doxxing, extremism, credible threats, self-harm instructions, explicit gore, illegal solicitation, scams, impersonation, deepfakes, revenge porn, creepy/sexualized content about young-looking characters, age roleplay, and sharing others' PII
2. WHEN a hard block occurs THEN the system SHALL report violations and apply permanent bans for sexualization of minors
3. WHEN checking text THEN the system SHALL use ModerationService.checkText({text, context, authorId}) and return `{decision:'allow'|'soft_block'|'hard_block'|'review', reasons:[], severity:N, redactions?}`
4. WHEN checking images THEN the system SHALL use ModerationService.checkImage({prompt, bytes?, context, authorId}) and return ModResult
5. WHEN soft blocking THEN the system SHALL show "That message breaks our community rules. Please rephrase and keep it kind."
6. WHEN hard blocking THEN the system SHALL show "This content isn't allowed here. See Community Guidelines."
7. WHEN sanitizing avatar prompts THEN the system SHALL allowlist abstract/crest/cosmic terms, block body/age/sexual terms and real names, and show "We only support abstract, crest-style avatars. Try different words." on rejection
8. WHEN checking avatar images THEN the system SHALL run checks pre-generation (prompt) and post-generation (image); unsafe results are discarded without preview
9. WHEN rate limiting THEN the system SHALL enforce DMs ≤20/5min, rooms ≤8/min, links ≤3/hr, mentions ≤5/10min, and half limits for new accounts
10. WHEN age gating THEN the system SHALL default to 18+ and restrict under-18 users to abstract crest avatars only with DMs disabled
11. WHEN retaining flagged content THEN the system SHALL keep items for 30 days maximum and purge automatically
12. WHEN reviewing flagged content THEN the system SHALL provide an admin endpoint or stub UI with audit log (actor, action, reason, timestamp)
13. WHEN storing moderation data THEN the system SHALL NOT include birth data in chat payloads

### Requirement 6: Server Validation and Leaderboards

**User Story:** As a competitive player, I want my game runs validated server-side and aggregated into fair team leaderboards, so that cheating is prevented and team scores reflect population size fairly.

#### Acceptance Criteria

1. WHEN submitting a run THEN the system SHALL accept POST /api/runs/submit with `{game_key, event_id, team_id, seed, inputs, client_hash, metrics, game_core_version, nonce, clientTimestamp}`
2. WHEN validating requests THEN the system SHALL validate against committed JSON Schemas (/schemas/*.json) and return 400 on mismatch
3. WHEN validating a run THEN the system SHALL re-simulate using the headless validator (packages/games-headless) and verify abs(serverScore - clientScore) <= min(0.01 * serverScore, 5)
4. WHEN validating game version THEN the system SHALL reject runs with mismatched game_core_version
5. WHEN detecting tampering THEN the system SHALL mark runs as `suspect:true` if drift exceeds tolerance or speed/DPS exceeds clamped maximums
6. WHEN enforcing security THEN the system SHALL rate-limit submissions and optionally verify HMAC(signature) over {seed, inputs, version, nonce}
7. WHEN receiving payloads THEN the system SHALL enforce size cap of ≤200 KB (compressed); inputs SHALL be delta/RLE-compressed
8. WHEN computing daily team scores THEN the system SHALL use formula `sum(top K) + median(all)` where `K = clamp(round(sqrt(N)), 5, 25)`
9. WHEN aggregating weekly seasons THEN the system SHALL sum daily scores with transparent formula displayed in UI
10. WHEN querying leaderboards THEN the system SHALL support GET /api/leaderboard/daily?event_id=...
11. WHEN querying events THEN the system SHALL support GET /api/events/active
12. WHEN the server runs THEN the system SHALL use in-memory storage without database dependencies
13. WHEN storing runs THEN the system SHALL retain data for 90 days and use hashed user IDs in logs

### Requirement 7: Music and Audio System

**User Story:** As a player, I want each star system to have its own default soundtrack with the ability to override preferences, so that I can customize my audio experience.

#### Acceptance Criteria

1. WHEN loading music THEN the system SHALL map star systems to default soundtrack packs via JSON configuration
2. WHEN playing in Flutter THEN the system SHALL use an audio mixer with layered stems and volume ducking
3. WHEN setting preferences in RN THEN the system SHALL provide UI for music pack selection and persist choices
4. WHEN changing music THEN the system SHALL send `{"type":"set-music","payload":{"pack":"<team_name>"}}` command to Flutter
5. WHEN querying music THEN the system SHALL support GET /api/music/packs and POST /api/music/prefs

### Requirement 8: Anti-Cheat and Validation

**User Story:** As a fair player, I want the system to validate game runs and detect anomalies, so that leaderboards remain legitimate and competitive integrity is maintained.

#### Acceptance Criteria

1. WHEN validating runs THEN the system SHALL verify score, duration, and metrics are within expected ranges for Super Dash
2. WHEN comparing results THEN the system SHALL check that score progression matches typical gameplay patterns
3. WHEN detecting anomalies THEN the system SHALL validate intervals, max distance, and score rate against statistical limits
4. WHEN flagging suspicious runs THEN the system SHALL mark runs as `suspect:true` and emit error events with `{"type":"error","payload":{"code":"ANOMALY_DETECTED","message":"..."}}`
5. WHEN determinism is not fully achievable THEN the system SHALL use statistical validation and heuristics to detect cheating
6. WHEN building full determinism THEN the system SHALL optionally add headless re-simulation as a future enhancement

### Requirement 9: Development Workflow and Tooling

**User Story:** As a developer, I want a streamlined development workflow with hot reload for both RN and Flutter, so that I can iterate quickly on UI and game features.

#### Acceptance Criteria

1. WHEN starting RN development THEN the system SHALL run Metro bundler with Fast Refresh enabled
2. WHEN starting Flutter development THEN the system SHALL support hot reload on the Super Dash game while embedded or attached to cached engine
3. WHEN starting the server THEN the system SHALL run Node server with auto-restart on file changes
4. WHEN running `scripts/dev.sh` THEN the system SHALL start all three services (Metro, Flutter, Node) and print URLs/commands
5. WHEN building for production THEN the system SHALL support Android and iOS builds with Super Dash Flutter module properly integrated
6. WHEN modifying Super Dash THEN the system SHALL maintain the existing game structure and only add bridge integration and team theming

### Requirement 10: Testing and Quality Assurance

**User Story:** As a quality-focused developer, I want comprehensive tests with coverage targets and quality gates, so that I can confidently deploy changes and maintain code quality.

#### Acceptance Criteria

1. WHEN testing the scorer THEN the system SHALL have unit tests and golden fixtures in tests/scorer.test.ts with ≥80% statement coverage
2. WHEN testing moderation THEN the system SHALL have tests for text categories, avatar sanitizer, decisions, and rate limits in tests/moderation.test.ts
3. WHEN testing the bridge THEN the system SHALL have contract tests with golden JSON fixtures in tests/bridge.contract.test.ts
4. WHEN testing determinism THEN the system SHALL have headless validator tests in packages/games-headless/tests/headless.test.ts with golden test vectors (seeds + inputs → identical scores) and ≥80% coverage
5. WHEN testing games-core THEN the system SHALL maintain ≥80% statement coverage on RNG, physics, and scoring logic
6. WHEN measuring app-wide coverage THEN the system SHALL maintain ≥60% statement coverage
7. WHEN running CI THEN the system SHALL execute lint, typecheck, RN unit tests, Flutter tests, Node validator tests, and cross-lang golden vectors
8. WHEN running CI THEN the system SHALL validate import graph rules (layering, no cycles, public API only)
9. WHEN running CI THEN the system SHALL verify games-headless re-sim matches Flutter fixtures exactly
10. WHEN running CI THEN the system SHALL validate payload schemas against committed JSON Schema files
11. WHEN game_core_version or schemas change THEN the system SHALL require bridge.contract tests to be updated via compatibility check job
12. WHEN all tests pass THEN the system SHALL verify RN app runs on Android/iOS, Flutter games launch and render, message contracts validate, and client/server scores match
13. WHEN golden vectors run THEN the system SHALL verify RNG/physics produce identical scores in Dart and Node

### Requirement 11: Code Quality, Modularity, and Documentation

**User Story:** As a developer, I want a highly modular codebase with small, focused files, enforced layering, and clear documentation, so that the system is maintainable, testable, and easy to understand.

#### Acceptance Criteria

1. WHEN writing code THEN the system SHALL maintain files at ≤150 LOC with a strong preference for 60-120 LOC
2. WHEN exceeding 150 LOC THEN the system SHALL require a comment `// @exception(max-lines) why:<reason>` and maintain a small allowlist (e.g., app root, router)
3. WHEN writing functions THEN the system SHALL keep them ≤40 LOC with single responsibility and cyclomatic complexity ≤10
4. WHEN organizing code THEN the system SHALL use named exports and clear module boundaries
5. WHEN structuring layers THEN the system SHALL enforce: Screens → Components → Theme/Tokens → Utils with no reverse dependencies
6. WHEN importing modules THEN the system SHALL import packages/components via their index.ts (RN) or lib/<package>.dart (Flutter) only; no deep imports into private files
7. WHEN analyzing dependencies THEN the system SHALL ensure the import graph is acyclic across folders/packages
8. WHEN structuring components THEN the system SHALL favor composition over inheritance and small, reusable units
9. WHEN creating modules THEN the system SHALL ensure each module has a single, well-defined purpose
10. WHEN reading README.md THEN the system SHALL provide dev instructions for RN, Flutter, and server setup
11. WHEN reading CANON_GUIDE.md THEN the system SHALL explain how to author real canon data to replace mock fixtures
12. WHEN reading SECURITY.md THEN the system SHALL document PII handling stance, moderation policies, age gating rules, and data retention (90 days for runs, 30 days for flagged content)
13. WHEN encountering errors THEN the system SHALL provide one-line, actionable error messages
14. WHEN refactoring THEN the system SHALL prioritize breaking large files into smaller, focused modules

### Requirement 12: Dependency Management and Constraints

**User Story:** As a project maintainer, I want a strict dependency budget with no telemetry, so that the app remains lightweight, auditable, and privacy-respecting.

#### Acceptance Criteria

1. WHEN managing web app dependencies THEN the system SHALL use: react, react-router-dom, zod (single source of truth for validation), @hookform/resolvers, react-hook-form, zustand (minimal usage for 2-3 global state atoms), pako (fallback only if CompressionStream unavailable, guarded import)
2. WHEN managing TS library dependencies THEN the system SHALL use: zod, yaml (server/CLI only), commander, vitest, tsup, zod-to-json-schema
3. WHEN managing dev dependencies THEN the system SHALL use: playwright (E2E tests for iframe handshake and result flow), msw (mock /api/* endpoints), dependency-cruiser (enforce no import cycles and no deep imports)
4. WHEN managing server dependencies THEN the system SHALL use only node:http (no Express)
5. WHEN managing Flutter dependencies THEN the system SHALL use only: flutter, flame, flutter_svg, audioplayers
6. WHEN managing shared game dependencies THEN the system SHALL use only: seedrandom or pure PCG for test vectors
7. WHEN using Zod THEN the system SHALL treat it as the single source of truth for forms and API validation
8. WHEN using zustand THEN the system SHALL keep usage minimal (2-3 atoms maximum for global state)
9. WHEN using pako THEN the system SHALL only import as fallback when CompressionStream is unavailable at runtime with guarded import
10. WHEN adding new dependencies THEN the system SHALL reject any telemetry, analytics, or tracking libraries
11. WHEN downloading assets THEN the system SHALL NOT remotely execute new code/assets that change gameplay without app review
12. WHEN using music packs THEN the system SHALL note that packs are placeholders/silent until licensed


### Requirement 13: Non-Functional Performance and Quality

**User Story:** As a user, I want the app to launch quickly, run smoothly, and remain accessible, so that I have a high-quality experience regardless of my device or abilities.

#### Acceptance Criteria

1. WHEN launching the app cold THEN the system SHALL start in ≤2.5s on Android mid-tier devices and ≤1.8s on iOS A-series devices
2. WHEN playing games THEN the system SHALL maintain ≥55 FPS target and never drop below 45 FPS for more than 1 second
3. WHEN running gameplay THEN the system SHALL use ≤350 MB peak memory on mid-tier Android devices
4. WHEN building the app THEN the system SHALL ensure Flutter module adds ≤25 MB to the RN APK/IPA (compressed)
5. WHEN navigating with assistive technology THEN the system SHALL support full TalkBack/VoiceOver traversal of menus and HUD with visible focus rings
6. WHEN displaying interactive elements THEN the system SHALL ensure minimum 44×44 touch targets
7. WHEN presenting non-verbal cues THEN the system SHALL provide captions or alternative indicators
8. WHEN localizing content THEN the system SHALL externalize all strings with en-US as default and infrastructure ready for additional locales

### Requirement 14: Compliance and Scope Boundaries

**User Story:** As a product owner, I want clear boundaries on what is in and out of scope, so that the team stays focused on MVP and complies with platform policies.

#### Acceptance Criteria

1. WHEN distributing the app THEN the system SHALL NOT remotely execute new code or download executable game logic that changes gameplay without app review
2. WHEN using music packs THEN the system SHALL document that packs are placeholders/silent until properly licensed
3. WHEN defining scope THEN the system SHALL explicitly exclude: authentication, payments, push notifications, real-time multiplayer, analytics/telemetry (for now)
4. WHEN planning features THEN the system SHALL prevent scope creep by referring to this out-of-scope list
5. WHEN submitting to app stores THEN the system SHALL comply with Apple and Google guidelines regarding remote code execution and content policies
