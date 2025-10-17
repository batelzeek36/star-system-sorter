# E2E Testing Quick Start

## Prerequisites

1. **Maestro installed:**

   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   export PATH="$PATH:$HOME/.maestro/bin"
   ```

2. **Metro bundler running:**

   ```bash
   # Start Metro in a separate terminal
   npm start
   ```

3. **App running on simulator/emulator:**

   ```bash
   # In another terminal, launch the app
   # iOS
   npm run ios

   # Android
   npm run android
   ```

**Important Notes:**

- Keep Metro running in the background while running E2E tests
- Run tests for one platform at a time (iOS or Android, not both simultaneously)
- If both simulators are running, Maestro will default to Android

## Running Tests

### Quick Commands

```bash
# Run all flows on iOS (default)
make e2e

# Run specific flow
make e2e-ios FLOW=onboarding
make e2e-ios FLOW=input_chart
make e2e-ios FLOW=full_journey
make e2e-ios FLOW=moderation

# Run on Android
make e2e-android FLOW=onboarding

# Run on both platforms
make e2e-all
```

### Manual Execution

```bash
# iOS
./scripts/e2e-ios.sh onboarding
./scripts/e2e-ios.sh input_chart
./scripts/e2e-ios.sh full_journey
./scripts/e2e-ios.sh moderation

# Android
./scripts/e2e-android.sh onboarding
```

## Test Flows

### 1. Onboarding Flow (30 seconds)

Tests app launch and basic navigation.

```bash
make e2e-ios FLOW=onboarding
```

**What it tests:**

- App launches successfully
- Onboarding screen displays correctly
- Begin Sorting button works
- Navigation to input screen

### 2. Input Chart Flow (60 seconds)

Tests form input and chart generation.

```bash
make e2e-ios FLOW=input_chart
```

**What it tests:**

- Form fields accept input
- Validation works correctly
- Chart computation succeeds
- Result screen displays

### 3. Full Journey Flow (90 seconds)

Complete end-to-end user journey.

```bash
make e2e-ios FLOW=full_journey
```

**What it tests:**

- Onboarding → Input → Result → Why
- All navigation flows
- Complete feature set
- Back navigation

### 4. Moderation Flow (45 seconds)

Tests input validation and error handling.

```bash
make e2e-ios FLOW=moderation
```

**What it tests:**

- Invalid date format detection
- Invalid time format detection
- Invalid location characters
- Required field validation
- Error message display

## Viewing Results

### Analyze Latest Run

```bash
make artifacts
```

This will show:

- Test results summary
- Video recording location
- Screenshots directory
- Log files

### Open Video Recording

```bash
open .artifacts/LATEST/test-run.mp4
```

### View Test Results

```bash
cat .artifacts/LATEST/results.xml
```

### Browse Screenshots

```bash
open .artifacts/LATEST/.maestro/
```

## Troubleshooting

### Maestro Not Found

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH
export PATH="$PATH:$HOME/.maestro/bin"

# Verify installation
maestro --version
```

### Simulator Not Running

```bash
# List available simulators
xcrun simctl list devices | grep iPhone

# Boot simulator
xcrun simctl boot "iPhone 15"
```

### App Not Installed

```bash
# Rebuild and install
npm run ios
# or
npm run android
```

### Element Not Found

1. Check testID matches component implementation
2. Verify element is visible (not hidden)
3. Increase timeout in flow YAML
4. Review video recording to see what happened

### Test Timeout

1. Check if app is launching
2. Verify network connectivity
3. Review video to see where it got stuck
4. Increase timeout in flow YAML

## Test Data

All flows use this test case for consistency:

**Birth Data:**

- Date: 10/03/1992 (MM/DD/YYYY)
- Time: 12:03 AM (HH:MM AM/PM)
- Location: Attleboro, MA
- Timezone: America/New_York (auto-detected)

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
        run: |
          curl -Ls "https://get.maestro.mobile.dev" | bash
          echo "$HOME/.maestro/bin" >> $GITHUB_PATH

      - name: Install Dependencies
        run: npm ci

      - name: Build iOS
        run: npm run ios -- --configuration Release

      - name: Run E2E Tests
        run: make e2e-ios

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-artifacts
          path: .artifacts/
```

## Next Steps

1. ✅ Run onboarding flow to verify setup
2. ✅ Run input_chart flow to test form
3. ✅ Run full_journey flow for complete test
4. ✅ Run moderation flow for validation
5. ⏳ Add flows to CI/CD pipeline
6. ⏳ Create golden fixtures for deterministic testing

## Documentation

- **Setup Guide:** `docs/MAESTRO_SETUP.md`
- **Testing Guide:** `docs/E2E_TESTING.md`
- **testID Checklist:** `docs/TESTID_CHECKLIST.md`
- **Flow Details:** `e2e/README.md`
- **Implementation:** `.artifacts/e2e-flows-implementation.md`

## Support

For issues or questions:

1. Check video recording to see what happened
2. Review logs in `.artifacts/LATEST/`
3. Verify testIDs match component implementation
4. See troubleshooting section above
5. Consult documentation in `docs/`
