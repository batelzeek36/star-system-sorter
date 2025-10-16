# Maestro E2E Testing Implementation Summary

This document summarizes the complete Maestro E2E testing infrastructure that has been created for Star System Sorter.

## ✅ What Has Been Created

### 1. Test Flows (`e2e/flows/`)
- **onboarding.yaml** - Basic app launch and navigation
- **input_chart.yaml** - Birth data input and chart generation
- **full_journey.yaml** - Complete user journey (onboarding → input → result → why)
- **moderation.yaml** - Content moderation system tests
- **README.md** - Quick reference for flows

### 2. Automation Scripts (`scripts/`)
- **e2e-ios.sh** - iOS test runner with screen recording and artifact collection
- **e2e-android.sh** - Android test runner with screen recording and artifact collection
- **collect-artifacts.sh** - Analyze and summarize test results
- **find-missing-testids.sh** - Helper to identify components needing testIDs

### 3. Build Tools
- **Makefile** - Convenient commands for running tests
  - `make e2e` - Run tests on iOS (default)
  - `make e2e-ios` - Run tests on iOS
  - `make e2e-android` - Run tests on Android
  - `make e2e-all` - Run tests on both platforms
  - `make artifacts` - Analyze latest results
  - `make clean-artifacts` - Clean old test runs
- **package.json** - Added npm scripts for Maestro
  - `npm run maestro:ios`
  - `npm run maestro:android`
  - `npm run maestro:artifacts`

### 4. Documentation (`docs/`)
- **MAESTRO_SETUP.md** - Complete step-by-step setup guide
- **E2E_TESTING.md** - Comprehensive testing guide with best practices
- **TESTID_CHECKLIST.md** - Implementation checklist for all components

### 5. Test Fixtures (`tests/goldens/`)
- **README.md** - Documentation for golden fixtures
- **test_user_1992.json** - Template for test data (needs real values)

### 6. Configuration
- **.gitignore** - Updated to ignore `.artifacts/` and `.maestro/` directories
- **Directory structure** - Created `e2e/`, `tests/goldens/`, `.artifacts/`

## 🎯 What You Need To Do

### Step 1: Install Maestro (5 minutes)

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH
export PATH="$PATH:$HOME/.maestro/bin"

# Add to ~/.zshrc for persistence
echo 'export PATH="$PATH:$HOME/.maestro/bin"' >> ~/.zshrc

# Verify
maestro --version
```

### Step 2: Verify Simulators/Emulators (2 minutes)

```bash
# Check iOS simulators
xcrun simctl list devices | grep iPhone

# Check Android emulators
emulator -list-avds
```

If needed, update simulator/emulator names in:
- `scripts/e2e-ios.sh` (line 9: `SIMULATOR="iPhone 15"`)
- `scripts/e2e-android.sh` (line 9: `AVD_NAME="Pixel_7_API_35"`)

### Step 3: Add testIDs to Components (30-60 minutes)

This is the most important step. Use the helper script to find components:

```bash
./scripts/find-missing-testids.sh
```

Then add testIDs following `docs/TESTID_CHECKLIST.md`. Priority order:

**P0 - Critical (must have):**
- Onboarding screen: `screen-onboarding`, `btn-get-started`
- Input screen: `screen-input`, `input-name`, `input-birthdate`, `input-birthtime`, `input-location`, `btn-compute-chart`
- Result screen: `screen-result`, `label-hd-type`, `label-star-system`, `radial-chart`, `btn-why`

**P1 - Important:**
- Why screen: `screen-why`, `explanation-text`, `btn-back`
- Error states and validation messages

**P2 - Nice to have:**
- Profile and settings screens
- Advanced features

### Step 4: Create Golden Fixtures (10 minutes)

Run the app manually with test data and capture results:

1. Launch app on simulator
2. Input: `1992-10-03 00:03` in `Attleboro, MA`
3. Capture HD chart results
4. Update `tests/goldens/test_user_1992.json` with real values

### Step 5: Build the App (5 minutes)

```bash
# iOS
cd ios && xcodebuild -scheme S3App -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15' build && cd ..

# Android
cd android && ./gradlew assembleDebug && cd ..
```

### Step 6: Run Your First Test (2 minutes)

```bash
# Run onboarding flow
make e2e-ios FLOW=onboarding

