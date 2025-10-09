# Usage Examples

This document provides practical examples of using the configured core dependencies.

## Form Validation with Zod + React Hook Form

```typescript
import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z, zodResolver } from '@/lib';

// Define schema with Zod (single source of truth)
const birthDataSchema = z.object({
  date: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  time: z.string()
    .regex(/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format'),
  location: z.string()
    .min(1, 'Location is required'),
  timezone: z.string()
    .min(1, 'Timezone is required'),
});

type BirthData = z.infer<typeof birthDataSchema>;

export function InputForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthData>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      date: '',
      time: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = (data: BirthData) => {
    console.log('Valid data:', data);
    // Process form data
  };

  return (
    <View>
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="MM/DD/YYYY"
            />
            {errors.date && <Text>{errors.date.message}</Text>}
          </View>
        )}
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

## Global State with Zustand

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useUserSession, useToast } from '@/state';

export function ProfileScreen() {
  const { session, setSession } = useUserSession();
  const { addToast } = useToast();

  const handleLogin = () => {
    setSession({
      isAuthenticated: true,
      userId: 'user123',
    });
    
    addToast({
      message: 'Logged in successfully',
      type: 'success',
    });
  };

  return (
    <View>
      {session.isAuthenticated ? (
        <Text>Welcome, {session.userId}</Text>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}
```

## Navigation with React Navigation

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile', { userId: 'user123' })}
      />
    </View>
  );
}

function ProfileScreen({ route }) {
  const { userId } = route.params;
  return <View>{/* Profile content */}</View>;
}

export function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## SVG Graphics with react-native-svg

```typescript
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

export function StarSystemCrest({ size = 100 }) {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G>
          <Circle cx="50" cy="50" r="45" fill="#1a1a2e" stroke="#16213e" strokeWidth="2" />
          <Path
            d="M50 20 L60 45 L85 45 L65 60 L75 85 L50 70 L25 85 L35 60 L15 45 L40 45 Z"
            fill="#0f3460"
            stroke="#e94560"
            strokeWidth="1"
          />
        </G>
      </Svg>
    </View>
  );
}
```

## Compression with pako (Fallback)

```typescript
import pako from 'pako';

export async function compressData(data: string): Promise<Uint8Array> {
  // Use native CompressionStream if available
  if ('CompressionStream' in globalThis) {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    
    writer.write(encoder.encode(data));
    writer.close();
    
    const chunks: Uint8Array[] = [];
    const reader = stream.readable.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Concatenate chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result;
  }
  
  // Fallback to pako
  return pako.gzip(data);
}

export function decompressData(data: Uint8Array): string {
  const decompressed = pako.ungzip(data);
  return new TextDecoder().decode(decompressed);
}
```

## Document Picker (Optional)

```typescript
import React from 'react';
import { Button, View, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export function ChartUpload() {
  const [file, setFile] = React.useState<any>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setFile(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  return (
    <View>
      <Button title="Upload Chart PDF" onPress={pickDocument} />
      {file && <Text>Selected: {file.name}</Text>}
    </View>
  );
}
```

## Best Practices

### Validation
- ✅ Always use Zod schemas as single source of truth
- ✅ Use `zodResolver` with react-hook-form
- ✅ Infer TypeScript types from Zod schemas: `type T = z.infer<typeof schema>`

### State Management
- ✅ Prefer local component state with `useState`
- ✅ Only use zustand for truly global state (2-3 atoms max)
- ✅ Keep zustand stores focused and minimal

### Navigation
- ✅ Define typed navigation params with TypeScript
- ✅ Use native-stack navigator for better performance
- ✅ Handle deep linking if needed

### Graphics
- ✅ Use react-native-svg for vector graphics
- ✅ Keep SVG components small and focused
- ✅ Consider performance for complex SVGs

### Compression
- ✅ Prefer native CompressionStream when available
- ✅ Use pako only as fallback
- ✅ Guard pako import to avoid unnecessary bundle size
