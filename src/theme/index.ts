/**
 * Theme Module
 * Design system tokens, provider, and utilities
 * 
 * @see Figma/design-tokens.json for source of truth
 * 
 * After NativeWind migration:
 * - tokens.ts remains the source of truth (used by tailwind.config.js)
 * - ThemeProvider is deprecated (kept for backward compatibility)
 * - utils.ts helpers are deprecated (use className utilities instead)
 * - validation.ts and audit.ts remain active for accessibility checks
 */

// Design tokens (source of truth - used by Tailwind config)
export {
  colors,
  spacing,
  borderRadius,
  typography,
  elevation,
  motion,
  components,
  starSystems,
} from './tokens';

// Theme provider (deprecated - kept for backward compatibility)
export { ThemeProvider, useTheme, type Theme } from './ThemeProvider';

// Style utilities (deprecated - use className utilities instead)
// Kept for backward compatibility with components not yet migrated
export {
  createSpacing,
  createTextStyle,
  createElevatedStyle,
  createBorderedStyle,
  stylePresets,
} from './utils';

// Validation utilities (active - used for accessibility checks)
export {
  validateTouchTarget,
  validateTextContrast,
  validateSpacing,
  getColorToken,
  getLavenderShade,
  getGoldShade,
  validateEtherealFlow,
  type EtherealFlowValidation,
} from './validation';

// Audit utilities (active - used for design system compliance)
export {
  isValidSpacing,
  getClosestSpacing,
  isValidFontSize,
  getClosestFontSize,
  isValidFontWeight,
  auditComponentStyles,
  generateAuditReport,
  type ComponentAudit,
  type AuditIssue,
} from './audit';
