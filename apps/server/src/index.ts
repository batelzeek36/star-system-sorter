// @file apps/server/src/index.ts
// Server entry point

import { createHTTPServer } from './http.js';

const PORT = process.env.PORT || 3000;

const server = createHTTPServer();

server.listen(PORT, () => {
  console.log(`[Server] Listening on http://localhost:${PORT}`);
  console.log(`[Server] BodyGraph proxy: POST /internal/hd`);
  console.log(`[Server] Health check: GET /health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down...');
  server.close(() => {
    console.log('[Server] Closed');
    process.exit(0);
  });
});
