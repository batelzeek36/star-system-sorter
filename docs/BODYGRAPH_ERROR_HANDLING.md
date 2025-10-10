# BodyGraph Error Handling

## Error Codes

The API uses standard HTTP status codes with descriptive error messages:

| Status Code | Error Type            | Description                                  | Client Action                                 |
| ----------- | --------------------- | -------------------------------------------- | --------------------------------------------- |
| 400         | Invalid Input         | Malformed date, invalid timezone, bad format | Show validation error, prompt user to correct |
| 401         | Authentication Failed | Missing or invalid API key                   | Show "Service unavailable" (server issue)     |
| 429         | Rate Limit Exceeded   | Too many requests in time window             | Show "Too many requests, try again later"     |
| 500         | Internal Server Error | Server-side error                            | Show "Service error, try again"               |
| 503         | Service Unavailable   | BodyGraph API is down                        | Show "Service temporarily unavailable"        |

## Error Response Format

All errors return JSON with an `error` field:

```json
{
  "error": "Invalid birth data format"
}
```

For validation errors (400), additional details may be included:

```json
{
  "error": "Invalid request format",
  "details": [
    {
      "code": "invalid_string",
      "path": ["date"],
      "message": "Invalid date format"
    }
  ]
}
```

## Client Error Handling

The client API (`computeHDExtract`) throws descriptive errors:

```typescript
try {
  const result = await computeHDExtract({
    dateISO: '1992-10-03',
    time: '00:03',
    timeZone: 'America/New_York',
  });
} catch (error) {
  if (error instanceof Error) {
    // User-friendly error messages:
    // - "Invalid input: ..."
    // - "Server misconfiguration: ..."
    // - "Rate limit exceeded: ..."
    // - "Server error: ..."
    // - "No internet connection. Please check your network and try again."
    console.error(error.message);
  }
}
```

## Network Error Handling

Network failures (no connection, timeout) are caught and transformed:

```typescript
// Network errors
if (error instanceof TypeError && error.message.includes('fetch')) {
  throw new Error(
    'No internet connection. Please check your network and try again.',
  );
}
```

## Server-Side Error Mapping

The server proxy maps upstream BodyGraph errors to clean client errors:

```typescript
// apps/server/src/routes/hd.ts
if (status === 400) throw new Error('Invalid birth data format');
if (status === 401) throw new Error('API authentication failed');
if (status === 429) throw new Error('Rate limit exceeded');
if (status >= 500) throw new Error('BodyGraph service unavailable');
```

## Error Handling Best Practices

1. **Always catch errors** when calling `computeHDExtract`
2. **Show user-friendly messages** - don't expose technical details
3. **Provide retry options** for transient errors (429, 500, 503)
4. **Log errors** for debugging but don't log sensitive data
5. **Handle network errors** gracefully with offline messaging

## Related Documentation

- [API Reference](./BODYGRAPH_API_REFERENCE.md) - Endpoints and payloads
- [Troubleshooting](./BODYGRAPH_TROUBLESHOOTING.md) - Common issues
