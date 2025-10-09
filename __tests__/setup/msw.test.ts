const { http, HttpResponse } = require('msw');

describe('MSW Setup', () => {
  const server = global.mswServer;
  const baseUrl = 'http://localhost:3000';

  it('should mock API endpoints correctly', async () => {
    // Test that MSW is configured and working
    const response = await fetch(`${baseUrl}/api/events/active`);
    const data = await response.json();

    expect(data).toHaveProperty('events');
    expect(Array.isArray(data.events)).toBe(true);
  });

  it('should allow overriding handlers per test', async () => {
    // Override the default handler for this test
    server.use(
      http.get(`${baseUrl}/api/events/active`, () => {
        return HttpResponse.json({
          events: [
            {
              id: 'custom-event',
              name: 'Custom Event',
              start_date: '2025-11-01',
              end_date: '2025-11-30',
              game_key: 'super_dash',
            },
          ],
        });
      })
    );

    const response = await fetch(`${baseUrl}/api/events/active`);
    const data = await response.json();

    expect(data.events[0].id).toBe('custom-event');
    expect(data.events[0].name).toBe('Custom Event');
  });

  it('should reset handlers after each test', async () => {
    // This test verifies that the override from the previous test was reset
    const response = await fetch(`${baseUrl}/api/events/active`);
    const data = await response.json();

    expect(data.events[0].id).toBe('test-event');
    expect(data.events[0].name).toBe('Test Event');
  });
});
