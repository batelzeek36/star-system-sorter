/**
 * Tie-Breaking Logic
 * 
 * Implements tie-breaking rules for star system classification.
 * Determines primary, hybrid, or unresolved classification based on
 * score margins and contributor counts.
 * 
 * Requirements: 4.4, 4.5, 4.6
 */

import type {SystemScore, TiePolicy} from './types';

/**
 * Default tie policy configuration
 */
const DEFAULT_TIE_POLICY: TiePolicy = {
  minPrimaryPct: 0,
  hybridWindowPct: 6.0,
  leadPct: 0,
};

/**
 * Classification result from tie-breaking
 */
export interface TieBreakResult {
  /** Classification type */
  classification: 'primary' | 'hybrid' | 'unresolved';
  
  /** Primary system (if classification is 'primary') */
  primary?: string;
  
  /** Hybrid systems (if classification is 'hybrid'), ordered [higher, lower] */
  hybrid?: [string, string];
}

/**
 * Resolve ties between top-scoring systems
 * 
 * Applies tie-breaking logic based on score margins and contributor counts.
 * 
 * Algorithm:
 * 1. If lead margin >= hybridWindowPct: primary classification
 * 2. If lead margin < hybridWindowPct: check for hybrid
 * 3. Tie-break by contributor count, then lexicographic order
 * 
 * @param scores - System scores sorted by percentage (descending)
 * @param policy - Tie policy configuration (uses defaults if not provided)
 * @returns Classification result with primary or hybrid determination
 * 
 * Requirements:
 * - 4.4: Use hybridWindowPct as single numeric percentage (default 6.0)
 * - 4.5: If lead < hybridWindowPct, return hybrid:[A,B] with A higher
 * - 4.6: Tie-break by contributor count, then lexicographic order
 */
export function resolveTies(
  scores: SystemScore[],
  policy?: Partial<TiePolicy>
): TieBreakResult {
  // Merge with defaults
  const tiePolicy: TiePolicy = {
    ...DEFAULT_TIE_POLICY,
    ...policy,
  };

  // Handle edge cases
  if (scores.length === 0) {
    return {classification: 'unresolved'};
  }

  if (scores.length === 1) {
    return {
      classification: 'primary',
      primary: scores[0].system,
    };
  }

  // Get top two scores
  const [first, second] = scores;

  // Calculate lead margin
  const leadMargin = first.percentage - second.percentage;

  // Check if lead is clear (primary classification)
  if (leadMargin >= tiePolicy.hybridWindowPct) {
    return {
      classification: 'primary',
      primary: first.system,
    };
  }

  // Lead is within hybrid window - need to determine hybrid or tie-break
  // Check if scores are exactly equal (need tie-breaking)
  if (leadMargin === 0) {
    // Tie-break by contributor count
    const firstCount = first.contributors.length;
    const secondCount = second.contributors.length;

    if (firstCount > secondCount) {
      // First has more contributors - hybrid with first as primary
      return {
        classification: 'hybrid',
        hybrid: [first.system, second.system],
      };
    } else if (secondCount > firstCount) {
      // Second has more contributors - hybrid with second as primary
      return {
        classification: 'hybrid',
        hybrid: [second.system, first.system],
      };
    }

    // Same contributor count - tie-break by lexicographic order
    const sorted = [first.system, second.system].sort();
    return {
      classification: 'hybrid',
      hybrid: [sorted[0], sorted[1]] as [string, string],
    };
  }

  // Scores are different but within hybrid window
  // Return hybrid with higher percentage first
  return {
    classification: 'hybrid',
    hybrid: [first.system, second.system],
  };
}
