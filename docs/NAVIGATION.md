# Navigation System

## Overview

Star System Sorter uses React Navigation with native-stack navigator for optimal performance. The navigation system includes route guards, error handling, and deep linking support.

## Architecture

```
App.tsx
└── NavigationErrorBoundary
    └── NavigationContainer
        └── RootNavigator (native-stack)
            ├── Onboarding
            ├── Input
            ├── Result
            ├── Why
            ├── Profile
            └── Settings
```

## Navigation Guards

Guards automatically validate route parameters and prevent navigation with invalid data.

**Protected Routes:**
- `Result`: Requires classification, percentage, allies
- `Why`: Requires contributorsPerSystem, percentages

**Usage:**
```typescript
// Guards are automatically applied
// No additional setup needed in screens
```

## Error Handling

Navigation errors are caught by `NavigationErrorBoundary` and display a user-friendly fallback UI.

**Features:**
- Catches navigation tree errors
- Shows error message with reset button
- Dev-mode error details
- Graceful recovery without crash

## Deep Linking

Supports URL schemes: `s3://` and `starsystemsorter://`

**Examples:**
- `s3://onboarding` → Onboarding screen
- `s3://input` → Input screen
- `s3://result` → Result screen
- `s3://profile` → Profile screen
- `s3://settings` → Settings screen

## Type Safety

All navigation is fully typed with TypeScript:

```typescript
import type {ScreenProps} from '@/navigation';

type Props = ScreenProps<'Result'>;

function ResultScreen({navigation, route}: Props) {
  // route.params is fully typed
  const {classification, percentage, allies} = route.params;
  
  // navigation.navigate is type-safe
  navigation.navigate('Why', {
    contributorsPerSystem: {},
    percentages: {},
  });
}
```

## Screen Options

**Default Options:**
- Header shown by default
- Back button visible
- Slide from right animation
- White background

**Custom Options:**
- `Onboarding`: No header
- `Result`: No back button

## Navigation Methods

**Navigate to screen:**
```typescript
navigation.navigate('ScreenName', {param: value});
```

**Go back:**
```typescript
navigation.goBack();
```

**Replace current screen:**
```typescript
navigation.replace('ScreenName', {param: value});
```

**Reset navigation stack:**
```typescript
navigation.reset({
  index: 0,
  routes: [{name: 'Onboarding'}],
});
```

## Best Practices

1. **Always pass required params**: Guards will warn if params are missing
2. **Use type-safe navigation**: Import `ScreenProps` for full type safety
3. **Handle navigation errors**: Error boundary catches errors automatically
4. **Test navigation flows**: Verify params are passed correctly
5. **Use guards for protection**: Extend guards for custom validation logic

## Extending Guards

Add custom validation in `src/navigation/guards.ts`:

```typescript
function validateRouteParams(routeName: string, params: any): boolean {
  switch (routeName) {
    case 'MyNewScreen':
      if (!params?.requiredParam) {
        console.warn('[Navigation] Invalid params');
        return false;
      }
      break;
  }
  return true;
}
```

## Troubleshooting

**Issue: Navigation params are undefined**
- Check that params are passed when navigating
- Verify param names match type definitions
- Check guards for validation warnings

**Issue: Navigation error boundary shows**
- Check console for error details (dev mode)
- Verify screen components are imported correctly
- Check for errors in screen render methods

**Issue: Deep link not working**
- Verify URL scheme is registered in native config
- Check linking configuration in `src/navigation/linking.ts`
- Test with `npx uri-scheme open s3://screen --ios`

## Files

- `src/navigation/RootNavigator.tsx` - Main navigator configuration
- `src/navigation/types.ts` - TypeScript type definitions
- `src/navigation/guards.ts` - Route validation guards
- `src/navigation/ErrorBoundary.tsx` - Error handling component
- `src/navigation/linking.ts` - Deep linking configuration
- `src/navigation/index.ts` - Public API exports
