# Flutter Framework Not Found - Fix

## Problem

The build is failing with: `error: no such module 'Flutter'`

This happens because the Flutter framework isn't being found by the Swift compiler, even though the Flutter pod is installed.

## Root Cause

For Flutter modules embedded in React Native, the Flutter.framework needs to be present and properly linked. The framework should come from the Flutter SDK, not built locally.

## Solution Options

### Option 1: Add Flutter Framework Search Path (Recommended)

1. Open `S3App.xcodeproj` in Xcode
2. Select the **S3App** project → **S3App** target
3. Go to **Build Settings** tab
4. Search for: `Framework Search Paths`
5. Add the following paths:
   ```
   $(inherited)
   $(PROJECT_DIR)/../super_dash/.ios/Flutter
   $(FLUTTER_ROOT)/bin/cache/artifacts/engine/ios/Flutter.xcframework/ios-arm64_x86_64-simulator
   $(FLUTTER_ROOT)/bin/cache/artifacts/engine/ios/Flutter.xcframework/ios-arm64
   ```

### Option 2: Verify Flutter Engine

The Flutter engine should be automatically downloaded when you run `flutter pub get` in the module. Check if it exists:

```bash
ls -la ~/flutter/bin/cache/artifacts/engine/ios/
```

If the engine isn't there, download it:

```bash
flutter precache --ios
```

### Option 3: Clean and Rebuild

Sometimes Xcode caches cause issues:

```bash
cd ios
rm -rf Pods Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/S3App-*
bundle exec pod install
cd ..
```

Then rebuild in Xcode.

### Option 4: Temporary Workaround (For Testing)

If you just want to test that the rest of the iOS bridge builds, you can temporarily comment out the Flutter import:

In `ios/S3App/GameBridgeModule.swift`, change:

```swift
import Flutter
```

to:

```swift
// import Flutter  // TODO: Fix Flutter framework path
```

This will let you verify the Objective-C bridge and other parts build correctly, but the Flutter functionality won't work.

## Verification

After applying the fix, build should succeed:

```bash
cd ios
xcodebuild -workspace S3App.xcworkspace -scheme S3App -configuration Debug -sdk iphonesimulator build
```

## Next Steps

Once the framework path is fixed:
1. Build should complete successfully
2. Run the app: `npm run ios`
3. Test the bridge with BridgeTestScreen

## Related Files

- `ios/S3App/GameBridgeModule.swift` - Swift bridge implementation
- `ios/S3App/GameBridgeModule.m` - Objective-C bridge header
- `ios/S3App/S3App-Bridging-Header.h` - Bridging header
- `ios/Podfile` - Flutter module integration
- `super_dash/.ios/Flutter/` - Flutter module iOS artifacts
