# Design Document

## Overview

Star System Sorter (S³) is a React Native mobile app that classifies users into star systems based on Human Design birth data. The design follows an **Ethereal Flow** aesthetic with dark backgrounds, lavender primary colors, and gold highlights.

## Design Principles

- **Ethereal Flow**: Soft gradients, rounded shapes, gentle animations, starfield backgrounds
- **Mobile-First**: Touch-optimized UI (≥44px targets), React Native for iOS/Android
- **Accessibility**: WCAG 2.1 AA compliance (contrast ratios, focus states)
- **Privacy-First**: No PII collection, local-first data storage
- **Modularity**: Target 100-200 LOC per file, soft limit 300 LOC, hard limit 500 LOC

## Architecture

```
Mobile App (React Native)
├── Screens (Input, Result, Why, Profile, Settings)
├── Components (Button, Card, Chip, Field, StarSystemCrest)
├── Scorer Library (deterministic classification)
├── HD Integration (BodyGraph API client)
├── Moderation (content filters)
└── State (zustand, minimal)

Server (Node.js)
├── Express API
├── BodyGraph API Proxy (30-day cache)
└── In-Memory Store
```

## Tech Stack

**Frontend:**
- React Native 0.82+ with TypeScript 5.9+
- React 19.1.1
- React Navigation (native stack)
- Zod v4 for validation
- react-hook-form + @hookform/resolvers
- zustand (2-3 atoms)
- react-native-svg
- pako for compression

**Backend:**
- Node.js 20+ with TypeScript
- Express
- BodyGraph Chart API proxy
- 30-day cache (in-memory)

**Testing:**
- Jest 29+
- @testing-library/react-native
- Detox 20+
- MSW for API mocking

**Code Quality:**
- ESLint + Prettier
- dependency-cruiser (no cycles, layering enforcement)
- TypeScript strict mode

## Design System

### Color Palette

**Canvas:**
- Dark: `#0a0612`
- Darker: `#060408`

**Lavender (Primary):**
- 400: `#c4b5fd`
- 500: `#a78bfa` (primary)
- 600: `#8b5cf6`
- 900: `#5b21b6`

**Gold (Highlights):**
- 400: `#fbbf24` (primary)
- 600: `#d97706`

**Text (WCAG AA compliant):**
- Primary: `#ffffff` (21:1 contrast)
- Secondary: `#e5e7eb` (14.8:1 contrast)
- Muted: `#9ca3af` (7.2:1 contrast)
- Subtle: `#6b7280` (4.7:1 contrast)

### Spacing & Layout

- 4px grid system (spacing-1 to spacing-16)
- Touch targets: Minimum 44px
- Border radius: sm (8px), md (12px), lg (16px), xl (24px), full (pill)

### Typography

- Font sizes: xs (12px) to 4xl (36px)
- Font weights: normal (400), medium (500), semibold (600), bold (700)
- Line heights: tight (1.25), normal (1.5), relaxed (1.75)

### Motion

- Duration: fast (150ms), normal (200ms), slow (300ms)
- Easing: cubic-bezier for smooth transitions
- Press animation: scale(0.98)

## Star Systems

Six primary systems with geometric crest icons:
- **Orion** (synonym: Osirian)
- **Sirius**
- **Pleiades**
- **Andromeda**
- **Lyra**
- **Arcturus**

Crests exported as SVG at 24px, 28px, 48px sizes.

## Core Components

### Button
**Variants:** primary, secondary, ghost, destructive  
**Sizes:** sm/md (44px), lg (48px)  
**States:** default, hover, active, focus, disabled, loading  
**Features:** Gradient backgrounds, scale animation, focus rings, loading spinner

### Card
**Variants:** default, emphasis, warning  
**Features:** Gradient backgrounds, backdrop blur, lavender/gold borders

### Chip
**Variants:** gold, lavender  
**States:** default, selectable, selected, dismissible  
**Use:** Star system allies with percentages

### Field
**Features:** Label, icon slot, helper text, error states, focus ring  
**Validation:** Inline error messages with red border

### StarSystemCrests
**Components:** OrionCrest, SiriusCrest, PleiadesCrest, AndromedaCrest, LyraCrest, ArcturusCrest  
**Sizes:** 24px, 28px, 48px  
**Format:** SVG with currentColor fill

