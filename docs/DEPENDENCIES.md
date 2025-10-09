# Core Dependencies Configuration

This document outlines the core dependencies installed for Star System Sorter (S³) and their configuration.

## Installed Dependencies

### Form Management & Validation
- **zod** (^4.1.12): Single source of truth for all validation
- **react-hook-form** (^7.64.0): Form state management
- **@hookform/resolvers** (^5.2.2): Zod integration with react-hook-form

**Usage:**
```typescript
import { z, zodResolver } from '@/lib';
import { useForm } from 'react-hook-form';

const schema = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  time: z.string().regex(/^\d{2}:\d{2} (AM|PM)$/),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### State Management
- **zustand** (^5.0.8): Minimal global state (2-3 atoms maximum)

**Usage:**
```typescript
import { useUserSession, useGameState, useToast } from '@/state';

// In component
const { session, setSession } = useUserSession();
```

**Important:** Prefer local component state. Only use zustand for truly global state.

### Navigation
- **@react-navigation/native** (^7.1.18): Navigation framework
- **@react-navigation/native-stack** (^7.3.27): Native stack navigator
- **react-native-screens** (^4.16.0): Native screen primitives
- **react-native-gesture-handler** (^2.28.0): Gesture handling
- **react-native-safe-area-context** (^5.5.2): Safe area support

**Configuration:**
- `index.js`: Added `import 'react-native-gesture-handler'` at top
- `MainActivity.kt`: Added `onCreate` override for gesture handler

### Graphics & UI
- **react-native-svg** (^15.14.0): SVG rendering for crests and charts

### Compression
- **pako** (^2.1.0): Gzip/deflate compression fallback
- **@types/pako** (^2.0.4): TypeScript definitions

**Note:** Use native CompressionStream when available, pako as fallback only.

### File Handling (Optional)
- **react-native-document-picker** (^9.3.1): PDF chart upload support

## Configuration Files

### Validation (`src/lib/validation.ts`)
Exports Zod and zodResolver as single source of truth for validation.

### State Store (`src/state/store.ts`)
Defines three minimal global state atoms:
- `useUserSession`: User authentication and profile
- `useGameState`: Active game session data
- `useToast`: Global toast notifications

## Native Configuration

### Android
- **MainActivity.kt**: Added `onCreate` override for gesture handler support
- **Gradle**: Dependencies auto-linked via React Native CLI

### iOS
- **Podfile**: Dependencies auto-linked via CocoaPods
- Run `cd ios && pod install` after installing new dependencies

## Development Workflow

1. **Install dependencies**: `npm install`
2. **iOS setup**: `cd ios && pod install && cd ..`
3. **Type check**: `npm run typecheck`
4. **Run Android**: `npm run android`
5. **Run iOS**: `npm run ios`

## Dependency Budget

This project maintains a strict dependency budget. All dependencies listed here are approved and necessary for core functionality. New dependencies require justification and approval.

### Approved Dependencies
✅ zod, @hookform/resolvers, react-hook-form
✅ zustand (minimal usage only)
✅ @react-navigation/native, @react-navigation/native-stack
✅ react-native-svg
✅ pako (fallback only)
✅ react-native-document-picker (optional)

### Rejected Dependencies
❌ No telemetry or analytics libraries
❌ No remote code execution libraries
❌ No unnecessary UI frameworks (use existing shadcn/ui components)
