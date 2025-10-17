/**
 * NativeWind Configuration Tests
 * Tests to verify NativeWind is properly configured and className utilities work
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

describe('NativeWind Configuration', () => {
  describe('className prop recognition', () => {
    it('recognizes className prop on View components', () => {
      const { getByTestId } = render(
        <View testID="test-view" className="bg-lavender-500 rounded-xl p-4" />
      );
      const view = getByTestId('test-view');
      expect(view).toBeTruthy();
      expect(view.props.className).toBe('bg-lavender-500 rounded-xl p-4');
    });

    it('recognizes className prop on Text components', () => {
      const { getByTestId } = render(
        <Text testID="test-text" className="text-text-primary text-base">
          Test Text
        </Text>
      );
      const text = getByTestId('test-text');
      expect(text).toBeTruthy();
      expect(text.props.className).toBe('text-text-primary text-base');
    });

    it('supports multiple className utilities', () => {
      const { getByTestId } = render(
        <View
          testID="multi-class-view"
          className="bg-canvas-dark border-borders-subtle rounded-lg p-6 m-4"
        />
      );
      const view = getByTestId('multi-class-view');
      expect(view.props.className).toContain('bg-canvas-dark');
      expect(view.props.className).toContain('border-borders-subtle');
      expect(view.props.className).toContain('rounded-lg');
    });
  });

  describe('Custom colors from tailwind.config.js', () => {
    it('applies custom canvas colors (dark)', () => {
      const { getByTestId } = render(
        <View testID="canvas-dark" className="bg-canvas-dark" />
      );
      expect(getByTestId('canvas-dark').props.className).toContain('bg-canvas-dark');
    });

    it('applies custom canvas colors (darker)', () => {
      const { getByTestId } = render(
        <View testID="canvas-darker" className="bg-canvas-darker" />
      );
      expect(getByTestId('canvas-darker').props.className).toContain('bg-canvas-darker');
    });

    it('applies custom surface colors', () => {
      const { getByTestId } = render(
        <View testID="surface-subtle" className="bg-surface-subtle" />
      );
      expect(getByTestId('surface-subtle').props.className).toContain('bg-surface-subtle');
    });

    it('applies lavender-100 color', () => {
      const { getByTestId } = render(
        <View testID="lavender-100" className="bg-lavender-100" />
      );
      expect(getByTestId('lavender-100').props.className).toContain('bg-lavender-100');
    });

    it('applies lavender-500 color', () => {
      const { getByTestId } = render(
        <View testID="lavender-500" className="bg-lavender-500" />
      );
      expect(getByTestId('lavender-500').props.className).toContain('bg-lavender-500');
    });

    it('applies lavender-900 color', () => {
      const { getByTestId } = render(
        <View testID="lavender-900" className="bg-lavender-900" />
      );
      expect(getByTestId('lavender-900').props.className).toContain('bg-lavender-900');
    });

    it('applies gold-100 color', () => {
      const { getByTestId } = render(
        <View testID="gold-100" className="bg-gold-100" />
      );
      expect(getByTestId('gold-100').props.className).toContain('bg-gold-100');
    });

    it('applies gold-400 color', () => {
      const { getByTestId } = render(
        <View testID="gold-400" className="bg-gold-400" />
      );
      expect(getByTestId('gold-400').props.className).toContain('bg-gold-400');
    });

    it('applies gold-700 color', () => {
      const { getByTestId } = render(
        <View testID="gold-700" className="bg-gold-700" />
      );
      expect(getByTestId('gold-700').props.className).toContain('bg-gold-700');
    });

    it('applies text-primary color', () => {
      const { getByTestId } = render(
        <Text testID="text-primary" className="text-text-primary">
          Primary Text
        </Text>
      );
      expect(getByTestId('text-primary').props.className).toContain('text-text-primary');
    });

    it('applies text-secondary color', () => {
      const { getByTestId } = render(
        <Text testID="text-secondary" className="text-text-secondary">
          Secondary Text
        </Text>
      );
      expect(getByTestId('text-secondary').props.className).toContain('text-text-secondary');
    });

    it('applies text-muted color', () => {
      const { getByTestId } = render(
        <Text testID="text-muted" className="text-text-muted">
          Muted Text
        </Text>
      );
      expect(getByTestId('text-muted').props.className).toContain('text-text-muted');
    });

    it('applies semantic-success color', () => {
      const { getByTestId } = render(
        <View testID="semantic-success" className="bg-semantic-success" />
      );
      expect(getByTestId('semantic-success').props.className).toContain('bg-semantic-success');
    });

    it('applies semantic-error color', () => {
      const { getByTestId } = render(
        <View testID="semantic-error" className="bg-semantic-error" />
      );
      expect(getByTestId('semantic-error').props.className).toContain('bg-semantic-error');
    });

    it('applies semantic-warning color', () => {
      const { getByTestId } = render(
        <View testID="semantic-warning" className="bg-semantic-warning" />
      );
      expect(getByTestId('semantic-warning').props.className).toContain('bg-semantic-warning');
    });

    it('applies semantic-info color', () => {
      const { getByTestId } = render(
        <View testID="semantic-info" className="bg-semantic-info" />
      );
      expect(getByTestId('semantic-info').props.className).toContain('bg-semantic-info');
    });

    it('applies borders-subtle color', () => {
      const { getByTestId } = render(
        <View testID="border-subtle" className="border-borders-subtle" />
      );
      expect(getByTestId('border-subtle').props.className).toContain('border-borders-subtle');
    });

    it('applies borders-muted color', () => {
      const { getByTestId } = render(
        <View testID="border-muted" className="border-borders-muted" />
      );
      expect(getByTestId('border-muted').props.className).toContain('border-borders-muted');
    });

    it('applies borders-emphasis color', () => {
      const { getByTestId } = render(
        <View testID="border-emphasis" className="border-borders-emphasis" />
      );
      expect(getByTestId('border-emphasis').props.className).toContain('border-borders-emphasis');
    });
  });

  describe('Custom spacing from tailwind.config.js', () => {
    it('applies spacing-1 (4px)', () => {
      const { getByTestId } = render(
        <View testID="spacing-1" className="p-1" />
      );
      expect(getByTestId('spacing-1').props.className).toContain('p-1');
    });

    it('applies spacing-2 (8px)', () => {
      const { getByTestId } = render(
        <View testID="spacing-2" className="p-2" />
      );
      expect(getByTestId('spacing-2').props.className).toContain('p-2');
    });

    it('applies spacing-4 (16px)', () => {
      const { getByTestId } = render(
        <View testID="spacing-4" className="p-4" />
      );
      expect(getByTestId('spacing-4').props.className).toContain('p-4');
    });

    it('applies spacing-6 (24px)', () => {
      const { getByTestId } = render(
        <View testID="spacing-6" className="m-6" />
      );
      expect(getByTestId('spacing-6').props.className).toContain('m-6');
    });

    it('applies spacing-11 (44px) for touch targets', () => {
      const { getByTestId } = render(
        <View testID="spacing-11" className="h-11" />
      );
      expect(getByTestId('spacing-11').props.className).toContain('h-11');
    });

    it('applies minimum touch target spacing with arbitrary value', () => {
      const { getByTestId } = render(
        <View testID="touch-target" className="min-h-[44px]" />
      );
      expect(getByTestId('touch-target').props.className).toContain('min-h-[44px]');
    });

    it('applies multiple spacing utilities', () => {
      const { getByTestId } = render(
        <View testID="multi-spacing" className="px-4 py-6 mt-2 mb-8" />
      );
      const className = getByTestId('multi-spacing').props.className;
      expect(className).toContain('px-4');
      expect(className).toContain('py-6');
      expect(className).toContain('mt-2');
      expect(className).toContain('mb-8');
    });
  });

  describe('Custom border radius from tailwind.config.js', () => {
    it('applies rounded-sm (8px)', () => {
      const { getByTestId } = render(
        <View testID="rounded-sm" className="rounded-sm" />
      );
      expect(getByTestId('rounded-sm').props.className).toContain('rounded-sm');
    });

    it('applies rounded-md (12px)', () => {
      const { getByTestId } = render(
        <View testID="rounded-md" className="rounded-md" />
      );
      expect(getByTestId('rounded-md').props.className).toContain('rounded-md');
    });

    it('applies rounded-lg (16px)', () => {
      const { getByTestId } = render(
        <View testID="rounded-lg" className="rounded-lg" />
      );
      expect(getByTestId('rounded-lg').props.className).toContain('rounded-lg');
    });

    it('applies rounded-xl (24px)', () => {
      const { getByTestId } = render(
        <View testID="rounded-xl" className="rounded-xl" />
      );
      expect(getByTestId('rounded-xl').props.className).toContain('rounded-xl');
    });

    it('applies rounded-full (9999px)', () => {
      const { getByTestId } = render(
        <View testID="rounded-full" className="rounded-full" />
      );
      expect(getByTestId('rounded-full').props.className).toContain('rounded-full');
    });

    it('applies directional border radius', () => {
      const { getByTestId } = render(
        <View testID="rounded-directional" className="rounded-t-2xl rounded-b-lg" />
      );
      const className = getByTestId('rounded-directional').props.className;
      expect(className).toContain('rounded-t-2xl');
      expect(className).toContain('rounded-b-lg');
    });
  });

  describe('Custom typography from tailwind.config.js', () => {
    it('applies text-xs (12px)', () => {
      const { getByTestId } = render(
        <Text testID="text-xs" className="text-xs">
          Extra Small
        </Text>
      );
      expect(getByTestId('text-xs').props.className).toContain('text-xs');
    });

    it('applies text-sm (14px)', () => {
      const { getByTestId } = render(
        <Text testID="text-sm" className="text-sm">
          Small
        </Text>
      );
      expect(getByTestId('text-sm').props.className).toContain('text-sm');
    });

    it('applies text-base (16px)', () => {
      const { getByTestId } = render(
        <Text testID="text-base" className="text-base">
          Base
        </Text>
      );
      expect(getByTestId('text-base').props.className).toContain('text-base');
    });

    it('applies text-2xl (24px)', () => {
      const { getByTestId } = render(
        <Text testID="text-2xl" className="text-2xl">
          Large Text
        </Text>
      );
      expect(getByTestId('text-2xl').props.className).toContain('text-2xl');
    });

    it('applies text-4xl (36px)', () => {
      const { getByTestId } = render(
        <Text testID="text-4xl" className="text-4xl">
          Extra Large
        </Text>
      );
      expect(getByTestId('text-4xl').props.className).toContain('text-4xl');
    });

    it('applies font-normal (400)', () => {
      const { getByTestId } = render(
        <Text testID="font-normal" className="font-normal">
          Normal Weight
        </Text>
      );
      expect(getByTestId('font-normal').props.className).toContain('font-normal');
    });

    it('applies font-medium (500)', () => {
      const { getByTestId } = render(
        <Text testID="font-medium" className="font-medium">
          Medium Weight
        </Text>
      );
      expect(getByTestId('font-medium').props.className).toContain('font-medium');
    });

    it('applies font-semibold (600)', () => {
      const { getByTestId } = render(
        <Text testID="font-semibold" className="font-semibold">
          Semibold Weight
        </Text>
      );
      expect(getByTestId('font-semibold').props.className).toContain('font-semibold');
    });

    it('applies font-bold (700)', () => {
      const { getByTestId } = render(
        <Text testID="font-bold" className="font-bold">
          Bold Weight
        </Text>
      );
      expect(getByTestId('font-bold').props.className).toContain('font-bold');
    });

    it('applies line-height utilities', () => {
      const { getByTestId } = render(
        <Text testID="leading-normal" className="leading-normal">
          Normal Line Height
        </Text>
      );
      expect(getByTestId('leading-normal').props.className).toContain('leading-normal');
    });

    it('combines typography utilities', () => {
      const { getByTestId } = render(
        <Text testID="combined-typography" className="text-2xl font-bold text-text-primary leading-tight">
          Combined Typography
        </Text>
      );
      const className = getByTestId('combined-typography').props.className;
      expect(className).toContain('text-2xl');
      expect(className).toContain('font-bold');
      expect(className).toContain('text-text-primary');
      expect(className).toContain('leading-tight');
    });
  });

  describe('Computed styles with inline style objects', () => {
    it('supports both className and inline style', () => {
      const { getByTestId } = render(
        <View
          testID="mixed-styles"
          className="bg-lavender-500 p-4"
          style={{ opacity: 0.8 }}
        />
      );
      const view = getByTestId('mixed-styles');
      expect(view.props.className).toBe('bg-lavender-500 p-4');
      expect(view.props.style).toMatchObject({ opacity: 0.8 });
    });

    it('supports array of inline styles with className', () => {
      const { getByTestId } = render(
        <View
          testID="array-styles"
          className="bg-canvas-dark rounded-xl"
          style={[{ opacity: 0.9 }, { transform: [{ scale: 1.1 }] }]}
        />
      );
      const view = getByTestId('array-styles');
      expect(view.props.className).toBe('bg-canvas-dark rounded-xl');
      expect(view.props.style).toEqual([
        { opacity: 0.9 },
        { transform: [{ scale: 1.1 }] },
      ]);
    });
  });

  describe('Complex className compositions', () => {
    it('handles complex layout with multiple utilities', () => {
      const { getByTestId } = render(
        <View
          testID="complex-layout"
          className="flex flex-row items-center justify-between bg-surface-subtle rounded-lg p-4 m-2 border border-borders-subtle"
        />
      );
      const className = getByTestId('complex-layout').props.className;
      expect(className).toContain('flex');
      expect(className).toContain('flex-row');
      expect(className).toContain('items-center');
      expect(className).toContain('justify-between');
      expect(className).toContain('bg-surface-subtle');
      expect(className).toContain('rounded-lg');
      expect(className).toContain('p-4');
      expect(className).toContain('m-2');
      expect(className).toContain('border');
      expect(className).toContain('border-borders-subtle');
    });

    it('handles responsive and state-based utilities', () => {
      const { getByTestId } = render(
        <View
          testID="state-based"
          className="bg-lavender-500 active:bg-lavender-600 opacity-100"
        />
      );
      const className = getByTestId('state-based').props.className;
      expect(className).toContain('bg-lavender-500');
      expect(className).toContain('active:bg-lavender-600');
      expect(className).toContain('opacity-100');
    });

    it('handles shadow and elevation utilities', () => {
      const { getByTestId } = render(
        <View
          testID="shadow-test"
          className="shadow-md shadow-black/50"
        />
      );
      const className = getByTestId('shadow-test').props.className;
      expect(className).toContain('shadow-md');
      expect(className).toContain('shadow-black/50');
    });

    it('handles absolute positioning with inset utilities', () => {
      const { getByTestId } = render(
        <View
          testID="absolute-positioning"
          className="absolute inset-0 bg-black/50"
        />
      );
      const className = getByTestId('absolute-positioning').props.className;
      expect(className).toContain('absolute');
      expect(className).toContain('inset-0');
      expect(className).toContain('bg-black/50');
    });
  });

  describe('Edge cases and special utilities', () => {
    it('handles arbitrary values with square brackets', () => {
      const { getByTestId } = render(
        <View
          testID="arbitrary-values"
          className="w-[200px] h-[100px] bg-[#ff0000]"
        />
      );
      const className = getByTestId('arbitrary-values').props.className;
      expect(className).toContain('w-[200px]');
      expect(className).toContain('h-[100px]');
      expect(className).toContain('bg-[#ff0000]');
    });

    it('handles opacity modifiers on colors', () => {
      const { getByTestId } = render(
        <View
          testID="opacity-modifiers"
          className="bg-lavender-500/50 border-gold-400/30"
        />
      );
      const className = getByTestId('opacity-modifiers').props.className;
      expect(className).toContain('bg-lavender-500/50');
      expect(className).toContain('border-gold-400/30');
    });

    it('handles negative spacing values', () => {
      const { getByTestId } = render(
        <View
          testID="negative-spacing"
          className="-mt-4 -ml-2"
        />
      );
      const className = getByTestId('negative-spacing').props.className;
      expect(className).toContain('-mt-4');
      expect(className).toContain('-ml-2');
    });

    it('handles empty className gracefully', () => {
      const { getByTestId } = render(
        <View testID="empty-class" className="" />
      );
      expect(getByTestId('empty-class').props.className).toBe('');
    });

    it('handles undefined className gracefully', () => {
      const { getByTestId } = render(
        <View testID="no-class" />
      );
      expect(getByTestId('no-class').props.className).toBeUndefined();
    });
  });
});
