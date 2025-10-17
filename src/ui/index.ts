/**
 * NativeWind Primitive Components
 * 
 * Public API exports for all primitive UI components.
 * These components use NativeWind (Tailwind CSS utilities) for styling.
 * 
 * Design tokens from Figma/design-tokens.json:
 * - Colors: canvas, lavender, gold, text, semantic, borders
 * - Spacing: 4px grid system
 * - Border radius: sm, md, lg, xl, full
 * - Typography: fontSize, fontWeight, lineHeight
 * - Elevation: shadows for iOS and Android
 * 
 * All components maintain WCAG 2.1 AA accessibility compliance:
 * - Touch targets ≥44px
 * - Proper accessibility props
 * - Color contrast ratios
 */

// Button primitive with variants and sizes
export { Button } from './Button';

// Card primitive with gradient simulation
export { Card, CardHeader, CardTitle, CardDescription } from './Card';

// Input primitive with label and error states
export { Input } from './Input';

// Sheet primitive for modal presentations
export { Sheet, SheetHeader, SheetTitle, SheetDescription } from './Sheet';
