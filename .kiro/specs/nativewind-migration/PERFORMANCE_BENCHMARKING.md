# NativeWind Migration Performance Benchmarking

## Overview

This document outlines the performance benchmarking process for the NativeWind migration. The migration aims to maintain or improve performance while providing better developer experience.

## Performance Targets

Based on requirements 9.1-9.4:

| Metric | Target | Notes |
|--------|--------|-------|
| Initial build time | ≤120s | First build after clean install |
| Hot reload time | ≤3s | Time to see changes after save |
| Bundle size | Within 10% of original | JavaScript bundle size |
| Cold launch (Android) | ≤2.5s | Time to interactive |
| Cold launch (iOS) | ≤1.8s | Time to interactive |

## Benchmarking Process

### 1. Initial Build Time

**How to measure:**
```bash
# Clean all caches and builds
npm run rebuild:all
rm -rf node_modules
npm install

# Time the first build
time npm run android  # or npm run ios
```

**What to measure:**
- Time from `npm run android/ios` to app launch
- Should complete within 120 seconds

**Expected result:**
- NativeWind adds minimal build overhead
- Tailwind CSS compilation is fast (< 1s)
- Metro bundler time should be similar to pre-migration

### 2. Hot Reload Time

**How to measure:**
```bash
# Start Metro bundler
npm start

# In another terminal, run the app
npm run android  # or npm run ios

# Make a change to a screen file (e.g., add a space)
# Measure time from save to seeing the change in the app
```

**What to measure:**
- Time from file save to visual update in app
- Should complete within 3 seconds

**Expected result:**
- NativeWind uses Metro's Fast Refresh
- className changes should hot reload instantly
- No performance degradation from pre-migration

### 3. Bundle Size

**How to measure:**

**Android:**
```bash
# Build release APK
cd android
./gradlew assembleRelease
cd ..

# Check APK size
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

**iOS:**
```bash
# Build release IPA
cd ios
xcodebuild -workspace S3App.xcworkspace \
  -scheme S3App \
  -configuration Release \
  -archivePath build/S3App.xcarchive \
  archive

# Check archive size
du -sh ios/build/S3App.xcarchive
```

**What to measure:**
- APK/IPA file size
- JavaScript bundle size (in Metro output)
- Should be within 10% of pre-migration size

**Expected result:**
- NativeWind adds ~50KB to bundle (Tailwind runtime)
- Removal of StyleSheet code may offset this
- Net change should be minimal (< 10%)

### 4. Cold Launch Time

**How to measure:**

**Android:**
```bash
# Close app completely
adb shell am force-stop com.starsystemsorter

# Launch and measure
adb shell am start -W -n com.starsystemsorter/.MainActivity

# Look for "TotalTime" in output
```

**iOS:**
```bash
# Use Xcode Instruments
# 1. Open Xcode
# 2. Product > Profile
# 3. Select "Time Profiler"
# 4. Launch app and measure time to first interaction
```

**What to measure:**
- Time from app icon tap to first interactive screen
- Android target: ≤2.5s
- iOS target: ≤1.8s

**Expected result:**
- NativeWind has no runtime overhead
- className utilities are compiled at build time
- Launch time should be identical to pre-migration

## Benchmarking Checklist

- [ ] Measure initial build time on clean install
- [ ] Measure hot reload time for multiple file types
- [ ] Measure bundle size (APK/IPA)
- [ ] Measure JavaScript bundle size
- [ ] Measure cold launch time on Android
- [ ] Measure cold launch time on iOS
- [ ] Compare all metrics to pre-migration baseline
- [ ] Document any performance regressions
- [ ] Investigate and fix any metrics outside targets

## Performance Optimization Tips

### 1. Minimize Template Literals

```typescript
// ❌ Slower (creates new string on every render)
<View className={`flex-1 bg-canvas-dark`}>

