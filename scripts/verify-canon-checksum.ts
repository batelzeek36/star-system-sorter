/**
 * Canon Checksum Verification Script
 * 
 * Verifies that canon checksum is deterministic across multiple runs.
 * 
 * Usage from project root:
 *   npx ts-node scripts/verify-canon-checksum.ts
 *   npx ts-node scripts/verify-canon-checksum.ts  # Run again to verify
 */

import { getCanonWithChecksum } from '../src/scorer/canon';

console.log('=== Canon Checksum Verification ===\n');

// Run 5 times to verify determinism
const checksums: string[] = [];
const versions: string[] = [];

for (let i = 1; i <= 5; i++) {
  const { canon, checksum } = getCanonWithChecksum();
  checksums.push(checksum);
  versions.push(canon.version);
  
  console.log(`Run ${i}:`);
  console.log(`  Version:  ${canon.version}`);
  console.log(`  Checksum: ${checksum}`);
  console.log(`  Systems:  ${Object.keys(canon.systems).length}`);
  console.log();
}

// Verify all checksums match
const allMatch = checksums.every(c => c === checksums[0]);
const allVersionsMatch = versions.every(v => v === versions[0]);

console.log('=== Verification Results ===');
console.log(`All checksums match: ${allMatch ? '✅ PASS' : '❌ FAIL'}`);
console.log(`All versions match:  ${allVersionsMatch ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Checksum length:     ${checksums[0].length} chars (expected: 64)`);
console.log(`Checksum format:     ${/^[a-f0-9]{64}$/.test(checksums[0]) ? '✅ Valid hex' : '❌ Invalid'}`);

if (!allMatch) {
  console.log('\n❌ ERROR: Checksums do not match!');
  checksums.forEach((c, i) => console.log(`  Run ${i + 1}: ${c}`));
  process.exit(1);
}

console.log('\n✅ Canon checksum is deterministic!');
console.log(`Stable checksum: ${checksums[0]}`);
