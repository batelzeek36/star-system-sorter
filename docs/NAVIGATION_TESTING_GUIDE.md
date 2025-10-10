# Navigation Testing Guide

## Quick Start

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

## Test Scenarios

### Scenario 1: Classification Flow (Primary User Journey)

**Goal**: Test the main user flow from onboarding to classification result

**Steps**:

1. App launches on **Onboarding** screen

   - ✅ Verify: "Star System Sorter" and "S³" titles visible
   - ✅ Verify: "Get Started" and "Game Hub" buttons visible
   - ✅ Verify: Both buttons have 44px minimum height

2. Tap **"Get Started"** button

   - ✅ Verify: Navigates to **Input** screen
   - ✅ Verify: Header shows "Enter Birth Data"
   - ✅ Verify: Back button visible in header

3. On **Input** screen, tap **"Submit (Mock)"** button

   - ✅ Verify: Navigates to **Result** screen
   - ✅ Verify: Header shows "Your Star System"
   - ✅ Verify: No back button (prevents returning to input)
   - ✅ Verify: Classification data displayed:
     - Classification: "primary"
     - Primary System: "Pleiades"
     - Percentage: "67.5%"
     - Allies: "Sirius: 18.2%", "Arcturus: 14.3%"
   - ✅ Verify: Disclaimer text visible at bottom

4. On **Result** screen, tap **"View Why"** button

   - ✅ Verify: Navigates to **Why** screen
   - ✅ Verify: Header shows "Why This System?"
   - ✅ Verify: Back button returns to Result

5. Go back to **Result** screen, tap **"Go to Profile"** button

   - ✅ Verify: Navigates to **Profile** screen
   - ✅ Verify: Header shows "Profile"

6. On **Profile** screen, tap **"Settings"** button
   - ✅ Verify: Navigates to **Settings** screen
   - ✅ Verify: Header shows "Settings"

### Scenario 2: Game Flow (Competitive Journey)

**Goal**: Test the complete game flow from hub to leaderboard

**Steps**:

1. From **Onboarding** screen, tap **"Game Hub"** button

   - ✅ Verify: Navigates to **GameHub** screen
   - ✅ Verify: Header shows "Game Hub"
   - ✅ Verify: "Start Game (Mock)" and "View Leaderboard" buttons visible

2. On **GameHub** screen, tap **"Start Game (Mock)"** button

   - ✅ Verify: Navigates to **TeamSelect** screen
   - ✅ Verify: Header shows "Choose Your Team"
   - ✅ Verify: Three team buttons visible: Pleiades, Sirius, Arcturus

3. On **TeamSelect** screen, tap **"Pleiades (Mock)"** button

   - ✅ Verify: Navigates to **Lobby** screen
   - ✅ Verify: Header shows "Game Lobby"
   - ✅ Verify: Event ID, Team, and Seed displayed
   - ✅ Verify: Team shows "pleiades"

4. On **Lobby** screen, tap **"Start Game"** button

   - ✅ Verify: Navigates to **SuperDash** screen
   - ✅ Verify: No header visible (full screen)
   - ✅ Verify: Black background
   - ✅ Verify: Team and seed info displayed

5. On **SuperDash** screen, tap **"Complete Game (Mock)"** button

   - ✅ Verify: Navigates to **MatchResult** screen
   - ✅ Verify: Header shows "Match Result"
   - ✅ Verify: No back button (prevents returning to game)
   - ✅ Verify: Score displayed: "12,450"
   - ✅ Verify: Validated: "Yes" (in green)
   - ✅ Verify: Metrics displayed: distance, coins, jumps

6. On **MatchResult** screen, tap **"View Leaderboard"** button

   - ✅ Verify: Navigates to **Leaderboard** screen
   - ✅ Verify: Header shows "Leaderboard"
   - ✅ Verify: Mock team rankings displayed
   - ✅ Verify: Three teams with ranks, scores, and run counts

7. Go back to **MatchResult** screen, tap **"Play Again"** button
   - ✅ Verify: Navigates back to **GameHub** screen

### Scenario 3: Direct Leaderboard Access

**Goal**: Test accessing leaderboard directly from game hub

**Steps**:

1. Navigate to **GameHub** screen
2. Tap **"View Leaderboard"** button
   - ✅ Verify: Navigates to **Leaderboard** screen
   - ✅ Verify: Event ID displayed: "event_001"
   - ✅ Verify: Leaderboard data visible

### Scenario 4: Back Button Behavior

**Goal**: Test back button on Android and swipe gestures on iOS

**Android Steps**:

1. Navigate through: Onboarding → Input → Result
2. Press hardware back button
   - ✅ Verify: Nothing happens (Result has no back button)
3. Navigate to Why screen
4. Press hardware back button
   - ✅ Verify: Returns to Result screen
