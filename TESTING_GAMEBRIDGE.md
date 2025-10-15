# Testing GameBridge Integration

## How to Check for Ready Events

### 1. Where to Look for Logs

**Metro Bundler Terminal** - This is where React Native console.log appears:
- Look for logs prefixed with `[SuperDashScreen]` or `[GameBridge]`
- These will show in the terminal where you ran `npm start`

### 2. What You Should See

When you navigate to the SuperDash screen (runner game), you should see logs like:

```
[SuperDashScreen] Checking GameBridge availability...
[SuperDashScreen] GameBridge is available, attempting to open...
[GameBridge] Sending command: ... (if commands are sent)
[SuperDashScreen] ✅ READY EVENT RECEIVED: { type: 'ready', game_core_version: '1.0.0' }
[SuperDashScreen] ✅ Game opened successfully: { type: 'ready', game_core_version: '1.0.0' }
```

### 3. Expected Behavior

**If Native Bridge NOT Implemented Yet (Current State):**
- Status: "Error"
- Message: "Game module not available. Flutter integration not enabled."
- This is EXPECTED because tasks 6.2 (iOS) and 6.3 (Android) haven't been implemented yet

**If Native Bridge Implemented:**
- Status: "Opening Flutter game..."
- Then either:
  - ✅ Status: "Game Ready!" (if Flutter sends ready event)
  - ❌ Status: "Error" with timeout message (if Flutter doesn't respond in 5 seconds)

### 4. Should You See the Game?

**No, not yet!** Here's why:

The current implementation (task 6.4) only wires up the **JavaScript side** of the bridge. You won't see the actual Flutter game until:

1. ✅ **Task 6.4** (DONE): React Native GameBridge wrapper
2. ⏳ **Task 6.2**: iOS native bridge implementation (GameBridgeModule.swift)
3. ⏳ **Task 6.3**: Android native bridge implementation (GameBridgeModule.kt)
4. ⏳ **Task 8.4**: SuperDashScreen implementation that actually displays the Flutter view

### 5. Testing Steps

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **Run the app:**
   ```bash
   npm run ios
   # or
   npm run android
   ```

3. **Navigate to the game:**
   - Go through the app flow to reach the SuperDash screen
   - Or use deep linking if configured

4. **Watch the Metro logs:**
   - Look for `[SuperDashScreen]` and `[GameBridge]` prefixed logs
   - You should see the availability check and error message

### 6. Current Expected Output (UPDATED - Flutter Re-Enabled)

**Flutter integration has been re-enabled!** See `FLUTTER_RE_ENABLED.md` for details.

After rebuilding (see step 7 below), you should see:

**In the App:**
- Status: "Opening Flutter game..." (then either "Game Ready!" or timeout error)

**In Metro Logs:**
```
[SuperDashScreen] Checking GameBridge availability...
[SuperDashScreen] GameBridge is available, attempting to open...
[SuperDashScreen] ✅ READY EVENT RECEIVED: { type: 'ready', game_core_version: '1.0.0' }
```

**If you see "Game module not available":**
- You need to rebuild the app (see step 7 below)
- The native modules are enabled but the app needs to be recompiled

### 7. What Happens After Native Bridge Implementation

Once tasks 6.2 and 6.3 are complete:

1. `GameBridge.isAvailable()` will return `true`
2. `GameBridge.open()` will call the native module
3. The native module will:
   - Create a Flutter view
   - Initialize the Flutter engine
   - Send a ready event back to React Native
4. You'll see the ready event in the logs
5. The Flutter game view will be displayed (after task 8.4)

### 8. Debugging Tips

**Check if GameBridge is available:**
```typescript
console.log('GameBridge available:', GameBridge.isAvailable());
```

**Listen to all events:**
```typescript
GameBridge.onAny((event) => {
  console.log('GameBridge event:', event);
});
```

**Check for errors:**
```typescript
GameBridge.on('error', (event) => {
  console.error('GameBridge error:', event);
});
```

### 9. Next Steps (UPDATED)

Flutter integration has been re-enabled! To see ready events:

1. ✅ Tasks 6.2 and 6.3 are complete (native bridges implemented)
2. ✅ Flutter integration re-enabled (see `FLUTTER_RE_ENABLED.md`)
3. **Build Flutter module:**
   ```bash
   cd runner_game
   flutter pub get
   flutter build aar  # For Android
   flutter build ios-framework  # For iOS
   cd ..
   ```
4. **Clean and rebuild native apps:**
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   npm run android
   
   # iOS
   cd ios && bundle exec pod install && cd ..
   npm run ios
   ```
5. Navigate to SuperDash screen and check Metro logs for ready events

### 10. Quick Test Command

To quickly test the current state:

```bash
# Start Metro
npm start

# In another terminal, run the app
npm run ios  # or npm run android

# Navigate to the game screen and watch Metro logs
```

## Summary

- ✅ Task 6.4 is complete - React Native side is ready
- ❌ You won't see the game yet - native bridges not implemented
- ✅ You should see "Game module not available" error - this is correct
- 📝 Ready events will appear after tasks 6.2 and 6.3 are done
- 🎮 The actual game view will appear after task 8.4 is done
