// Configure MSW v2 with @mswjs/interceptors for API mocking in Jest
// Note: For React Native Jest tests, we use msw/native which works with @mswjs/interceptors
const { http, HttpResponse } = require('msw');
const { setupServer } = require('msw/native');

// Create mock handlers for API endpoints
// Note: MSW requires full URLs for React Native
const baseUrl = 'http://localhost:3000';

const handlers = [
  // Mock /api/runs/submit endpoint
  http.post(`${baseUrl}/api/runs/submit`, () => {
    return HttpResponse.json({
      score: 12450,
      validated: true,
      suspect: false,
    });
  }),

  // Mock /api/leaderboard/daily endpoint
  http.get(`${baseUrl}/api/leaderboard/daily`, () => {
    return HttpResponse.json({
      event_id: 'test-event',
      date: '2025-10-08',
      teams: [
        {
          team_id: 'pleiades',
          team_name: 'Pleiades',
          score: 125000,
          rank: 1,
          top_runs: 10,
          median_score: 10000,
          total_runs: 50,
        },
      ],
    });
  }),

  // Mock /api/events/active endpoint
  http.get(`${baseUrl}/api/events/active`, () => {
    return HttpResponse.json({
      events: [
        {
          id: 'test-event',
          name: 'Test Event',
          start_date: '2025-10-01',
          end_date: '2025-10-31',
          game_key: 'super_dash',
        },
      ],
    });
  }),

  // Mock /api/music/packs endpoint
  http.get(`${baseUrl}/api/music/packs`, () => {
    return HttpResponse.json({
      packs: [
        { id: 'pleiades', name: 'Pleiades Pack' },
        { id: 'sirius', name: 'Sirius Pack' },
      ],
    });
  }),

  // Mock /api/music/prefs endpoint
  http.post(`${baseUrl}/api/music/prefs`, () => {
    return HttpResponse.json({ success: true });
  }),
];

// Set up MSW server for Jest tests
const server = setupServer(...handlers);

// Export for use in tests
global.mswServer = server;
global.mswHandlers = handlers;

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});

// Mock React Native modules that may not be available in Jest
// Note: React Native 0.82+ handles most mocks automatically

// Mock AsyncStorage for Jest with in-memory storage
const mockStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn((key, value) => {
      mockStorage.set(key, value);
      return Promise.resolve();
    }),
    getItem: jest.fn((key) => {
      return Promise.resolve(mockStorage.get(key) || null);
    }),
    removeItem: jest.fn((key) => {
      mockStorage.delete(key);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Array.from(mockStorage.keys()));
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach(key => mockStorage.delete(key));
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      mockStorage.clear();
      return Promise.resolve();
    }),
  },
}));
