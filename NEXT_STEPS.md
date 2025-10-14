# Next Steps - Star System Sorter

**Current Status:** ✅ Both iOS and Android working with bridge implemented  
**Date:** October 13, 2025

## 🎯 Immediate Next Steps

### 1. Test the Bridge (15 minutes)

The bridge is implemented but needs testing to verify it works end-to-end.

```bash
# Run on iOS
npm run ios

# Or run on Android
npm run android

# Navigate to BridgeTestScreen in the app
# Test the following:
# - Check Flutter engine status
# - Test open() method
# - Test sendCommand() method
# - Verify events are received
```

**Expected Results:**
- ✅ Engine status shows "ready"
- ✅ open() launches Flutter view
- ✅ sendCommand() sends data to Flutter
- ✅ Events received from Flutter

**If issues occur:**
- Check logs in Metro bundler
- Check native logs (Xcode Console or Android Logcat)
- Verify Flutter integration is enabled (see `docs/!!!FLUTTER_TOGGLE_REFERENCE.md`)

### 2. Implement Game Screens (2-3 hours)

Now that the bridge works, implement the screens that use it:

#### A. GameHub Screen (Task 8.1)
Entry point to games - shows available events.

```typescript
// src/screens/GameHubScreen.tsx
// - Display available events
// - Navigate to TeamSelect
// - Use adapted Card components
```

#### B. SuperDash Screen (Task 8.4)
The main game screen that launches Flutter.

```typescript
// src/screens/SuperDashScreen.tsx
// - Call GameBridge.open()
// - Handle game lifecycle
// - Listen for result event
// - Navigate to MatchResult on completion
```

#### C. MatchResult Screen (Task 8.5)
Shows game results after completion.

```typescript
// src/screens/MatchResultScreen.tsx
// - Display score and metrics
// - Show validation status
// - Add "View Leaderboard" button
```

### 3. Complete Flutter Determinism (3-4 hours)

Make the game deterministic for fair competition:

#### A. PCG32 RNG (Task 9.4)
```dart
// super_dash/lib/core/seeded_rng.dart
// - Implement PCG32 algorithm
// - Accept 64-bit seed as hex string
// - Replace all Random() usage
```

#### B. Fixed Timestep (Task 9.5)
```dart
// super_dash/lib/core/fixed_timestep.dart
// - 16.6667ms timestep
// - Frame index as time source
// - No DateTime.now() in game logic
```

#### C. Input Recorder (Task 9.7)
```dart
// super_dash/lib/core/input_recorder.dart
// - Record frame-indexed inputs
// - Compute clientHash
// - Send with result
```

### 4. Implement Moderation System (2-3 hours)

Essential for user-generated content safety:

```typescript
// Tasks 4.1-4.5
// - Create blocklists
// - Implement sanitization
// - Build ModerationService
// - Write tests
```

## 📋 Suggested Order

**Week 1: Core Game Flow**
1. ✅ Test bridge (Day 1)
2. Implement GameHub screen (Day 1-2)
3. Implement SuperDash screen (Day 2-3)
4. Implement MatchResult screen (Day 3)
5. Test full game flow (Day 4)

**Week 2: Determinism & Server**
1. PCG32 RNG (Day 1)
2. Fixed timestep (Day 1-2)
3. Input recorder (Day 2-3)
4. Server API basics (Day 3-4)
5. Headless validator (Day 4-5)

**Week 3: Moderation & Polish**
1. Moderation system (Day 1-2)
2. Remaining UI screens (Day 2-3)
3. E2E tests (Day 3-4)
4. Bug fixes and polish (Day 4-5)

## 🔍 Testing Strategy

### After Each Implementation
```bash
# Type check
npm run typecheck

# Run tests
npm test

# Check dependency graph
npm run lint:graph

# Test on both platforms
npm run ios
npm run android
```

### Before Moving to Next Task
- ✅ Code compiles without errors
- ✅ Tests pass
- ✅ Works on both iOS and Android
- ✅ No console errors or warnings
- ✅ Follows file size limits (≤300 LOC soft, ≤500 LOC hard)

## 🎓 Key Concepts to Remember

### Bridge Communication
```typescript
// React Native → Flutter
await GameBridge.sendCommand(JSON.stringify({
  type: 'START_GAME',
  payload: { seed: '0x123...', team: 'Projector' }
}));

// Flutter → React Native
DeviceEventEmitter.addListener('GameBridge', (event) => {
  const data = JSON.parse(event);
  if (data.type === 'RESULT') {
    // Handle game result
  }
});
```

### Determinism Requirements
- **Seeded RNG**: Same seed → same random sequence
- **Fixed Timestep**: Frame-based time, not wall clock
- **Input Recording**: Frame-indexed inputs for replay
- **No DateTime.now()**: Use frame index instead

### Architecture Principles
- **React Native**: UI, navigation, user data
- **Flutter**: Game logic only
- **Bridge**: Minimal data passing
- **Server**: Validation and leaderboards

## 📚 Reference Documentation

### Bridge
- `src/bridge/GAMEBRIDGE_USAGE.md` - How to use GameBridge
- `super_dash/lib/bridge/README.md` - Flutter bridge implementation
- `docs/BRIDGE_HANDSHAKE_TESTING.md` - Testing guide

### Flutter
- `docs/FLUTTER_MODULE_INTEGRATION.md` - Integration guide
- `super_dash/FLUTTER_MODULE_CONVERSION.md` - Conversion notes

### General
- `.kiro/steering/tech.md` - Tech stack
- `.kiro/steering/structure.md` - Project structure
- `.kiro/steering/product.md` - Product overview

## 🚨 Common Pitfalls to Avoid

1. **Don't add Firebase to Flutter module**
   - RN app handles Firebase
   - Flutter receives data via bridge

2. **Don't use DateTime.now() in game logic**
   - Use frame index instead
   - Required for determinism

3. **Don't exceed file size limits**
   - Target: 100-200 LOC
   - Soft limit: 300 LOC
   - Hard limit: 500 LOC (must split)

4. **Don't skip tests**
   - Write tests as you go
   - Easier than adding later

5. **Don't forget both platforms**
   - Test on iOS AND Android
   - Bridge behavior may differ

## 💡 Tips for Success

1. **Start small**: Get one screen working before moving to next
2. **Test frequently**: Run on device after each change
3. **Read the docs**: Check existing documentation first
4. **Follow patterns**: Look at existing code for examples
5. **Ask for help**: Check task requirements if stuck

## 🎉 You're Ready!

The foundation is solid:
- ✅ Both platforms working
- ✅ Bridge implemented
- ✅ Core infrastructure ready

Now it's time to build the game flow and make it deterministic!

---

**Start with:** Testing the bridge (15 minutes)  
**Then:** Implement GameHub screen (Task 8.1)  
**Goal:** Full game flow working by end of week
