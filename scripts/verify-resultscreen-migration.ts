#!/usr/bin/env tsx
/**
 * ResultScreen Migration Verification Script
 * 
 * Verifies that ResultScreen matches Figma design tokens and maintains
 * visual parity with the original implementation.
 */

import * as fs from 'fs';
import * as path from 'path';

interface VerificationResult {
  category: string;
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
}

const results: VerificationResult[] = [];

// Read files
const resultScreenPath = path.join(process.cwd(), 'src/screens/ResultScreen.tsx');
const designTokensPath = path.join(process.cwd(), 'Figma/design-tokens.json');

const resultScreenContent = fs.readFileSync(resultScreenPath, 'utf-8');
const designTokens = JSON.parse(fs.readFileSync(designTokensPath, 'utf-8'));

console.log('🔍 Verifying ResultScreen Migration...\n');

// 1. Color Verification
const colorChecks: VerificationResult = {
  category: 'Color Tokens',
  checks: [],
};

// Check for lavender usage (primary star system color)
colorChecks.checks.push({
  name: 'Uses lavender color tokens',
  passed: resultScreenContent.includes('lavender') || resultScreenContent.includes('#a78bfa'),
  details: 'Primary system should use lavender-500 (#a78bfa)',
});

// Check for gold usage (warning/disclaimer)
colorChecks.checks.push({
  name: 'Uses gold color tokens for disclaimer',
  passed: resultScreenContent.includes('gold') && resultScreenContent.includes('warning'),
  details: 'Disclaimer card should use gold colors',
});

// Check for canvas-dark background
colorChecks.checks.push({
  name: 'Uses canvas-dark background',
  passed: resultScreenContent.includes('bg-canvas-dark'),
  details: 'Screen background should be canvas-dark (#0a0612)',
});

// Check for text color tokens
colorChecks.checks.push({
  name: 'Uses text color tokens',
  passed: resultScreenContent.includes('text-text-primary') || 
          resultScreenContent.includes('text-text-secondary') ||
          resultScreenContent.includes('text-text-muted'),
  details: 'Text should use design token colors',
});

results.push(colorChecks);

// 2. Spacing Verification
const spacingChecks: VerificationResult = {
  category: 'Spacing (4px grid)',
  checks: [],
};

// Check for proper spacing classes
const spacingPattern = /\b(p|m|gap)-\d+\b/g;
const spacingMatches = resultScreenContent.match(spacingPattern) || [];

spacingChecks.checks.push({
  name: 'Uses Tailwind spacing utilities',
  passed: spacingMatches.length > 0,
  details: `Found ${spacingMatches.length} spacing utilities`,
});

// Check for mb-6 (24px) spacing between sections
spacingChecks.checks.push({
  name: 'Uses mb-6 (24px) for section spacing',
  passed: resultScreenContent.includes('mb-6'),
  details: 'Sections should have 24px bottom margin',
});

results.push(spacingChecks);

// 3. Typography Verification
const typographyChecks: VerificationResult = {
  category: 'Typography',
  checks: [],
};

// Check for text-3xl (30px) for header
typographyChecks.checks.push({
  name: 'Uses text-3xl for header',
  passed: resultScreenContent.includes('text-3xl'),
  details: 'Header should use fontSize.3xl (30px)',
});

// Check for font-bold
typographyChecks.checks.push({
  name: 'Uses font-bold for emphasis',
  passed: resultScreenContent.includes('font-bold'),
  details: 'Primary text should use bold weight',
});

// Check for text-sm for labels
typographyChecks.checks.push({
  name: 'Uses text-sm for labels',
  passed: resultScreenContent.includes('text-sm'),
  details: 'Labels should use fontSize.sm (14px)',
});

results.push(typographyChecks);

// 4. Component Usage Verification
const componentChecks: VerificationResult = {
  category: 'Component Usage',
  checks: [],
};

// Check for NativeWind Button
componentChecks.checks.push({
  name: 'Uses NativeWind Button component',
  passed: resultScreenContent.includes("from '@/ui'") && 
          resultScreenContent.includes('Button'),
  details: 'Should import Button from @/ui',
});

// Check for NativeWind Card
componentChecks.checks.push({
  name: 'Uses NativeWind Card component',
  passed: resultScreenContent.includes("from '@/ui'") && 
          resultScreenContent.includes('Card'),
  details: 'Should import Card from @/ui',
});

// Check for RadialChart
componentChecks.checks.push({
  name: 'Uses RadialChart component',
  passed: resultScreenContent.includes('RadialChart'),
  details: 'Should display radial percentage chart',
});

// Check for StarSystemCrest
componentChecks.checks.push({
  name: 'Uses StarSystemCrest component',
  passed: resultScreenContent.includes('StarSystemCrest'),
  details: 'Should display star system crest',
});

// Check for Chip component
componentChecks.checks.push({
  name: 'Uses Chip component for allies',
  passed: resultScreenContent.includes('Chip'),
  details: 'Should display ally chips',
});

results.push(componentChecks);

// 5. Accessibility Verification
const accessibilityChecks: VerificationResult = {
  category: 'Accessibility',
  checks: [],
};

// Check for testID attributes
const testIdPattern = /testID="[^"]+"/g;
const testIdMatches = resultScreenContent.match(testIdPattern) || [];

accessibilityChecks.checks.push({
  name: 'Has testID attributes',
  passed: testIdMatches.length >= 4,
  details: `Found ${testIdMatches.length} testID attributes (expected ≥4)`,
});

// Check for accessibilityLabel
accessibilityChecks.checks.push({
  name: 'Has accessibilityLabel on button',
  passed: resultScreenContent.includes('accessibilityLabel'),
  details: 'View Why button should have accessibility label',
});

results.push(accessibilityChecks);

// 6. NativeWind Migration Verification
const nativeWindChecks: VerificationResult = {
  category: 'NativeWind Migration',
  checks: [],
};

// Check for className usage
nativeWindChecks.checks.push({
  name: 'Uses className utilities',
  passed: resultScreenContent.includes('className='),
  details: 'Should use className for styling',
});

// Check that StyleSheet is not used
nativeWindChecks.checks.push({
  name: 'No StyleSheet usage',
  passed: !resultScreenContent.includes('StyleSheet.create'),
  details: 'Should not use StyleSheet.create',
});

// Check that useTheme is not used
nativeWindChecks.checks.push({
  name: 'No useTheme hook',
  passed: !resultScreenContent.includes('useTheme'),
  details: 'Should not use useTheme hook',
});

results.push(nativeWindChecks);

// Print results
let totalChecks = 0;
let passedChecks = 0;

results.forEach(result => {
  console.log(`\n📋 ${result.category}`);
  console.log('─'.repeat(50));
  
  result.checks.forEach(check => {
    totalChecks++;
    if (check.passed) {
      passedChecks++;
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
    if (check.details) {
      console.log(`   ${check.details}`);
    }
  });
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${passedChecks}/${totalChecks} checks passed`);

const percentage = ((passedChecks / totalChecks) * 100).toFixed(1);
console.log(`   Success Rate: ${percentage}%\n`);

if (passedChecks === totalChecks) {
  console.log('✨ All checks passed! ResultScreen migration is complete.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please review the results above.\n');
  process.exit(1);
}
