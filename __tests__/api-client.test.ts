/**
 * API Client Tests
 * Tests for BodyGraph Chart API integration
 */

import { http, HttpResponse } from 'msw';
import { computeHDExtract, clearCache } from '../src/hd/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://localhost:3000';

// Golden fixtures: Known birth data → Expected HDExtract
// These fixtures represent real-world test cases with expected outputs
const GOLDEN_FIXTURES = [
  {
    name: 'Steve Jobs',
    input: {
      dateISO: '1955-02-24',
      time: '19:15',
      timeZone: 'America/Los_Angeles',
    },
    mockResponse: {
      Properties: {
        Type: { option: 'Manifestor' },
        InnerAuthority: { option: 'Emotional - Solar Plexus' },
        Profile: { option: '1 / 3' },
        Gates: {
          list: [
            { option: 1 },
            { option: 8 },
            { option: 13 },
            { option: 25 },
            { option: 33 },
            { option: 55 },
          ],
        },
      },
    },
    expected: {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: ['G', 'Solar Plexus', 'Throat'], // Gates: 1,13,25→G, 8,33→Throat, 55→Solar Plexus
      channels: [1, 13], // Channels: [1,8] and [13,33]
      gates: [1, 8, 13, 25, 33, 55],
    },
  },
  {
    name: 'Marie Curie',
    input: {
      dateISO: '1867-11-07',
      time: '12:00',
      timeZone: 'Europe/Warsaw',
      lat: 52.2297,
      lon: 21.0122,
    },
    mockResponse: {
      Properties: {
        Type: { option: 'Projector' },
        InnerAuthority: { option: 'Splenic' },
        Profile: { option: '6 / 2' },
        Gates: {
          list: [
            { option: 2 },
            { option: 14 },
            { option: 29 },
            { option: 46 },
          ],
        },
      },
    },
    expected: {
      type: 'Projector',
      authority: 'Splenic',
      profile: '6/2',
      centers: ['G', 'Sacral'],
      channels: [2, 29], // Channels: [2,14] and [29,46]
      gates: [2, 14, 29, 46],
    },
  },
  {
    name: 'Nelson Mandela',
    input: {
      dateISO: '1918-07-18',
      time: '14:54',
      timeZone: 'Africa/Johannesburg',
      lat: -28.4793,
      lon: 24.6727,
    },
    mockResponse: {
      Properties: {
        Type: { option: 'Manifesting Generator' },
        InnerAuthority: { option: 'Sacral' },
        Profile: { option: '5 / 1' },
        Gates: {
          list: [
            { option: 3 },
            { option: 9 },
            { option: 27 },
            { option: 34 },
            { option: 50 },
            { option: 59 },
          ],
        },
      },
    },
    expected: {
      type: 'Manifesting Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: ['Sacral', 'Spleen'], // Gates: 3,9,27,34,59→Sacral, 50→Spleen
      channels: [27], // Only channel [27,50] is complete
      gates: [3, 9, 27, 34, 50, 59],
    },
  },
];

describe('computeHDExtract', () => {
  beforeEach(async () => {
    // Clear cache before each test
    await clearCache();
    await AsyncStorage.clear();
  });
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
      centers: ['G', 'Root'],
      channels: [], // No complete channels (1 needs 8, 2 needs 14, 53 needs 42)
      gates: [1, 2, 53],
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

  it('should handle error responses with invalid JSON (use statusText)', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return new HttpResponse('Internal Server Error', {
          status: 500,
          statusText: 'Internal Server Error',
        });
      })
    );

    await expect(
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow('Server error: Internal Server Error');
  });

  it('should handle unexpected error status codes', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json(
          { error: 'Payment required' },
          { status: 402 }
        );
      })
    );

    await expect(
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow('API error (402): Payment required');
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
      centers: [], // No gates, so no centers
      channels: [], // No gates, so no channels
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
    expect(result.centers).toContain('G'); // Gates 1, 13, 25, 46 map to G and Sacral
    expect(result.channels).toEqual([]); // No complete channels (1 needs 8, 13 needs 33, 25 needs 51, 46 needs 29)
  });

  it('should handle various authority types', async () => {
    const authorityTests = [
      { input: 'Sacral', expected: 'Sacral', date: '1992-10-03' },
      { input: 'Splenic', expected: 'Splenic', date: '1992-10-04' },
      { input: 'Ego Manifested', expected: 'Ego', date: '1992-10-05' },
      { input: 'Ego Projected', expected: 'Ego', date: '1992-10-06' },
      { input: 'Self Projected', expected: 'Self-Projected', date: '1992-10-07' },
      { input: 'Mental Projector', expected: 'Mental', date: '1992-10-08' },
      { input: 'Lunar', expected: 'Lunar', date: '1992-10-09' },
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
        dateISO: test.date,
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

describe('Golden Fixtures (Known Inputs → Expected Outputs)', () => {
  beforeEach(async () => {
    await clearCache();
    await AsyncStorage.clear();
  });

  GOLDEN_FIXTURES.forEach((fixture) => {
    it(`should correctly transform data for ${fixture.name}`, async () => {
      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, () => {
          return HttpResponse.json(fixture.mockResponse);
        })
      );

      const result = await computeHDExtract(fixture.input);

      expect(result).toEqual(fixture.expected);
    });
  });

  it('should handle timezone conversion correctly for all fixtures', async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      let capturedBody: any;

      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(fixture.mockResponse);
        })
      );

      await computeHDExtract(fixture.input);

      // Verify the date and time are formatted correctly
      expect(capturedBody.date).toBe(
        `${fixture.input.dateISO} ${fixture.input.time}`
      );
      expect(capturedBody.timezone).toBe(fixture.input.timeZone);

      // Clear cache between fixtures
      await clearCache();
    }
  });

  it('should cache golden fixture results correctly', async () => {
    const fixture = GOLDEN_FIXTURES[0]; // Steve Jobs
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
        return HttpResponse.json(fixture.mockResponse);
      })
    );

    // First call
    const result1 = await computeHDExtract(fixture.input);
    expect(callCount).toBe(1);
    expect(result1).toEqual(fixture.expected);

    // Second call - should use cache
    const result2 = await computeHDExtract(fixture.input);
    expect(callCount).toBe(1); // No additional network call
    expect(result2).toEqual(fixture.expected);
  });

  it('should handle lat/lon coordinates in golden fixtures', async () => {
    const fixtureWithCoords = GOLDEN_FIXTURES.find(f => f.input.lat !== undefined);
    const fixtureWithoutCoords = GOLDEN_FIXTURES.find(f => f.input.lat === undefined);

    if (!fixtureWithCoords || !fixtureWithoutCoords) {
      throw new Error('Test setup error: need fixtures with and without coordinates');
    }

    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
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

    // Call with coordinates
    await computeHDExtract(fixtureWithCoords.input);
    expect(callCount).toBe(1);

    // Call without coordinates (different cache key)
    await computeHDExtract(fixtureWithoutCoords.input);
    expect(callCount).toBe(2);
  });
});

