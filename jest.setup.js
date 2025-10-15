// Configure MSW v2 with @mswjs/interceptors for API mocking in Jest
// Note: For React Native Jest tests, we use msw/native which works with @mswjs/interceptors
const { http, HttpResponse } = require('msw');
const { setupServer } = require('msw/native');

// Create mock handlers for API endpoints
// Note: MSW requires full URLs for React Native
const baseUrl = 'http://localhost:3000';

const handlers = [
  // Mock /internal/hd endpoint (BodyGraph API proxy)
  http.post(`${baseUrl}/internal/hd`, () => {
    return HttpResponse.json({
      // Mock HD chart data
      planets: {},
      gates: {},
      channels: {},
      type: 'Generator',
      profile: '1/3',
      definition: 'Single',
      authority: 'Sacral',
    });
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
