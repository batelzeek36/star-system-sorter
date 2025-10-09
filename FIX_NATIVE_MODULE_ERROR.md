# Fix: Native Module Error (RNGestureHandlerModule)

## Problem

After installing dev dependencies, the app shows:
```
Invariant Violation: TurboModuleRegistry.getEnforcing(...): 
'RNGestureHandlerModule' could not be found.
```

## Root Cause

When you install new dependencies with native modules (like `react-native-gesture-handler`), the native iOS and Android projects need to be rebuilt to link these modules.

## Solution

### Quick Fix (Recommended)

**Stop the Metro bundler first** (press Ctrl+C in the terminal where it's running), then:

#### For iOS:
```bash
npm run rebuild:ios
```

Then in a new terminal:
```bash
npm start -- --reset-cache
```

And in another terminal:
```bash
npm run ios
```

#### For Android:
```bash
npm run rebuild:android
```

Then in a new terminal:
```bash
npm start -- --reset-cache
```

And in another terminal:
```bash
npm run android
```

### Manual Steps (If scripts don't work)

#### iOS Manual Fix:

1. **Stop Metro bundler** (Ctrl+C)

2. **Install CocoaPods:**
   ```bash
   cd ios
   bundle exec pod install
   cd ..
   ```

3. **Clean build (optional but recommended):**
   ```bash
   cd ios
   xcodebuild clean -workspace S3App.xcworkspace -scheme S3App
   cd ..
   ```

4. **Start Metro with cache reset:**
   ```bash
   npm start -- --reset-cache
   ```

5. **In a NEW terminal, rebuild and run:**
   ```bash
   npm run ios
   ```

#### Android Manual Fix:

1. **Stop Metro bundler** (Ctrl+C)

2. **Clean build:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

3. **Start Metro with cache reset:**
   ```bash
   npm start -- --reset-cache
   ```

4. **In a NEW terminal, rebuild and run:**
   ```bash
   npm run android
   ```

## Why This Happened

The dev dependencies we installed include:
- `react-native-gesture-handler` (required by React Navigation)
- `react-native-screens` (required by React Navigation)
- `react-native-safe-area-context` (required by React Navigation)
- `react-native-svg` (for SVG support)

All of these have native code that needs to be compiled into the iOS/Android apps. Simply installing them via npm isn't enough - the native projects must be rebuilt.

## Prevention

Going forward, whenever you install a package with native modules:

1. **Always run `pod install` for iOS:**
   ```bash
   cd ios && bundle exec pod install && cd ..
   ```

2. **Always rebuild the app** (not just restart Metro)

3. **Or use the postinstall script** (already configured):
   ```bash
   npm install
   # This automatically runs pod install
   ```

## Verification

After rebuilding, you should see:
- ✅ App launches without errors
- ✅ No "TurboModuleRegistry" errors
- ✅ No "could not be found" errors

## Still Having Issues?

See `docs/TROUBLESHOOTING_NATIVE_MODULES.md` for more detailed troubleshooting steps.

## Quick Reference

```bash
# Rebuild iOS
npm run rebuild:ios

# Rebuild Android  
npm run rebuild:android

# Rebuild both
npm run rebuild:all

# After rebuilding, always:
npm start -- --reset-cache
# Then in new terminal:
npm run ios  # or npm run android
```
