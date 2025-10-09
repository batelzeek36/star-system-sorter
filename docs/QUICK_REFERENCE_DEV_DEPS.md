# Quick Reference: Dev Dependencies

## Running Tests

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# Specific test file
npm test -- __tests__/path/to/test.ts

# E2E tests (requires built app)
npm run build:detox:android  # or build:detox:ios
npm run test:e2e:android     # or test:e2e:ios
```

## Code Quality Checks

```bash
# ESLint
npm run lint

# TypeScript type checking
npm run typecheck

# Import graph validation (no cycles, no deep imports)
npm run lint:graph
```

## MSW Usage in Tests

```typescript
const { http, HttpResponse } = require('msw');

describe('My Test', () => {
  const server = global.mswServer;
  const baseUrl = 'http://localhost:3000';

  it('should override handler', async () => {
    server.use(
      http.get(`${baseUrl}/api/endpoint`, () => {
        return HttpResponse.json({ data: 'custom' });
      })
    );

    const response = await fetch(`${baseUrl}/api/endpoint`);
    const data = await response.json();
    expect(data.data).toBe('custom');
  });
});
```

## Path Aliases

```typescript
// Available in all TypeScript/JavaScript files
import { something } from '@/lib/utils';
import { hdkitFunction } from '@hdkit/hdkit';
import { Button } from '@components/ui/button';
```

## Detox E2E Testing

```bash
# 1. Start dev API server
npm run dev:server

# 2. Build app for Detox
npm run build:detox:android  # or ios

# 3. Run E2E tests
npm run test:e2e:android     # or ios
```

## Dependency Cruiser Rules

- ❌ No circular dependencies
- ❌ No deep imports (only via index.ts)
- ❌ No reverse dependencies (components → screens)
- ✅ Layering: Screens → Components → Utils

## Common Issues

### MSW not mocking requests
- Ensure using full URLs: `http://localhost:3000/api/...`
- Check handler is registered in jest.setup.js
- Verify server is started in beforeAll

### Detox tests failing
- Ensure dev API server is running
- Check Android emulator/iOS simulator is running
- Verify app is built with correct configuration

### Import graph errors
- Only import from module index.ts
- Check for circular dependencies
- Verify layering rules are followed
