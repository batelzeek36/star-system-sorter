# Debugging Guide for Star System Sorter

## App Architecture Configuration

### ✅ New Architecture (Fabric + TurboModules)
- **Status**: ENABLED
- **Config**: `android/gradle.properties` → `newArchEnabled=true`
- **iOS**: Automatically enabled via Podfile

### ✅ Hermes JavaScript Engine
- **Status**: ENABLED
- **Android**: `android/gradle.properties` → `hermesEnabled=true`
- **iOS**: Automatically included via CocoaPods (hermes-engine framework)

### React Native Version
- **Version**: 0.82.0
- **React**: 19.1.1
- **Node**: >=20

## Debugging Methods

### 1. React Native DevTools (Recommended - Official Tool)

React Native DevTools is the official debugging tool that fully supports New Architecture and Hermes.

**Setup:**
```bash
# Start Metro
npm start

# Press 'j' in the Metro terminal to open DevTools
# Or open browser to: http://localhost:8081/debugger-ui/
```

**Features:**
- ✅ Console logs
- ✅ Component inspector
- ✅ Hermes debugger with breakpoints
- ✅ Performance profiler
- ✅ Built-in (no installation needed)
- ✅ Fast and lightweight

**Usage:**
1. Start Metro: `npm start`
2. Press `j` in Metro terminal (opens DevTools in browser)
3. Run app: `npm run ios` or `npm run android`
4. DevTools auto-connects
5. Use Console tab for logs, Sources tab for breakpoints

**View Console Logs:**
- Open DevTools (press `j` in Metro)
- Click "Console" tab
- Submit form in app
- See logs appear in real-time

**See detailed guide:** [REACT_NATIVE_DEVTOOLS.md](./REACT_NATIVE_DEVTOOLS.md)

### 2. Flipper (Alternative - Advanced Features)

Flipper provides additional features like network inspection and layout debugging.

**Setup:**
```bash
# Download from: https://fbflipper.com/
```

**Features:**
- ✅ Console logs
- ✅ Network inspector (advanced)
- ✅ Layout inspector (advanced)
- ✅ Hermes debugger
- ✅ Performance monitoring

**Usage:**
1. Open Flipper before starting app
2. Start app: `npm run ios` or `npm run android`
3. Flipper auto-connects
4. Use "React DevTools" plugin for console logs

### 3. Chrome DevTools (Not Recommended with Hermes)

⚠️ **Note**: Chrome DevTools has limited functionality with Hermes. Use Flipper instead.

**If you still want to try:**
1. In the app, open dev menu:
   - iOS Simulator: `Cmd + D`
   - Android Emulator: `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)
2. Select "Debug" or "Open Debugger"
3. Chrome will open with limited debugging capabilities

**Limitations with Hermes:**
- ❌ No source maps in some cases
- ❌ Some ES6+ features may not work in debugger
- ❌ Performance is slower
- ✅ Console logs still work

### 3. React Native Debugger (Alternative)

**Install:**
```bash
brew install --cask react-native-debugger
```

**Usage:**
1. Open React Native Debugger before starting the app
2. Start app: `npm run ios` or `npm run android`
3. Open dev menu and select "Debug"
4. Debugger should auto-connect

**Features:**
- ✅ Redux DevTools
- ✅ React DevTools
- ✅ Network inspector
- ⚠️ Limited Hermes support

### 4. Console Logs in Terminal

**Metro Bundler Logs:**
```bash
# Terminal where you ran `npm start`
# Shows console.log, console.warn, console.error
```

**Native Logs:**
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
# or
adb logcat
```

### 5. In-App Console (Development Only)

For quick debugging without external tools:

```typescript
// Add to any screen
import { Alert } from 'react-native';

// Show alert with data
Alert.alert('Debug', JSON.stringify(data, null, 2));

// Or use console.warn (shows yellow box in app)
console.warn('Debug data:', data);
```

## Testing the hdkit Adapter

### Method 1: React Native DevTools (Recommended)

1. **Start Metro:**
   ```bash
   npm start
   ```

2. **Press `j` in Metro terminal:**
   - Opens DevTools in browser
   - URL: http://localhost:8081/debugger-ui/

3. **Run the app:**
   ```bash
   npm run ios  # or npm run android
   ```

4. **Navigate to Input screen:**
   - Tap "Get Started" on Onboarding
   - Fill in the form:
     - Date: `01/15/1990`
     - Time: `02:30 PM`
     - Location: `New York, NY`
     - Time Zone: `America/New_York`

5. **Submit and check console:**
   - Tap "Calculate"
   - In DevTools Console tab, you should see:
   ```
   LOG  Form data: {date: "01/15/1990", time: "02:30 PM", ...}
   LOG  ✅ HDExtract computed successfully: {type: "Generator", ...}
   LOG  Type: Generator
   LOG  Authority: Sacral
   LOG  Profile: 2/4
   LOG  Centers: ["Head", "Ajna", "Throat", "G"]
   LOG  Channels: [1, 8, 15, 22]
   LOG  Gates: [1, 8, 15, 22, 33, 40, 47, 54]
   ```

6. **Expand objects:**
   - Click arrow next to object to see full structure
   - Verify all properties are present

### Method 2: Metro Bundler Terminal

