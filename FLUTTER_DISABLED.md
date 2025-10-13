# Flutter Module Temporarily Disabled

This branch (`temp/disable-flutter-for-testing`) has Flutter module integration temporarily disabled to allow React Native development and testing without requiring the Flutter module to be built.

## What Was Changed

### Android (`android/settings.gradle`)
Commented out Flutter module integration:
```groovy
// setBinding(new Binding([gradle: this]))
// evaluate(new File(
//   settingsDir.parentFile,
//   'super_dash/.android/include_flutter.groovy'
// ))
```

### iOS (`ios/Podfile`)
Commented out Flutter module integration:
```ruby
# flutter_application_path = '../super_dash'
# load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')
# install_all_flutter_pods(flutter_application_path)
# flutter_post_install(installer) if defined?(flutter_post_install)
```

## Why This Was Done

1. **Unblock Development**: Allows testing React Native app and UI components without Flutter
2. **Build Issues**: Flutter module needs to be properly built before integration (task 9.1+)
3. **Parallel Work**: RN development can proceed while Flutter module is being prepared

## What Works

- ✅ React Native app builds on Android and iOS
- ✅ All RN screens and components
- ✅ Navigation between screens
- ✅ UI component library
- ✅ State management (zustand)
- ✅ API integration (BodyGraph, scorer, etc.)

## What Doesn't Work

- ❌ Flutter game integration
- ❌ GameBridge native module calls (will fail at runtime)
- ❌ Super Dash game screens

## How to Re-enable Flutter

When Flutter module is ready (after task 9.1+):

1. **Uncomment the lines** in both files (remove the `//` or `#`)
2. **Clean builds**:
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   
   # iOS
   cd ios && pod install && cd ..
   ```
3. **Rebuild** the app

## Current Development Plan

With Flutter disabled, we can work on:
- ✅ Task 1.4: UI components (COMPLETED)
- 🔄 Task 5.0: Zustand store
- 🔄 Task 6.1: Bridge types + Zod schemas
- 🔄 Task 12.1: Zod source-of-truth
- 🔄 Task 5.4: GameBridge RN wrapper (stubbed)
- 🔄 Tasks 7.x: More RN screens

Once Flutter module is ready:
- Task 9.1+: Flutter bridge implementation
- Re-enable Flutter integration
- Test full integration

## Notes

- This is a **temporary testing branch**
- Do not merge to main without re-enabling Flutter
- All Flutter code remains intact, just not integrated
- Easy to toggle on/off by commenting/uncommenting
