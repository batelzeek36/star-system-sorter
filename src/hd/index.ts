/**
 * Human Design Module
 * Public API for HD calculations via BodyGraph Chart API
 */

export { computeHDExtract } from './api-client';
export type { HDExtract, BirthData } from './types';

// Legacy hdkit adapter still available for reference
export { computeHDExtract as computeHDExtractLegacy } from './hdkit-adapter';
