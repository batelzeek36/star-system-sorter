# Bridge Handshake Testing Guide

## Overview

This guide explains how to verify the critical handshake gate:
**Boot app → call GameBridge.open() → receive ready < 5s**

The handshake test verifies:
- ✓ Ready event received within 5 seconds
- ✓ Channel names match exactly (`s3/game/cmd`, `s3/game/events`)
- ✓ Payloads validate against Zod schemas
- ✓ Event listeners work correctly
- ✓ Error handling is robust

## Prerequisites

Before running handshake tests, ensure:

1. **Native Bridges Implemented** (Tasks 6.2 and 6.3)
   - Android: `android/app/src/main/java/com/starsystemsorter/GameBridgeModule.java`
   - iOS: `ios/StarSystemSorter/GameBridgeModule.swift`

2. **Flutter Module Built**
   ```bash
   ./scripts/build-flutter-module.sh
   ```

3. **App Running**
   - Android: `npm run android`
   - iOS: `npm run ios`

## Testing Methods

### Method 1: Automated Test (Recommended)

Run the Jest integration test:

```bash
npm test -- bridge-handshake.test.ts
```

This test will:
- Open the Flutter view
- Wait for ready event (max 5s)
- Validate event structure
- Verify Zod schema validation
- Test event listeners

**Location:** `__tests__/bridge-handshake.test.ts`

### Method 2: Shell Script

Run the automated shell script:

```bash
./scripts/test-bridge-handshake.sh
```

This script will:
- Check prerequisites
- Build and install app
- Monitor logs for ready event
- Provide manual verification steps

**Location:** `scripts/test-bridge-handshake.sh`

### Method 3: Manual UI Test

Use the BridgeTestScreen component:

1. **Add to Navigation**

   ```typescript
   // In your navigation setup
   import { BridgeTestScreen } from '@/screens/BridgeTestScreen';
   
   // Add to stack navigator
   <Stack.Screen 
     name="BridgeTest" 
     component={BridgeTestScreen}
     options={{ title: 'Bridge Test' }}
   />
   ```

2. **Navigate to Screen**

   ```typescript
   navigation.navigate('BridgeTest');
   ```

3. **Press "Test Handshake" Button**

4. **Verify Results**
   - Success message with elapsed time
   - Ready event payload displayed
   - All events logged

**Location:** `src/screens/BridgeTestScreen.tsx`

### Method 4: Programmatic Test

Add this code to any component:

```typescript
import { GameBridge } from '@/bridge';

async function testHandshake() {
  try {
    console.log('Testing handshake...');
    const startTime = Date.now();
    
    // Open Flutter view and wait for ready event
    const readyEvent = await GameBridge.open();
    
    const elapsed = Date.now() - startTime;
    
    console.log(`✓ Ready in ${elapsed}ms`);
    console.log('✓ Event:', readyEvent);
    console.log('✓ Version:', readyEvent.game_core_version);
    
    if (elapsed < 5000) {
      console.log('✓ HANDSHAKE SUCCESSFUL');
    } else {
      console.error('✗ Handshake too slow');
    }
  } catch (error) {
    console.error('✗ Handshake failed:', error);
  }
}

// Call it
testHandshake();
```

## Expected Results

### Success Criteria

```
✓ Ready event received in < 5000ms
✓ Event type: 'ready'
✓ Event has game_core_version: '1.0.0'
✓ Event validates against Zod schema
✓ Channel names match:
  - Commands: s3/game/cmd
  - Events: s3/game/events
```

### Example Success Output

```
Testing handshake...
✓ Ready in 1247ms
✓ Event: { type: 'ready', game_core_version: '1.0.0' }
✓ Version: 1.0.0
✓ HANDSHAKE SUCCESSFUL
```

### Example Failure Output

```
Testing handshake...
✗ Handshake failed: Flutter game ready timeout
```

## Troubleshooting

### Ready Event Not Received

**Symptoms:**
- Timeout after 5 seconds
- No ready event in logs

**Possible Causes:**
1. Native bridge not implemented
2. Flutter module not built
3. Channel names don't match
4. Flutter main.dart not wired correctly

**Solutions:**
1. Verify native bridges exist:
   ```bash
   ls android/app/src/main/java/com/starsystemsorter/GameBridgeModule.java
   ls ios/StarSystemSorter/GameBridgeModule.swift
   ```

2. Rebuild Flutter module:
   ```bash
   ./scripts/build-flutter-module.sh
   ```

3. Check channel names in native code:
   - Commands: `s3/game/cmd`
   - Events: `s3/game/events`

