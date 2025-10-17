/**
 * Design System Audit Utilities
 * Tools to validate spacing and typography consistency
 */

import { spacing, typography } from './tokens';

/**
 * Validates that a spacing value is on the 4px grid
 */
export function isValidSpacing(value: number): boolean {
  return (Object.values(spacing) as number[]).includes(value);
}

/**
 * Finds the closest valid spacing value
 */
export function getClosestSpacing(value: number): number {
  const spacingValues = Object.values(spacing);
  return spacingValues.reduce((prev, curr) => 
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Validates that a font size is in the typography scale
 */
export function isValidFontSize(value: number): boolean {
  return (Object.values(typography.fontSize) as number[]).includes(value);
}

/**
 * Finds the closest valid font size
 */
export function getClosestFontSize(value: number): number {
  const fontSizes = Object.values(typography.fontSize);
  return fontSizes.reduce((prev, curr) => 
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Validates that a font weight is in the typography scale
 */
export function isValidFontWeight(value: string | number): boolean {
  const weights = Object.values(typography.fontWeight) as string[];
  return weights.includes(String(value));
}

/**
 * Audit results for a component
 */
export interface ComponentAudit {
  component: string;
  issues: AuditIssue[];
  score: number; // 0-100
}

export interface AuditIssue {
  type: 'spacing' | 'typography' | 'color' | 'touchTarget';
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

/**
 * Audits component styles for design system compliance
 */
export function auditComponentStyles(
  componentName: string,
  styles: {
    spacing?: number[];
    fontSize?: number[];
    fontWeight?: (string | number)[];
    touchTargetSizes?: number[];
  }
): ComponentAudit {
  const issues: AuditIssue[] = [];

  // Check spacing
  if (styles.spacing) {
    styles.spacing.forEach((value) => {
      if (!isValidSpacing(value)) {
        const closest = getClosestSpacing(value);
        issues.push({
          type: 'spacing',
          severity: 'warning',
          message: `Invalid spacing value: ${value}px`,
          suggestion: `Use ${closest}px instead (closest valid value)`,
        });
      }
    });
  }

  // Check font sizes
  if (styles.fontSize) {
    styles.fontSize.forEach((value) => {
      if (!isValidFontSize(value)) {
        const closest = getClosestFontSize(value);
        issues.push({
          type: 'typography',
          severity: 'warning',
          message: `Invalid font size: ${value}px`,
          suggestion: `Use ${closest}px instead (closest valid value)`,
        });
      }
    });
  }

  // Check font weights
  if (styles.fontWeight) {
    styles.fontWeight.forEach((value) => {
      if (!isValidFontWeight(value)) {
        issues.push({
          type: 'typography',
          severity: 'warning',
          message: `Invalid font weight: ${value}`,
          suggestion: 'Use one of: 400, 500, 600, 700',
        });
      }
    });
  }

  // Check touch targets
  if (styles.touchTargetSizes) {
    styles.touchTargetSizes.forEach((value) => {
      if (value < 44) {
        issues.push({
          type: 'touchTarget',
          severity: 'error',
          message: `Touch target too small: ${value}px`,
          suggestion: 'Minimum touch target size is 44px (WCAG 2.1 AA)',
        });
      }
    });
  }

  // Calculate score (100 - 10 points per error, 5 points per warning)
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const score = Math.max(0, 100 - errorCount * 10 - warningCount * 5);

  return {
    component: componentName,
    issues,
    score,
  };
}

/**
 * Generates a report from audit results
 */
export function generateAuditReport(audits: ComponentAudit[]): string {
  const totalScore = audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length;
  const totalIssues = audits.reduce((sum, audit) => sum + audit.issues.length, 0);

  let report = '# Design System Audit Report\n\n';
  report += `**Overall Score**: ${totalScore.toFixed(1)}/100\n`;
  report += `**Total Issues**: ${totalIssues}\n\n`;

  audits.forEach((audit) => {
    if (audit.issues.length > 0) {
      report += `## ${audit.component} (Score: ${audit.score}/100)\n\n`;
      audit.issues.forEach((issue) => {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        report += `${icon} **${issue.type}**: ${issue.message}\n`;
        if (issue.suggestion) {
          report += `   💡 ${issue.suggestion}\n`;
        }
        report += '\n';
      });
    }
  });

  return report;
}
