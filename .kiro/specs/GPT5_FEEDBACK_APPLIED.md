# GPT-5 Feedback Applied to tasks.md

## Summary

Applied surgical fixes to `.kiro/specs/tasks.md` based on GPT-5's feedback. The plan was already solid—these changes make it airtight.

## Changes Made

### 1. Fixed Duplicate Section 9 Numbering ✅

**Problem**: Section 9 had duplicate numbering with legacy Super Dash tasks (9.1-9.11) appearing after the new runner game tasks (9.1-9.7).

**Solution**: Removed all legacy Super Dash tasks. Clean canonical outline now:
- 9.1 Backup & pin Flutter stable (FVM)
- 9.2 Create runner_game module (+ Flame)
- 9.3 Implement simple runner (tap+jump, obstacles, collisions)
- 9.4 Bridge inside Flutter (MethodChannel/EventChannel, schema)
- 9.5 RN host integration (Android/iOS paths)
- 9.6 Build & integration tests (Android/iOS, determinism)
- 9.7 Docs (integration guide, toggle reference)

### 2. Added Integration Strategy Gate ✅

**Added**: Section 9.5.0 - Choose integration strategy (GATE)

Two options documented:
- **Option A**: Standard add-to-app include (requires AGP/Gradle alignment)
- **Option B**: Prebuilt AAR consumption (decouples host's Gradle/AGP from Flutter's)

This prevents future confusion about which approach to use and avoids version conflicts.

### 3. Added Toolchain Pinning Documentation ✅

**Added**: Section 9.1.3 - Document toolchain matrix

Creates `docs/ANDROID_TOOLCHAIN_MATRIX.md` noting:
- `runner_game/.android`: Gradle 8.x + AGP 8.x + JDK 17 (from Flutter template)
- RN host: Gradle 9.x stays untouched (decoupled until integration strategy chosen)
- Don't bump Flutter module to Gradle 9 yet

### 4. Made Toggle Reference Real ✅

**Updated**: Section 9.7 now explicitly requires:
- Ensure `docs/!!!FLUTTER_TOGGLE_REFERENCE.md` has exact 5 uncomment steps (3 Android, 2 iOS)
- Include disable steps as well

This file already exists but now it's explicitly called out in the task list.

### 5. Updated Rollout Checklist Wording ✅

**Changed**: 
- "Super Dash Flutter module" → "Runner Game (Flutter 3.x stable) module"
- Added: "Integration path chosen (AAR vs include) and documented"

### 6. Added iOS Minutiae ✅

**Updated**: Section 8.4 (SuperDash screen) now includes:
- iOS minimum target (13 or 14)
- Orientation lock notes (Info.plist)
- Engine warm-up call in AppDelegate (to meet ≤1.8s cold launch target)

### 7. Added Performance & Determinism Hooks ✅

**Added**: Section 9.3.4 - Add debug instrumentation
- Expose frame counter + delta in HUD for debugging
- Log seed, game_core_version, and clientHash to console in debug mode
- Add "replay with seed" dev button for testing determinism

**Updated**: Section 9.6 tests now verify:
- Frame counter and delta display in HUD
- Console logs for seed, game_core_version, and clientHash
- "Replay with seed" button functionality

## What Was Removed

- All legacy Super Dash conversion tasks (the duplicate 9.1-9.11 block)
- References to copying existing Super Dash from specific file paths
- Old conversion instructions that no longer apply

## Green Lights Maintained ✅

- Clear DoD and CI gates (determinism + golden fixtures)
- Method/EventChannel split with contract tests planned
- Security note ("API key only on server")
- File-size guardrails and import-graph rules

## Immediate Next Steps

1. ✅ Fixed §9 numbering + added Integration Strategy Gate checkbox
2. ✅ Added toolchain matrix documentation task
3. ✅ Made toggle doc requirement explicit
4. ✅ Updated rollout checklist wording
5. ✅ Added iOS specifics to section 8.4
6. ✅ Added performance/determinism hooks to sections 9.3 and 9.6

## Additional Quick Fixes Applied

### 8. Fixed Task 0.2 Legacy References ✅

**Problem**: Task 0.2 still referenced Super Dash paths.

**Solution**: Marked as LEGACY and deferred until §9.5. Now explicitly points to `runner_game/` paths and notes it depends on integration strategy choice.

### 9. Renamed SuperDash Screen ✅

**Changed**: Section 8.4 "Create SuperDash screen" → "Create RunnerGame screen"

Consistent naming throughout the document to avoid confusion in tests and docs.

### 10. Added Channel Constants (Single Source of Truth) ✅

**Added**: Section 9.4.1 now defines channel constants:
- `S3_CMD_CHANNEL = "s3/game/cmd"`
- `S3_EVT_CHANNEL = "s3/game/events"`

**Updated**: Sections 6.2, 6.3, 6.4, and 9.4.2 now reference these constants to prevent fat-fingering strings across RN/Android/iOS/Flutter.

### 11. Added CI Smoke Test for Flutter Module ✅

**Added**: Section 13.4 now includes Flutter module smoke test:
- Run `fvm flutter doctor -v` to verify toolchain
- Run `fvm flutter build aar` to catch toolchain drift early
- Fail if Flutter module doesn't build independently (non-hosted)

### 12. Added Size Optimization Details ✅

**Updated**: Sections 13.1 and 13.2 now include specific size optimization strategies:

**Android**:
- Enable `minifyEnabled true` in release build
- Enable resource shrinking (`shrinkResources true`)
- Keep asset packs minimal

**iOS**:
- Note that iOS size mostly comes from frameworks
- Keep asset packs minimal
- Use asset catalogs for efficient bundling

## Result

The tasks.md file now has a clean, surgical plan for replacing Super Dash with a modern Flutter runner game. No ambiguity, no duplicate tasks, all the guardrails in place to avoid toolchain conflicts, and single source of truth for channel constants to prevent typos.
