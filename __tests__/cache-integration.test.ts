/**
 * Cache Integration Tests
 * Verifies caching behavior across different scenarios:
 * 1. Same data twice in one session → second is instant (no network log)
 * 2. Kill/restart the app; submit again → loads from persistent cache
 * 3. Fire two submits quickly → only one request goes out
 */

import { http, HttpResponse } from 'msw';
import { computeHDExtract, clearCache, clearMemoryCache } from '../src/hd/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://localhost:3000';

describe('Cache Integration Tests', () => {
  beforeEach(async () => {
    await clearCache();
    await AsyncStorage.clear();
  });

  describe('Scenario 1: Same data twice in one session → second is instant', () => {
    it('should return cached data instantly on second request (no network call)', async () => {
      let networkCallCount = 0;
      const startTimes: number[] = [];
      const endTimes: number[] = [];

      // Mock network response with delay to simulate real network
      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, async () => {
          networkCallCount++;
          // Simulate network latency
          await new Promise(resolve => setTimeout(resolve, 50));
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

      const params = {
        dateISO: '1992-10-03',
        time: '00:03',
        timeZone: 'America/New_York',
      };

      // First request - should hit network
      startTimes.push(Date.now());
      const result1 = await computeHDExtract(params);
      endTimes.push(Date.now());
      const firstRequestTime = endTimes[0] - startTimes[0];

      expect(networkCallCount).toBe(1);
      expect(result1.type).toBe('Generator');
      expect(firstRequestTime).toBeGreaterThanOrEqual(50); // Network delay

      // Second request - should be instant from cache
      startTimes.push(Date.now());
      const result2 = await computeHDExtract(params);
      endTimes.push(Date.now());
      const secondRequestTime = endTimes[1] - startTimes[1];

      // Verify no additional network call
      expect(networkCallCount).toBe(1);
      
      // Verify results are identical
      expect(result2).toEqual(result1);
      
      // Verify second request is much faster (cache hit)
      expect(secondRequestTime).toBeLessThan(10); // Should be <10ms from memory cache
      expect(secondRequestTime).toBeLessThan(firstRequestTime / 5); // At least 5x faster
      
      console.log(`First request: ${firstRequestTime}ms (network)`);
      console.log(`Second request: ${secondRequestTime}ms (cache)`);
      console.log(`Speed improvement: ${Math.round(firstRequestTime / secondRequestTime)}x faster`);
    });
  });

  describe('Scenario 2: Kill/restart app; submit again → loads from persistent cache', () => {
    it('should load from AsyncStorage after memory cache is cleared (simulating app restart)', async () => {
      let networkCallCount = 0;

      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, () => {
          networkCallCount++;
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

      const params = {
        dateISO: '1993-05-15',
        time: '14:30',
        timeZone: 'America/Los_Angeles',
      };

      // First request - populates both memory and AsyncStorage
      const result1 = await computeHDExtract(params);
      expect(networkCallCount).toBe(1);
      expect(result1.type).toBe('Projector');

      // Verify data is in AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('@hd_cache:'));
      expect(cacheKeys.length).toBeGreaterThan(0);

      // Simulate app restart by clearing memory cache only
      clearMemoryCache();
      console.log('Simulated app restart (memory cache cleared)');

      // Second request - should load from AsyncStorage (no network call)
      const startTime = Date.now();
      const result2 = await computeHDExtract(params);
      const loadTime = Date.now() - startTime;

      // Verify no additional network call
      expect(networkCallCount).toBe(1);
      
      // Verify results are identical
      expect(result2).toEqual(result1);
      
      // Verify it loaded from AsyncStorage (faster than network, slower than memory)
      expect(loadTime).toBeLessThan(50); // Should be <50ms from AsyncStorage
      
      console.log(`Loaded from AsyncStorage in ${loadTime}ms (no network call)`);
    });

    it('should survive multiple app restarts', async () => {
      let networkCallCount = 0;

      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, () => {
          networkCallCount++;
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

      const params = {
        dateISO: '1990-01-01',
        time: '00:00',
        timeZone: 'UTC',
      };

      // Initial request
      const result1 = await computeHDExtract(params);
      expect(networkCallCount).toBe(1);

      // Simulate multiple app restarts
      for (let i = 0; i < 3; i++) {
        clearMemoryCache();
        console.log(`App restart #${i + 1}`);
        
        const result = await computeHDExtract(params);
        expect(result).toEqual(result1);
        expect(networkCallCount).toBe(1); // Still only one network call
      }

      console.log('Survived 3 app restarts with only 1 network call');
    });
  });

  describe('Scenario 3: Fire two submits quickly → only one request goes out', () => {
    it('should coalesce simultaneous identical requests', async () => {
      let networkCallCount = 0;
      const requestTimestamps: number[] = [];

      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, async () => {
          requestTimestamps.push(Date.now());
          networkCallCount++;
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({
            Properties: {
              Type: { option: 'Generator' },
              InnerAuthority: { option: 'Sacral' },
              Profile: { option: '3/5' },
              Gates: { list: [{ option: 25 }] },
            },
          });
        })
      );

      const params = {
        dateISO: '1995-07-20',
        time: '09:15',
        timeZone: 'Europe/London',
      };

      // Fire 5 identical requests simultaneously
      console.log('Firing 5 simultaneous requests...');
      const startTime = Date.now();
      
      const promises = [
        computeHDExtract(params),
        computeHDExtract(params),
        computeHDExtract(params),
        computeHDExtract(params),
        computeHDExtract(params),
      ];

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // Verify only ONE network call was made
      expect(networkCallCount).toBe(1);
      expect(requestTimestamps.length).toBe(1);
      
      // Verify all results are identical
      results.forEach(result => {
        expect(result).toEqual(results[0]);
        expect(result.type).toBe('Generator');
      });

      // Verify total time is close to single request time (not 5x)
      expect(totalTime).toBeLessThan(200); // Should be ~100ms, not 500ms
      
      console.log(`5 requests completed in ${totalTime}ms with only 1 network call`);
      console.log('Request coalescing: SUCCESS ✓');
    });

    it('should handle rapid sequential requests with coalescing', async () => {
      let networkCallCount = 0;

      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, async () => {
          networkCallCount++;
          await new Promise(resolve => setTimeout(resolve, 50));
          return HttpResponse.json({
            Properties: {
              Type: { option: 'Reflector' },
              InnerAuthority: { option: 'Lunar' },
              Profile: { option: '6/2' },
              Gates: { list: [] },
            },
          });
        })
      );

      const params = {
        dateISO: '1988-12-25',
        time: '18:45',
        timeZone: 'Asia/Tokyo',
      };

      // Fire requests in rapid succession (not awaited)
      console.log('Firing rapid sequential requests...');
      const promise1 = computeHDExtract(params);
      const promise2 = computeHDExtract(params);
      
      // Small delay, then fire more
      await new Promise(resolve => setTimeout(resolve, 10));
      const promise3 = computeHDExtract(params);
      const promise4 = computeHDExtract(params);

      const results = await Promise.all([promise1, promise2, promise3, promise4]);

      // Should still only make one network call due to coalescing
      expect(networkCallCount).toBe(1);
      
      // All results should be identical
      results.forEach(result => {
        expect(result).toEqual(results[0]);
      });

      console.log(`4 rapid requests coalesced into 1 network call`);
    });
  });

  describe('Combined Scenarios', () => {
    it('should handle all three scenarios in sequence', async () => {
      let networkCallCount = 0;

      global.mswServer.use(
        http.post(`${baseUrl}/internal/hd`, async () => {
          networkCallCount++;
          await new Promise(resolve => setTimeout(resolve, 50));
          return HttpResponse.json({
            Properties: {
              Type: { option: 'Generator' },
              InnerAuthority: { option: 'Sacral' },
              Profile: { option: '4/6' },
              Gates: { list: [{ option: 1 }, { option: 2 }] },
            },
          });
        })
      );

      const params = {
        dateISO: '1985-03-10',
        time: '12:00',
        timeZone: 'America/Chicago',
      };

      console.log('\n=== COMBINED SCENARIO TEST ===\n');

      // Scenario 1: First request (network)
      console.log('1. First request (should hit network)...');
      const start1 = Date.now();
      const result1 = await computeHDExtract(params);
      const time1 = Date.now() - start1;
      console.log(`   ✓ Completed in ${time1}ms`);
      expect(networkCallCount).toBe(1);

      // Scenario 1: Second request (memory cache)
      console.log('2. Second request (should use memory cache)...');
      const start2 = Date.now();
      const result2 = await computeHDExtract(params);
      const time2 = Date.now() - start2;
      console.log(`   ✓ Completed in ${time2}ms (${Math.round(time1/time2)}x faster)`);
      expect(networkCallCount).toBe(1);
      expect(result2).toEqual(result1);

      // Scenario 3: Simultaneous requests (coalescing)
      console.log('3. Three simultaneous requests (should coalesce)...');
      const start3 = Date.now();
      const [r3a, r3b, r3c] = await Promise.all([
        computeHDExtract(params),
        computeHDExtract(params),
        computeHDExtract(params),
      ]);
      const time3 = Date.now() - start3;
      console.log(`   ✓ Completed in ${time3}ms`);
      expect(networkCallCount).toBe(1); // Still only 1 network call
      expect(r3a).toEqual(result1);
      expect(r3b).toEqual(result1);
      expect(r3c).toEqual(result1);

      // Scenario 2: App restart (AsyncStorage)
      console.log('4. Simulating app restart...');
      clearMemoryCache();
      console.log('   ✓ Memory cache cleared');
      
      console.log('5. Request after restart (should use AsyncStorage)...');
      const start4 = Date.now();
      const result4 = await computeHDExtract(params);
      const time4 = Date.now() - start4;
      console.log(`   ✓ Completed in ${time4}ms`);
      expect(networkCallCount).toBe(1); // Still only 1 network call!
      expect(result4).toEqual(result1);

      console.log('\n=== SUMMARY ===');
      console.log(`Total requests made: 8`);
      console.log(`Network calls: ${networkCallCount}`);
      console.log(`Cache efficiency: ${Math.round((7/8) * 100)}% of requests served from cache`);
      console.log('✓ All scenarios passed!\n');
    });
  });
});
