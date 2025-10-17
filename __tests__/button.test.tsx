/**
 * Button Component Tests
 * Tests for Figma-adapted Button component with variants and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/components/Button';
import { ThemeProvider } from '../src/theme';

describe('Button', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  describe('Variants', () => {
    it('renders primary variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="primary-btn" variant="primary">
          Primary Button
        </Button>
      );
      expect(getByTestId('primary-btn')).toBeTruthy();
    });

    it('renders secondary variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="secondary-btn" variant="secondary">
          Secondary Button
        </Button>
      );
      expect(getByTestId('secondary-btn')).toBeTruthy();
    });

    it('renders ghost variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="ghost-btn" variant="ghost">
          Ghost Button
        </Button>
      );
      expect(getByTestId('ghost-btn')).toBeTruthy();
    });

    it('renders destructive variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="destructive-btn" variant="destructive">
          Destructive Button
        </Button>
      );
      expect(getByTestId('destructive-btn')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('renders small size with minimum 44px touch target', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="small-btn" size="sm">
          Small
        </Button>
      );
      const button = getByTestId('small-btn');
      expect(button.props.style).toMatchObject(
        expect.objectContaining({ minHeight: 44 })
      );
    });

    it('renders medium size with minimum 44px touch target', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="medium-btn" size="md">
          Medium
        </Button>
      );
      const button = getByTestId('medium-btn');
      expect(button.props.style).toMatchObject(
        expect.objectContaining({ minHeight: 44 })
      );
    });

    it('renders large size with minimum 48px touch target', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="large-btn" size="lg">
          Large
        </Button>
      );
      const button = getByTestId('large-btn');
      expect(button.props.style).toMatchObject(
        expect.objectContaining({ minHeight: 48 })
      );
    });
  });

  describe('Interaction', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Button testID="interactive-btn" onPress={onPress}>
          Press Me
        </Button>
      );
      fireEvent.press(getByTestId('interactive-btn'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Button testID="disabled-btn" onPress={onPress} disabled>
          Disabled
        </Button>
      );
      fireEvent.press(getByTestId('disabled-btn'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Button testID="loading-btn" onPress={onPress} loading>
          Loading
        </Button>
      );
      fireEvent.press(getByTestId('loading-btn'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="accessible-btn">Accessible</Button>
      );
      expect(getByTestId('accessible-btn').props.accessibilityRole).toBe('button');
    });

    it('uses children as accessibility label when string', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="label-btn">Click Me</Button>
      );
      expect(getByTestId('label-btn').props.accessibilityLabel).toBe('Click Me');
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="custom-label-btn" accessibilityLabel="Custom Label">
          Button Text
        </Button>
      );
      expect(getByTestId('custom-label-btn').props.accessibilityLabel).toBe('Custom Label');
    });

    it('sets disabled state for accessibility', () => {
      const { getByTestId } = renderWithTheme(
        <Button testID="disabled-state-btn" disabled>
          Disabled
        </Button>
      );
      expect(getByTestId('disabled-state-btn').props.accessibilityState).toEqual({
        disabled: true,
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator when loading', () => {
      const { getByTestId, UNSAFE_getByType } = renderWithTheme(
        <Button testID="loading-indicator-btn" loading>
          Loading
        </Button>
      );
      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('renders leading icon', () => {
      const { Text } = require('react-native');
      const Icon = () => <Text>Icon</Text>;
      const { getByText } = renderWithTheme(
        <Button leadingIcon={<Icon />}>With Icon</Button>
      );
      expect(getByText('Icon')).toBeTruthy();
    });
  });
});
