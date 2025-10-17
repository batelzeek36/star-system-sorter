/**
 * Theme Tokens Tests
 * Verify design tokens are correctly imported and structured
 */

import {
  colors,
  spacing,
  borderRadius,
  typography,
  elevation,
  motion,
  components,
  starSystems,
} from '@/theme';

describe('Theme Tokens', () => {
  describe('Colors', () => {
    it('should have canvas colors', () => {
      expect(colors.canvas.dark).toBe('#0a0612');
      expect(colors.canvas.darker).toBe('#060408');
    });

    it('should have lavender primary color', () => {
      expect(colors.lavender[500]).toBe('#a78bfa');
    });

    it('should have gold highlight color', () => {
      expect(colors.gold[400]).toBe('#fbbf24');
    });

    it('should have text colors with proper contrast', () => {
      expect(colors.text.primary).toBe('#ffffff');
      expect(colors.text.secondary).toBe('#e5e7eb');
      expect(colors.text.muted).toBe('#9ca3af');
    });

    it('should have semantic colors', () => {
      expect(colors.semantic.success).toBe('#10b981');
      expect(colors.semantic.error).toBe('#ef4444');
      expect(colors.semantic.warning).toBe('#f59e0b');
      expect(colors.semantic.info).toBe('#3b82f6');
    });
  });

  describe('Spacing (4px grid)', () => {
    it('should follow 4px grid system', () => {
      expect(spacing[1]).toBe(4);
      expect(spacing[2]).toBe(8);
      expect(spacing[4]).toBe(16);
      expect(spacing[6]).toBe(24);
    });

    it('should have minimum touch target size', () => {
      expect(spacing[11]).toBe(44); // WCAG 2.1 AA
    });
  });

  describe('Typography', () => {
    it('should have font sizes', () => {
      expect(typography.fontSize.base).toBe(16);
      expect(typography.fontSize['2xl']).toBe(24);
      expect(typography.fontSize['4xl']).toBe(36);
    });

    it('should have font weights', () => {
      expect(typography.fontWeight.normal).toBe('400');
      expect(typography.fontWeight.semibold).toBe('600');
      expect(typography.fontWeight.bold).toBe('700');
    });

    it('should have line heights', () => {
      expect(typography.lineHeight.tight).toBe(1.25);
      expect(typography.lineHeight.normal).toBe(1.5);
      expect(typography.lineHeight.relaxed).toBe(1.75);
    });
  });

  describe('Elevation', () => {
    it('should have no elevation at level 0', () => {
      expect(elevation[0].shadowOpacity).toBe(0);
      expect(elevation[0].elevation).toBe(0);
    });

    it('should have increasing elevation levels', () => {
      expect(elevation[1].elevation).toBe(1);
      expect(elevation[2].elevation).toBe(2);
      expect(elevation[3].elevation).toBe(3);
      expect(elevation[4].elevation).toBe(4);
    });

    it('should have shadow properties for iOS', () => {
      expect(elevation[2]).toHaveProperty('shadowColor');
      expect(elevation[2]).toHaveProperty('shadowOffset');
      expect(elevation[2]).toHaveProperty('shadowOpacity');
      expect(elevation[2]).toHaveProperty('shadowRadius');
    });
  });

  describe('Motion', () => {
    it('should have duration values in milliseconds', () => {
      expect(motion.duration.fast).toBe(150);
      expect(motion.duration.normal).toBe(200);
      expect(motion.duration.slow).toBe(300);
    });
  });

  describe('Components', () => {
    it('should have button sizes with minimum touch targets', () => {
      expect(components.button.sizes.sm.minHeight).toBe(44);
      expect(components.button.sizes.md.minHeight).toBe(44);
      expect(components.button.sizes.lg.minHeight).toBe(48);
    });

    it('should have minimum touch target constant', () => {
      expect(components.touchTarget.minimum).toBe(44);
    });
  });

  describe('Star Systems', () => {
    it('should have all star system names', () => {
      expect(starSystems.names).toContain('Orion');
      expect(starSystems.names).toContain('Sirius');
      expect(starSystems.names).toContain('Pleiades');
      expect(starSystems.names).toContain('Andromeda');
      expect(starSystems.names).toContain('Lyra');
      expect(starSystems.names).toContain('Arcturus');
    });

    it('should have crest export sizes', () => {
      expect(starSystems.crestExportSizes).toEqual([24, 28, 48]);
    });
  });
});
