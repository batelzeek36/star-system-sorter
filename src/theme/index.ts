/**
 * Theme Module
 * Design system tokens, provider, and utilities
 * 
 * @see Figma/design-tokens.json for source of truth
 */

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

export { ThemeProvider, useTheme, type Theme } from './ThemeProvider';

export {
  createSpacing,
  createTextStyle,
  createElevatedStyle,
  createBorderedStyle,
  stylePresets,
} from './utils';

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
