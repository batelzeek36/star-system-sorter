/**
 * Canon Loading and Validation
 * 
 * Loads mock canon YAML, validates structure with Zod,
 * and computes SHA256 checksum for canonicalized JSON.
 * 
 * Requirements: 4.2, 4.8
 */

import {z} from 'zod';
import type {Canon} from './types';

/**
 * Pure JavaScript SHA256 implementation (React Native compatible)
 * Based on standard SHA256 algorithm
 */
function sha256(message: string): string {
  // Convert string to UTF-8 bytes
  const utf8 = unescape(encodeURIComponent(message));
  const bytes = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    bytes[i] = utf8.charCodeAt(i);
  }

  // SHA256 constants
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  // Initial hash values
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  // Pre-processing
  const ml = bytes.length * 8;
  const paddedLength = Math.ceil((ml + 65) / 512) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  // Append length as 64-bit big-endian
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 4, ml & 0xffffffff, false);

  // Process 512-bit chunks
  for (let i = 0; i < paddedLength; i += 64) {
    const w = new Uint32Array(64);

    // Copy chunk into first 16 words
    for (let j = 0; j < 16; j++) {
      w[j] = view.getUint32(i + j * 4, false);
    }

    // Extend into remaining 48 words
    for (let j = 16; j < 64; j++) {
      const s0 =
        ((w[j - 15] >>> 7) | (w[j - 15] << 25)) ^
        ((w[j - 15] >>> 18) | (w[j - 15] << 14)) ^
        (w[j - 15] >>> 3);
      const s1 =
        ((w[j - 2] >>> 17) | (w[j - 2] << 15)) ^
        ((w[j - 2] >>> 19) | (w[j - 2] << 13)) ^
        (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    // Initialize working variables
    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      h = h7;

    // Main loop
    for (let j = 0; j < 64; j++) {
      const S1 =
        ((e >>> 6) | (e << 26)) ^
        ((e >>> 11) | (e << 21)) ^
        ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 =
        ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Add chunk hash to result
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  // Produce final hash
  const hash = [h0, h1, h2, h3, h4, h5, h6, h7];
  return hash.map(h => h.toString(16).padStart(8, '0')).join('');
}

// Zod schema for SystemWeights validation
const SystemWeightsSchema = z.object({
  weights: z.record(z.string(), z.number()),
  why: z.string().min(1),
});

// Zod schema for Canon validation
const CanonSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  systems: z.record(z.string(), SystemWeightsSchema),
});

/**
 * Mock canon data (inline for React Native compatibility)
 * In production, this would be loaded from a YAML file or API
 */
const MOCK_CANON_DATA = {
  version: '0.1.0',
  systems: {
    Pleiades: {
      weights: {
        type_manifestor: 15,
        type_generator: 10,
        authority_emotional: 12,
        profile_1_3: 8,
        profile_3_5: 7,
        center_sacral_defined: 10,
        center_throat_defined: 8,
        channel_3457: 20,
        channel_2034: 15,
        gate_1: 5,
        gate_13: 6,
        gate_25: 7,
      },
      why: 'Manifestors with emotional authority and channel 34-57 show strong Pleiadian alignment. These individuals are natural initiators with powerful creative energy.',
    },
    Sirius: {
      weights: {
        type_projector: 15,
        type_generator: 8,
        authority_splenic: 12,
        authority_emotional: 10,
        profile_2_4: 10,
        profile_4_6: 9,
        center_spleen_defined: 10,
        center_g_defined: 8,
        channel_1858: 18,
        channel_1057: 14,
        gate_2: 5,
        gate_14: 6,
        gate_29: 7,
      },
      why: 'Projectors with splenic authority and channel 18-58 show strong Sirian alignment. These individuals are natural guides with deep wisdom.',
    },
    Arcturus: {
      weights: {
        type_generator: 15,
        type_manifestor: 8,
        authority_sacral: 12,
        authority_emotional: 10,
        profile_5_1: 10,
        profile_6_2: 9,
        center_sacral_defined: 12,
        center_solar_plexus_defined: 8,
        channel_515: 18,
        channel_2750: 14,
        gate_3: 5,
        gate_9: 6,
        gate_42: 7,
      },
      why: 'Generators with sacral authority and channel 5-15 show strong Arcturian alignment. These individuals are natural builders with sustainable energy.',
    },
    Andromeda: {
      weights: {
        type_reflector: 20,
        type_projector: 12,
        authority_lunar: 15,
        profile_6_3: 10,
        profile_3_6: 9,
        center_all_open: 15,
        channel_1156: 18,
        channel_1333: 14,
        gate_4: 5,
        gate_7: 6,
        gate_23: 7,
      },
      why: 'Reflectors with lunar authority show strong Andromedan alignment. These individuals are natural mirrors with deep sensitivity to their environment.',
    },
    Orion: {
      weights: {
        type_manifestor: 12,
        type_projector: 10,
        authority_ego: 15,
        authority_self: 12,
        profile_1_4: 10,
        profile_4_1: 9,
        center_heart_defined: 12,
        center_throat_defined: 10,
        channel_2145: 18,
        channel_2551: 14,
        gate_8: 5,
        gate_16: 6,
        gate_31: 7,
      },
      why: 'Manifestors and Projectors with ego or self authority show strong Orion alignment. These individuals are natural leaders with strong willpower.',
    },
  },
};

/**
 * Canonicalize JSON for consistent checksum computation
 * Sorts keys recursively and removes whitespace
 */
function canonicalizeJSON(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return JSON.stringify(obj);
  }

  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJSON).join(',') + ']';
  }

  const sorted = Object.keys(obj)
    .sort()
    .map(key => `"${key}":${canonicalizeJSON((obj as Record<string, unknown>)[key])}`)
    .join(',');

  return '{' + sorted + '}';
}

/**
 * Compute SHA256 checksum of canonicalized canon JSON
 */
export function computeCanonChecksum(canon: Canon): string {
  const canonical = canonicalizeJSON(canon);
  return sha256(canonical);
}

/**
 * Load and validate mock canon data
 * 
 * @returns Validated canon with checksum
 * @throws Error if validation fails
 */
export function loadCanon(): Canon {
  try {
    // Validate canon structure with Zod
    const validated = CanonSchema.parse(MOCK_CANON_DATA);
    return validated as Canon;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Canon validation failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get canon with computed checksum
 * 
 * @returns Canon and its SHA256 checksum
 */
export function getCanonWithChecksum(): {canon: Canon; checksum: string} {
  const canon = loadCanon();
  const checksum = computeCanonChecksum(canon);
  return {canon, checksum};
}
