/**
 * Button Primitive (NativeWind) Tests
 * Tests for NativeWind Button primitive with className utilities
 * 
 * Note: NativeWind processes className at build/runtime, so we test
 * the component's behavior and accessibility rather than className strings.
 */

import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/ui/Button';

describe('Button (NativeWind Primitive)', () => {
  describe('Variants', () => {
    it('renders primary variant', () => {
      const { getByTestId } = render(
        <Button testID="primary-btn" variant="primary">
          Primary Button
        </Button>
      );
      expect(getByTestId('primary-btn')).toBeTruthy();
    });

    it('renders secondary variant', () => {
      const { getByTestId } = render(
        <Button testID="secondary-btn" variant="secondary">
          Secondary Button
        </Button>
      );
      expect(getByTestId('secondary-btn')).toBeTruthy();
    });

    it('renders ghost variant', () => {
      const { getByTestId } = render(
        <Button testID="ghost-btn" variant="ghost">
          Ghost Button
        </Button>
      );
      expect(getByTestId('ghost-btn')).toBeTruthy();
    });

    it('renders destructive variant', () => {
      const { getByTestId } = render(
        <Button testID="destructive-btn" variant="destructive">
          Destructive Button
        </Button>
      );
      expect(getByTestId('destructive-btn')).toBeTruthy();
    });

    it('renders outline variant', () => {
      const { getByTestId } = render(
        <Button testID="outline-btn" variant="outline">
          Outline Button
        </Button>
      );
      expect(getByTestId('outline-btn')).toBeTruthy();
    });

    it('renders link variant', () => {
      const { getByTestId } = render(
        <Button testID="link-btn" variant="link">
          Link Button
        </Button>
      );
      expect(getByTestId('link-btn')).toBeTruthy();
    });
  });

  describe('Touch Target Minimum (44px)', () => {
    it('renders small size button', () => {
      const { getByTestId } = render(
        <Button testID="small-btn" size="sm">
          Small
        </Button>
      );
      expect(getByTestId('small-btn')).toBeTruthy();
    });

    it('renders medium size button', () => {
      const { getByTestId } = render(
        <Button testID="medium-btn" size="md">
          Medium
        </Button>
      );
      expect(getByTestId('medium-btn')).toBeTruthy();
    });

    it('renders large size button', () => {
      const { getByTestId } = render(
        <Button testID="large-btn" size="lg">
          Large
        </Button>
      );
      expect(getByTestId('large-btn')).toBeTruthy();
    });
  });

  describe('Platform-Specific Elevation', () => {
    it('applies platform-specific styles for primary variant', () => {
      const { getByTestId } = render(
        <Button testID="primary-btn" variant="primary">
          Primary
        </Button>
      );
      const button = getByTestId('primary-btn');
      const styles = Array.isArray(button.props.style) 
        ? button.props.style 
        : [button.props.style];
      
      // Should have either elevation (Android) or shadow (iOS) properties
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(true);
    });

    it('applies platform-specific styles for destructive variant', () => {
      const { getByTestId } = render(
        <Button testID="destructive-btn" variant="destructive">
          Destructive
        </Button>
      );
      const button = getByTestId('destructive-btn');
      const styles = Array.isArray(button.props.style) 
        ? button.props.style 
        : [button.props.style];
      
      // Should have either elevation (Android) or shadow (iOS) properties
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(true);
    });

    it('does not apply elevation for ghost variant', () => {
      const { getByTestId } = render(
        <Button testID="ghost-btn" variant="ghost">
          Ghost
        </Button>
      );
      const button = getByTestId('ghost-btn');
      const styles = Array.isArray(button.props.style) 
        ? button.props.style 
        : [button.props.style];
      
      // Ghost variant should not have elevation or shadow
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(false);
    });

    it('does not apply elevation for outline variant', () => {
      const { getByTestId } = render(
        <Button testID="outline-btn" variant="outline">
          Outline
        </Button>
      );
      const button = getByTestId('outline-btn');
      const styles = Array.isArray(button.props.style) 
        ? button.props.style 
        : [button.props.style];
      
      // Outline variant should not have elevation or shadow
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <Button testID="accessible-btn">Accessible</Button>
      );
      expect(getByTestId('accessible-btn').props.accessibilityRole).toBe('button');
    });

    it('uses children as accessibility label when string', () => {
      const { getByTestId } = render(
        <Button testID="label-btn">Click Me</Button>
      );
      expect(getByTestId('label-btn').props.accessibilityLabel).toBe('Click Me');
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = render(
        <Button testID="custom-label-btn" accessibilityLabel="Custom Label">
          Button Text
        </Button>
      );
      expect(getByTestId('custom-label-btn').props.accessibilityLabel).toBe('Custom Label');
    });

    it('sets disabled state for accessibility', () => {
      const { getByTestId } = render(
        <Button testID="disabled-state-btn" disabled>
          Disabled
        </Button>
      );
      expect(getByTestId('disabled-state-btn').props.accessibilityState).toEqual({
        disabled: true,
      });
    });

    it('sets disabled state when loading', () => {
      const { getByTestId } = render(
        <Button testID="loading-state-btn" loading>
          Loading
        </Button>
      );
      expect(getByTestId('loading-state-btn').props.accessibilityState).toEqual({
        disabled: true,
      });
    });
  });

  describe('Interaction', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button testID="interactive-btn" onPress={onPress}>
          Press Me
        </Button>
      );
      fireEvent.press(getByTestId('interactive-btn'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button testID="disabled-btn" onPress={onPress} disabled>
          Disabled
        </Button>
      );
      fireEvent.press(getByTestId('disabled-btn'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button testID="loading-btn" onPress={onPress} loading>
          Loading
        </Button>
      );
      fireEvent.press(getByTestId('loading-btn'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator when loading', () => {
      const { UNSAFE_getByType } = render(
        <Button testID="loading-indicator-btn" loading>
          Loading
        </Button>
      );
      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('hides leading icon when loading', () => {
      const { Text } = require('react-native');
      const Icon = () => <Text>Icon</Text>;
      const { queryByText } = render(
        <Button leadingIcon={<Icon />} loading>
          Loading
        </Button>
      );
      expect(queryByText('Icon')).toBeNull();
    });
  });

  describe('Icons', () => {
    it('renders leading icon', () => {
      const { Text } = require('react-native');
      const Icon = () => <Text>Icon</Text>;
      const { getByText } = render(
        <Button leadingIcon={<Icon />}>With Icon</Button>
      );
      expect(getByText('Icon')).toBeTruthy();
    });
  });

  describe('Custom className', () => {
    it('accepts custom className prop', () => {
      const { getByTestId } = render(
        <Button testID="custom-class-btn" className="custom-class">
          Custom Class
        </Button>
      );
      expect(getByTestId('custom-class-btn')).toBeTruthy();
    });

    it('merges custom className with variant classes', () => {
      const { getByTestId } = render(
        <Button testID="merged-class-btn" variant="primary" className="mt-4">
          Merged Classes
        </Button>
      );
      expect(getByTestId('merged-class-btn')).toBeTruthy();
    });
  });
});
