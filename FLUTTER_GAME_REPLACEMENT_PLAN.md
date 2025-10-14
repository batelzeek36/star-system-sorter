# Flutter Game Replacement Plan

**Replaces:** `.kiro/specs/hybrid-mobile-game-app/tasks.md` Section 9  
**See Also:** `.kiro/specs/hybrid-mobile-game-app/SECTION_9_REPLACED.md` for context

**Goal:** Replace complex Super Dash game with simple, modern Flutter runner game that works with latest stable Flutter and current toolchain.

**Estimated Time:** 1 hour

**Status:** Ready to execute

---

## Task List

- [ ] 1. Backup and remove old Super Dash module
  - [ ] 1.1 Create backup of super_dash directory
    - Move `super_dash/` to `super_dash.backup/` for reference
    - Document what we're keeping (bridge pattern, types)
  
  - [ ] 1.2 Update .gitignore for backup
    - Add `super_dash.backup/` to .gitignore
    - Keep backup local only

- [ ] 2. Set up Flutter with latest stable
  - [ ] 2.1 Install and configure Flutter stable
    - Run `fvm install stable`
    - Run `fvm use stable --force` in project root
    - Update `.flutter-version` to `stable`
    - Verify with `fvm flutter --version`
  
  - [ ] 2.2 Verify Flutter doctor
    - Run `fvm flutter doctor -v`
    - Ensure Android and iOS toolchains are ready
    - Note any warnings (can address later)

- [ ] 3. Create new Flutter module
  - [ ] 3.1 Generate fresh Flutter module
    - Run `fvm flutter create --template=module --org com.starsystemsorter runner_game`
    - Verify module structure created correctly
    - Check that `.android/` and `.ios/` directories exist
  
  - [ ] 3.2 Add Flame dependency
    - Add `flame: ^1.32.0` to `runner_game/pubspec.yaml`
    - Run `fvm flutter pub get` in runner_game
    - Verify no dependency conflicts

- [ ] 4. Implement simple runner game
  - [ ] 4.1 Create main game file
    - Replace `runner_game/lib/main.dart` with runner game code
    - Implement tap-to-jump mechanic
    - Add obstacle spawning
    - Add collision detection
    - Keep it under 150 lines
  
  - [ ] 4.2 Add team theming support
    - Add team color parameter to game
    - Map team names to colors (Manifestor=red, Generator=orange, etc.)
    - Apply color to player square
  
  - [ ] 4.3 Add deterministic scoring
    - Track distance traveled as score
    - Use fixed timestep (16.6667ms)
    - Implement seeded RNG for obstacle placement
    - Calculate final score on game over

- [ ] 5. Implement bridge integration
  - [ ] 5.1 Create bridge schema in Dart
    - Copy bridge pattern from old super_dash
    - Create `runner_game/lib/bridge/schema.dart`
    - Define GameCommand and GameEvent types
    - Keep it simple (START, PAUSE, RESUME, QUIT commands)
  
  - [ ] 5.2 Implement MethodChannel bridge
    - Create `runner_game/lib/bridge/method_channel_bridge.dart`
    - Set up MethodChannel `s3/game/cmd`
    - Set up EventChannel `s3/game/events`
    - Handle commands: start (with seed + team), pause, resume, quit
    - Send events: ready, state, result, error
  
  - [ ] 5.3 Wire bridge to main.dart
    - Initialize bridge in main()
    - Listen for START command with seed and team
    - Apply team theming on start
    - Send READY event when initialized
    - Send RESULT event on game over with score

- [ ] 6. Update React Native integration
  - [ ] 6.1 Update Android settings.gradle
    - Change path from `super_dash/.android/` to `runner_game/.android/`
    - Verify include_flutter.groovy path is correct
  
  - [ ] 6.2 Update iOS Podfile
    - Change flutter_application_path from `../super_dash` to `../runner_game`
    - Run `cd ios && pod install`
  
  - [ ] 6.3 Update local.properties paths
    - Check `runner_game/.android/local.properties` has correct Flutter SDK path
    - Check `runner_game/.ios/Flutter/Generated.xcconfig` exists

- [ ] 7. Test Android build
  - [ ] 7.1 Clean and build Android
    - Run `cd android && ./gradlew clean`
    - Run `./gradlew assembleDebug`
    - Verify build succeeds
    - Check for Flutter embedding errors
  
  - [ ] 7.2 Test on Android emulator
    - Run `npm run android`
    - Navigate to BridgeTestScreen
    - Verify Flutter engine initializes
    - Test bridge commands

- [ ] 8. Test iOS build
  - [ ] 8.1 Install pods and build iOS
    - Run `cd ios && pod install`
    - Run `cd .. && npm run ios`
    - Verify build succeeds
  
  - [ ] 8.2 Test on iOS simulator
    - Navigate to BridgeTestScreen
    - Verify Flutter engine initializes
    - Test bridge commands

- [ ] 9. Test end-to-end game flow
  - [ ] 9.1 Test game launch
    - Open game from React Native
    - Verify game loads with correct team color
    - Test tap-to-jump mechanic
    - Verify obstacles spawn
  
  - [ ] 9.2 Test game completion
    - Play until collision
    - Verify game over detected
    - Verify score calculated correctly
    - Verify result sent back to React Native
  
  - [ ] 9.3 Test determinism
    - Play game with same seed twice
    - Verify identical obstacle patterns
    - Verify identical scores (if same inputs)

- [ ] 10. Update documentation
  - [ ] 10.1 Update Flutter integration docs
    - Update `docs/FLUTTER_MODULE_INTEGRATION.md`
    - Document new module structure
    - Document runner game mechanics
  
  - [ ] 10.2 Create runner game README
    - Create `runner_game/README.md`
    - Document game mechanics
    - Document bridge integration
    - Document team theming
  
  - [ ] 10.3 Update project status
    - Update `PROJECT_STATUS.md`
    - Mark Flutter integration as complete
    - Document toolchain versions used

---

## Success Criteria

- ✅ Android builds without errors
- ✅ iOS builds without errors
- ✅ Game launches from React Native on both platforms
- ✅ Bridge communication works (commands and events)
- ✅ Team theming applies correctly
- ✅ Game is playable (tap to jump, obstacles spawn, collision works)
- ✅ Score is calculated and returned to React Native
- ✅ Deterministic behavior (same seed = same obstacles)

---

## Rollback Plan

If something goes wrong:
1. Restore from backup: `mv super_dash.backup super_dash`
2. Revert Flutter version: `fvm use 3.16.0`
3. Revert integration changes in Android/iOS configs

---

## Key Decisions

**Flutter Version:** Latest stable (~3.35.x)
- Reason: Modern, well-supported, works with current toolchain

**Toolchain:** AGP 8.12 + Gradle 8.13 (let Flutter template decide)
- Reason: Known-good combination, avoid Gradle 9 issues

**Game Engine:** Flame
- Reason: Simple, well-maintained, perfect for runner game

**Game Complexity:** ~100-450 lines
- Reason: MVP needs proof-of-concept, not AAA game

**Bridge Pattern:** Keep existing pattern
- Reason: Already designed and documented

---

## Notes

- Keep backup of old super_dash for reference
- Don't commit backup to git
- Focus on getting it working, optimize later
- Can always make game fancier after MVP
- Bridge pattern is proven, just need new game

---

**Created:** October 13, 2025  
**Estimated Duration:** 1 hour  
**Priority:** High (unblocks Android development)
