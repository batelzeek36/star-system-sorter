// @file apps/server/__tests__/http.test.ts
// Tests for HTTP server setup and routing

import { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';

// Mock the hd route handler
jest.mock('../src/routes/hd', () => ({
  handleHDRequest: jest.fn(async (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mocked: true }));
  }),
}));

// Helper to create mock request
function createMockRequest(url: string, method = 'GET'): IncomingMessage {
  const readable = new Readable({
    read() {
      this.push(null);
    },
  });
  
  const req = readable as any as IncomingMessage;
  req.method = method;
  req.url = url;
  
  return req;
}

// Helper to create mock response
function createMockResponse(): {
  res: ServerResponse;
  getStatus: () => number;
  getHeaders: () => Record<string, string | string[]>;
  getBody: () => string;
} {
  let statusCode = 200;
  let headers: Record<string, string | string[]> = {};
  let body = '';

  const res = {
    writeHead: jest.fn((code: number, hdrs?: Record<string, string>) => {
      statusCode = code;
      if (hdrs) headers = { ...headers, ...hdrs };
    }),
    setHeader: jest.fn((key: string, value: string | string[]) => {
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

describe('HTTP Server', () => {
  let createHTTPServer: any;
  let handleHDRequest: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    
    const httpModule = await import('../src/http');
    createHTTPServer = httpModule.createHTTPServer;
    
    const hdModule = await import('../src/routes/hd');
    handleHDRequest = hdModule.handleHDRequest;
  });

  describe('Routing', () => {
    it('should route POST /internal/hd to HD handler', async () => {
      const server = createHTTPServer();
      const req = createMockRequest('/internal/hd', 'POST');
      const { res } = createMockResponse();

      // Simulate request handling
      await new Promise<void>((resolve) => {
        server.emit('request', req, res);
        setTimeout(resolve, 10);
      });

      expect(handleHDRequest).toHaveBeenCalledWith(req, res);
    });

    it('should handle health check endpoint', async () => {
      const server = createHTTPServer();
      const req = createMockRequest('/health', 'GET');
      const { res, getStatus, getBody } = createMockResponse();

      await new Promise<void>((resolve) => {
        server.emit('request', req, res);
        setTimeout(resolve, 10);
      });

      expect(getStatus()).toBe(200);
      expect(JSON.parse(getBody())).toEqual({ status: 'ok' });
    });

    it('should return 404 for unknown routes', async () => {
      const server = createHTTPServer();
      const req = createMockRequest('/unknown', 'GET');
      const { res, getStatus, getBody } = createMockResponse();

      await new Promise<void>((resolve) => {
        server.emit('request', req, res);
        setTimeout(resolve, 10);
      });

      expect(getStatus()).toBe(404);
      expect(JSON.parse(getBody())).toEqual({ error: 'Not found' });
    });
  });

  describe('CORS', () => {
    it('should set CORS headers on all requests', async () => {
      const server = createHTTPServer();
      const req = createMockRequest('/health', 'GET');
      const { res, getHeaders } = createMockResponse();

      await new Promise<void>((resolve) => {
        server.emit('request', req, res);
        setTimeout(resolve, 10);
      });

      const headers = getHeaders();
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('GET, POST, OPTIONS');
      expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type, Authorization');
    });

    it('should handle OPTIONS preflight requests', async () => {
      const server = createHTTPServer();
      const req = createMockRequest('/internal/hd', 'OPTIONS');
      const { res, getStatus } = createMockResponse();

      await new Promise<void>((resolve) => {
        server.emit('request', req, res);
        setTimeout(resolve, 10);
      });

      expect(getStatus()).toBe(204);
    });
  });

  describe('Server Creation', () => {
    it('should create HTTP server instance', () => {
      const server = createHTTPServer();
      expect(server).toBeDefined();
      expect(typeof server.listen).toBe('function');
      expect(typeof server.close).toBe('function');
    });
  });
});
