# Flutter Engine Cache Testing Guide

This guide helps you manually verify that FlutterEngine caching is working correctly and provides the expected performance benefits.

## Prerequisites

- Flutter SDK installed (>= 3.16.0)
- React Native app built and running
- Android emulator/device or iOS simulator/device

## Setup

First, run the Flutter module setup:

```bash
./scripts/setup-flutter-module.sh
```

## Test 1: Verify FlutterEngine Initialization

### Android

1. **Build and run the app**:
   ```bash
   npm run android
   ```

2. **Check logs for FlutterEngine initialization**:
   ```bash
   adb logcat | grep -E "(FlutterEngine|s3_engine|DartExecutor)"
   ```

3. **Expected output**:
   ```
   MainApplication: Creating FlutterEngine
   FlutterEngineCache: put("s3_engine")
   DartExecutor: executeDartEntrypoint
   ```

4. **Verify timing**:
   - Look for timestamps in logs
   - Engine should initialize within 500ms of app launch

### iOS

1. **Build and run the app**:
   ```bash
   npm run ios
   ```

2. **Check Xcode console** for FlutterEngine initialization:
   - Open Xcode → Window → Devices and Simulators
   - Select your device/simulator
   - View Device Logs

3. **Expected output**:
   ```
   AppDelegate: Creating FlutterEngine
   FlutterEngine: run()
   GeneratedPluginRegistrant: register
   ```

4. **Verify timing**:
   - Engine should initialize within 300ms of app launch

## Test 2: Verify Engine Caching (Manual)

**Note**: This test requires the native bridge to be implemented (Task 6.x) and a screen that launches the Flutter game (Task 8.x). For now, we can verify the cache exists.

### Android

Add temporary test code to verify cache:

```kotlin
// In MainActivity.kt or a test activity
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Verify engine is cached
    val engine = FlutterEngineCache.getInstance().get("s3_engine")
    if (engine != null) {
        Log.d("FlutterTest", "✅ Engine cached successfully")
        Log.d("FlutterTest", "Engine running: ${engine.dartExecutor.isExecutingDart}")
    } else {
        Log.e("FlutterTest", "❌ Engine not found in cache")
    }
}
```

### iOS

Add temporary test code to verify cache:

```swift
// In a view controller
override func viewDidLoad() {
    super.viewDidLoad()
    
    // Verify engine is cached
    if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        let engine = appDelegate.flutterEngine
        print("✅ Engine cached successfully")
        print("Engine running: \(engine.isRunning)")
    } else {
        print("❌ Engine not found")
    }
}
```

## Test 3: Performance Testing (After Bridge Implementation)

**Prerequisites**: Tasks 6.x (native bridge) and 8.x (game screen) must be complete.

### Setup Performance Measurement

1. **Add timing logs to game launch code**:

```typescript
// In SuperDashScreen.tsx or game bridge
const launchGame = async () => {
  const startTime = Date.now();
  
  await GameBridge.start({
    game: 'super_dash',
    seed: 'test123',
    team: 'Pleiades'
  });
  
  const launchTime = Date.now() - startTime;
  console.log(`Game launch time: ${launchTime}ms`);
};
```

2. **Add native timing logs**:

**Android**:
```kotlin
val startTime = System.currentTimeMillis()
val intent = FlutterActivity
  .withCachedEngine("s3_engine")
  .build(currentActivity)
currentActivity.startActivity(intent)
val launchTime = System.currentTimeMillis() - startTime
Log.d("GameBridge", "Flutter activity launch: ${launchTime}ms")
```

**iOS**:
```swift
let startTime = Date()
let flutterViewController = FlutterViewController(
  engine: flutterEngine,
  nibName: nil,
  bundle: nil
)
present(flutterViewController, animated: true)
let launchTime = Date().timeIntervalSince(startTime) * 1000
print("Flutter VC launch: \(launchTime)ms")
```

### Execute Performance Test

1. **First Launch** (Cold):
   - Launch the app fresh (kill and restart)
   - Navigate to game screen
   - Record launch time
   - **Expected**: ≤500ms (Android), ≤300ms (iOS)

2. **Second Launch** (Warm):
   - Go back to previous screen
   - Navigate to game screen again
   - Record launch time
   - **Expected**: ≤200ms (Android), ≤100ms (iOS)

