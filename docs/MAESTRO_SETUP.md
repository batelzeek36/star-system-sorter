# Maestro E2E Testing Setup Guide

Complete step-by-step guide to set up and run Maestro E2E tests for Star System Sorter.

## What Has Been Created

The following infrastructure is now in place:

### Test Flows (`e2e/flows/`)
- ✅ `onboarding.yaml` - Basic app launch and navigation
- ✅ `input_chart.yaml` - Birth data input flow
- ✅ `full_journey.yaml` - Complete user journey
- ✅ `moderation.yaml` - Content moderation tests

### Scripts (`scripts/`)
- ✅ `e2e-ios.sh` - iOS test runner with video recording
- ✅ `e2e-android.sh` - Android test runner with video recording
- ✅ `collect-artifacts.sh` - Artifact analysis tool
- ✅ `find-missing-testids.sh` - Helper to find components needing testIDs

### Documentation (`docs/`)
- ✅ `E2E_TESTING.md` - Complete testing guide
- ✅ `TESTID_CHECKLIST.md` - Implementation checklist
- ✅ `MAESTRO_SETUP.md` - This file

### Build Tools
- ✅ `Makefile` - Convenient test commands
- ✅ `.gitignore` - Updated to ignore test artifacts

### Test Fixtures (`tests/goldens/`)
- ✅ `README.md` - Golden fixture documentation
- ✅ `test_user_1992.json` - Template for test data

## What You Need To Do

### Step 1: Install Maestro

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH (add this to ~/.zshrc for persistence)
export PATH="$PATH:$HOME/.maestro/bin"

# Verify installation
maestro --version
```

Expected output: `maestro X.X.X`

### Step 2: Verify Simulators/Emulators

#### iOS Simulator

```bash
# List available simulators
xcrun simctl list devices | grep iPhone

# You should see something like:
#   iPhone 15 (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) (Shutdown)
```

If you don't have iPhone 15, edit `scripts/e2e-ios.sh` and change the `SIMULATOR` variable to match an available device.

#### Android Emulator

```bash
# List available emulators
emulator -list-avds

# You should see something like:
#   Pixel_7_API_35
```

If you don't have this emulator, edit `scripts/e2e-android.sh` and change the `AVD_NAME` variable to match an available device.

### Step 3: Add testIDs to Components

This is the most important step. Maestro needs testIDs to interact with UI elements.

#### Find components that need testIDs:

```bash
./scripts/find-missing-testids.sh
```

#### Add testIDs to your components:

See `docs/TESTID_CHECKLIST.md` for the complete list of required testIDs.

Example changes needed:

```tsx
// src/screens/OnboardingScreen.tsx
export function OnboardingScreen() {
  return (
    <View testID="screen-onboarding">
      <Text>Star System Sorter</Text>
      <Button testID="btn-get-started" onPress={handleStart}>
        Get Started
      </Button>
    </View>
  );
}

// src/screens/InputScreen.tsx
export function InputScreen() {
  return (
    <View testID="screen-input">
      <TextInput
        testID="input-name"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        testID="input-birthdate"
        placeholder="Birth date"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <Button testID="btn-compute-chart" onPress={handleSubmit}>
        Compute Chart
      </Button>
    </View>
  );
}

