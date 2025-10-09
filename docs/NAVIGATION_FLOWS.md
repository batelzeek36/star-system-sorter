# Navigation Flows

## Visual Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        Star System Sorter                        │
│                     Navigation Architecture                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Onboarding  │ (Initial Screen)
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
   ┌───────┐      ┌──────────┐
   │ Input │      │ GameHub  │
   └───┬───┘      └────┬─────┘
       │               │
       │               ├──────────────┐
       │               │              │
       ▼               ▼              ▼
   ┌────────┐    ┌────────────┐  ┌─────────────┐
   │ Result │    │ TeamSelect │  │ Leaderboard │
   └───┬────┘    └─────┬──────┘  └──────▲──────┘
       │               │                 │
       ├───────┐       ▼                 │
       │       │   ┌───────┐             │
       ▼       │   │ Lobby │             │
   ┌──────┐   │   └───┬───┘             │
   │ Why  │   │       │                 │
   └──────┘   │       ▼                 │
              │   ┌───────────┐         │
              │   │ SuperDash │         │
              │   └─────┬─────┘         │
              │         │               │
              │         ▼               │
              │   ┌─────────────┐      │
              │   │ MatchResult │──────┘
              │   └─────────────┘
              │
              ▼
          ┌─────────┐
          │ Profile │
          └────┬────┘
               │
               ▼
          ┌──────────┐
          │ Settings │
          └──────────┘
```

## Flow Descriptions

### 1. Classification Flow (Primary User Journey)

**Path**: Onboarding → Input → Result → Why → Profile

**Purpose**: User enters birth data and receives star system classification

**Steps**:
1. **Onboarding**: Welcome screen with app introduction
2. **Input**: Form for birth date, time, and location
3. **Result**: Display classification with primary system and allies
4. **Why**: Explain reasoning behind classification
5. **Profile**: View saved profile and classification history

**Parameters Passed**:
- Input → Result: `{classification, primary, hybrid, percentage, allies}`
- Result → Why: `{contributorsPerSystem, percentages}`

### 2. Game Flow (Competitive Journey)

**Path**: Onboarding → GameHub → TeamSelect → Lobby → SuperDash → MatchResult → Leaderboard

**Purpose**: User plays Super Dash game and competes on team leaderboards

**Steps**:
1. **GameHub**: View available events and start game
2. **TeamSelect**: Choose star system team
3. **Lobby**: Pre-game setup and information
4. **SuperDash**: Play the game (Flutter module)
5. **MatchResult**: View game results and validation
6. **Leaderboard**: See team rankings

**Parameters Passed**:
- GameHub → TeamSelect: `{eventId}`
- TeamSelect → Lobby: `{eventId, teamId, seed}`
- Lobby → SuperDash: `{eventId, teamId, seed}`
- SuperDash → MatchResult: `{score, validated, suspect, metrics}`
- MatchResult → Leaderboard: `{eventId?}`

### 3. Settings Flow

**Path**: Profile → Settings

**Purpose**: User manages app preferences

**Steps**:
1. **Profile**: View user information
2. **Settings**: Configure app preferences

## Navigation Patterns

### Forward Navigation
- Uses `navigation.navigate('ScreenName', params)`
- Adds screen to stack
- Back button returns to previous screen

### Replace Navigation
- Uses `navigation.replace('ScreenName', params)`
- Replaces current screen (no back)
- Used for: Onboarding → Input (after completion)

### Reset Navigation
- Uses `navigation.reset()`
- Clears entire stack
- Used for: Logout, error recovery

### Modal Navigation
- Uses modal presentation
- Slides up from bottom
- Used for: Settings, dialogs

## Screen Options

### Header Configuration

**Hidden Headers**:
- Onboarding (full-screen welcome)
- SuperDash (game immersion)

**Custom Headers**:
- Result (no back button - prevents returning to Input)
- MatchResult (no back button - prevents returning to game)

**Standard Headers**:
- All other screens use default header with back button

### Orientation Locking

**Landscape Only**:
- SuperDash (game requirement)

**Portrait/Landscape**:
- All other screens (responsive)

## Deep Linking

### URL Scheme
```
s3://screen/params
```

### Supported URLs
- `s3://input` - Go to Input screen
- `s3://result?classification=primary&system=Pleiades` - Show result
- `s3://game?eventId=event_001` - Start game
- `s3://leaderboard?eventId=event_001` - View leaderboard

### Configuration
Deep linking is configured in `src/navigation/linking.ts`

## Error Handling

### Navigation Errors
- Caught by NavigationErrorBoundary
- Shows error message with retry option
- Logs error for debugging

### Invalid Parameters
- Validated by TypeScript types
- Runtime validation in screens
- Fallback to safe defaults

### Back Button Behavior

**Android Hardware Back**:
- Standard screens: Navigate back
- SuperDash: Show pause modal (first press), quit (second press)
- Root screen: Exit app confirmation

**iOS Swipe Back**:
- Enabled on all screens except Result and MatchResult
- Smooth gesture animation

## Accessibility

### Screen Reader Support
- All navigation actions have labels
- Screen titles announced on navigation
- Focus management on screen change

### Keyboard Navigation
- Tab order follows visual hierarchy
- Enter key activates buttons
- Escape key goes back (where applicable)

## Performance

### Navigation Timing
- Screen transitions: <100ms
- Parameter passing: Immediate
- Stack operations: Optimized

### Memory Management
- Screens unmounted when not visible
- Navigation state persisted
- Efficient re-rendering

## Testing Navigation

### Unit Tests
```typescript
// Test navigation action
const navigation = {navigate: jest.fn()};
handlePress();
expect(navigation.navigate).toHaveBeenCalledWith('Result', params);
```

### Integration Tests
```typescript
// Test navigation flow
render(<App />);
fireEvent.press(screen.getByText('Get Started'));
expect(screen.getByText('Input Screen')).toBeVisible();
```

### E2E Tests (Detox)
```typescript
// Test complete flow
await element(by.text('Get Started')).tap();
await element(by.text('Submit')).tap();
await expect(element(by.text('Your Star System'))).toBeVisible();
```

## Next Steps

1. **Implement Screen Content** (Tasks 7.x, 8.x)
   - Replace placeholders with real UI
   - Add forms, components, and data handling

2. **Add Navigation Guards** (Already done in 11.1)
   - Validate navigation conditions
   - Prevent invalid navigation

3. **Test on Devices**
   - Android: Test back button, deep links
   - iOS: Test swipe gestures, safe areas

4. **E2E Testing** (Task 14.x)
   - Test complete user journeys
   - Verify navigation on both platforms
