# After Task 1.2: What You Need to Do

## ✅ Task 1.2 Complete!

All dev dependencies have been installed and configured:
- Testing libraries (Jest, Detox, @testing-library/react-native)
- API mocking (MSW v2 with @mswjs/interceptors)
- Code quality tools (dependency-cruiser)
- Build tools (babel-plugin-module-resolver, zod-to-json-schema)

## ⚠️ Important: Rebuild Required

Because we installed dependencies with native modules, you **must rebuild** the native apps before they will work.

### Quick Steps

1. **Stop Metro bundler** if it's running (press Ctrl+C)

2. **Choose your platform and rebuild:**

   **For iOS:**
   ```bash
   npm run rebuild:ios
   ```

   **For Android:**
   ```bash
   npm run rebuild:android
   ```

   **For both:**
   ```bash
   npm run rebuild:all
   ```

3. **Start Metro with cache reset:**
   ```bash
   npm start -- --reset-cache
   ```

4. **In a NEW terminal, run the app:**
   ```bash
   npm run ios
   # or
   npm run android
   ```

### What These Commands Do

- `npm run rebuild:ios` - Installs CocoaPods and cleans iOS build
- `npm run rebuild:android` - Cleans Android build
- `npm start -- --reset-cache` - Starts Metro bundler with fresh cache
- `npm run ios/android` - Builds and runs the app

## 🎯 Expected Result

After rebuilding, the app should:
- ✅ Launch without errors
- ✅ Show "Star System Sorter" screen
- ✅ No "TurboModuleRegistry" errors
- ✅ No "could not be found" errors

## 📚 Documentation Created

All documentation is in the `docs/` folder:

- **`FIX_NATIVE_MODULE_ERROR.md`** - Quick fix for the current error
- **`docs/DEV_DEPENDENCIES.md`** - Complete dev dependencies guide
- **`docs/TROUBLESHOOTING_NATIVE_MODULES.md`** - Detailed troubleshooting
- **`docs/QUICK_REFERENCE_DEV_DEPS.md`** - Quick command reference
- **`docs/TASK_1.2_SUMMARY.md`** - Full task summary

## 🔧 New Scripts Available

```bash
# Rebuild native projects
npm run rebuild:ios
npm run rebuild:android
npm run rebuild:all

# Testing
npm test                    # Unit tests
npm run test:coverage       # With coverage
npm run test:e2e:ios        # E2E tests iOS
npm run test:e2e:android    # E2E tests Android

# Code quality
npm run lint                # ESLint
npm run lint:graph          # Import graph validation
npm run typecheck           # TypeScript checking
```

## 🚀 Next Tasks

Once the app is running again, you can proceed with:
- Task 1.3: Configure dependency-cruiser rules ✅ (already done)
- Task 1.4: Adapt existing shadcn/ui components for React Native
- Task 1.5: Set up React Navigation

## ❓ Still Having Issues?

1. Check `FIX_NATIVE_MODULE_ERROR.md` for quick fixes
2. Check `docs/TROUBLESHOOTING_NATIVE_MODULES.md` for detailed help
3. Try the "Nuclear Option" in the troubleshooting guide (complete clean)

## 💡 Prevention

Going forward, the `postinstall` script will automatically run `pod install` after `npm install`, so this issue shouldn't happen again when installing new dependencies.

---

**TL;DR**: Run `npm run rebuild:all`, then `npm start -- --reset-cache`, then `npm run ios` (or android) in a new terminal.
