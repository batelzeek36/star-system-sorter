# Section 9: Super Dash Implementation - REPLACED

**Date:** October 13, 2025

## ⚠️ IMPORTANT NOTICE

**Section 9 of tasks.md ("Implement Super Dash Flutter module adapter") has been REPLACED.**

## New Implementation Plan

**See:** `FLUTTER_GAME_REPLACEMENT_PLAN.md` (in project root)

## Why the Change?

### Technical Issues
- Super Dash uses Flutter 3.16.0 (Nov 2023)
- React Native project uses Gradle 9.0.0 (July 2025)
- These versions are incompatible
- Debugging would take 4+ hours with uncertain outcome

### Better Approach
- Use latest Flutter stable (3.35.x)
- Create simple runner game (~150 LOC)
- Proven toolchain (AGP 8.12 + Gradle 8.13)
- Estimated time: 1 hour vs. 4+ hours

## What We Keep

✅ **Bridge Pattern** (Tasks 6.1-6.3 already complete)
- MethodChannel/EventChannel communication
- Bridge types and schemas
- Native modules (iOS & Android)

✅ **Core Concepts**
- Team theming
- Deterministic scoring
- Seeded RNG approach
- Game-to-RN communication

## What We Simplify

🎯 **Game Complexity**
- Old: Complex platformer with assets, animations, physics
- New: Simple runner game (tap to jump, avoid obstacles)

🎯 **Dependencies**
- Old: Firebase, audioplayers, file_selector, many plugins
- New: Just Flame engine

🎯 **Toolchain**
- Old: Flutter 3.16.0 + compatibility hell
- New: Flutter 3.35.x stable + modern toolchain

## Original Tasks (Reference Only)

The original Section 9 tasks (9.0-9.11) are kept in tasks.md for reference but should **NOT be executed**.

### Original Task List:
- 9.0: Convert Super Dash to Flutter module ✅ (done, but being replaced)
- 9.1: Create MethodChannel/EventChannel bridge ✅ (done, keeping this)
- 9.2: Create bridge schemas in Dart ✅ (done, keeping this)
- 9.3: Audit randomness/time ❌ (not needed for simple game)
- 9.4: Implement PCG32 RNG ⚠️ (will do simpler version)
- 9.5: Implement fixed timestep ⚠️ (will do simpler version)
- 9.6: Implement fixed-point arithmetic ❌ (overkill for MVP)
- 9.7: Implement input recorder ❌ (not needed for MVP)
- 9.8: Implement team theming ✅ (keeping, but simpler)
- 9.9: Create game adapter with DI ❌ (not needed)
- 9.10: Implement ghost overlay ❌ (not needed for MVP)
- 9.11: Wire adapter to main.dart ⚠️ (will do simpler version)

## Action Items

1. **Execute:** `FLUTTER_GAME_REPLACEMENT_PLAN.md` tasks
2. **Ignore:** Section 9 tasks in tasks.md
3. **Reference:** Keep old tasks.md for historical context

## Benefits of New Approach

### Time Savings
- Old approach: 4+ hours debugging + unknown implementation time
- New approach: 1 hour total

### Reduced Complexity
- Fewer dependencies to manage
- Simpler codebase to maintain
- Easier to debug

### Better Toolchain
- Latest Flutter stable
- Modern Gradle/AGP versions
- No compatibility issues

### MVP Focus
- Proves bridge works
- Demonstrates team theming
- Shows deterministic scoring
- Can iterate later

## Future Considerations

If you want a more complex game later:
1. The bridge pattern is proven and working
2. You can swap in any Flutter game
3. Or enhance the simple runner
4. Or bring back Super Dash when toolchain catches up

## Questions?

See `FLUTTER_GAME_REPLACEMENT_PLAN.md` for detailed implementation steps.

---

**Status:** Active replacement plan  
**Original Section:** tasks.md Section 9  
**New Plan:** FLUTTER_GAME_REPLACEMENT_PLAN.md
