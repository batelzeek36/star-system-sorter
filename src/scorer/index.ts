/**
 * Scorer Module - Public API
 * 
 * Deterministic star system classification based on Human Design principles.
 * 
 * Usage:
 *   import { classify, type HDExtract, type ScorerResult } from '@/scorer';
 * 
 *   const result = await classify(hdExtract, { tiePolicy: { hybridWindowPct: 6.0 } });
 *   console.log(result.classification, result.primary || result.hybrid);
 * 
 * Requirements: 4.7, 4.9
 */

// Export all types
export type {
  HDExtract,
  SystemWeights,
  Canon,
  TiePolicy,
  Contributor,
  SystemScore,
  ScorerResult,
  ClassificationOptions,
} from './types';

// Import dependencies
import { loadCanon, computeCanonChecksum, getCanonWithChecksum } from './canon';
import { computeScores } from './score';
import { resolveTies } from './tie';

import type { HDExtract, ScorerResult, ClassificationOptions } from './types';

/**
 * Classify an HD extract into a star system
 * 
 * Main entry point for the scorer. Takes HD chart data and returns
 * a deterministic classification with percentages and metadata.
 * 
 * @param extract - Human Design extract from chart calculation
 * @param options - Optional classification configuration
 * @returns Promise resolving to classification result with meta information
 * 
 * @example
 * ```typescript
 * const hdExtract = {
 *   type: 'Manifestor',
 *   authority: 'Emotional',
 *   profile: '1/3',
 *   centers: ['Sacral', 'Throat'],
 *   channels: [34-57],
 *   gates: [1, 13, 25]
 * };
 * 
 * const result = await classify(hdExtract);
 * // result.classification: 'primary' | 'hybrid' | 'unresolved'
 * // result.primary: 'Pleiades' (if primary)
 * // result.meta.canonVersion: '0.1.0'
 * // result.meta.canonChecksum: 'sha256...'
 * ```
 */
export async function classify(
  extract: HDExtract,
  options?: ClassificationOptions
): Promise<ScorerResult> {
  // 1. Load canon and compute checksum (task 3.2)
  const { canon, checksum } = await getCanonWithChecksum();
  
  // 2. Compute scores for all systems (task 3.3)
  const systemScores = computeScores(extract, canon);
  
  // 3. Apply tie-breaking logic (task 3.4)
  const tieBreakResult = resolveTies(systemScores, options?.tiePolicy);
  
  // 4. Build result with meta information
  const percentages: Record<string, number> = {};
  const contributorsPerSystem: Record<string, string[]> = {};
  
  systemScores.forEach(score => {
    percentages[score.system] = score.percentage;
    contributorsPerSystem[score.system] = score.contributors.map(c => c.key);
  });
  
  // Build allies list (all systems except primary/hybrid, sorted by percentage)
  const alliesSet = new Set(systemScores.map(s => s.system));
  if (tieBreakResult.primary) {
    alliesSet.delete(tieBreakResult.primary);
  }
  if (tieBreakResult.hybrid) {
    tieBreakResult.hybrid.forEach(sys => alliesSet.delete(sys));
  }
  
  const allies = systemScores
    .filter(s => alliesSet.has(s.system))
    .map(s => ({ system: s.system, percentage: s.percentage }));
  
  return {
    classification: tieBreakResult.classification,
    primary: tieBreakResult.primary,
    hybrid: tieBreakResult.hybrid,
    allies,
    percentages,
    contributorsPerSystem,
    meta: {
      canonVersion: canon.version,
      canonChecksum: checksum,
    },
  };
}

// Canon exports (task 3.2 complete)
export { loadCanon, computeCanonChecksum, getCanonWithChecksum } from './canon';

// Score exports (task 3.3 complete)
export { computeScores } from './score';

// Tie-breaking exports (task 3.4 complete)
export { resolveTies } from './tie';
