# E2E Test Flows

This directory contains Maestro test flows for Star System Sorter.

## Quick Start

```bash
# Install Maestro (one time)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run tests
make e2e                    # iOS (default)
make e2e-android            # Android
make e2e-all                # Both platforms

# Analyze results
make artifacts
```

## Available Flows

### `onboarding.yaml` ✅
Basic app launch and navigation test.
- Verifies app launches successfully
- Tests onboarding screen elements (logo, tagline, steps)
- Checks disclaimer visibility
- Verifies navigation to input screen

**Run:** `make e2e-ios FLOW=onboarding`

**Coverage:**
- App launch and initialization
- Onboarding screen UI elements
- Begin Sorting button interaction
- Navigation to Input screen

### `input_chart.yaml` ✅
Birth data input and chart generation.
- Tests form field visibility and interaction
- Verifies input validation (date, time, location formats)
- Tests chart computation flow
- Checks result screen navigation and display

**Run:** `make e2e-ios FLOW=input_chart`

**Coverage:**
- Form field inputs (date, time, location, timezone)
- Compute Chart button interaction
- Toast notification display
- Result screen navigation
- Result elements verification

### `full_journey.yaml` ✅
Complete user journey from start to finish.
- Onboarding → Input → Result → Why
- Tests all major features end-to-end
- Verifies complete navigation flow
- Uses known test data for deterministic results

**Run:** `make e2e-ios FLOW=full_journey`

**Coverage:**
- Complete user journey (4 screens)
- Birth data input with test case (1992-10-03 00:03, Attleboro MA)
- Chart computation and classification
- Result display with radial chart and allies
- Why screen with contributors
- Back navigation

### `moderation.yaml` ✅
Input validation and error handling tests.
- Tests invalid date formats
- Tests invalid time formats
- Tests invalid location characters
- Verifies required field validation
- Tests successful submission with valid data

**Run:** `make e2e-ios FLOW=moderation`

**Coverage:**
- Date format validation (MM/DD/YYYY)
- Time format validation (HH:MM AM/PM)
- Location character validation
- Required field validation
- Error message display
- Valid input submission

## Flow Syntax

Maestro flows are written in YAML. Basic commands:

```yaml
# Launch app
- launchApp

# Tap on element
- tapOn:
    id: "btn-get-started"

# Input text
- inputText: "Test User"

# Assert element is visible
- assertVisible:
    id: "screen-result"
    timeout: 10000

# Assert text is visible
- assertVisible:
    text: "Star System Sorter"

# Clear text input
- clearText

# Scroll
- scroll

# Wait
- waitForAnimationToEnd
```

## Creating New Flows

1. Create new YAML file in this directory
2. Start with `appId: com.s3app`
3. Add test steps
4. Run with `maestro test e2e/flows/your-flow.yaml`

Example:

```yaml
appId: com.s3app
---
- launchApp
- assertVisible:
    id: "screen-onboarding"
- tapOn:
    id: "btn-get-started"
```

## testID Requirements

All interactive elements need testIDs. See `docs/TESTID_CHECKLIST.md` for the complete list.

Required testIDs:
- `screen-*` - Screen containers
- `btn-*` - Buttons
- `input-*` - Text inputs
- `label-*` - Labels and text displays

## Documentation

- **Setup Guide**: `docs/MAESTRO_SETUP.md`
- **Testing Guide**: `docs/E2E_TESTING.md`
- **testID Checklist**: `docs/TESTID_CHECKLIST.md`

## Troubleshooting

**Element not found:**
- Add testID to component
- Check for typos in flow
- Verify element is visible

**Test timeout:**
- Increase timeout value
- Check if app is launching
- Review video recording

**App won't launch:**
- Rebuild app
- Check simulator/emulator
- Verify app ID matches

For more help, see `docs/E2E_TESTING.md`.
