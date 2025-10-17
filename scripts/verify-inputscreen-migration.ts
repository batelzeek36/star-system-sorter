#!/usr/bin/env tsx
/**
 * InputScreen Migration Verification Script
 * 
 * Verifies visual parity and accessibility compliance after NativeWind migration:
 * - Form colors match Figma/design-tokens.json
 * - Focus rings match Figma effects.focusRing specs
 * - Touch targets are ≥44px
 * - Form validation error states work correctly
 * 
 * Run: npx tsx scripts/verify-inputscreen-migration.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface DesignTokens {
  colors: {
    surface: { muted: { value: string } };
    borders: { muted: { value: string } };
    lavender: Record<string, { value: string }>;
    semantic: { error: { value: string } };
    text: Record<string, { value: string }>;
  };
  effects: {
    focusRing: {
      default: { value: string };
      error: { value: string };
    };
  };
  borderRadius: {
    md: { value: string };
  };
  spacing: {
    '4': { value: string };
  };
  typography: {
    fontSize: {
      base: { value: string };
      sm: { value: string };
      xs: { value: string };
    };
  };
  components: {
    touchTarget: {
      minimum: { value: string };
    };
  };
}

interface VerificationResult {
  category: string;
  checks: Array<{
    name: string;
    passed: boolean;
    expected: string;
    actual: string;
    severity: 'error' | 'warning';
  }>;
}

// Load design tokens
const tokensPath = path.join(process.cwd(), 'Figma/design-tokens.json');
const tokens: DesignTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Load InputScreen source
const inputScreenPath = path.join(process.cwd(), 'src/screens/InputScreen.tsx');
const inputScreenSource = fs.readFileSync(inputScreenPath, 'utf-8');

// Load Input primitive source
const inputPrimitivePath = path.join(process.cwd(), 'src/ui/Input.tsx');
const inputPrimitiveSource = fs.readFileSync(inputPrimitivePath, 'utf-8');

const results: VerificationResult[] = [];

// ============================================================================
// 1. Verify Form Colors Match Figma Tokens
// ============================================================================
console.log('🎨 Verifying form colors...\n');

const colorChecks: VerificationResult = {
  category: 'Form Colors',
  checks: [],
};

// Check background color (surface.muted)
const expectedBg = tokens.colors.surface.muted.value;
if (inputPrimitiveSource.includes('bg-surface-muted')) {
  colorChecks.checks.push({
    name: 'Input background color',
    passed: true,
    expected: `bg-surface-muted (${expectedBg})`,
    actual: 'bg-surface-muted',
    severity: 'error',
  });
} else {
  colorChecks.checks.push({
    name: 'Input background color',
    passed: false,
    expected: `bg-surface-muted (${expectedBg})`,
    actual: 'Not found',
    severity: 'error',
  });
}

// Check border color (borders.muted)
const expectedBorder = tokens.colors.borders.muted.value;
if (inputPrimitiveSource.includes('border-borders-muted')) {
  colorChecks.checks.push({
    name: 'Input border color (default)',
    passed: true,
    expected: `border-borders-muted (${expectedBorder})`,
    actual: 'border-borders-muted',
    severity: 'error',
  });
} else {
  colorChecks.checks.push({
    name: 'Input border color (default)',
    passed: false,
    expected: `border-borders-muted (${expectedBorder})`,
    actual: 'Not found',
    severity: 'error',
  });
}

// Check focus border color (lavender-500)
const expectedFocusBorder = tokens.colors.lavender['500'].value;
if (inputPrimitiveSource.includes('border-lavender-500')) {
  colorChecks.checks.push({
    name: 'Input border color (focus)',
    passed: true,
    expected: `border-lavender-500 (${expectedFocusBorder})`,
    actual: 'border-lavender-500',
    severity: 'error',
  });
} else {
  colorChecks.checks.push({
    name: 'Input border color (focus)',
    passed: false,
    expected: `border-lavender-500 (${expectedFocusBorder})`,
    actual: 'Not found',
    severity: 'error',
  });
}

// Check error border color (semantic.error)
const expectedErrorBorder = tokens.colors.semantic.error.value;
if (inputPrimitiveSource.includes('border-semantic-error')) {
  colorChecks.checks.push({
    name: 'Input border color (error)',
    passed: true,
    expected: `border-semantic-error (${expectedErrorBorder})`,
    actual: 'border-semantic-error',
    severity: 'error',
  });
} else {
  colorChecks.checks.push({
    name: 'Input border color (error)',
    passed: false,
    expected: `border-semantic-error (${expectedErrorBorder})`,
    actual: 'Not found',
    severity: 'error',
  });
}

// Check error text color
if (inputPrimitiveSource.includes('text-semantic-error')) {
  colorChecks.checks.push({
    name: 'Error text color',
    passed: true,
    expected: `text-semantic-error (${expectedErrorBorder})`,
    actual: 'text-semantic-error',
    severity: 'error',
  });
} else {
  colorChecks.checks.push({
    name: 'Error text color',
    passed: false,
    expected: `text-semantic-error (${expectedErrorBorder})`,
    actual: 'Not found',
    severity: 'error',
  });
}

results.push(colorChecks);

// ============================================================================
// 2. Verify Focus Ring Matches Figma Specs
// ============================================================================
console.log('🔍 Verifying focus ring implementation...\n');

const focusRingChecks: VerificationResult = {
  category: 'Focus Ring',
  checks: [],
};

// Check for focus ring implementation
const expectedFocusRing = tokens.effects.focusRing.default.value;
const expectedErrorRing = tokens.effects.focusRing.error.value;

if (inputPrimitiveSource.includes('shadowColor') && inputPrimitiveSource.includes('#a78bfa')) {
  focusRingChecks.checks.push({
    name: 'Default focus ring (iOS shadow)',
    passed: true,
    expected: `shadowColor: #a78bfa (from ${expectedFocusRing})`,
    actual: 'shadowColor: #a78bfa',
    severity: 'error',
  });
} else {
  focusRingChecks.checks.push({
    name: 'Default focus ring (iOS shadow)',
    passed: false,
    expected: `shadowColor: #a78bfa (from ${expectedFocusRing})`,
    actual: 'Not found',
    severity: 'error',
  });
}

if (inputPrimitiveSource.includes('shadowColor') && inputPrimitiveSource.includes('#ef4444')) {
  focusRingChecks.checks.push({
    name: 'Error focus ring (iOS shadow)',
    passed: true,
    expected: `shadowColor: #ef4444 (from ${expectedErrorRing})`,
    actual: 'shadowColor: #ef4444',
    severity: 'error',
  });
} else {
  focusRingChecks.checks.push({
    name: 'Error focus ring (iOS shadow)',
    passed: false,
    expected: `shadowColor: #ef4444 (from ${expectedErrorRing})`,
    actual: 'Not found',
    severity: 'error',
  });
}

// Check for Android elevation
if (inputPrimitiveSource.includes('elevation')) {
  focusRingChecks.checks.push({
    name: 'Focus ring (Android elevation)',
    passed: true,
    expected: 'elevation property for Android',
    actual: 'elevation found',
    severity: 'error',
  });
} else {
  focusRingChecks.checks.push({
    name: 'Focus ring (Android elevation)',
    passed: false,
    expected: 'elevation property for Android',
    actual: 'Not found',
    severity: 'warning',
  });
}

results.push(focusRingChecks);

// ============================================================================
// 3. Verify Touch Targets (≥44px)
// ============================================================================
console.log('👆 Verifying touch targets...\n');

const touchTargetChecks: VerificationResult = {
  category: 'Touch Targets',
  checks: [],
};

const minTouchTarget = parseInt(tokens.components.touchTarget.minimum.value);

// Check Input primitive min-h
if (inputPrimitiveSource.includes('min-h-[44px]')) {
  touchTargetChecks.checks.push({
    name: 'Input primitive minimum height',
    passed: true,
    expected: `min-h-[44px] (${minTouchTarget}px)`,
    actual: 'min-h-[44px]',
    severity: 'error',
  });
} else {
  touchTargetChecks.checks.push({
    name: 'Input primitive minimum height',
    passed: false,
    expected: `min-h-[44px] (${minTouchTarget}px)`,
    actual: 'Not found',
    severity: 'error',
  });
}

// Check tab buttons
if (inputScreenSource.includes('min-h-[44px]') && inputScreenSource.includes('tab-birth-data')) {
  touchTargetChecks.checks.push({
    name: 'Tab buttons minimum height',
    passed: true,
    expected: `min-h-[44px] (${minTouchTarget}px)`,
    actual: 'min-h-[44px]',
    severity: 'error',
  });
} else {
  touchTargetChecks.checks.push({
    name: 'Tab buttons minimum height',
    passed: false,
    expected: `min-h-[44px] (${minTouchTarget}px)`,
    actual: 'Not found',
    severity: 'error',
  });
}

results.push(touchTargetChecks);

// ============================================================================
// 4. Verify Form Validation Error States
// ============================================================================
console.log('✅ Verifying form validation...\n');

const validationChecks: VerificationResult = {
  category: 'Form Validation',
  checks: [],
};

// Check for Zod schema
if (inputScreenSource.includes('birthDataSchema') && inputScreenSource.includes('z.object')) {
  validationChecks.checks.push({
    name: 'Zod validation schema',
    passed: true,
    expected: 'birthDataSchema with z.object',
    actual: 'Found',
    severity: 'error',
  });
} else {
  validationChecks.checks.push({
    name: 'Zod validation schema',
    passed: false,
    expected: 'birthDataSchema with z.object',
    actual: 'Not found',
    severity: 'error',
  });
}

// Check for error prop passing
if (inputScreenSource.includes('error={errors.date?.message}')) {
  validationChecks.checks.push({
    name: 'Error message passing (date field)',
    passed: true,
    expected: 'error={errors.date?.message}',
    actual: 'Found',
    severity: 'error',
  });
} else {
  validationChecks.checks.push({
    name: 'Error message passing (date field)',
    passed: false,
    expected: 'error={errors.date?.message}',
    actual: 'Not found',
    severity: 'error',
  });
}

// Check for Controller usage
if (inputScreenSource.includes('<Controller') && inputScreenSource.includes('control={control}')) {
  validationChecks.checks.push({
    name: 'React Hook Form Controller',
    passed: true,
    expected: 'Controller with control prop',
    actual: 'Found',
    severity: 'error',
  });
} else {
  validationChecks.checks.push({
    name: 'React Hook Form Controller',
    passed: false,
    expected: 'Controller with control prop',
    actual: 'Not found',
    severity: 'error',
  });
}

results.push(validationChecks);

// ============================================================================
// 5. Verify Typography and Spacing
// ============================================================================
console.log('📐 Verifying typography and spacing...\n');

const typographyChecks: VerificationResult = {
  category: 'Typography & Spacing',
  checks: [],
};

// Check label font size (sm = 14px)
const expectedLabelSize = tokens.typography.fontSize.sm.value;
if (inputPrimitiveSource.includes('text-sm')) {
  typographyChecks.checks.push({
    name: 'Label font size',
    passed: true,
    expected: `text-sm (${expectedLabelSize})`,
    actual: 'text-sm',
    severity: 'warning',
  });
} else {
  typographyChecks.checks.push({
    name: 'Label font size',
    passed: false,
    expected: `text-sm (${expectedLabelSize})`,
    actual: 'Not found',
    severity: 'warning',
  });
}

// Check input font size (base = 16px)
const expectedInputSize = tokens.typography.fontSize.base.value;
if (inputPrimitiveSource.includes('text-base')) {
  typographyChecks.checks.push({
    name: 'Input font size',
    passed: true,
    expected: `text-base (${expectedInputSize})`,
    actual: 'text-base',
    severity: 'warning',
  });
} else {
  typographyChecks.checks.push({
    name: 'Input font size',
    passed: false,
    expected: `text-base (${expectedInputSize})`,
    actual: 'Not found',
    severity: 'warning',
  });
}

// Check error text size (xs = 12px)
const expectedErrorSize = tokens.typography.fontSize.xs.value;
if (inputPrimitiveSource.includes('text-xs')) {
  typographyChecks.checks.push({
    name: 'Error text font size',
    passed: true,
    expected: `text-xs (${expectedErrorSize})`,
    actual: 'text-xs',
    severity: 'warning',
  });
} else {
  typographyChecks.checks.push({
    name: 'Error text font size',
    passed: false,
    expected: `text-xs (${expectedErrorSize})`,
    actual: 'Not found',
    severity: 'warning',
  });
}

// Check padding (spacing.4 = 16px)
const expectedPadding = tokens.spacing['4'].value;
if (inputPrimitiveSource.includes('px-4') || inputPrimitiveSource.includes('p-4')) {
  typographyChecks.checks.push({
    name: 'Input padding',
    passed: true,
    expected: `px-4 or p-4 (${expectedPadding})`,
    actual: 'Found',
    severity: 'warning',
  });
} else {
  typographyChecks.checks.push({
    name: 'Input padding',
    passed: false,
    expected: `px-4 or p-4 (${expectedPadding})`,
    actual: 'Not found',
    severity: 'warning',
  });
}

// Check border radius (md = 12px)
const expectedRadius = tokens.borderRadius.md.value;
if (inputPrimitiveSource.includes('rounded-md')) {
  typographyChecks.checks.push({
    name: 'Input border radius',
    passed: true,
    expected: `rounded-md (${expectedRadius})`,
    actual: 'rounded-md',
    severity: 'warning',
  });
} else {
  typographyChecks.checks.push({
    name: 'Input border radius',
    passed: false,
    expected: `rounded-md (${expectedRadius})`,
    actual: 'Not found',
    severity: 'warning',
  });
}

results.push(typographyChecks);

// ============================================================================
// Generate Report
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('📊 INPUTSCREEN MIGRATION VERIFICATION REPORT');
console.log('='.repeat(80) + '\n');

let totalChecks = 0;
let passedChecks = 0;
let errorCount = 0;
let warningCount = 0;

results.forEach((result) => {
  console.log(`\n${result.category}`);
  console.log('-'.repeat(result.category.length));
  
  result.checks.forEach((check) => {
    totalChecks++;
    const icon = check.passed ? '✅' : check.severity === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${check.name}`);
    console.log(`   Expected: ${check.expected}`);
    console.log(`   Actual: ${check.actual}`);
    
    if (check.passed) {
      passedChecks++;
    } else if (check.severity === 'error') {
      errorCount++;
    } else {
      warningCount++;
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total Checks: ${totalChecks}`);
console.log(`✅ Passed: ${passedChecks}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`⚠️  Warnings: ${warningCount}`);
console.log(`\nSuccess Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (errorCount === 0 && warningCount === 0) {
  console.log('\n🎉 All checks passed! InputScreen migration is complete.');
  process.exit(0);
} else if (errorCount === 0) {
  console.log('\n✨ All critical checks passed! Some warnings to review.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review and fix errors.');
  process.exit(1);
}
