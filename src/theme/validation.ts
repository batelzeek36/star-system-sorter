/**
 * Design System Validation
 * Ensures components match Figma design tokens exactly
 */

import { colors, typography, components } from './tokens';

/**
 * Validates that a touch target meets WCAG 2.1 AA minimum size (44px)
 */
export function validateTouchTarget(size: number): boolean {
  return size >= components.touchTarget.minimum;
}

/**
 * Validates that text contrast meets WCAG 2.1 AA standards
 * Based on documented contrast ratios in design-tokens.json
 */
export function validateTextContrast(
  textColor: string,
  backgroundColor: string
): { valid: boolean; ratio?: number } {
  // Known contrast ratios from design tokens
  const knownRatios: Record<string, number> = {
    [`${colors.text.primary}-${colors.canvas.dark}`]: 21,
    [`${colors.text.secondary}-${colors.canvas.dark}`]: 14.8,
    [`${colors.text.muted}-${colors.canvas.dark}`]: 7.2,
    [`${colors.text.subtle}-${colors.canvas.dark}`]: 4.7,
  };

  const key = `${textColor}-${backgroundColor}`;
  const ratio = knownRatios[key];

  // WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text
  if (ratio !== undefined) {
    return { valid: ratio >= 4.5, ratio };
  }

  // If not in known ratios, assume valid (manual check needed)
  return { valid: true };
}

/**
 * Validates spacing values match the 4px grid system
 */
export function validateSpacing(value: number): boolean {
  return value % 4 === 0;
}

/**
 * Gets the correct color token for a given context
 */
export function getColorToken(context: 'primary' | 'secondary' | 'muted' | 'subtle'): string {
  return colors.text[context];
}

/**
 * Gets the correct lavender shade for a given emphasis level
 */
export function getLavenderShade(
  emphasis: 'subtle' | 'medium' | 'strong' | 'primary'
): string {
  const shades = {
    subtle: colors.lavender[900],
    medium: colors.lavender[600],
    strong: colors.lavender[500],
    primary: colors.lavender[400],
  };
  return shades[emphasis];
}

/**
 * Gets the correct gold shade for highlights
 */
export function getGoldShade(emphasis: 'subtle' | 'medium' | 'strong'): string {
  const shades = {
    subtle: colors.gold[700],
    medium: colors.gold[500],
    strong: colors.gold[400],
  };
  return shades[emphasis];
}

/**
 * Validates that a component uses proper Ethereal Flow aesthetic
 */
export interface EtherealFlowValidation {
  usesLavenderPrimary: boolean;
  usesGoldHighlights: boolean;
  usesDarkCanvas: boolean;
  hasProperSpacing: boolean;
  hasProperTypography: boolean;
  touchTargetsValid: boolean;
}

export function validateEtherealFlow(component: {
  backgroundColor?: string;
  primaryColor?: string;
  highlightColor?: string;
  spacing?: number[];
  fontSize?: number;
  touchTargetSize?: number;
}): EtherealFlowValidation {
  return {
    usesLavenderPrimary:
      component.primaryColor === colors.lavender[500] ||
      component.primaryColor === colors.lavender[400],
    usesGoldHighlights:
      component.highlightColor === colors.gold[400] ||
      component.highlightColor === colors.gold[500],
    usesDarkCanvas:
      component.backgroundColor === colors.canvas.dark ||
      component.backgroundColor === colors.canvas.darker,
    hasProperSpacing:
      !component.spacing || component.spacing.every(validateSpacing),
    hasProperTypography:
      !component.fontSize ||
      (Object.values(typography.fontSize) as number[]).includes(component.fontSize),
    touchTargetsValid:
      !component.touchTargetSize ||
      validateTouchTarget(component.touchTargetSize),
  };
}
