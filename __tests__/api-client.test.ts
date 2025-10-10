/**
 * API Client Tests
 * Tests for BodyGraph Chart API integration
 */

import { http, HttpResponse } from 'msw';
import { computeHDExtract } from '../src/hd/api-client';

const baseUrl = 'http://localhost:3000';

describe('computeHDExtract', () => {
  it('should successfully fetch and transform HD data', async () => {
    // Mock successful response
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Manifesting Generator' },
            InnerAuthority: { option: 'Emotional - Solar Plexus' },
            Profile: { option: '2 / 4' },
            Gates: {
              list: [
                { option: 2 },
                { option: 1 },
                { option: 53 },
              ],
            },
          },
        });
      })
    );

    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(result).toEqual({
      type: 'Manifesting Generator',
      authority: 'Emotional',
      profile: '2/4',
      centers: [],
      channels: [],
      gates: [2, 1, 53],
    });
  });

  it('should normalize authority names correctly', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Generator' },
            InnerAuthority: { option: 'Emotional - Solar Plexus' },
            Profile: { option: '1/3' },
            Gates: { list: [] },
          },
        });
      })
    );

    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(result.authority).toBe('Emotional');
  });

  it('should normalize profile format (remove spaces)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Projector' },
            InnerAuthority: { option: 'Splenic' },
            Profile: { option: '6 / 2' },
            Gates: { list: [] },
          },
        });
      })
    );

    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(result.profile).toBe('6/2');
  });

  it('should handle 400 errors (invalid input)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json(
          { error: 'Invalid birth data format' },
          { status: 400 }
        );
      })
    );

    await expect(
      computeHDExtract({
        dateISO: 'invalid',
        time: 'invalid',
        timeZone: 'invalid',
      })
    ).rejects.toThrow('Invalid input');
  });

  it('should handle 401 errors (server misconfiguration)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json(
          { error: 'API authentication failed' },
          { status: 401 }
        );
      })
    );

    await expect(
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow('Server misconfiguration');
  });

  it('should handle 429 errors (rate limit)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      })
    );

    await expect(
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow('Rate limit exceeded');
  });

  it('should handle 500 errors (server error)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json(
          { error: 'BodyGraph service unavailable' },
          { status: 503 }
        );
      })
    );

    await expect(
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow('Server error');
  });

  it('should format date and time correctly', async () => {
    let capturedBody: any;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Generator' },
            InnerAuthority: { option: 'Sacral' },
            Profile: { option: '1/3' },
            Gates: { list: [] },
          },
        });
      })
    );

    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(capturedBody).toEqual({
      date: '1992-10-03 00:03',
      timezone: 'America/New_York',
    });
  });

  it('should handle missing optional fields gracefully', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json({
          Properties: {},
        });
      })
    );

    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(result).toEqual({
      type: 'Generator',
      authority: 'Sacral',
      profile: '1/3',
      centers: [],
      channels: [],
      gates: [],
    });
  });

  it('should extract gate numbers correctly', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Generator' },
            InnerAuthority: { option: 'Sacral' },
            Profile: { option: '1/3' },
            Gates: {
              list: [
                { option: 1 },
                { option: 13 },
                { option: 25 },
                { option: 46 },
              ],
            },
          },
        });
      })
    );

    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(result.gates).toEqual([1, 13, 25, 46]);
  });

  it('should handle various authority types', async () => {
    const authorityTests = [
      { input: 'Sacral', expected: 'Sacral' },
      { input: 'Splenic', expected: 'Splenic' },
      { input: 'Ego Manifested', expected: 'Ego' },
      { input: 'Ego Projected', expected: 'Ego' },
      { input: 'Self Projected', expected: 'Self-Projected' },
      { input: 'Mental Projector', expected: 'Mental' },
      { input: 'Lunar', expected: 'Lunar' },
    ];

    for (const test of authorityTests) {
      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, () => {
          return HttpResponse.json({
            Properties: {
              Type: { option: 'Generator' },
              InnerAuthority: { option: test.input },
              Profile: { option: '1/3' },
              Gates: { list: [] },
            },
          });
        })
      );

      const result = await computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      });

      expect(result.authority).toBe(test.expected);
    }
  });

  it('should handle network errors (airplane mode, no connection)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.error();
      })
    );

    await expect(
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow('No internet connection');
  });
});
