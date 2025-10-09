/**
 * Human Design Module
 * Public API for HD calculations using hdkit
 */

export { computeHDExtract } from './hdkit-adapter';
export type { HDExtract, BirthData } from './types';

/**
 * Usage example for importing from hdkit:
 * 
 * import { gateOrder, planetGlyphs, gateNames } from '@hdkit/index';
 * import type { Gate, Planet, Activations } from '@hdkit/index';
 * 
 * const firstGate = gateOrder[0]; // 41
 * const sunGlyph = planetGlyphs['Sun']; // '☉'
 * const gateName = gateNames['1']; // 'The Creative'
 */
