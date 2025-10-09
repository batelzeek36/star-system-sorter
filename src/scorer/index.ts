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

// Import dependencies (to be implemented in tasks 3.2-3.4)
// import { loadCanon } from './canon';
// import { computeScore } from './score';
// import { resolveTies } from './tie';

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
  // TODO: Implement in task 3.2-3.4
  // 1. Load canon and compute checksum (task 3.2)
  // 2. Compute scores for all systems (task 3.3)
  // 3. Apply tie-breaking logic (task 3.4)
  // 4. Return result with meta information
  
  throw new Error(
    'classify() not yet implemented. Complete tasks 3.2-3.4 first: ' +
    'canon loading (3.2), scoring algorithm (3.3), and tie-breaking (3.4)'
  );
}

// Future exports (to be implemented in subsequent tasks):
// export { loadCanon } from './canon';
// export { computeScore } from './score';
// export { resolveTies } from './tie';
