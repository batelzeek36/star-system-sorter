# Navigation Setup

## Overview

React Navigation is configured using native-stack navigator for optimal performance on both iOS and Android.

## Structure

```
src/navigation/
├── types.ts           # TypeScript type definitions
├── RootNavigator.tsx  # Main navigation stack
├── linking.ts         # Deep linking configuration
└── index.ts           # Public API
```

## Routes

The app includes the following routes:

### Core Flow
- **Onboarding** - Welcome screen (no header)
- **Input** - Birth data entry form
- **Result** - Star system classification results
- **Why** - Explanation of classification reasoning

### Profile & Settings
- **Profile** - User profile display
- **Settings** - App preferences

### Game Flow
- **GameHub** - Entry point to games and events
- **TeamSelect** - Choose star system team
- **Lobby** - Pre-game setup
- **SuperDash** - Flutter game (landscape, no header)
- **MatchResult** - Game results and validation
- **Leaderboard** - Team rankings

## Type Safety

Navigation is fully typed using TypeScript. The `RootStackParamList` type defines all routes and their parameters.

### Usage in Screens

When implementing screens in later tasks, use the navigation and route props:

```typescript
import {useNavigation, useRoute} from '@react-navigation/native';
import type {ScreenProps} from '@/navigation';

type Props = ScreenProps<'Result'>;

export function ResultScreen() {
  const navigation = useNavigation<Props['navigation']>();
  const route = useRoute<Props['route']>();
  
  // Access params
  const {classification, percentage} = route.params;
  
  // Navigate
  navigation.navigate('Why', {contributorsPerSystem, percentages});
}
```

## Deep Linking

Deep linking is configured with the following URL schemes:
- `s3://` - Custom scheme
- `starsystemsorter://` - Alternative scheme

### Examples
- `s3://onboarding` - Opens onboarding screen
- `s3://game/lobby` - Opens game lobby
- `s3://result` - Opens result screen

## Performance

Native-stack navigator is used instead of stack navigator for:
- Better performance (native animations)
- Lower memory usage
- Smoother transitions
- Native gesture handling

## Configuration

### Screen Options

Default screen options are set in `RootNavigator.tsx`:
- Header shown by default
- Back button visible
- Slide from right animation
- White background

Individual screens can override these options as needed.

### Orientation

Most screens use portrait orientation. The SuperDash game screen is locked to landscape mode.

## Next Steps

Placeholder screens have been created for all routes. These will be implemented in tasks 7.x and 8.x with full functionality.
