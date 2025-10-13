# Migration Guide: Using React Native UI Components

This guide helps you migrate existing screens to use the new React Native UI components.

## Import Changes

### Before (web components)
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
```

### After (React Native components)
```tsx
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle } from '@/components/ui';
```

## Component API Differences

### Button

**Web (shadcn/ui):**
```tsx
<Button variant="default" size="default">
  Click me
</Button>
```

**React Native (adapted):**
```tsx
<Button variant="default" size="default" onPress={handlePress}>
  Click me
</Button>
```

**Key differences:**
- Use `onPress` instead of `onClick`
- Use `loading` prop instead of `disabled` with spinner
- No `asChild` prop (not applicable in React Native)

### Input

**Web (shadcn/ui):**
```tsx
<Input
  type="text"
  placeholder="Enter text"
  className="custom-class"
/>
```

**React Native (adapted):**
```tsx
<Input
  placeholder="Enter text"
  keyboardType="default"
  style={customStyle}
  error={!!errors.field}
/>
```

**Key differences:**
- Use `keyboardType` instead of `type`
- Use `style` instead of `className`
- Use `error` boolean prop for error state
- Use `onChangeText` instead of `onChange`

### Form

**Web (shadcn/ui):**
```tsx
<FormField
  control={form.control}
  name="field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**React Native (adapted):**
```tsx
<FormField
  control={form.control}
  name="field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Key differences:**
- Explicitly pass `value`, `onChangeText`, and `onBlur` to Input
- Cannot spread `{...field}` directly due to React Native differences

## Styling

### Web (Tailwind CSS)
```tsx
<Button className="mt-4 bg-blue-500">
  Click me
</Button>
```

### React Native (StyleSheet)
```tsx
<Button style={{ marginTop: 16, backgroundColor: '#3B82F6' }}>
  Click me
</Button>
```

**Key differences:**
- Use StyleSheet or inline styles instead of className
- Use numeric values for spacing (4px increments)
- Use hex/rgb colors instead of Tailwind color names
- Reference design tokens from `theme.ts`

## Common Patterns

### Card with Content

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Text>Content goes here</Text>
  </CardContent>
</Card>
```

### Form with Validation

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

const form = useForm({
  resolver: zodResolver(schema),
});

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            placeholder="email@example.com"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Button with Loading State

```tsx
import { Button } from '@/components/ui';
import { useState } from 'react';

const [loading, setLoading] = useState(false);

<Button
  loading={loading}
  onPress={async () => {
    setLoading(true);
    await doSomething();
    setLoading(false);
  }}
>
  Submit
</Button>
```

## Accessibility

All components support React Native accessibility props:

```tsx
<Button
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the form data"
  accessibilityRole="button"
  onPress={handleSubmit}
>
  Submit
</Button>

<Input
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email address"
  placeholder="email@example.com"
/>
```

## Design Tokens

Use design tokens from `theme.ts` for consistent styling:

```tsx
import { colors, radius, spacing, fontSizes } from '@/components/ui/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  text: {
    color: colors.foreground,
    fontSize: fontSizes.base,
  },
});
```

## Testing

Components work with React Native Testing Library:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui';

test('button calls onPress', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button onPress={onPress}>Click me</Button>
  );
  
  fireEvent.press(getByText('Click me'));
  expect(onPress).toHaveBeenCalled();
});
```

## Next Steps

1. Review the `examples.tsx` file for complete usage examples
2. Check the `README.md` for full component documentation
3. Use design tokens from `theme.ts` for consistent styling
4. Add accessibility props to all interactive components
5. Test components on both iOS and Android
