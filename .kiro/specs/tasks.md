# Implementation Plan — Sorter-Only (No Flutter/Game)

This replaces the previous plan. Scope is **classification only**: collect birth data → call BodyGraph proxy → score → show results/why. All Flutter/game/bridge/leaderboard/music/features are removed.

---

## Definition of Done (Sorter-Only)

- ✅ Enter birth data → **/internal/hd** proxy fetch → **scorer** produces primary/hybrid + contributors
- ✅ Result & Why screens render (radial chart, crests, allies, disclaimers)
- ✅ Client + server caching works; offline/timeout UX is sane
- ✅ Jest unit tests pass; Detox covers Onboarding → Input → Result → Why
- ✅ CI runs lint, typecheck, tests, import-graph, file-size gates; Android build succeeds (iOS optional on macOS)
- ✅ No secrets in mobile bundle; BODYGRAPH_API_KEY only on server

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

  - `git rm --ignore-unmatch docs/PROJECT_STATUS.md` (if it’s game/Flutter-centric; keep if still useful and rewrite)
  - Ensure `README.md` will be rewritten later (§7.1).
  - Ensure `SECURITY.md` and `CANON_GUIDE.md` will be created/updated (§7.2–§7.3).

- [x] **0.8 Dependency & cache cleanup**

  - Remove dead deps in `package.json`:
    - `flame`, any Flutter tool runners, any game/bridge specific libs.
  - Keep RN deps, testing, MSW, zod, dependency-cruiser, pako, react-native-svg, etc.
  - Reinstall:
    - `rm -rf node_modules && pnpm i` (or `yarn` / `npm i` per your setup)
  - Native rebuild:
    - `cd android && ./gradlew clean && cd ..`
    - `cd ios && bundle exec pod deintegrate && bundle exec pod install && cd ..`

- [x] **0.9 Sanity builds**
  - `npm run android` (expect the app to launch without any game/bridge references)
  - `npm run ios` (optional on macOS)

---

## 1. Core App (Keep/Finish)

- [x] **1.1 RN foundation & deps** (already done)
- [x] **1.2 BodyGraph client & cache** (already done)
- [x] **1.3 Scorer library & tests** (already done)
- [x] **1.4 Moderation (trimmed)** _(optional but recommended for store readiness)_
  - [x] Create `src/moderation/types.ts`, `blocklists.ts`, `sanitizer.ts`, `service.ts`, `index.ts`
  - [x] Unit tests for blocklists, sanitization, decisions, rate-limits

---

## 2. UI Components & Screens

- [x] **2.1 RadialChart** (done)
- [x] **2.2 ScoreDisplay** (done)
- [ ] **2.3 StarSystemCrest**
  - [ ] Implement SVG crests with `react-native-svg`
  - [ ] Fallback for missing crests
- [ ] **2.4 Onboarding**
  - [ ] Intro + minimal steps; CTA into Input
- [x] **2.5 Input** (done)
- [x] **2.6 Result** (done)
- [x] **2.7 Why** (done)
- [ ] **2.8 Profile & Settings (essentials)**
  - [ ] Simple profile view; minimal app preferences (theme, consent, telemetry toggle if any)
- [ ] **2.9 Accessibility pass**
  - [ ] `accessibilityLabel`/`Hint` on interactive elements; 44px min targets
  - [ ] Test with TalkBack/VoiceOver; verify screen reader flow

---

## 3. Server (Minimal)

- [x] **3.1 BodyGraph proxy `/internal/hd`** (done)
- [ ] **3.2 HTTP server bootstrap (minimal)**
  - [ ] `apps/server/src/http.ts` (CORS permissive in dev; router + error handling)
  - [ ] `apps/server/src/index.ts` wiring for `/internal/hd` only
- [ ] **3.3 Tests**
  - [ ] Happy path, 400, 401 (missing/invalid key), 429, 5xx, caching

_(Delete/avoid all runs/submit, validator, events, leaderboard, music.)_

---

## 4. Validation & Schemas

- [ ] **4.1 Zod schemas (source of truth)**
  - [ ] Define schemas for client inputs and server responses used by the sorter flow
  - [ ] Server returns 400 with field errors on validation failure
- [ ] **4.2 Generate JSON Schemas (optional)**
  - [ ] Use `zod-to-json-schema` → `schemas/*.json` for docs/clients

---

## 5. Build & CI (RN-Only)

- [ ] **5.1 Android release config**
  - [ ] Signing config; enable `minifyEnabled true` & `shrinkResources true`
  - [ ] Keep asset packs minimal; compress/remove unused images
- [ ] **5.2 iOS release config (optional)**
  - [ ] Signing/profiles; verify sizes (no Flutter frameworks now)
- [ ] **5.3 CI gates**
  - [ ] Lint + typecheck + Jest
  - [ ] Detox (Android; iOS if runners available)
  - [ ] dependency-cruiser (no cycles, no deep imports)
  - [ ] File-size gate (≤150 LOC/file; allow `// @exception(max-lines) why:<reason>`)

---

## 6. Testing

- [ ] **6.1 MSW v2 setup** (unit/integration only; Detox hits real dev API)
  - [ ] `src/mocks/handlers.ts` for `/internal/hd`
- [ ] **6.2 Detox E2E (trimmed)**
  - [ ] Flows: Onboarding → Input → Result → Why
  - [ ] Offline/timeout & caching behavior
- [ ] **6.3 Scorer goldens (Node-only)**
  - [ ] Fixtures: HD extracts → expected classification (no Dart cross-lang now)

---

## 7. Documentation

- [ ] **7.1 README.md (rewrite)**
  - [ ] Dev setup for RN app + minimal server
  - [ ] Commands for Android/iOS
  - [ ] Env vars; caching behavior; error codes
- [ ] **7.2 SECURITY.md**
  - [ ] PII stance; moderation policy summary; age gating; retention (e.g., 90d telemetry if any)
- [ ] **7.3 CANON_GUIDE.md**
  - [ ] How to author canon YAML; structure; examples; validation rules

---

## 8. Post-Cutover Cleanup (Automatable)

- [ ] **8.1 Remove dead imports/exports**
  - Run `ts-prune` (or similar) and remove unused exports.
  - Run `depcruise` to confirm no deep imports or cycles.
- [ ] **8.2 Repo hygiene**
  - `rg -n "Flutter|MethodChannel|EventChannel|AAR|game_core_version|RunnerGame|GameBridge"` should return **no matches**.
- [ ] **8.3 Final builds**
  - `npm run android` (debug)
  - `npm run build:android` (your release script)
  - `npm run ios` (optional)

---

## Notes & Conventions

- Keep files ≤300 LOC; split modules; annotate exceptions sparingly.
- Prefer local component state over global; keep `zustand` atoms minimal (`userSession`, `toastNotifications`).
- Zod is runtime truth; JSON Schemas are generated for docs.
- No secrets in mobile bundle; server holds keys.
