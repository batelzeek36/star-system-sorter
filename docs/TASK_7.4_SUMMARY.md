# Task 7.4 Summary: Create Why Screen

## Overview
Created the Why screen that explains classification reasoning by displaying contributors per star system.

## Implementation Details

### Files Created
1. **src/screens/WhyScreen.tsx** - Main Why screen component
2. **__tests__/why-screen.test.tsx** - Comprehensive test suite

### Key Features

#### 1. Classification Explanation Display
- Shows all star systems sorted by percentage (highest first)
- Displays percentage for each system
- Lists contributing Human Design attributes per system

#### 2. Contributor Formatting
Intelligent formatting of contributor keys into human-readable labels:
- `type_*` → "Type: [Name]"
- `authority_*` → "Authority: [Name]"
- `profile_*` → "Profile: [Number]"
- `center_*` → "Center: [Name]"
- `gate_*` → "Gate [Number]"
- `channel_*` → "Channel [Number]"

#### 3. Card-Based Layout
- Uses adapted Card component styling (white background, shadow, rounded corners)
- Each system displayed in its own card
- Clear visual hierarchy with system name and percentage in header
- Bulleted list of contributors

#### 4. Empty State Handling
- Gracefully handles systems with no contributors
- Shows "No contributing attributes" message

#### 5. Legal Disclaimer
- Footer displays required disclaimer: "For insight & entertainment. Not medical, financial, or legal advice."

### Component Structure

```typescript
interface WhyScreenProps {
  route: {
    params: {
      contributorsPerSystem: Record<string, string[]>;
      percentages: Record<string, number>;
    };
  };
}
```

### Navigation Integration
- Already registered in RootNavigator as "Why" screen
- Accessible from ResultScreen via "View Why" button
- Receives contributor data from scorer result

### Styling
- Follows existing design system patterns
- Uses consistent spacing, colors, and typography
- Responsive card layout with proper shadows
- Accessible touch targets (44pt minimum)

### Testing
All tests passing (6/6):
- ✓ Renders title and subtitle
- ✓ Displays systems sorted by percentage
- ✓ Displays formatted contributors for each system
- ✓ Displays disclaimer footer
- ✓ Handles empty contributors gracefully
- ✓ Formats different contributor types correctly

### Requirements Satisfied
- **1.3**: Classification explanation with contributor display

## File Size
- WhyScreen.tsx: ~200 LOC (within guidelines with formatting functions)
- Test file: ~150 LOC

## Data Flow Integration

### Navigation Type Updates
Updated `RootStackParamList` to include contributor data in Result params:
```typescript
Result: {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  percentage: number;
  allies: Array<{system: string; percentage: number}>;
  contributorsPerSystem: Record<string, string[]>;  // Added
  percentages: Record<string, number>;              // Added
};
```

### Screen Updates
1. **InputScreen** - Now passes mock contributor data when navigating to Result
2. **ResultScreen** - Extracts and forwards contributor data to Why screen
3. **Navigation Tests** - Updated to include contributor data in test expectations

### Mock Data
For development/testing, InputScreen provides realistic mock data:
```typescript
contributorsPerSystem: {
  Pleiades: ['type_manifestor', 'gate_1', 'gate_13', 'authority_emotional'],
  Sirius: ['center_sacral', 'gate_5', 'profile_2/4'],
  Arcturus: ['gate_34', 'channel_34-57'],
}
```

## Next Steps
The Why screen is fully integrated and displays contributor data. When the scorer module is implemented, it will provide real contributor data instead of mock data.

## Usage Example

```typescript
// From ResultScreen
navigation.navigate('Why', {
  contributorsPerSystem: {
    Pleiades: ['type_manifestor', 'gate_1', 'gate_13'],
    Sirius: ['authority_emotional', 'center_sacral'],
  },
  percentages: {
    Pleiades: 45.5,
    Sirius: 32.1,
  },
});
```