// src/screens/ResultScreen.tsx
export function ResultScreen() {
  return (
    <View testID="screen-result">
      <Text testID="label-hd-type">{hdType}</Text>
      <Text testID="label-star-system">{starSystem}</Text>
      <RadialChart testID="radial-chart" data={chartData} />
      <Button testID="btn-why" onPress={handleWhy}>
        Why This Result?
      </Button>
    </View>
  );
}
```

### Step 4: Create Golden Fixtures

Golden fixtures are expected results for test cases. They ensure deterministic testing.

#### Run the app manually:

1. Launch the app on simulator/emulator
2. Input known birth data: `1992-10-03 00:03` in `Attleboro, MA`
3. Capture the HD chart results
4. Note the star system classification

#### Update the golden fixture:

Edit `tests/goldens/test_user_1992.json` and replace the TODO placeholders with actual values:

```json
{
  "description": "Test case for known birth data - Manifesting Generator",
  "input": {
    "name": "Test User",
    "birthDate": "1992-10-03",
    "birthTime": "00:03",
    "location": "Attleboro, MA",
    "timezone": "America/New_York"
  },
  "expected": {
    "hdType": "Manifesting Generator",
    "profile": "3/5",
    "authority": "Sacral",
    "channels": ["32-54", "29-46"],
    "gates": [13, 33, 54],
    "starSystem": {
      "primary": "Orion",
      "secondary": "Osirian"
    },
    "reasoning": ["Gate54→Ambition", "Gate13→Prodigal"]
  }
}
```

### Step 5: Build the App

#### iOS:

```bash
cd ios
xcodebuild -scheme S3App -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15' build
cd ..
```

#### Android:

```bash
cd android
./gradlew assembleDebug
cd ..
```

### Step 6: Run Your First Test

```bash
# Run the onboarding flow on iOS
make e2e-ios FLOW=onboarding
```

This will:
1. Boot the iOS simulator
2. Start screen recording
3. Run the Maestro flow
4. Save artifacts to `.artifacts/TIMESTAMP-ios/`

### Step 7: Review Results

```bash
# Analyze the test results
make artifacts

# Open the video recording
open .artifacts/LATEST/test-run.mp4

# View test results
cat .artifacts/LATEST/results.xml

# Browse screenshots
open .artifacts/LATEST/.maestro/
```

### Step 8: Iterate and Fix

If tests fail:

1. **Review the video** - See what actually happened
2. **Check screenshots** - Identify UI issues
3. **Read logs** - Find errors
4. **Fix the issue** - Update code or tests
5. **Run again** - `make e2e-ios FLOW=onboarding`

Common issues:
- **Element not found**: Add missing testID
- **Timeout**: Increase timeout in flow YAML
- **Wrong text**: Update assertion in flow
- **App crash**: Check logs for errors

## Testing Workflow

### Development Workflow

```bash
# 1. Make code changes
# 2. Run quick test
make e2e-ios FLOW=onboarding

# 3. If it passes, run full suite
make e2e-ios FLOW=full_journey

# 4. Test on Android too
make e2e-android FLOW=full_journey

# 5. Review artifacts
make artifacts
```

### Before Committing

```bash
# Run all tests on both platforms
make e2e-all

# Verify all passed
make artifacts
```

### Continuous Integration

Add to your CI pipeline (GitHub Actions, etc.):

```yaml
- name: Run E2E Tests
  run: make e2e-ios
- name: Upload Artifacts
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: e2e-artifacts
    path: .artifacts/
```

## Available Commands

```bash
# Show help
make help

# Run E2E tests (iOS by default)
make e2e

# Run on specific platform
make e2e-ios
make e2e-android

# Run specific flow
make e2e-ios FLOW=onboarding
make e2e-ios FLOW=input_chart
make e2e-ios FLOW=full_journey
make e2e-ios FLOW=moderation

# Run on both platforms
make e2e-all

# Analyze latest results
make artifacts

# Clean old artifacts (keep last 5)
make clean-artifacts

# Find components missing testIDs
./scripts/find-missing-testids.sh
```

## Next Steps

1. ✅ Install Maestro
2. ✅ Verify simulators/emulators
3. ⏳ Add testIDs to all components (see `docs/TESTID_CHECKLIST.md`)
4. ⏳ Create golden fixtures with real data
5. ⏳ Build the app
6. ⏳ Run first test
7. ⏳ Iterate and fix issues
8. ⏳ Add more test flows as needed

## Getting Help

- **Maestro Docs**: https://maestro.mobile.dev/
- **testID Guide**: `docs/TESTID_CHECKLIST.md`
- **Testing Guide**: `docs/E2E_TESTING.md`
- **Find missing testIDs**: `./scripts/find-missing-testids.sh`

## Troubleshooting

See `docs/E2E_TESTING.md` for detailed troubleshooting steps.

Quick fixes:
- Maestro not found: Add to PATH
- Simulator won't boot: Reset with `xcrun simctl erase "iPhone 15"`
- Element not found: Add testID to component
- Test timeout: Increase timeout in flow YAML
- App won't launch: Rebuild with xcodebuild/gradlew
