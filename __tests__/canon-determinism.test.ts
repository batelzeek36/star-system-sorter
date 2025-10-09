/**
 * Canon Checksum Determinism Verification
 * 
 * Verifies that loading the same mock canon multiple times
 * produces identical checksums (determinism requirement).
 * 
 * Requirements: 4.2, 4.8
 */

import {getCanonWithChecksum} from '../src/scorer/canon';

describe('Canon Checksum Determinism (Cross-Run Verification)', () => {
  it('should produce identical checksums across multiple loads', () => {
    console.log('\n=== Canon Checksum Determinism Test ===\n');

    // Load canon 5 times
    const results: Array<{canon: any; checksum: string}> = [];
    for (let i = 1; i <= 5; i++) {
      const result = getCanonWithChecksum();
      results.push(result);
      console.log(`Run ${i}: ${result.checksum}`);
    }

    // Verify all checksums match
    const firstChecksum = results[0].checksum;
    results.forEach(result => {
      expect(result.checksum).toBe(firstChecksum);
    });

    console.log(`\n✅ All 5 runs produced identical checksum: ${firstChecksum}\n`);
  });

  it('should produce the expected stable checksum for v0.1.0', () => {
    const {checksum, canon} = getCanonWithChecksum();

    // This is the stable checksum for mock canon v0.1.0
    // If this changes, the canon data has been modified
    const expectedChecksum =
      'de2f57a11af9cccf49ace7573b881ec10b17c7935eeabaeecac21a743437fe0c';

    console.log(`\nCanon version: ${canon.version}`);
    console.log(`Current checksum:  ${checksum}`);
    console.log(`Expected checksum: ${expectedChecksum}`);

    expect(checksum).toBe(expectedChecksum);
    console.log('✅ Checksum matches expected value\n');
  });

  it('should be deterministic across different execution contexts', () => {
    // Simulate different execution contexts by creating new closures
    const getChecksum1 = () => {
      const {checksum} = getCanonWithChecksum();
      return checksum;
    };

    const getChecksum2 = () => {
      const {checksum} = getCanonWithChecksum();
      return checksum;
    };

    const checksum1 = getChecksum1();
    const checksum2 = getChecksum2();

    console.log(`\nContext 1: ${checksum1}`);
    console.log(`Context 2: ${checksum2}`);

    expect(checksum1).toBe(checksum2);
    console.log('✅ Checksums match across contexts\n');
  });
});