# Review results
make artifacts

# Watch the video
open .artifacts/LATEST/test-run.mp4
```

### Step 7: Iterate and Fix

If tests fail:
1. Watch the video recording
2. Check screenshots in `.artifacts/LATEST/.maestro/`
3. Read logs
4. Fix issues (add testIDs, update flows, fix bugs)
5. Run again

## 📋 Quick Reference

### Running Tests

```bash
# Quick test (onboarding only)
make e2e-ios FLOW=onboarding

# Full journey test
make e2e-ios FLOW=full_journey

# Test on Android
make e2e-android FLOW=full_journey

# Test both platforms
make e2e-all

# Analyze results
make artifacts
```

### Available Flows

- `onboarding` - Basic app launch (fastest)
- `input_chart` - Form input and validation
- `full_journey` - Complete user flow (most comprehensive)
- `moderation` - Content moderation tests

### Artifacts Location

After each test run, artifacts are saved to:
```
.artifacts/TIMESTAMP-PLATFORM/
├── test-run.mp4          # Screen recording
├── results.xml           # JUnit test results
├── .maestro/             # Screenshots and logs
├── system.log            # iOS logs (or logcat.txt for Android)
└── summary.txt           # Test summary
```

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Make code changes
# 2. Quick smoke test
make e2e-ios FLOW=onboarding

# 3. If passes, run full test
make e2e-ios FLOW=full_journey
```

### Before Committing

```bash
# Run all tests
make e2e-all

# Verify results
make artifacts
```

### When Tests Fail

```bash
# 1. Review artifacts
make artifacts

# 2. Watch video
open .artifacts/LATEST/test-run.mp4

# 3. Check screenshots
open .artifacts/LATEST/.maestro/

# 4. Read logs
cat .artifacts/LATEST/summary.txt

# 5. Fix and rerun
make e2e-ios FLOW=onboarding
```

## 🎭 How This Enables Semi-Autonomous Testing

Once set up, this infrastructure allows for rapid iteration:

1. **You run tests** → `make e2e`
2. **Artifacts are generated** → Video, screenshots, logs
3. **I analyze artifacts** → Identify failures and bugs
4. **I fix the code** → Update components, flows, or logic
5. **You run tests again** → `make e2e`
6. **Repeat until green** ✅

This creates a tight feedback loop where:
- You provide "eyes and hands" (running tests, capturing artifacts)
- I provide "brain" (analyzing results, fixing bugs)
- Together we iterate rapidly toward working E2E tests

## 📚 Documentation

- **Setup Guide**: `docs/MAESTRO_SETUP.md` - Step-by-step setup
- **Testing Guide**: `docs/E2E_TESTING.md` - Comprehensive testing guide
- **testID Checklist**: `docs/TESTID_CHECKLIST.md` - Implementation checklist
- **Flow Reference**: `e2e/README.md` - Quick flow reference

## 🚀 Next Steps

1. ✅ Infrastructure created (done!)
2. ⏳ Install Maestro
3. ⏳ Add testIDs to components
4. ⏳ Create golden fixtures
5. ⏳ Run first test
6. ⏳ Iterate and fix
7. ⏳ Add to CI/CD

## 💡 Tips

- Start with `onboarding` flow (simplest)
- Add testIDs incrementally (P0 → P1 → P2)
- Run tests frequently during development
- Keep artifacts for debugging
- Update flows as UI changes
- Create new flows for new features

## 🆘 Getting Help

If you get stuck:
1. Check `docs/MAESTRO_SETUP.md` for troubleshooting
2. Run `./scripts/find-missing-testids.sh` to find issues
3. Review video recordings to see what happened
4. Share artifacts with me for analysis

## 🎉 Benefits

Once fully set up, you'll have:
- ✅ Automated E2E testing
- ✅ Video recordings of test runs
- ✅ Screenshot documentation
- ✅ Deterministic test cases (golden fixtures)
- ✅ Fast feedback loop
- ✅ Confidence in deployments
- ✅ Regression prevention
- ✅ Semi-autonomous bug fixing

---

**Ready to start?** Follow `docs/MAESTRO_SETUP.md` for detailed instructions!
