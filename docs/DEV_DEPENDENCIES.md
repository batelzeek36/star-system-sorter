# Development Dependencies

This document describes the development dependencies installed for Star System Sorter (S³) and their configuration.

## Installed Dependencies

### Testing Libraries

- **@testing-library/react-native** (^13.3.3): Testing utilities for React Native components
- **jest** (^29.6.3): JavaScript testing framework (already present in RN)
- **detox** (^20.43.0): E2E testing framework for React Native

### API Mocking

- **msw** (^2.11.4): Mock Service Worker v2 for API mocking
- **@mswjs/interceptors** (^0.39.7): Network request interceptors for MSW v2

### Code Quality

- **dependency-cruiser** (^17.0.2): Validates and visualizes dependencies
- **babel-plugin-module-resolver** (^5.0.2): Resolves module paths for aliases

### Schema Generation

- **zod-to-json-schema** (^3.24.6): Generates JSON Schemas from Zod schemas

## Configuration Files

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-svg|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
  },
};
```

### Jest Setup (`jest.setup.js`)

Configures:
- @testing-library/react-native extensions
- MSW v2 server with @mswjs/interceptors
- Mock handlers for all API endpoints
- React Native module mocks

### Detox Configuration (`.detoxrc.js`)

Configures E2E testing for:
- iOS simulator (iPhone 15)
- Android emulator (Pixel 7 API 34)
- Debug and release builds
- Local dev API access (not mocked network)

**Important**: Detox tests hit the real local dev API, not mocked endpoints. This ensures true E2E validation.

### Dependency Cruiser (`.dependency-cruiser.js`)

Enforces:
- No circular dependencies
- No deep imports (only via index.ts)
- Layering: Screens → Components → Theme/Tokens → Utils
- No reverse dependencies (components can't import screens)

### Babel Configuration (`babel.config.js`)

Includes module-resolver plugin for path aliases:
- `@/*` → `src/*`
- `@components/*` → `components/*`

## Available Scripts

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests on iOS
npm run test:e2e:ios

# Run E2E tests on Android
npm run test:e2e:android

# Build Detox for iOS
npm run build:detox:ios

# Build Detox for Android
npm run build:detox:android
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Check import graph (no cycles, no deep imports)
npm run lint:graph

# TypeScript type checking
npm run typecheck
```

## MSW v2 Configuration

MSW v2 is configured with @mswjs/interceptors for React Native compatibility. Mock handlers are defined in `jest.setup.js` and include:

- `POST /internal/hd` - BodyGraph API proxy with caching

### Usage in Tests

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '../jest.setup';

// Override handler for specific test
server.use(
  http.get('/api/events/active', () => {
    return HttpResponse.json({ events: [] });
  })
);
```

## Detox E2E Testing

Detox is configured to test the app against a real local dev API server:

- **Android**: Uses `10.0.2.2:3000` to reach host machine
- **iOS**: Uses `localhost:3000`
- **Physical devices**: Use LAN IP address

### Running E2E Tests

1. Start the dev API server:
   ```bash
   npm run dev:server
   ```

2. Build the app for Detox:
   ```bash
   npm run build:detox:android  # or build:detox:ios
   ```

3. Run E2E tests:
   ```bash
   npm run test:e2e:android  # or test:e2e:ios
   ```

## Dependency Cruiser Rules

The import graph is validated with these rules:

1. **No circular dependencies**: Prevents circular imports
2. **No orphans**: Warns about unused modules
3. **No deep imports**: Only import from module index.ts
4. **Enforce layering**: Utils/State can't import from Components/Screens
5. **No reverse deps**: Components can't import from Screens

Run validation:
```bash
npm run lint:graph
```

## Notes

- MSW v2 is used **only in Jest tests**, not in Detox E2E tests
- Detox tests hit the real local dev API for true E2E validation
- zod-to-json-schema installed with `--legacy-peer-deps` due to zod v4 compatibility
- All path aliases are configured in both tsconfig.json and babel.config.js
