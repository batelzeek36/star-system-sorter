// @exception(max-lines) why: Core scoring algorithm with attribute key generation, scoring logic, and normalization - comprehensive implementation
/**
 * Core Scoring Algorithm
 * 
 * Implements weighted scoring logic for star system classification.
 * Normalizes scores to 0.1% precision and calculates per-system
 * percentages and contributors.
 * 
 * Requirements: 4.3, 4.10
 */

import type {HDExtract, Canon, SystemScore, Contributor} from './types';

/**
 * Generate attribute keys from HD extract
 * 
 * Converts HD extract data into weighted attribute keys that match
 * canon weight definitions (e.g., "type_manifestor", "gate_1").
 */
function generateAttributeKeys(extract: HDExtract): string[] {
  const keys: string[] = [];

  // Type key (lowercase, underscored)
  if (extract.type) {
    keys.push(`type_${extract.type.toLowerCase().replace(/\s+/g, '_')}`);
  }

  // Authority key (lowercase, underscored)
  if (extract.authority) {
    keys.push(
      `authority_${extract.authority.toLowerCase().replace(/\s+/g, '_')}`
    );
  }

  // Profile key (underscored)
  if (extract.profile) {
    keys.push(`profile_${extract.profile.replace('/', '_')}`);
  }

  // Center keys (lowercase, underscored, with "_defined" suffix)
  if (extract.centers && extract.centers.length > 0) {
    extract.centers.forEach(center => {
      keys.push(
        `center_${center.toLowerCase().replace(/\s+/g, '_')}_defined`
      );
    });

    // Special case: all centers open (for Reflectors)
    if (extract.centers.length === 0 && extract.type.toLowerCase() === 'reflector') {
      keys.push('center_all_open');
    }
  }

  // Channel keys (format: "channel_X_Y")
  if (extract.channels && extract.channels.length > 0) {
    extract.channels.forEach(channel => {
      keys.push(`channel_${channel}`);
    });
  }

  // Gate keys (format: "gate_X")
  if (extract.gates && extract.gates.length > 0) {
    extract.gates.forEach(gate => {
      keys.push(`gate_${gate}`);
    });
  }

  return keys;
}

/**
 * Create human-readable label from attribute key
 */
function createLabel(key: string): string {
  // Handle different key formats
  if (key.startsWith('type_')) {
    const type = key.replace('type_', '').replace(/_/g, ' ');
    return `Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  if (key.startsWith('authority_')) {
    const auth = key.replace('authority_', '').replace(/_/g, ' ');
    return `Authority: ${auth.charAt(0).toUpperCase() + auth.slice(1)}`;
  }

  if (key.startsWith('profile_')) {
    const profile = key.replace('profile_', '').replace('_', '/');
    return `Profile: ${profile}`;
  }

  if (key.startsWith('center_')) {
    const center = key
      .replace('center_', '')
      .replace('_defined', '')
      .replace(/_/g, ' ');
    return `Center: ${center.charAt(0).toUpperCase() + center.slice(1)}`;
  }

  if (key.startsWith('channel_')) {
    const channel = key.replace('channel_', '');
    return `Channel: ${channel}`;
  }

  if (key.startsWith('gate_')) {
    const gate = key.replace('gate_', '');
    return `Gate: ${gate}`;
  }

  return key;
}

/**
 * Compute raw score for a single system
 * 
 * Sums weights for all matching attributes between HD extract
 * and system weights.
 */
function computeSystemScore(
  systemName: string,
  systemWeights: Record<string, number>,
  attributeKeys: string[]
): {rawScore: number; contributors: Contributor[]} {
  let rawScore = 0;
  const contributors: Contributor[] = [];

  // Check each attribute key against system weights
  attributeKeys.forEach(key => {
    const weight = systemWeights[key];
    if (weight !== undefined && weight > 0) {
      rawScore += weight;
      contributors.push({
        key,
        weight,
        label: createLabel(key),
      });
    }
  });

  return {rawScore, contributors};
}

/**
 * Normalize scores to percentages with 0.1% precision
 * 
 * Converts raw scores to percentages that sum to 100.0%
 * with one decimal place precision.
 */
function normalizeScores(
  scores: Array<{system: string; rawScore: number}>
): Record<string, number> {
  const totalScore = scores.reduce((sum, s) => sum + s.rawScore, 0);

  // Handle edge case: no scores
  if (totalScore === 0) {
    const percentages: Record<string, number> = {};
    scores.forEach(s => {
      percentages[s.system] = 0;
    });
    return percentages;
  }

  // Calculate percentages with 0.1% precision
  const percentages: Record<string, number> = {};
  scores.forEach(s => {
    const pct = (s.rawScore / totalScore) * 100;
    // Round to 0.1% precision
    percentages[s.system] = Math.round(pct * 10) / 10;
  });

  return percentages;
}

/**
 * Compute scores for all systems
 * 
 * Main scoring function that processes HD extract against canon
 * and returns detailed scoring information for each system.
 * 
 * @param extract - HD extract data from birth chart
 * @param canon - Canon with system weights
 * @returns Array of system scores with percentages and contributors
 */
export function computeScores(
  extract: HDExtract,
  canon: Canon
): SystemScore[] {
  // Generate attribute keys from HD extract
  const attributeKeys = generateAttributeKeys(extract);

  // Compute raw scores for each system
  const rawScores: Array<{
    system: string;
    rawScore: number;
    contributors: Contributor[];
  }> = [];

  Object.entries(canon.systems).forEach(([systemName, systemData]) => {
    const {rawScore, contributors} = computeSystemScore(
      systemName,
      systemData.weights,
      attributeKeys
    );

    rawScores.push({
      system: systemName,
      rawScore,
      contributors,
    });
  });

  // Normalize to percentages
  const percentages = normalizeScores(rawScores);

  // Build final system scores
  const systemScores: SystemScore[] = rawScores.map(s => ({
    system: s.system,
    rawScore: s.rawScore,
    percentage: percentages[s.system],
    contributors: s.contributors,
  }));

  // Sort by percentage (descending)
  systemScores.sort((a, b) => b.percentage - a.percentage);

  return systemScores;
}