describe('API Client Caching', () => {
  beforeEach(async () => {
    await clearCache();
    await AsyncStorage.clear();
  });

  it('should cache successful responses', async () => {
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Generator' },
            InnerAuthority: { option: 'Sacral' },
            Profile: { option: '1/3' },
            Gates: { list: [{ option: 1 }] },
          },
        });
      })
    );

    // First call - should hit network
    const result1 = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(callCount).toBe(1);
    expect(result1.type).toBe('Generator');

    // Second call with same params - should use cache
    const result2 = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(callCount).toBe(1); // No additional network call
    expect(result2).toEqual(result1);
  });

  it('should cache with different lat/lon coordinates', async () => {
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
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

    // Call with lat/lon
    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
      lat: 40.7128,
      lon: -74.006,
    });

    expect(callCount).toBe(1);

    // Same params - should use cache
    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
      lat: 40.7128,
      lon: -74.006,
    });

    expect(callCount).toBe(1);

    // Different lat/lon - should make new request
    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
      lat: 34.0522,
      lon: -118.2437,
    });

    expect(callCount).toBe(2);
  });

  it('should coalesce identical in-flight requests', async () => {
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, async () => {
        callCount++;
        // Simulate slow network
        await new Promise(resolve => setTimeout(resolve, 100));
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

    // Make 3 identical requests simultaneously
    const promises = [
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      }),
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      }),
      computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      }),
    ];

    const results = await Promise.all(promises);

    // Should only make one network call
    expect(callCount).toBe(1);
    // All results should be identical
    expect(results[0]).toEqual(results[1]);
    expect(results[1]).toEqual(results[2]);
  });

  it('should persist cache to AsyncStorage', async () => {
    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Projector' },
            InnerAuthority: { option: 'Splenic' },
            Profile: { option: '2/4' },
            Gates: { list: [{ option: 13 }] },
          },
        });
      })
    );

    // Make request
    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    // Check AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith('@hd_cache:'));
    
    expect(cacheKeys.length).toBeGreaterThan(0);

    // Verify stored data
    const stored = await AsyncStorage.getItem(cacheKeys[0]);
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.data.type).toBe('Projector');
    expect(parsed.timestamp).toBeDefined();
  });

  it('should use AsyncStorage cache after memory cache is cleared', async () => {
    const { clearMemoryCache } = require('../src/hd/api-client');
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
        return HttpResponse.json({
          Properties: {
            Type: { option: 'Manifestor' },
            InnerAuthority: { option: 'Emotional' },
            Profile: { option: '5/1' },
            Gates: { list: [] },
          },
        });
      })
    );

    // First call - populates both caches
    const result1 = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(callCount).toBe(1);

    // Clear only memory cache (simulate app restart)
    clearMemoryCache();

    // Second call - should use AsyncStorage cache
    const result2 = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    expect(callCount).toBe(1); // No additional network call
    expect(result2).toEqual(result1);
  });

  it('should not cache error responses', async () => {
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        );
      })
    );

    // First call - should fail
    try {
      await computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(callCount).toBe(1);

    // Second call - should try again (not cached)
    try {
      await computeHDExtract({
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(callCount).toBe(2);
  });

  it('should generate different cache keys for different parameters', async () => {
    let callCount = 0;

    global.mswServer.use(
      http.post(`${baseUrl}/internal/hd`, () => {
        callCount++;
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

    // Different dates
    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    await computeHDExtract({
      dateISO: '1993-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });

    // Different times
    await computeHDExtract({
      dateISO: '1992-10-03',
      time: '12:30',
      timeZone: 'America/New_York',
    });

    // Each should be a separate network call
    expect(callCount).toBe(3);
  });
});
