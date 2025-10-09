# How to Preview App on Android - Step by Step

## Quick Start (2 Terminals)

### Terminal 1: Start Metro Bundler
```bash
npm start
```
**Keep this running!** This is the JavaScript bundler.

### Terminal 2: Start Android Emulator & Run App
```bash
# Option A: Let React Native start the emulator and run the app
npm run android

# Option B: Start emulator manually first, then run
emulator -avd Medium_Phone_API_36.1 &
npm run android
```

## Detailed Steps

### Step 1: Verify Environment (One-Time)
```bash
source ~/.zshrc
echo $ANDROID_HOME
```
Should show: `/Users/kingkamehameha/Library/Android/sdk`

### Step 2: Check Available Emulators
```bash
emulator -list-avds
```
You have: **Medium_Phone_API_36.1**

### Step 3: Start Metro Bundler
Open a terminal and run:
```bash
npm start
```

You'll see:
```
Welcome to Metro v0.82.0
  Fast - Scalable - Integrated

To reload the app press "r"
To open developer menu press "d"
```

**Leave this running!**

### Step 4: Run on Android (New Terminal)
Open a **new terminal** and run:
```bash
npm run android
```

This will:
1. Start the emulator (if not running)
2. Build the Android app
3. Install the APK on the emulator
4. Launch the app

**First build takes 2-5 minutes.** Subsequent builds are much faster.

## What You'll See

### In Terminal:
```
info Running jetifier to migrate libraries to AndroidX.
info Starting JS server...
info Installing the app...
info Launching emulator...
info Successfully launched emulator.
info Installing app...
BUILD SUCCESSFUL in 2m 34s
```

### On Emulator:
The app will launch and show:
- **Title**: "Star System Sorter"
- **Subtitle**: "S³"
- **Message**: "React Native app initialized successfully"

## Alternative: Start Emulator from Android Studio

### Option 1: Android Studio GUI
1. Open Android Studio
2. Click "More Actions" → "Device Manager"
3. Find "Medium_Phone_API_36.1"
4. Click the ▶️ play button
5. Wait for emulator to boot
6. Then run: `npm run android`

### Option 2: Command Line
```bash
# Start emulator in background
emulator -avd Medium_Phone_API_36.1 &

# Wait for it to boot (30-60 seconds)
# Then run the app
npm run android
```

## Verify Emulator is Running

```bash
adb devices
```

Should show:
```
List of devices attached
emulator-5554   device
```

## Hot Reload

Once the app is running:
1. Edit any file in `src/` or `App.tsx`
2. Save the file
3. The app automatically reloads on the emulator!

No need to rebuild or restart.

## Debug Menu

While app is running on emulator:
- Press `Cmd+M` (Mac) or `Ctrl+M` (Windows/Linux)
- Or shake the device (if physical device)

Options:
- Reload
- Debug
- Enable Hot Reloading
- Enable Live Reload
- Toggle Inspector

## Troubleshooting

### "SDK location not found"
```bash
source ~/.zshrc
echo $ANDROID_HOME
```
Should show the SDK path. If not, open a new terminal.

### "No emulators found"
```bash
emulator -list-avds
```
If empty, create one in Android Studio:
1. Device Manager → Create Virtual Device
2. Select device (e.g., Pixel 6)
3. Select system image (API 34+)
4. Finish

### "Emulator won't start"
```bash
# Kill any stuck emulator processes
pkill -9 qemu-system

# Try starting again
emulator -avd Medium_Phone_API_36.1
```

### "Build failed"
```bash
# Clean build
cd android
./gradlew clean
cd ..

# Try again
npm run android
```

### "Metro bundler port in use"
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Start Metro again
npm start
```

## Quick Commands Reference

```bash
# List emulators
emulator -list-avds

# Start specific emulator
emulator -avd Medium_Phone_API_36.1

# List connected devices
adb devices

# Start Metro bundler
npm start

# Run on Android
npm run android

# Clear Metro cache
npm start -- --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..
```

## Performance Tips

1. **Keep emulator running** - Don't close it between runs
2. **Use Hot Reload** - Edit and save, no rebuild needed
3. **Enable Fast Refresh** - Automatic in React Native 0.82
4. **Close other apps** - Emulator uses significant RAM

## What Happens on First Run

1. **Gradle downloads dependencies** (~1-2 min)
2. **App builds** (~2-3 min)
3. **APK installs on emulator** (~30 sec)
4. **App launches** (~10 sec)

**Total first run: 3-5 minutes**

Subsequent runs: **30-60 seconds** (much faster!)

## Success Indicators

✅ Metro bundler shows: "Loading..."
✅ Terminal shows: "BUILD SUCCESSFUL"
✅ Emulator shows: App launches
✅ You see: "Star System Sorter" screen

---

**You're ready!** Just run `npm start` in one terminal and `npm run android` in another.