### AppBar
**Features:** Title, back button, 56px height

### TabBar
**Tabs:** Home, Profile  
**Features:** Active state indicator, icon + label, ≥44px touch targets

### Toast & InlineAlert
**Types:** success, info, warning, error  
**Features:** Auto-dismiss (3s), dismissible variant, icon indicators

## Screen Flows

### 01. Onboarding
- S³ logo and hero
- Starfield background
- "Begin Sorting" CTA
- → Input Screen

### 02. Input
- Birth data form (date, time, location)
- Tabs: Birth Data | Upload PDF
- "Compute Chart" CTA
- → Result Screen

### 03. Result
- Radial chart with percentage
- Primary system card
- Ally chips (e.g., Sirius 18%, Lyra 12%)
- "View Why" button
- **Disclaimer:** "For insight & entertainment. Not medical, financial, or legal advice."
- TabBar navigation

### 04. Why
- Explanation of classification
- Contributor cards with weights
- Back to Result

### 05. Profile
- Avatar, user type display
- Star system cards (primary + allies)
- Settings icon
- TabBar navigation

### 06. Settings
- Privacy notice
- Settings groups (Privacy, Notifications, Display)
- Legal links
- Back to Profile

## Core Systems

### Scorer Library
Deterministic classification system that analyzes Human Design birth data and assigns users to star systems based on weighted scoring algorithms.

### Human Design Integration
BodyGraph API client with 30-day caching for chart generation from birth data (date, time, location).

### Moderation System
Content filtering across all user inputs with blocklists, sanitization, and rate limiting.

### State Management
Minimal zustand store (2-3 atoms) for user session, chart data, and toast notifications.

## Key Interfaces

### Scorer

```typescript
interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
}

interface ScorerResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  allies: Array<{ system: string; percentage: number }>;
  percentages: Record<string, number>;
  contributorsPerSystem: Record<string, string[]>;
  meta: {
    canonVersion: string;
    canonChecksum: string;
  };
}
```

### State

```typescript
interface AppState {
  userSession: {
    userId?: string;
    isAuthenticated: boolean;
  };
  chartData: {
    birthData?: BirthData;
    hdChart?: HDChart;
    scorerResult?: ScorerResult;
  };
  toasts: Array<{
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
  }>;
}
```

## API Endpoints

**POST /api/chart**
```typescript
Request: {
  date: string; // MM/DD/YYYY
  time: string; // HH:MM AM/PM
  location: string;
  timezone?: string;
}

Response: HDChart
```

**GET /api/health**
```typescript
Response: {
  status: 'ok';
  timestamp: number;
}
```

## Error Handling

**Client:**
- Invalid chart data → "Invalid chart data" message
- Network error → "Connection lost" with retry button
- Form validation → Inline error with red border

**Server:**
- Invalid schema → 400 Bad Request with field errors
- API failure → 502 Bad Gateway
- Rate limit → 429 Too Many Requests

## Performance Targets

- Cold launch: ≤2.5s (Android), ≤1.8s (iOS)
- Memory: ≤350MB peak on mid-tier devices
- Bundle size: Keep minimal, monitor APK/IPA size

## Security

### PII Handling
- Never store birth data in logs
- Hash user IDs for metrics
- 30-day cache retention

### Content Moderation
- Pre-filter client inputs
- Server validation
- Rate limiting per user

### API Security
- Zod schema validation
- Payload size limits
- CORS configuration

## Design Decisions

### Why React Native?
- Cross-platform development
- Native performance
- Rich ecosystem
- Hot reload development

### Why In-Memory Storage?
- MVP simplicity
- Fast development
- Sufficient scale for testing
- Easy database migration later

## Conclusion

This design provides a React Native mobile app with deterministic star system classification based on Human Design principles. The modular architecture with small files, clear boundaries, and comprehensive testing ensures maintainability.

Key success metrics:
- All files ≤500 LOC (target 100-200 LOC)
- Test coverage: ≥80% for core, ≥60% app-wide
- Mobile performance: cold launch ≤2.5s, memory ≤350MB
- Deterministic classification with reproducible results