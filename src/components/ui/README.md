# React Native UI Components

React Native adaptations of shadcn/ui components, maintaining the same API surface where possible.

## Design Tokens

All components use design tokens from `theme.ts`, which are derived from `globals.css`:

- **Colors**: Background, foreground, primary, secondary, muted, accent, destructive, border
- **Radius**: sm (6px), md (8px), lg (10px), xl (14px)
- **Font Sizes**: xs (12), sm (14), base (16), lg (18), xl (20), 2xl (24), 3xl (30)
- **Font Weights**: normal (400), medium (500), semibold (600), bold (700)
- **Spacing**: 1-12 (4px increments)

## Components

### Button

Touchable button with variants and sizes.

```tsx
import {Button} from '@/components/ui';

<Button variant="default" size="default" onPress={handlePress}>
  Click me
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `loading`: boolean
- All TouchableOpacity props

### Card

Container component with header, content, and footer sections.

```tsx
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer */}
  </CardFooter>
</Card>
```

### Badge

Small label component with variants.

```tsx
import {Badge} from '@/components/ui';

<Badge variant="default">New</Badge>
```

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline'

### Input

Text input with error state.

```tsx
import {Input} from '@/components/ui';

<Input
  placeholder="Enter text"
  error={!!errors.field}
  value={value}
  onChangeText={onChange}
/>
```

**Props:**
- `error`: boolean
- All TextInput props

### Label

Text label for form fields.

```tsx
import {Label} from '@/components/ui';

<Label error={!!errors.field}>Field Name</Label>
```

**Props:**
- `error`: boolean

### Form

Form components for use with react-hook-form.

```tsx
import {Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from '@/components/ui';
import {useForm} from 'react-hook-form';

const form = useForm();

<Form {...form}>
  <FormField
    control={form.control}
    name="field"
    render={({field}) => (
      <FormItem>
        <FormLabel>Field Name</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormDescription>Helper text</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Separator

Horizontal or vertical divider.

```tsx
import {Separator} from '@/components/ui';

<Separator orientation="horizontal" />
```

### Alert

Alert box with variants.

```tsx
import {Alert, AlertTitle, AlertDescription} from '@/components/ui';

<Alert variant="default">
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert description</AlertDescription>
</Alert>
```

**Props:**
- `variant`: 'default' | 'destructive'

### Switch

Toggle switch component.

```tsx
import {Switch} from '@/components/ui';

<Switch value={enabled} onValueChange={setEnabled} />
```

### Skeleton

Loading skeleton with pulse animation.

```tsx
import {Skeleton} from '@/components/ui';

<Skeleton style={{width: 100, height: 20}} />
```

## Styling

All components use StyleSheet for styling based on design tokens. You can override styles using the `style` prop:

```tsx
<Button style={{marginTop: 20}}>Custom styled button</Button>
```

## Accessibility

Components include basic accessibility props:
- `accessibilityLabel`
- `accessibilityHint`
- `accessibilityRole`
- `aria-invalid` (for form inputs)

Ensure you add appropriate accessibility props when using these components in your screens.

## Requirements

These components fulfill requirements:
- 1.2: React Native project structure
- 1.3: Component library
- 1.4: Styling with design tokens
- 1.8: Consistent UI patterns
