# E2E Testing with Maestro

This document describes the E2E testing setup for Star System Sorter using Maestro.

## Overview

Maestro is a mobile UI testing framework that allows us to:
- Write declarative test flows in YAML
- Run tests on iOS simulators and Android emulators
- Capture screenshots, videos, and logs
- Verify UI behavior without manual testing

## Directory Structure

```
star-system-sorter/
├── e2e/
│   └── flows/              # Maestro test flows
│       ├── onboarding.yaml
│       ├── input_chart.yaml
│       ├── full_journey.yaml
│       └── moderation.yaml
├── tests/
│   └── goldens/            # Expected test results
│       ├── README.md
│       └── test_user_1992.json
├── scripts/
│   ├── e2e-ios.sh         # iOS test runner
│   ├── e2e-android.sh     # Android test runner
│   └── collect-artifacts.sh
├── .artifacts/             # Test run artifacts (gitignored)
└── Makefile               # Convenient test commands
```

## Prerequisites

### 1. Install Maestro

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH:$HOME/.maestro/bin"
```

Verify installation:
```bash
maestro --version
```

### 2. iOS Setup

Ensure you have:
- Xcode installed
- iOS simulator available
- App built for simulator

Check available simulators:
```bash
xcrun simctl list devices | grep iPhone
```

### 3. Android Setup

Ensure you have:
- Android Studio installed
- Android emulator configured
- App built for emulator

Check available emulators:
```bash
emulator -list-avds
```

## Running Tests

### Quick Start

```bash
# Run default flow on iOS
make e2e

# Run specific flow on iOS
make e2e-ios FLOW=onboarding

# Run on Android
make e2e-android FLOW=input_chart

# Run on both platforms
make e2e-all

# Analyze latest results
make artifacts
```

### Manual Execution

```bash
# iOS
./scripts/e2e-ios.sh full_journey

# Android
./scripts/e2e-android.sh full_journey
```

## Test Flows

### 1. Onboarding (`onboarding.yaml`)
- Verifies app launches
- Tests basic navigation
- Checks onboarding screen elements

### 2. Input Chart (`input_chart.yaml`)
- Tests birth data input form
- Verifies form validation
- Checks chart generation

### 3. Full Journey (`full_journey.yaml`)
- Complete user flow from onboarding to results
- Tests navigation between screens
- Verifies all major features

### 4. Moderation (`moderation.yaml`)
- Tests content moderation system
- Verifies blocked content handling
- Checks error messages

## Test Artifacts

After each test run, artifacts are saved to `.artifacts/TIMESTAMP-PLATFORM/`:

- `test-run.mp4` - Screen recording of the test
- `results.xml` - JUnit test results
- `.maestro/` - Screenshots and Maestro logs
- `system.log` or `logcat.txt` - Platform logs
- `summary.txt` - Test run summary

### Viewing Artifacts

```bash
# Analyze latest run
make artifacts

# Open video
open .artifacts/LATEST/test-run.mp4

# View results
cat .artifacts/LATEST/results.xml

# Browse screenshots
open .artifacts/LATEST/.maestro/
```

## Adding testIDs to Components

For Maestro to interact with UI elements, components need `testID` props.

### React Native Components

```tsx
// Button
<Button testID="btn-get-started" onPress={handlePress}>
  Get Started
</Button>

// Text Input
<TextInput
  testID="input-name"
  placeholder="Your name"
  value={name}
  onChangeText={setName}
/>

// Text/Label
<Text testID="label-hd-type">{hdType}</Text>

// View/Screen
<View testID="screen-result">
  {/* content */}
</View>
```

### testID Naming Convention

Use kebab-case with prefixes:
- `screen-*` - Screen containers
- `btn-*` - Buttons and tappable elements
- `input-*` - Text inputs and form fields
- `label-*` - Text labels and display elements
- `modal-*` - Modals and overlays
- `list-*` - Lists and scrollable content

Examples:
- `screen-onboarding`
- `btn-compute-chart`
- `input-birthdate`
- `label-star-system`
- `modal-timezone-picker`

## Required testIDs

### Onboarding Screen
- `screen-onboarding` - Screen container
- `btn-get-started` - Get started button

### Input Screen
- `screen-input` - Screen container
- `input-name` - Name input field
- `input-birthdate` - Birth date input
- `input-birthtime` - Birth time input
- `input-location` - Location input
- `btn-compute-chart` - Submit button

### Result Screen
- `screen-result` - Screen container
- `label-hd-type` - HD type display
- `label-star-system` - Star system display
- `radial-chart` - Chart visualization
- `btn-why` - Why button

### Why Screen
- `screen-why` - Screen container
- `explanation-text` - Explanation content
- `btn-back` - Back button

## Golden Fixtures

Golden fixtures provide expected results for test cases. They ensure:
1. HD chart API integration works correctly
2. Star system scoring is deterministic
3. UI displays correct information

### Creating Golden Fixtures

1. Run the app manually with specific birth data
2. Capture the HD chart results
3. Note the star system classification
4. Save as JSON in `tests/goldens/`

See `tests/goldens/README.md` for format details.

## Troubleshooting

### Maestro Not Found
```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH
export PATH="$PATH:$HOME/.maestro/bin"

# Add to shell profile
echo 'export PATH="$PATH:$HOME/.maestro/bin"' >> ~/.zshrc
```

### Simulator Not Booting
```bash
# List simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 15"

# Reset simulator if needed
xcrun simctl erase "iPhone 15"
```

### Emulator Not Starting
```bash
# List emulators
emulator -list-avds

# Start emulator manually
emulator -avd Pixel_7_API_35 -no-snapshot-load
```

### App Not Found
```bash
# Rebuild iOS
cd ios && xcodebuild -scheme S3App -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15' build

# Rebuild Android
cd android && ./gradlew assembleDebug
```

### Test Timing Out
- Increase timeout in flow YAML: `timeout: 15000`
- Check if app is actually launching
- Verify testIDs match component props
- Review video recording to see what happened

### Element Not Found
- Verify testID is set on component
- Check for typos in flow YAML
- Ensure element is visible (not hidden/conditional)
- Use `assertVisible` with longer timeout

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash
      - name: Build iOS
        run: cd ios && xcodebuild -scheme S3App -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15' build
      - name: Run E2E Tests
        run: make e2e-ios
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-artifacts
          path: .artifacts/
```

## Best Practices

1. **Keep flows atomic** - Test one feature per flow
2. **Use descriptive testIDs** - Make them easy to understand
3. **Add timeouts** - For async operations
4. **Capture artifacts** - Always record video and logs
5. **Use golden fixtures** - For deterministic verification
6. **Run locally first** - Before pushing to CI
7. **Clean artifacts** - Use `make clean-artifacts` regularly

## Next Steps

1. Add testIDs to all screens and components
2. Create golden fixtures for known test cases
3. Run tests manually to verify setup
4. Integrate into CI/CD pipeline
5. Add more test flows as features are added