3. **Compare**:
   - Second launch should be **noticeably faster** (50-70% faster)
   - Logs should show cached engine being reused

### Expected Results

| Platform | First Launch | Second Launch | Improvement |
|----------|-------------|---------------|-------------|
| Android  | ≤500ms      | ≤200ms        | ~60% faster |
| iOS      | ≤300ms      | ≤100ms        | ~67% faster |

## Test 4: Memory Usage

### Android

```bash
# Check memory usage
adb shell dumpsys meminfo com.s3app | grep -A 10 "App Summary"
```

**Expected**:
- Base app: ~100-150MB
- With FlutterEngine: ~150-200MB
- Overhead: ~50MB (acceptable)

### iOS

Use Xcode Instruments:
1. Open Xcode → Product → Profile
2. Select "Allocations" template
3. Run the app
4. Check memory usage

**Expected**:
- Base app: ~80-120MB
- With FlutterEngine: ~120-160MB
- Overhead: ~40MB (acceptable)

## Test 5: APK/IPA Size

### Android

```bash
# Build release APK
cd android
./gradlew assembleRelease
cd ..

# Check APK size
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

**Expected**:
- Base app: ~20-30MB
- With Flutter: ~45-55MB
- Flutter overhead: ~20-25MB (within target)

### iOS

Build in Xcode and check IPA size:
1. Product → Archive
2. Distribute App → Development
3. Check IPA size

**Expected**:
- Base app: ~15-25MB
- With Flutter: ~40-50MB
- Flutter overhead: ~20-25MB (within target)

## Troubleshooting

### Engine Not Cached

**Symptom**: Logs show "Engine not found in cache"

**Solution**:
1. Verify `initializeFlutterEngine()` is called in Application/AppDelegate
2. Check cache ID matches: `"s3_engine"`
3. Ensure Flutter module is built: `./scripts/setup-flutter-module.sh`

### Slow Launch Times

**Symptom**: Launch times exceed targets

**Possible causes**:
1. Engine not cached (see above)
2. Debug build (use release build for accurate timing)
3. Emulator performance (test on real device)
4. First launch includes Dart VM warmup (expected)

### Memory Issues

**Symptom**: App crashes or high memory usage

**Solution**:
1. Monitor memory in Instruments/Android Profiler
2. Check for memory leaks
3. Consider lazy initialization if needed
4. Verify engine is reused, not recreated

## Automated Testing (Future)

Once the bridge is implemented, create automated tests:

```typescript
// __tests__/flutter-engine-cache.test.ts
describe('FlutterEngine Caching', () => {
  it('should cache engine on app launch', async () => {
    // Test engine initialization
  });

  it('should reuse cached engine on second launch', async () => {
    // Test engine reuse
  });

  it('should launch game faster on second attempt', async () => {
    const firstLaunch = await measureGameLaunch();
    const secondLaunch = await measureGameLaunch();
    
    expect(secondLaunch).toBeLessThan(firstLaunch * 0.5);
  });
});
```

## Checklist

Use this checklist to verify FlutterEngine caching:

- [ ] Flutter module setup script runs successfully
- [ ] Android app builds without errors
- [ ] iOS app builds without errors
- [ ] Android logs show FlutterEngine initialization
- [ ] iOS logs show FlutterEngine initialization
- [ ] Engine cached with ID `"s3_engine"` on both platforms
- [ ] Memory overhead is acceptable (~50MB Android, ~40MB iOS)
- [ ] APK/IPA size increase is acceptable (~20-25MB)
- [ ] (After bridge) First game launch ≤500ms (Android), ≤300ms (iOS)
- [ ] (After bridge) Second game launch ≤200ms (Android), ≤100ms (iOS)
- [ ] (After bridge) Second launch is noticeably faster than first

## Next Steps

1. **Now**: Verify configuration and build success
2. **Task 6.x**: Implement native bridge
3. **Task 8.x**: Implement game screen
4. **Then**: Run full performance tests with this guide

## References

- [Flutter Module Integration](./FLUTTER_MODULE_INTEGRATION.md)
- [Setup Checklist](./FLUTTER_MODULE_SETUP_CHECKLIST.md)
- [Quick Reference](./QUICK_REFERENCE_FLUTTER_MODULE.md)
