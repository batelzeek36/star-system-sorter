#!/bin/bash

# Kill any existing server on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "Starting server..."
cd "$(dirname "$0")"
node --env-file=../../.env --loader ts-node/esm src/index.ts &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
sleep 3

echo ""
echo "=== Test 1: Valid request (should return 200 with JSON) ==="
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"2019-05-05 10:10","timezone":"Europe/London"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "=== Test 2: Same request again (should see cache hit in logs) ==="
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"2019-05-05 10:10","timezone":"Europe/London"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "=== Test 3: Invalid date format (should return 400) ==="
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"05/05/2019 10:10","timezone":"Europe/London"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "=== Test 4: Missing timezone (should return 400) ==="
curl -X POST http://localhost:3000/internal/hd \
  -H "Content-Type: application/json" \
  -d '{"date":"2019-05-05 10:10"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "=== Test 5: Health check ==="
curl http://localhost:3000/health -w "\nHTTP Status: %{http_code}\n" -s

echo ""
echo "Stopping server (PID: $SERVER_PID)..."
kill $SERVER_PID 2>/dev/null || true

echo "Done!"
