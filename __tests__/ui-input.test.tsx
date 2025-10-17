/**
 * Input Primitive (NativeWind) Tests
 * Tests for NativeWind Input primitive with focus and error states
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../src/ui/Input';

describe('Input (NativeWind Primitive)', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      const { getByText } = render(
        <Input label="Test Label" testID="test-input" />
      );
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('renders with placeholder', () => {
      const { getByPlaceholderText } = render(
        <Input label="Test Label" placeholder="Enter text" testID="test-input" />
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('renders with helper text', () => {
      const { getByText } = render(
        <Input label="Test Label" helperText="This is helper text" testID="test-input" />
      );
      expect(getByText('This is helper text')).toBeTruthy();
    });

    it('renders with icon', () => {
      const { Text } = require('react-native');
      const Icon = () => <Text>Icon</Text>;
      const { UNSAFE_getAllByType } = render(
        <Input label="Test Label" icon={<Icon />} testID="test-input" />
      );
      const { View } = require('react-native');
      const views = UNSAFE_getAllByType(View);
      
      // Find the icon container
      const iconContainer = views.find((view: any) => 
        view.props.accessibilityElementsHidden === true
      );
      expect(iconContainer).toBeTruthy();
    });
  });

  describe('Focus State', () => {
    it('changes border color on focus', () => {
      const { getByTestId } = render(
        <Input label="Test Label" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      // Before focus - should have border-borders-muted class
      expect(input.props.className).toContain('border-borders-muted');
      
      // After focus - should have border-lavender-500 class
      fireEvent(input, 'focus');
      expect(input.props.className).toContain('border-lavender-500');
    });

    it('changes state on blur', () => {
      const { getByTestId } = render(
        <Input label="Test Label" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      expect(input).toBeTruthy();
    });

    it('calls onFocus callback', () => {
      const onFocus = jest.fn();
      const { getByTestId } = render(
        <Input label="Test Label" onFocus={onFocus} testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      fireEvent(input, 'focus');
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur callback', () => {
      const onBlur = jest.fn();
      const { getByTestId } = render(
        <Input label="Test Label" onBlur={onBlur} testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      fireEvent(input, 'blur');
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error State', () => {
    it('displays error message', () => {
      const { getByText } = render(
        <Input label="Test Label" error="This is an error" testID="test-input" />
      );
      expect(getByText('This is an error')).toBeTruthy();
    });

    it('changes border color to error state', () => {
      const { getByTestId } = render(
        <Input label="Test Label" error="This is an error" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      // Should have border-semantic-error class when error is present
      expect(input.props.className).toContain('border-semantic-error');
    });

    it('error message takes precedence over helper text', () => {
      const { getByText, queryByText } = render(
        <Input
          label="Test Label"
          helperText="Helper text"
          error="Error message"
          testID="test-input"
        />
      );
      expect(getByText('Error message')).toBeTruthy();
      expect(queryByText('Helper text')).toBeNull();
    });

    it('sets accessibility live region for error', () => {
      const { getByTestId } = render(
        <Input label="Test Label" error="Error message" testID="test-input" />
      );
      const helper = getByTestId('test-input-helper');
      expect(helper.props.accessibilityLiveRegion).toBe('polite');
    });

    it('does not set accessibility live region for helper text', () => {
      const { getByTestId } = render(
        <Input label="Test Label" helperText="Helper text" testID="test-input" />
      );
      const helper = getByTestId('test-input-helper');
      expect(helper.props.accessibilityLiveRegion).toBe('none');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      const { getByTestId } = render(
        <Input label="Test Label" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      expect(input.props.accessibilityLabel).toBe('Test Label');
    });

    it('sets accessibility hint from helper text', () => {
      const { getByTestId } = render(
        <Input label="Test Label" helperText="Helper text" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      expect(input.props.accessibilityHint).toBe('Helper text');
    });

    it('sets disabled state for accessibility', () => {
      const { getByTestId } = render(
        <Input label="Test Label" editable={false} testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      expect(input.props.accessibilityState).toEqual({ disabled: true });
    });

    it('hides icon from accessibility tree', () => {
      const { Text } = require('react-native');
      const Icon = () => <Text>Icon</Text>;
      const { UNSAFE_getAllByType } = render(
        <Input label="Test Label" icon={<Icon />} testID="test-input" />
      );
      const { View } = require('react-native');
      const views = UNSAFE_getAllByType(View);
      
      // Find the icon container
      const iconContainer = views.find((view: any) => 
        view.props.accessibilityElementsHidden === true
      );
      expect(iconContainer).toBeTruthy();
      expect(iconContainer?.props.importantForAccessibility).toBe('no');
    });
  });

  describe('Text Input', () => {
    it('handles text change', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(
        <Input label="Test Label" onChangeText={onChangeText} testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      fireEvent.changeText(input, 'New text');
      expect(onChangeText).toHaveBeenCalledWith('New text');
    });

    it('accepts value prop', () => {
      const { getByTestId } = render(
        <Input label="Test Label" value="Initial value" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      expect(input.props.value).toBe('Initial value');
    });

    it('accepts secureTextEntry prop', () => {
      const { getByTestId } = render(
        <Input label="Password" secureTextEntry testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('accepts keyboardType prop', () => {
      const { getByTestId } = render(
        <Input label="Email" keyboardType="email-address" testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      expect(input.props.keyboardType).toBe('email-address');
    });
  });

  describe('Custom className', () => {
    it('accepts custom className prop', () => {
      const { getByTestId } = render(
        <Input label="Test Label" className="mt-4" testID="test-input" />
      );
      expect(getByTestId('test-input')).toBeTruthy();
    });
  });

  describe('Icon Color', () => {
    it('renders icon with color prop on focus', () => {
      const { Text } = require('react-native');
      let receivedColor: string | undefined;
      const Icon = ({ color }: { color?: string }) => {
        receivedColor = color;
        return <Text>Icon</Text>;
      };
      const { getByTestId } = render(
        <Input label="Test Label" icon={<Icon />} testID="test-input" />
      );
      const input = getByTestId('test-input-input');
      
      // Icon should receive default color
      expect(receivedColor).toBe('#c4b5fd');
      
      // Focus should trigger re-render with same color (lavender-400)
      fireEvent(input, 'focus');
      expect(receivedColor).toBe('#c4b5fd');
    });

    it('renders icon with error color', () => {
      const { Text } = require('react-native');
      let receivedColor: string | undefined;
      const Icon = ({ color }: { color?: string }) => {
        receivedColor = color;
        return <Text>Icon</Text>;
      };
      render(
        <Input label="Test Label" icon={<Icon />} error="Error" testID="test-input" />
      );
      
      // Icon should receive error color
      expect(receivedColor).toBe('#ef4444');
    });
  });
});