4. Verify main.dart sends ready event:
   ```dart
   bridge.sendEvent(
     const ReadyEvent(gameCoreVersion: kGameCoreVersion),
   );
   ```

### Invalid Event Payload

**Symptoms:**
- Event received but validation fails
- Zod schema errors

**Possible Causes:**
1. Event structure doesn't match schema
2. Missing required fields
3. Wrong field types

**Solutions:**
1. Check event structure in Flutter:
   ```dart
   ReadyEvent(gameCoreVersion: '1.0.0')
   ```

2. Verify against Zod schema:
   ```typescript
   {
     type: 'ready',
     game_core_version: string
   }
   ```

3. Check for typos in field names

### Native Module Not Available

**Symptoms:**
- `GameBridge native module not available`
- `NativeModules.GameBridge is undefined`

**Possible Causes:**
1. Native bridge not registered
2. App not rebuilt after adding native code
3. Metro cache issues

**Solutions:**
1. Rebuild native projects:
   ```bash
   npm run rebuild:android
   npm run rebuild:ios
   ```

2. Clear Metro cache:
   ```bash
   npm start -- --reset-cache
   ```

3. Verify native module registration:
   - Android: Check `MainApplication.java`
   - iOS: Check `AppDelegate.swift`

## Channel Name Verification

### React Native Side

**File:** `src/bridge/GameBridge.ts`

```typescript
const EVENT_CHANNEL_NAME = 's3/game/events';
```

### Flutter Side

**File:** `super_dash/lib/bridge/method_channel_bridge.dart`

```dart
static const MethodChannel _commandChannel = MethodChannel('s3/game/cmd');
static const EventChannel _eventChannel = EventChannel('s3/game/events');
```

### Native Android Side

**File:** `android/app/src/main/java/com/starsystemsorter/GameBridgeModule.java`

```java
private static final String COMMAND_CHANNEL = "s3/game/cmd";
private static final String EVENT_CHANNEL = "s3/game/events";
```

### Native iOS Side

**File:** `ios/StarSystemSorter/GameBridgeModule.swift`

```swift
let COMMAND_CHANNEL = "s3/game/cmd"
let EVENT_CHANNEL = "s3/game/events"
```

**All channel names must match exactly!**

## Schema Validation

### Zod Schema (React Native)

**File:** `src/bridge/types.ts`

```typescript
export const ReadyEventSchema = z.object({
  type: z.literal('ready'),
  game_core_version: z.string(),
});
```

### Dart Schema (Flutter)

**File:** `super_dash/lib/bridge/schema.dart`

```dart
class ReadyEvent extends GameEvent {
  const ReadyEvent({required this.gameCoreVersion});
  
  final String gameCoreVersion;
  
  @override
  Map<String, dynamic> toJson() => {
    'type': 'ready',
    'game_core_version': gameCoreVersion,
  };
}
```

**Schemas must match exactly!**

## Performance Benchmarks

### Target Performance

- **Ready Event:** < 2000ms (target), < 5000ms (max)
- **Command Send:** < 100ms
- **Event Receive:** < 50ms

### Measuring Performance

```typescript
const startTime = Date.now();
const readyEvent = await GameBridge.open();
const elapsed = Date.now() - startTime;

console.log(`Ready in ${elapsed}ms`);

if (elapsed < 2000) {
  console.log('✓ Excellent performance');
} else if (elapsed < 5000) {
  console.log('⚠ Acceptable performance');
} else {
  console.log('✗ Poor performance');
}
```

## Continuous Integration

### CI Test Setup

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Test Bridge Handshake
  run: |
    npm run android &
    sleep 30
    npm test -- bridge-handshake.test.ts
```

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
npm test -- bridge-handshake.test.ts --silent
```

## Related Documentation

- [Flutter Module Integration](./FLUTTER_MODULE_INTEGRATION.md)
- [GameBridge Usage](../src/bridge/GAMEBRIDGE_USAGE.md)
- [Bridge Schema Usage](../super_dash/lib/bridge/SCHEMA_USAGE.md)
- [Testing Flutter Integration](./TESTING_FLUTTER_INTEGRATION.md)

## Next Steps

After successful handshake verification:

1. **Test Commands** - Send start/pause/resume/quit commands
2. **Test Events** - Verify state/result/error events
3. **Test Lifecycle** - Verify app background/foreground handling
4. **Test Error Handling** - Verify error scenarios
5. **Performance Testing** - Measure and optimize timing

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review related documentation
3. Check Flutter and React Native logs
4. Verify all prerequisites are met
5. Rebuild native projects and clear caches
