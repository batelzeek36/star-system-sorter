// @exception(max-lines) why: Comprehensive type definitions with extensive JSDoc documentation for API clarity
/**
 * Scorer Types and Interfaces
 * 
 * Defines TypeScript interfaces for the deterministic star system
 * classification system based on Human Design principles.
 * 
 * Requirements: 4.1, 4.7
 */

/**
 * Human Design Extract
 * 
 * Core HD data extracted from birth chart calculation.
 * Used as input to the scoring algorithm.
 */
export interface HDExtract {
  /** HD type (e.g., "Manifestor", "Generator", "Projector", "Reflector") */
  type: string;
  
  /** Authority type (e.g., "Emotional", "Sacral", "Splenic") */
  authority: string;
  
  /** Profile (e.g., "1/3", "2/4", "3/5") */
  profile: string;
  
  /** Defined centers (e.g., ["Sacral", "Spleen", "Throat"]) */
  centers: string[];
  
  /** Active channels (gate pairs, e.g., [34-57, 18-58]) */
  channels: number[];
  
  /** Active gates (e.g., [1, 2, 3, 13, 25]) */
  gates: number[];
}

/**
 * System Weights
 * 
 * Defines weighted scoring rules for a single star system.
 * Each key represents an HD attribute, value is the weight.
 */
export interface SystemWeights {
  /** Weighted scoring rules (e.g., { "type_manifestor": 15, "gate_1": 5 }) */
  weights: Record<string, number>;
  
  /** Human-readable explanation of why these weights matter */
  why: string;
}

/**
 * Canon
 * 
 * Complete canon data structure containing all star system definitions.
 * Loaded from YAML and validated at runtime.
 */
export interface Canon {
  /** Canon version string (e.g., "0.1.0") */
  version: string;
  
  /** Map of star system name to its weights */
  systems: Record<string, SystemWeights>;
}

/**
 * Tie Policy
 * 
 * Configuration for tie-breaking logic when multiple systems
 * have similar scores.
 */
export interface TiePolicy {
  /** Minimum percentage for primary classification (default: 0) */
  minPrimaryPct: number;
  
  /** Percentage window for hybrid classification (default: 6.0) */
  hybridWindowPct: number;
  
  /** Minimum lead percentage for clear primary (default: 0) */
  leadPct: number;
}

/**
 * Contributor
 * 
 * Represents a single HD attribute that contributed to a system's score.
 */
export interface Contributor {
  /** Attribute key (e.g., "type_manifestor", "gate_1") */
  key: string;
  
  /** Weight value from canon */
  weight: number;
  
  /** Human-readable label (e.g., "Type: Manifestor", "Gate 1") */
  label: string;
}

/**
 * System Score
 * 
 * Detailed scoring information for a single star system.
 */
export interface SystemScore {
  /** Star system name */
  system: string;
  
  /** Raw score (sum of weights) */
  rawScore: number;
  
  /** Normalized percentage (0-100, precision 0.1%) */
  percentage: number;
  
  /** List of contributing attributes */
  contributors: Contributor[];
}

/**
 * Scorer Result
 * 
 * Complete classification result with primary/hybrid determination,
 * percentages, and metadata.
 */
export interface ScorerResult {
  /** Classification type */
  classification: 'primary' | 'hybrid' | 'unresolved';
  
  /** Primary system (if classification is 'primary') */
  primary?: string;
  
  /** Hybrid systems (if classification is 'hybrid'), ordered by percentage */
  hybrid?: [string, string];
  
  /** Allied systems with percentages, sorted by score */
  allies: Array<{ system: string; percentage: number }>;
  
  /** All system percentages */
  percentages: Record<string, number>;
  
  /** Contributors per system (attribute keys that contributed to each system's score) */
  contributorsPerSystem: Record<string, string[]>;
  
  /** Metadata about the classification */
  meta: {
    /** Canon version used */
    canonVersion: string;
    
    /** SHA256 checksum of canonicalized canon JSON */
    canonChecksum: string;
  };
}

/**
 * Classification Options
 * 
 * Optional configuration for the classification algorithm.
 */
export interface ClassificationOptions {
  /** Custom tie policy (uses defaults if not provided) */
  tiePolicy?: Partial<TiePolicy>;
  
  /** Whether to include detailed contributor information */
  includeContributors?: boolean;
}
