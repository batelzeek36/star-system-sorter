/**
 * UI Components Usage Examples
 * 
 * This file demonstrates how to use the adapted React Native UI components.
 * These examples can be used as reference when building screens.
 */

import React from 'react';
import {View, ScrollView} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Label,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Separator,
  Alert,
  AlertTitle,
  AlertDescription,
  Switch,
  Skeleton,
} from './index';

// Example: Button variants
export function ButtonExample() {
  return (
    <View style={{gap: 12}}>
      <Button variant="default" onPress={() => console.log('Default')}>
        Default Button
      </Button>
      <Button variant="destructive" onPress={() => console.log('Destructive')}>
        Destructive Button
      </Button>
      <Button variant="outline" onPress={() => console.log('Outline')}>
        Outline Button
      </Button>
      <Button variant="secondary" onPress={() => console.log('Secondary')}>
        Secondary Button
      </Button>
      <Button variant="ghost" onPress={() => console.log('Ghost')}>
        Ghost Button
      </Button>
      <Button variant="link" onPress={() => console.log('Link')}>
        Link Button
      </Button>
      <Button loading disabled>
        Loading...
      </Button>
    </View>
  );
}

// Example: Card with all sections
export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          {/* Card content goes here */}
        </View>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  );
}

// Example: Badges
export function BadgeExample() {
  return (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </View>
  );
}

// Example: Form with validation
const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  notifications: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export function FormExample() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      notifications: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form {...form}>
      <View style={{gap: 16}}>
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter username"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormDescription>
                This is your public display name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email"
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

        <FormField
          control={form.control}
          name="notifications"
          render={({field}) => (
            <FormItem>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FormLabel>Enable notifications</FormLabel>
                <Switch
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </View>
            </FormItem>
          )}
        />

        <Button onPress={form.handleSubmit(onSubmit)}>
          Submit
        </Button>
      </View>
    </Form>
  );
}

// Example: Alert
export function AlertExample() {
  return (
    <View style={{gap: 12}}>
      <Alert variant="default">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational alert message.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </Alert>
    </View>
  );
}

// Example: Loading skeleton
export function SkeletonExample() {
  return (
    <View style={{gap: 12}}>
      <Skeleton style={{width: '100%', height: 20}} />
      <Skeleton style={{width: '80%', height: 20}} />
      <Skeleton style={{width: '60%', height: 20}} />
    </View>
  );
}

// Example: Complete screen layout
export function CompleteExample() {
  return (
    <ScrollView style={{flex: 1, padding: 20}}>
      <View style={{gap: 24}}>
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Get started with our React Native UI components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{gap: 12}}>
              <Label>Status</Label>
              <Badge variant="secondary">Active</Badge>
              
              <Separator />
              
              <Alert variant="default">
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  All components maintain the same API as shadcn/ui
                </AlertDescription>
              </Alert>
            </View>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Learn More</Button>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>
      </View>
    </ScrollView>
  );
}