5. Navigate to SuperDash screen
6. Press hardware back button
   - ✅ Verify: Returns to Lobby screen (or shows pause modal when implemented)

**iOS Steps**:

1. Navigate through: Onboarding → Input → Result
2. Swipe from left edge
   - ✅ Verify: Nothing happens (Result has no back button)
3. Navigate to Why screen
4. Swipe from left edge
   - ✅ Verify: Returns to Result screen with smooth animation

## Accessibility Testing

### Screen Reader Testing (Android - TalkBack)

**Enable TalkBack**:

1. Settings → Accessibility → TalkBack → Enable
2. Use two-finger swipe to navigate

**Test Steps**:

1. Navigate to Onboarding screen
2. Swipe right to focus on "Get Started" button
   - ✅ Verify: TalkBack announces "Get Started, button"
3. Double-tap to activate
   - ✅ Verify: Navigates to Input screen
4. Test all interactive elements have proper labels

### Screen Reader Testing (iOS - VoiceOver)

**Enable VoiceOver**:

1. Settings → Accessibility → VoiceOver → Enable
2. Use swipe gestures to navigate

**Test Steps**:

1. Navigate to Onboarding screen
2. Swipe right to focus on "Get Started" button
   - ✅ Verify: VoiceOver announces "Get Started, button"
3. Double-tap to activate
   - ✅ Verify: Navigates to Input screen

### Touch Target Testing

**Test Steps**:

1. On any screen with buttons, try tapping near edges of buttons
   - ✅ Verify: All buttons respond to taps within 44px area
   - ✅ Verify: No accidental taps on adjacent elements

## Performance Testing

### Navigation Speed

**Test Steps**:

1. Navigate between screens rapidly
   - ✅ Verify: Transitions complete in <100ms
   - ✅ Verify: No lag or stuttering
   - ✅ Verify: Smooth animations

### Memory Usage

**Test Steps**:

1. Navigate through all screens multiple times
2. Monitor memory usage in dev tools
   - ✅ Verify: Memory usage stays stable
   - ✅ Verify: No memory leaks
   - ✅ Verify: Screens properly unmounted

## Error Testing

### Invalid Navigation

**Test Steps**:

1. Try to navigate with missing required params (via code)
   - ✅ Verify: TypeScript prevents compilation
   - ✅ Verify: Runtime validation catches errors

### Navigation Errors

**Test Steps**:

1. Simulate navigation error (via code)
   - ✅ Verify: Error boundary catches error
   - ✅ Verify: User sees error message
   - ✅ Verify: Retry option available

## Platform-Specific Testing

### Android-Specific

**Test**:

- [ ] Hardware back button behavior
- [ ] Navigation bar color
- [ ] Status bar color
- [ ] Landscape orientation in SuperDash
- [ ] Deep linking (if configured)

### iOS-Specific

**Test**:

- [ ] Swipe back gestures
- [ ] Navigation bar appearance
- [ ] Status bar appearance
- [ ] Safe area insets (notch devices)
- [ ] Landscape orientation in SuperDash
- [ ] Deep linking (if configured)

## Automated Testing

### Run Unit Tests

```bash
npm test -- __tests__/navigation.test.tsx
```

**Expected**: 9/9 tests passing

### Run Type Checking

```bash
npm run typecheck
```

**Expected**: No type errors

### Run Linting

```bash
npm run lint
```

**Expected**: No linting errors

## Troubleshooting

### Navigation Not Working

**Issue**: Button tap doesn't navigate
**Solution**:

- Check console for errors
- Verify navigation prop is passed correctly
- Ensure screen is registered in RootNavigator

### Parameters Not Received

**Issue**: Screen doesn't receive expected params
**Solution**:

- Check TypeScript types in RootStackParamList
- Verify params are passed in navigate() call
- Check route.params extraction in screen

### Back Button Not Working

**Issue**: Back button doesn't appear or doesn't work
**Solution**:

- Check headerBackVisible in screen options
- Verify screen is not the root screen
- Check if headerShown is false

### Screen Not Found

**Issue**: "Screen not found" error
**Solution**:

- Verify screen is imported in RootNavigator
- Check screen name matches exactly
- Ensure screen is added to Stack.Navigator

## Reporting Issues

When reporting navigation issues, include:

1. Platform (Android/iOS)
2. Device/Emulator details
3. Steps to reproduce
4. Expected behavior
5. Actual behavior
6. Screenshots/videos if possible
7. Console logs

## Next Steps

After verifying navigation:

1. Implement full UI for each screen (Tasks 7.x)
2. Add real data handling and forms
3. Integrate Flutter game bridge (Task 8.4)
4. Run E2E tests with Detox (Task 14.x)
