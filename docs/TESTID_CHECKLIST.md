# testID Implementation Checklist

This document tracks the implementation of testIDs across all screens and components for Maestro E2E testing.

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Complete

## Screens

### Onboarding Screen
- [ ] `screen-onboarding` - Main screen container
- [ ] `btn-get-started` - Primary CTA button
- [ ] `text-welcome` - Welcome message
- [ ] `text-description` - App description

### Input Screen
- [ ] `screen-input` - Main screen container
- [ ] `input-name` - Name text input
- [ ] `input-birthdate` - Birth date picker/input
- [ ] `input-birthtime` - Birth time picker/input
- [ ] `input-location` - Location text input
- [ ] `btn-timezone-picker` - Timezone picker button
- [ ] `btn-compute-chart` - Submit/compute button
- [ ] `error-name` - Name validation error
- [ ] `error-birthdate` - Birth date validation error
- [ ] `error-birthtime` - Birth time validation error
- [ ] `error-location` - Location validation error

### Result Screen
- [ ] `screen-result` - Main screen container
- [ ] `label-hd-type` - HD type display (Generator, MG, etc.)
- [ ] `label-profile` - Profile display (1/3, 2/4, etc.)
- [ ] `label-authority` - Authority display
- [ ] `label-star-system` - Star system classification
- [ ] `radial-chart` - Chart visualization component
- [ ] `btn-why` - Why this result button
- [ ] `btn-share` - Share button (if exists)
- [ ] `btn-save` - Save button (if exists)
- [ ] `btn-new-chart` - New chart button

### Why Screen
- [ ] `screen-why` - Main screen container
- [ ] `text-title` - Screen title
- [ ] `explanation-text` - Main explanation content
- [ ] `list-reasoning` - Reasoning points list
- [ ] `btn-back` - Back button
- [ ] `btn-close` - Close button (if modal)

### Profile Screen (if exists)
- [ ] `screen-profile` - Main screen container
- [ ] `list-saved-charts` - Saved charts list
- [ ] `btn-edit-profile` - Edit profile button
- [ ] `btn-settings` - Settings button

### Settings Screen (if exists)
- [ ] `screen-settings` - Main screen container
- [ ] `toggle-notifications` - Notifications toggle
- [ ] `toggle-dark-mode` - Dark mode toggle
- [ ] `btn-clear-data` - Clear data button
- [ ] `btn-about` - About button

## Reusable Components

### RadialChart Component
- [ ] `radial-chart` - Main chart container
- [ ] `chart-svg` - SVG element
- [ ] `chart-legend` - Legend component

### ScoreDisplay Component
- [ ] `score-display` - Main container
- [ ] `score-value` - Score value text
- [ ] `score-label` - Score label text

### StarSystemCrest Component
- [ ] `star-system-crest` - Main container
- [ ] `crest-image` - Crest image/icon
- [ ] `crest-label` - Crest label

### TimeZonePicker Component
- [ ] `timezone-picker` - Main container
- [ ] `timezone-search` - Search input
- [ ] `timezone-list` - Timezone list
- [ ] `timezone-item-*` - Individual timezone items

### Form Components
- [ ] `form-field` - Generic form field wrapper
- [ ] `form-label` - Form field label
- [ ] `form-error` - Form field error message
- [ ] `form-helper` - Form field helper text

### Modal Components
- [ ] `modal-overlay` - Modal overlay
- [ ] `modal-content` - Modal content container
- [ ] `modal-close` - Modal close button

### Loading Components
- [ ] `loading-spinner` - Loading spinner
- [ ] `loading-text` - Loading message

## Navigation

### Navigation Bar
- [ ] `nav-back` - Back button
- [ ] `nav-title` - Screen title
- [ ] `nav-menu` - Menu button

### Tab Bar (if exists)
- [ ] `tab-home` - Home tab
- [ ] `tab-profile` - Profile tab
- [ ] `tab-settings` - Settings tab

## Implementation Guide

### Step 1: Identify Components
```bash
# Find all screen files
find src/screens -name "*.tsx"

# Find all component files
find src/components -name "*.tsx"
```

### Step 2: Add testIDs

For each component, add testID props:

```tsx
// Before
<Button onPress={handlePress}>
  Get Started
</Button>

// After
<Button testID="btn-get-started" onPress={handlePress}>
  Get Started
</Button>
```

### Step 3: Verify in Maestro

Test that testIDs work:

```yaml
- assertVisible:
    id: "btn-get-started"
- tapOn:
    id: "btn-get-started"
```

### Step 4: Update Flows

Update Maestro flows to use the new testIDs.

## Priority Order

1. **Critical Path** (P0) - Must have for basic E2E
   - Onboarding screen
   - Input screen
   - Result screen
   - Primary buttons and inputs

2. **Secondary Features** (P1) - Important for full coverage
   - Why screen
   - Navigation elements
   - Error states

3. **Nice to Have** (P2) - For comprehensive testing
   - Profile screen
   - Settings screen
   - Advanced features

## Verification

After adding testIDs, verify by:

1. Running Maestro flows: `make e2e`
2. Checking for "element not found" errors
3. Reviewing video recordings
4. Updating this checklist

## Notes

- Use kebab-case for all testIDs
- Prefix with component type (btn-, input-, label-, etc.)
- Keep names descriptive and unique
- Document any dynamic testIDs (e.g., list items)
- Update Maestro flows when testIDs change
