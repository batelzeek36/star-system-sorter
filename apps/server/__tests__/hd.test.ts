// @file apps/server/__tests__/hd.test.ts
// Tests for BodyGraph proxy endpoint

import { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

// Helper to create mock request
function createMockRequest(body: unknown, method = 'POST'): IncomingMessage {
  const readable = new Readable({
    read() {
      this.push(JSON.stringify(body));
      this.push(null);
    },
  });
  
  const req = readable as any as IncomingMessage;
  req.method = method;
  req.url = '/internal/hd';
  
  return req;
}

// Helper to create mock response
function createMockResponse(): {
  res: ServerResponse;
  getStatus: () => number;
  getHeaders: () => Record<string, string>;
  getBody: () => string;
} {
  let statusCode = 200;
  let headers: Record<string, string> = {};
  let body = '';

  const res = {
    writeHead: jest.fn((code: number, hdrs?: Record<string, string>) => {
      statusCode = code;
      if (hdrs) headers = { ...headers, ...hdrs };
    }),
    setHeader: jest.fn((key: string, value: string) => {
      headers[key] = value;
    }),
    end: jest.fn((data?: string) => {
      if (data) body = data;
    }),
  } as any as ServerResponse;

  return {
    res,
    getStatus: () => statusCode,
    getHeaders: () => headers,
    getBody: () => body,
  };
}

describe('BodyGraph Proxy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.BODYGRAPH_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Happy Path', () => {
    it('should forward valid request to BodyGraph API', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const mockResponse = {
        type: 'Manifestor',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Sacral', 'Solar Plexus'],
        channels: [34, 57],
        gates: [1, 2, 3],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const requestBody = {
        date: '1990-01-15 14:30',
        timezone: 'America/New_York',
      };

      const req = createMockRequest(requestBody);
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(200);
      expect(JSON.parse(getBody())).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.bodygraphchart.com/latest/hd-data'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      
      // Verify query parameters
      const callUrl = new URL(mockFetch.mock.calls[0][0] as string);
      expect(callUrl.searchParams.get('api_key')).toBe('test-api-key');
      expect(callUrl.searchParams.get('date')).toBe('1990-01-15 14:30');
      expect(callUrl.searchParams.get('timezone')).toBe('America/New_York');
    });

    it('should cache responses with 30-day TTL', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const mockResponse = { type: 'Generator' };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const requestBody = {
        date: '1995-06-20 10:15',
        timezone: 'Europe/London',
      };

      // First request - cache miss
      const req1 = createMockRequest(requestBody);
      const { res: res1, getStatus: getStatus1 } = createMockResponse();
      await handleHDRequest(req1, res1);

      expect(getStatus1()).toBe(200);
      const initialCallCount = mockFetch.mock.calls.length;

      // Second request - cache hit
      const req2 = createMockRequest(requestBody);
      const { res: res2, getStatus: getStatus2 } = createMockResponse();
      await handleHDRequest(req2, res2);

      expect(getStatus2()).toBe(200);
      expect(mockFetch.mock.calls.length).toBe(initialCallCount); // Not called again
    });

    it('should generate different cache keys for different params', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ type: 'Projector' }),
      });

      const req1 = createMockRequest({
        date: '1992-03-10 08:45',
        timezone: 'Asia/Tokyo',
      });
      const { res: res1 } = createMockResponse();
      await handleHDRequest(req1, res1);
      const callsAfterFirst = mockFetch.mock.calls.length;

      const req2 = createMockRequest({
        date: '1992-03-10 08:46', // Different time
        timezone: 'Asia/Tokyo',
      });
      const { res: res2 } = createMockResponse();
      await handleHDRequest(req2, res2);

      expect(mockFetch.mock.calls.length).toBe(callsAfterFirst + 1); // Different cache keys
    });
  });

  describe('Validation Errors (400)', () => {
    it('should reject invalid date format', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const req = createMockRequest({
        date: '01/15/1990 14:30', // Wrong format
        timezone: 'America/New_York',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(400);
      const body = JSON.parse(getBody());
      expect(body.error).toBe('Invalid request format');
      expect(body.details).toBeDefined();
    });

    it('should reject invalid time format', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const req = createMockRequest({
        date: '1990-01-15 2:30 PM', // Wrong format
        timezone: 'America/New_York',
      });
      const { res, getStatus } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(400);
    });

    it('should reject missing required fields', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const req = createMockRequest({
        date: '1990-01-15 14:30',
        // Missing timezone
      });
      const { res, getStatus } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(400);
    });

    it('should map upstream 400 to clean error', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad request from upstream',
      });

      const req = createMockRequest({
        date: '1988-12-25 16:20',
        timezone: 'America/Chicago',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(400);
      expect(JSON.parse(getBody()).error).toBe('Invalid birth data format');
    });
  });

  describe('Authentication Errors (401)', () => {
    it('should return 500 when API key is missing', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      delete process.env.BODYGRAPH_API_KEY;

      const req = createMockRequest({
        date: '1990-01-15 14:30',
        timezone: 'America/New_York',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(500);
      expect(JSON.parse(getBody()).error).toBe('Server misconfiguration');
    });

    it('should map upstream 401 to authentication error', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      const req = createMockRequest({
        date: '1985-07-04 12:00',
        timezone: 'America/Los_Angeles',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(401);
      expect(JSON.parse(getBody()).error).toBe('API authentication failed');
    });
  });

  describe('Rate Limiting (429)', () => {
    it('should map upstream 429 to rate limit error', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Too many requests',
      });

      const req = createMockRequest({
        date: '2000-01-01 00:00',
        timezone: 'UTC',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(429);
      expect(JSON.parse(getBody()).error).toBe('Rate limit exceeded');
    });
  });

  describe('Server Errors (5xx)', () => {
    it('should map upstream 500 to service unavailable', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error',
      });

      const req = createMockRequest({
        date: '1975-11-30 18:45',
        timezone: 'Europe/Paris',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(503);
      expect(JSON.parse(getBody()).error).toBe('BodyGraph service unavailable');
    });

    it('should map upstream 503 to service unavailable', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => 'Service unavailable',
      });

      const req = createMockRequest({
        date: '1980-05-15 09:30',
        timezone: 'Australia/Sydney',
      });
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(503);
    });
  });

  describe('Method Validation', () => {
    it('should reject GET requests', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const req = createMockRequest({}, 'GET');
      const { res, getStatus, getBody } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(405);
      expect(JSON.parse(getBody()).error).toBe('Method not allowed');
    });

    it('should reject PUT requests', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const req = createMockRequest({}, 'PUT');
      const { res, getStatus } = createMockResponse();

      await handleHDRequest(req, res);

      expect(getStatus()).toBe(405);
    });
  });

  describe('Cache Logging', () => {
    it('should log cache hits and misses', async () => {
      const { handleHDRequest } = await import('../src/routes/hd');
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ type: 'Reflector' }),
      });

      const requestBody = {
        date: '1998-08-22 11:11',
        timezone: 'America/Denver',
      };

      // First request - cache miss
      const req1 = createMockRequest(requestBody);
      const { res: res1 } = createMockResponse();
      await handleHDRequest(req1, res1);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[HD] Cache MISS')
      );

      // Second request - cache hit
      const req2 = createMockRequest(requestBody);
      const { res: res2 } = createMockResponse();
      await handleHDRequest(req2, res2);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[HD] Cache HIT')
      );

      consoleSpy.mockRestore();
    });
  });
});
