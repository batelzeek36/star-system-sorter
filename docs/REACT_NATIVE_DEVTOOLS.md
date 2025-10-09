# React Native DevTools Guide

## Overview

React Native DevTools is the official debugging tool from Meta that fully supports:
- ✅ New Architecture (Fabric + TurboModules)
- ✅ Hermes JavaScript Engine
- ✅ Modern debugging features
- ✅ Built into React Native 0.76+

For React Native 0.82 (your version), DevTools is available but may need manual setup.

## Quick Start

### Method 1: Built-in DevTools (Easiest)

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **Run your app:**
   ```bash
   npm run ios
   # or
   npm run android
   ```

3. **Open Dev Menu in the app:**
   - **iOS Simulator**: Press `Cmd + D`
   - **Android Emulator**: Press `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)
   - **Physical Device**: Shake the device

4. **Select "Open DevTools"** from the menu
   - This should open a browser window with React Native DevTools
   - If not available, see Method 2 below

### Method 2: Manual DevTools Launch

If "Open DevTools" isn't in the menu, you can launch it manually:

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **In the Metro terminal, press `j`** to open the debugger
   - This opens React Native DevTools in your browser
   - URL: `http://localhost:8081/debugger-ui/`

3. **Run your app:**
   ```bash
   npm run ios  # or npm run android
   ```

4. **DevTools should auto-connect** to your app

### Method 3: Direct Browser Access

1. **Start Metro and your app**

2. **Open browser to:**
   ```
   http://localhost:8081/debugger-ui/
   ```

3. **DevTools connects automatically**

## Using React Native DevTools

### Console Tab

**View console logs:**
1. Open DevTools
2. Click "Console" tab
3. Submit the form in your app
4. See logs:
   ```
   Form data: {date: "01/15/1990", ...}
   ✅ HDExtract computed successfully: {type: "Generator", ...}
   Type: Generator
   Authority: Sacral
   Profile: 2/4
   Centers: ["Head", "Ajna", "Throat", "G"]
   Channels: [1, 8, 15, 22]
   Gates: [1, 8, 15, 22, 33, 40, 47, 54]
   ```

**Console features:**
- Filter logs by level (log, warn, error)
- Search logs
- Clear console
- Copy log output

### Components Tab

**Inspect React components:**
1. Click "Components" tab
2. Browse component tree
3. Select a component to see:
   - Props
   - State
   - Hooks
   - Context

**Useful for:**
- Checking form state
- Verifying navigation params
- Inspecting component props

### Profiler Tab

**Measure performance:**
1. Click "Profiler" tab
2. Click record button
3. Interact with your app
4. Stop recording
5. Analyze:
   - Component render times
   - Why components re-rendered
   - Performance bottlenecks

### Sources Tab (Hermes Debugger)

**Set breakpoints:**
1. Click "Sources" tab
2. Find your file (e.g., `InputScreen.tsx`)
3. Click line number to set breakpoint
4. Trigger the code in your app
5. Execution pauses at breakpoint
6. Inspect variables, step through code

**Debugger features:**
- Step over (F10)
- Step into (F11)
- Step out (Shift+F11)
- Continue (F8)
- Watch expressions
- Call stack
- Scope variables

## Testing the hdkit Adapter

### Step-by-Step

1. **Start Metro:**
   ```bash
   npm start
   ```

2. **Press `j` in Metro terminal** to open DevTools
   - Browser opens to `http://localhost:8081/debugger-ui/`

3. **Run the app:**
   ```bash
   npm run ios  # or npm run android
   ```

4. **In DevTools, go to Console tab**

5. **In the app:**
   - Navigate to Input screen
   - Fill in the form:
     - Date: `01/15/1990`
     - Time: `02:30 PM`
     - Location: `New York, NY`
     - Time Zone: `America/New_York`
   - Tap "Calculate"

6. **Check DevTools Console:**
   ```
   LOG  Form data: {"date":"01/15/1990","time":"02:30 PM",...}
   LOG  ✅ HDExtract computed successfully: {"type":"Generator",...}
   LOG  Type: Generator
   LOG  Authority: Sacral
   LOG  Profile: 2/4
   LOG  Centers: ["Head","Ajna","Throat","G"]
   LOG  Channels: [1,8,15,22]
   LOG  Gates: [1,8,15,22,33,40,47,54]
   ```

7. **Expand objects** to see full structure:
   - Click the arrow next to the object
   - Inspect all properties
   - Verify types are correct

### Setting Breakpoints

To debug the hdkit adapter with breakpoints:

1. **Open DevTools Sources tab**

2. **Find the file:**
   - Navigate to `src/screens/InputScreen.tsx`
   - Or search for "InputScreen"

3. **Set breakpoint** on line with `await computeHDExtract(...)`

4. **Submit form in app**

5. **Execution pauses** at breakpoint

6. **Inspect variables:**
   - Hover over `birthData` to see values
   - Check `dateISO`, `time`, `timeZone`
   - Step into `computeHDExtract` to debug adapter