// ✅ Faster (static string)
<View className="flex-1 bg-canvas-dark">
```

### 2. Use React.memo for Expensive Components

```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  return (
    <View className="p-4 bg-surface-subtle rounded-xl">
      {/* Complex rendering */}
    </View>
  );
});
```

### 3. Avoid Inline Styles for Static Values

```typescript
// ❌ Slower (creates new object on every render)
<View style={{padding: 16, backgroundColor: '#0a0612'}}>

// ✅ Faster (className is optimized)
<View className="p-4 bg-canvas-dark">
```

### 4. Use useMemo for Complex className Composition

```typescript
const className = useMemo(() => {
  return `
    flex-1 p-4
    ${isActive ? 'bg-lavender-500' : 'bg-surface-muted'}
    ${hasError ? 'border-semantic-error' : 'border-borders-subtle'}
  `.trim();
}, [isActive, hasError]);

<View className={className}>
```

## Known Performance Characteristics

### NativeWind Overhead

- **Build time**: +1-2s for Tailwind CSS compilation
- **Bundle size**: +50KB for NativeWind runtime
- **Runtime**: Zero overhead (styles compiled at build time)
- **Hot reload**: No impact (uses Metro Fast Refresh)

### Performance Improvements

- **Reduced StyleSheet.create calls**: Less JavaScript execution
- **Smaller component files**: Faster parsing and compilation
- **Better tree-shaking**: Unused utilities are removed
- **Optimized className strings**: Metro optimizes static strings

## Troubleshooting Performance Issues

### Slow Build Times

**Symptoms**: Build takes > 120s

**Solutions**:
1. Clear Metro cache: `npm start -- --reset-cache`
2. Clear Gradle cache (Android): `cd android && ./gradlew clean`
3. Clear Xcode derived data (iOS): `rm -rf ~/Library/Developer/Xcode/DerivedData`
4. Check for large dependencies in package.json
5. Verify Tailwind config isn't scanning unnecessary files

### Slow Hot Reload

**Symptoms**: Changes take > 3s to appear

**Solutions**:
1. Restart Metro bundler
2. Check for circular dependencies: `npm run lint:graph`
3. Reduce file size (target 100-200 LOC, soft limit 300 LOC)
4. Use React.memo for expensive components
5. Avoid complex calculations in render

### Large Bundle Size

**Symptoms**: Bundle size increased > 10%

**Solutions**:
1. Check for unused dependencies
2. Verify tree-shaking is working
3. Use dynamic imports for large modules
4. Check Tailwind config for unused utilities
5. Run bundle analyzer to identify large modules

### Slow Launch Time

**Symptoms**: Launch time > 2.5s (Android) or > 1.8s (iOS)

**Solutions**:
1. Profile with Xcode Instruments (iOS) or Android Profiler
2. Check for heavy computations in component mount
3. Defer non-critical initialization
4. Use lazy loading for screens
5. Optimize image assets

## Baseline Metrics (Pre-Migration)

Document baseline metrics before migration for comparison:

| Metric | Pre-Migration | Post-Migration | Change |
|--------|---------------|----------------|--------|
| Initial build time | TBD | TBD | TBD |
| Hot reload time | TBD | TBD | TBD |
| Bundle size (Android) | TBD | TBD | TBD |
| Bundle size (iOS) | TBD | TBD | TBD |
| Cold launch (Android) | TBD | TBD | TBD |
| Cold launch (iOS) | TBD | TBD | TBD |

## Conclusion

Performance benchmarking should be conducted on:
- Physical devices (not just emulators/simulators)
- Multiple device tiers (low-end, mid-tier, high-end)
- Both iOS and Android platforms
- Release builds (not debug builds)

All metrics should meet or exceed the targets defined in requirements 9.1-9.4. Any regressions should be investigated and resolved before considering the migration complete.

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Metro Bundler Performance](https://facebook.github.io/metro/docs/performance)
- [NativeWind Performance](https://www.nativewind.dev/overview/performance)
- [Android Profiling](https://developer.android.com/studio/profile)
- [Xcode Instruments](https://developer.apple.com/documentation/xcode/improving-your-app-s-performance)
