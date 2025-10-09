# Quick Guide: Debug hdkit Adapter

## TL;DR - Fastest Way

```bash
# Terminal 1: Start Metro
npm start

# Press 'j' to open DevTools in browser

# Terminal 2: Run app
npm run ios  # or npm run android

# In app: Fill form and tap "Calculate"
# In DevTools Console tab: See HDExtract output
```

## Step-by-Step (5 minutes)

### 1. Start Metro Bundler
```bash
npm start
```

### 2. Open React Native DevTools
In the Metro terminal, press `j`
- Browser opens to: `http://localhost:8081/debugger-ui/`
- You should see "Waiting for connection..."

### 3. Run the App
```bash
# iOS
npm run ios

# Android
npm run android
```

### 4. DevTools Connects
- Browser should show "Connected"
- Click "Console" tab

### 5. Test the Adapter
In the app:
1. Tap "Get Started" (if on Onboarding)
2. Fill in the form:
   - **Date**: `01/15/1990`
   - **Time**: `02:30 PM`
   - **Location**: `New York, NY`
   - **Time Zone**: `America/New_York` (pre-filled)
3. Tap "Calculate"

### 6. Check Console Output
In DevTools Console tab, you should see:

```
LOG  Form data: {"date":"01/15/1990","time":"02:30 PM","location":"New York, NY","timeZone":"America/New_York"}

LOG  ✅ HDExtract computed successfully: {"type":"Generator","authority":"Sacral","profile":"2/4","centers":["Head","Ajna","Throat","G"],"channels":[1,8,15,22],"gates":[1,8,15,22,33,40,47,54]}

LOG  Type: Generator
LOG  Authority: Sacral
LOG  Profile: 2/4
LOG  Centers: ["Head","Ajna","Throat","G"]
LOG  Channels: [1,8,15,22]
LOG  Gates: [1,8,15,22,33,40,47,54]
```

### 7. Verify Success ✅

You should see:
- ✅ "HDExtract computed successfully" message
- ✅ `type` property (e.g., "Generator")
- ✅ `authority` property (e.g., "Sacral")
- ✅ `profile` property (e.g., "2/4")
- ✅ `centers` array with center names
- ✅ `channels` array with numbers
- ✅ `gates` array with numbers

Click the arrow next to the object to expand and see full structure.

## Alternative: Metro Terminal Only

If you don't want to open DevTools, just watch the Metro terminal:

```bash
npm start
# Don't press 'j', just leave it running

# In another terminal:
npm run ios  # or npm run android

# Logs appear in Metro terminal automatically
```

## Troubleshooting

### DevTools won't open when pressing 'j'
**Solution**: Open browser manually to `http://localhost:8081/debugger-ui/`

### DevTools shows "Waiting for connection..."
**Solution**: 
1. Make sure app is running
2. Reload app: Press `Cmd + R` (iOS) or `R + R` (Android)

### No logs in Console
**Solution**:
1. Make sure "Console" tab is selected
2. Check log level filter (should be "All levels")
3. Try `console.warn()` instead of `console.log()` in code

### App crashes or errors
**Solution**:
```bash
# Clear cache and restart
npm start -- --reset-cache
npm run rebuild:ios  # or rebuild:android
```

## What You're Testing

The hdkit adapter (`src/hd/hdkit-adapter.ts`) does:
1. Takes form data (date, time, timezone)
2. Converts MM/DD/YYYY to YYYY-MM-DD (ISO format)
3. Converts 12-hour time to 24-hour format
4. Calls `computeHDExtract()` with converted data
5. Returns HDExtract object with HD data

The console logs show each step and the final result.

## Next Steps

Once you verify the adapter works:
- [ ] Check that HDExtract has all required properties
- [ ] Verify data types are correct (strings, arrays of numbers)
- [ ] Test with different birth dates/times
- [ ] Verify determinism (same input → same output)

## Full Documentation

- [REACT_NATIVE_DEVTOOLS.md](./REACT_NATIVE_DEVTOOLS.md) - Complete DevTools guide
- [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) - All debugging methods
- [HDKIT_ADAPTER_USAGE.md](./HDKIT_ADAPTER_USAGE.md) - Adapter API reference
- [TASK_2.2_SUMMARY.md](./TASK_2.2_SUMMARY.md) - Implementation details
