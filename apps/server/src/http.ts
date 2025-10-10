// @file apps/server/src/http.ts
// HTTP server setup with routing

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { handleHDRequest } from './routes/hd.js';

// CORS headers for development
function setCORSHeaders(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Route handler
async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // Set CORS headers
  setCORSHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || '/';

  // Route: POST /internal/hd
  if (url === '/internal/hd' || url.startsWith('/internal/hd?')) {
    await handleHDRequest(req, res);
    return;
  }

  // Health check
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

// Create and export server
export function createHTTPServer() {
  return createServer(handleRequest);
}
