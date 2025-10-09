# Troubleshooting: Native Module Errors

## Error: 'RNGestureHandlerModule' could not be found

This error occurs when native dependencies are installed but not properly linked to the native iOS/Android projects.

### Solution

After installing new dependencies with native modules (like react-native-gesture-handler, react-native-screens, etc.), you must rebuild the native apps:

#### iOS

1. **Install CocoaPods dependencies:**
   ```bash
   cd ios
   bundle exec pod install
   cd ..
   ```

2. **Clean the build (if needed):**
   ```bash
   cd ios
   xcodebuild clean
   cd ..
   ```

3. **Rebuild and run:**
   ```bash
   npm run ios
   ```

   Or from Xcode:
   - Open `ios/S3App.xcworkspace` (NOT .xcodeproj)
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Product → Build (Cmd+B)
   - Product → Run (Cmd+R)

#### Android

1. **Clean the build:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. **Rebuild and run:**
   ```bash
   npm run android
   ```

   Or from Android Studio:
   - Open the `android/` folder
   - Build → Clean Project
   - Build → Rebuild Project
   - Run → Run 'app'

### Quick Fix (Both Platforms)

If you're still seeing errors after the above steps:

1. **Stop Metro bundler** (Ctrl+C in the terminal where it's running)

2. **Clear Metro cache:**
   ```bash
   npm start -- --reset-cache
   ```

3. **In a new terminal, rebuild the app:**
   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android
   ```

### Common Issues

#### Issue: "Module not found" after installing dependencies

**Cause**: Native modules need to be linked and the native projects rebuilt.

**Solution**: Follow the iOS/Android rebuild steps above.

#### Issue: "Invariant Violation: TurboModuleRegistry.getEnforcing"

**Cause**: Native module is not registered in the native binary.

**Solution**: 
1. Ensure the module is in package.json dependencies (not devDependencies)
2. Run `pod install` for iOS
3. Rebuild the native app

#### Issue: Metro bundler won't start (EADDRINUSE)

**Cause**: Metro is already running on port 8081.

**Solution**:
```bash
# Find and kill the process
lsof -ti:8081 | xargs kill -9

# Or use a different port
npm start -- --port 8082
```

#### Issue: Xcode build fails with "Command PhaseScriptExecution failed"

**Cause**: CocoaPods or build cache issues.

**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
npm run ios
```

#### Issue: Android build fails with "Could not resolve all files"

**Cause**: Gradle cache or dependency issues.

**Solution**:
```bash
cd android
./gradlew clean
./gradlew --stop
cd ..
npm run android
```

### Nuclear Option (Last Resort)

If nothing else works, do a complete clean:

```bash
# 1. Stop Metro
# Press Ctrl+C in Metro terminal

# 2. Clean everything
rm -rf node_modules
rm -rf ios/Pods ios/Podfile.lock
rm -rf android/app/build android/build
rm -rf ios/build

# 3. Reinstall
npm install
cd ios && bundle exec pod install && cd ..

# 4. Start fresh
npm start -- --reset-cache

# 5. In new terminal, rebuild
npm run ios    # or npm run android
```

## Prevention

To avoid these issues in the future:

1. **Always run `pod install` after installing iOS dependencies**
2. **Always rebuild native apps after adding native modules**
3. **Keep Metro bundler running in a separate terminal**
4. **Use `npm run ios` or `npm run android` instead of building from IDE when possible**

## Dependencies with Native Modules

These dependencies require native linking and rebuilding:

- react-native-gesture-handler
- react-native-screens
- react-native-safe-area-context
- react-native-svg
- react-native-document-picker
- @react-navigation/native (uses above dependencies)

When you install any of these, remember to:
1. Run `pod install` (iOS)
2. Rebuild the app