7. **Step through code:**
   - Press F10 to step over
   - Press F11 to step into function
   - Watch the `hdExtract` result

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Dev Menu (iOS) | `Cmd + D` |
| Open Dev Menu (Android) | `Cmd + M` / `Ctrl + M` |
| Reload App | `Cmd + R` / `Ctrl + R` |
| Open DevTools (Metro) | Press `j` |
| Toggle Element Inspector | Press `i` in Metro |
| Toggle Performance Monitor | Press `Perf Monitor` in Dev Menu |

## Troubleshooting

### DevTools won't open

**Solution 1: Check Metro is running**
```bash
# Make sure Metro is running
npm start
```

**Solution 2: Clear cache**
```bash
npm start -- --reset-cache
```

**Solution 3: Manual browser open**
```
http://localhost:8081/debugger-ui/
```

### DevTools not connecting to app

**Solution 1: Reload app**
- Press `Cmd + R` (iOS) or `R + R` (Android) in the app

**Solution 2: Restart everything**
```bash
# Kill Metro
# Ctrl + C in Metro terminal

# Clear cache and restart
npm start -- --reset-cache

# Rebuild app
npm run rebuild:ios  # or rebuild:android
```

**Solution 3: Check network**
- Make sure app and DevTools are on same network
- For Android emulator, use `adb reverse tcp:8081 tcp:8081`

### Console logs not showing

**Solution 1: Check Console tab is selected**
- Click "Console" tab in DevTools

**Solution 2: Check log level filter**
- Make sure "All levels" is selected
- Not filtered to "Errors only"

**Solution 3: Use console.warn for visibility**
```typescript
// Shows as yellow box in app AND in console
console.warn('Debug:', data);
```

### Breakpoints not working

**Solution 1: Make sure debugger is connected**
- Check DevTools shows "Connected" status
- Reload app if needed

**Solution 2: Check source maps**
```bash
# Clear cache
npm start -- --reset-cache
```

**Solution 3: Use debugger statement**
```typescript
// Add this in your code
debugger; // Execution will pause here
```

## Alternative: Metro Terminal Logs

If DevTools isn't working, you can always see logs in the Metro terminal:

```bash
npm start

# Logs appear here automatically:
# LOG  Form data: {...}
# LOG  ✅ HDExtract computed successfully: {...}
```

## Comparison: DevTools vs Flipper

| Feature | React Native DevTools | Flipper |
|---------|----------------------|---------|
| New Architecture | ✅ Full support | ✅ Full support |
| Hermes | ✅ Full support | ✅ Full support |
| Console logs | ✅ Yes | ✅ Yes |
| Component inspector | ✅ Yes | ✅ Yes |
| Debugger/Breakpoints | ✅ Yes | ✅ Yes |
| Network inspector | ⚠️ Limited | ✅ Full |
| Performance profiler | ✅ Yes | ✅ Yes |
| Layout inspector | ⚠️ Basic | ✅ Advanced |
| Setup | ✅ Built-in | ⚠️ Separate install |
| Speed | ✅ Fast | ⚠️ Can be slow |

**Recommendation**: Use React Native DevTools for most debugging, especially console logs and breakpoints. Use Flipper if you need advanced network or layout inspection.

## Quick Commands

```bash
# Start Metro
npm start

# Open DevTools (press in Metro terminal)
j

# Open Element Inspector (press in Metro terminal)
i

# Reload app
# In app: Cmd+R (iOS) or R+R (Android)

# Clear cache
npm start -- --reset-cache

# View logs in terminal
# Just watch the Metro terminal output
```

## Best Practices

### 1. Keep DevTools Open
- Open DevTools before running the app
- Keeps connection stable
- Catches early logs

### 2. Use Console Tab for Quick Debugging
- Fastest way to see output
- No need for breakpoints
- Good for checking data flow

### 3. Use Breakpoints for Deep Debugging
- When you need to inspect variables
- Step through complex logic
- Find bugs in algorithms

### 4. Use Component Inspector for UI Issues
- Check props are correct
- Verify state updates
- Debug navigation params

### 5. Use Profiler for Performance
- Find slow components
- Optimize re-renders
- Measure improvements

## Testing Checklist

To verify hdkit adapter works:

- [ ] Start Metro: `npm start`
- [ ] Press `j` to open DevTools
- [ ] Run app: `npm run ios` or `npm run android`
- [ ] Navigate to Input screen
- [ ] Fill in form with test data
- [ ] Tap "Calculate" button
- [ ] Check DevTools Console tab
- [ ] Verify you see: `✅ HDExtract computed successfully`
- [ ] Expand the object to see all properties
- [ ] Verify: type, authority, profile, centers, channels, gates
- [ ] All properties should have correct types and values

## Next Steps

1. Open DevTools now: `npm start` then press `j`
2. Run the app and test the hdkit adapter
3. Check console output for HDExtract object
4. If you see the object with all properties, it works! ✅