1. **Watch the terminal where Metro is running:**
   ```bash
   npm start
   ```

2. **Submit the form in the app**

3. **Console logs appear in Metro terminal:**
   ```
   LOG  Form data: {"date":"01/15/1990","time":"02:30 PM",...}
   LOG  ✅ HDExtract computed successfully: {"type":"Generator",...}
   LOG  Type: Generator
   LOG  Authority: Sacral
   ...
   ```

### Method 3: Alert Box (Quick Test)

Temporarily modify `InputScreen.tsx`:

```typescript
// After computing hdExtract
Alert.alert(
  'HD Extract',
  `Type: ${hdExtract.type}\nAuthority: ${hdExtract.authority}\nProfile: ${hdExtract.profile}`
);
```

### Method 4: Unit Tests

```bash
# Run the test suite
npm test -- __tests__/hdkit-adapter.test.ts

# Should show:
# ✓ should return a valid HDExtract structure
# ✓ should be deterministic
# ✓ should produce different results for different inputs
# ... (8 tests passing)
```

## Common Issues

### Issue: No console logs in Flipper

**Solution:**
1. Make sure Flipper is running BEFORE starting the app
2. Check that "React DevTools" plugin is enabled
3. Try restarting both Flipper and the app
4. Check Metro bundler terminal for logs

### Issue: "Unable to connect to debugger"

**Solution:**
```bash
# Clear Metro cache
npm start -- --reset-cache

# Rebuild the app
npm run rebuild:ios  # or rebuild:android
```

### Issue: Hermes debugger not working

**Solution:**
1. Use Flipper's "Hermes Debugger" plugin (not Chrome DevTools)
2. Make sure Hermes is enabled (it is by default)
3. Restart the app

### Issue: Source maps not loading

**Solution:**
```bash
# Clear all caches
npm start -- --reset-cache
rm -rf ios/build android/app/build
npm run rebuild:ios  # or rebuild:android
```

### Issue: Console logs not showing in Metro

**Solution:**
1. Use `console.warn()` instead of `console.log()` (shows yellow box)
2. Check native logs: `npx react-native log-ios` or `npx react-native log-android`
3. Make sure Metro bundler is running

## Debugging Best Practices

### 1. Use TypeScript for Type Safety
```typescript
// TypeScript catches errors at compile time
const result: HDExtract = await computeHDExtract(birthData);
```

### 2. Add Error Boundaries
```typescript
// Already implemented in src/navigation/ErrorBoundary.tsx
// Catches and displays React errors
```

### 3. Use Zod for Runtime Validation
```typescript
// Already implemented in InputScreen
// Validates form data before submission
```

### 4. Log at Key Points
```typescript
console.log('1. Form submitted:', formData);
console.log('2. Converted to ISO:', { dateISO, time });
console.log('3. HD Extract computed:', hdExtract);
console.log('4. Classification result:', classification);
```

### 5. Use Conditional Logging
```typescript
const DEBUG = __DEV__; // true in development, false in production

if (DEBUG) {
  console.log('Debug info:', data);
}
```

## Performance Monitoring

### Flipper Performance Plugin
1. Open Flipper
2. Enable "Performance" plugin
3. Monitor:
   - Frame rate (should be 60 FPS)
   - Memory usage
   - CPU usage
   - Network requests

### React DevTools Profiler
1. Open Flipper → React DevTools
2. Click "Profiler" tab
3. Record a session
4. Analyze component render times

## Network Debugging

### Flipper Network Plugin
1. Open Flipper
2. Enable "Network" plugin
3. See all HTTP requests/responses
4. Inspect headers, body, timing

### MSW (Mock Service Worker)
```typescript
// Already configured in __tests__/setup/msw.test.ts
// Mocks API calls in tests
```

## Useful Commands

```bash
# Start with clean cache
npm start -- --reset-cache

# View iOS logs
npx react-native log-ios

# View Android logs
npx react-native log-android

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint

# Rebuild native code
npm run rebuild:ios
npm run rebuild:android

# Reload app without rebuild
npm run reload:ios
npm run reload:android
```

## Quick Reference

| Tool | Best For | Hermes Support | New Arch Support | Setup |
|------|----------|----------------|------------------|-------|
| RN DevTools | Console, breakpoints | ✅ Excellent | ✅ Yes | ✅ Built-in |
| Metro Terminal | Quick logs | ✅ Yes | ✅ Yes | ✅ Built-in |
| Flipper | Network, layout | ✅ Excellent | ✅ Yes | ⚠️ Install needed |
| Chrome DevTools | Legacy apps | ⚠️ Limited | ⚠️ Limited | ✅ Built-in |
| Native Logs | Native issues | ✅ Yes | ✅ Yes | ✅ Built-in |

## Recommended Setup

For this app (New Architecture + Hermes):

1. **Primary**: React Native DevTools (press `j` in Metro) - Official, fast, built-in
2. **Secondary**: Metro terminal for quick console logs
3. **Alternative**: Flipper for advanced network/layout debugging
4. **Fallback**: Native logs for native module issues
5. **Testing**: Jest for unit/integration tests

## Next Steps

- Install Flipper if not already installed
- Test the hdkit adapter using Flipper
- Check console logs for HDExtract output
- Verify all properties are present and correct
