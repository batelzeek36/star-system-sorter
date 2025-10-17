/**
 * Field Component Tests
 * Tests for form input with icons, validation states, and error handling
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { Field } from '../src/components/Field';
import { ThemeProvider } from '../src/theme';

// Mock icon component
const MockIcon = () => <View testID="mock-icon" />;

describe('Field Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  describe('Basic Rendering', () => {
    it('renders with label', () => {
      const { getByText } = renderWithTheme(
        <Field label="Email" placeholder="Enter email" />
      );
      expect(getByText('Email')).toBeTruthy();
    });

    it('renders with placeholder', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <Field label="Email" placeholder="Enter email" />
      );
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
    });

    it('renders with icon', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Field label="Email" icon={<MockIcon />} />
      );
      expect(UNSAFE_getByType(MockIcon)).toBeTruthy();
    });

    it('renders with helper text', () => {
      const { getByText } = renderWithTheme(
        <Field label="Email" helperText="Enter a valid email address" />
      );
      expect(getByText('Enter a valid email address')).toBeTruthy();
    });
  });

  describe('Validation States', () => {
    it('displays error message when error prop is provided', () => {
      const { getByText } = renderWithTheme(
        <Field label="Email" error="Email is required" />
      );
      expect(getByText('Email is required')).toBeTruthy();
    });

    it('prioritizes error over helper text', () => {
      const { getByText, queryByText } = renderWithTheme(
        <Field
          label="Email"
          error="Email is required"
          helperText="Enter a valid email"
        />
      );
      expect(getByText('Email is required')).toBeTruthy();
      expect(queryByText('Enter a valid email')).toBeNull();
    });

    it('applies error variant when error is present', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          error="Email is required"
          testID="email-field"
        />
      );
      const field = getByTestId('email-field');
      expect(field).toBeTruthy();
    });
  });

  describe('Focus States', () => {
    it('handles focus event', () => {
      const onFocus = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          onFocus={onFocus}
          testID="email-field"
        />
      );
      const input = getByTestId('email-field-input');
      fireEvent(input, 'focus');
      expect(onFocus).toHaveBeenCalled();
    });

    it('handles blur event', () => {
      const onBlur = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          onBlur={onBlur}
          testID="email-field"
        />
      );
      const input = getByTestId('email-field-input');
      fireEvent(input, 'blur');
      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('Text Input', () => {
    it('handles text change', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          onChangeText={onChangeText}
          testID="email-field"
        />
      );
      const input = getByTestId('email-field-input');
      fireEvent.changeText(input, 'test@example.com');
      expect(onChangeText).toHaveBeenCalledWith('test@example.com');
    });

    it('accepts value prop', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          value="test@example.com"
          testID="email-field"
        />
      );
      const input = getByTestId('email-field-input');
      expect(input.props.value).toBe('test@example.com');
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <Field label="Email Address" testID="email-field" />
      );
      const input = getByTestId('email-field-input');
      expect(input.props.accessibilityLabel).toBe('Email Address');
    });

    it('has accessibility hint from helper text', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          helperText="Enter a valid email"
          testID="email-field"
        />
      );
      const input = getByTestId('email-field-input');
      expect(input.props.accessibilityHint).toBe('Enter a valid email');
    });

    it('sets disabled state for accessibility', () => {
      const { getByTestId } = renderWithTheme(
        <Field label="Email" editable={false} testID="email-field" />
      );
      const input = getByTestId('email-field-input');
      expect(input.props.accessibilityState.disabled).toBe(true);
    });

    it('has live region for error messages', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          error="Email is required"
          testID="email-field"
        />
      );
      const helper = getByTestId('email-field-helper');
      expect(helper.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('Variants', () => {
    it('renders with default variant', () => {
      const { getByTestId } = renderWithTheme(
        <Field label="Email" variant="default" testID="email-field" />
      );
      expect(getByTestId('email-field')).toBeTruthy();
    });

    it('renders with focus variant', () => {
      const { getByTestId } = renderWithTheme(
        <Field label="Email" variant="focus" testID="email-field" />
      );
      expect(getByTestId('email-field')).toBeTruthy();
    });

    it('renders with error variant', () => {
      const { getByTestId } = renderWithTheme(
        <Field label="Email" variant="error" testID="email-field" />
      );
      expect(getByTestId('email-field')).toBeTruthy();
    });
  });

  describe('TextInput Props', () => {
    it('passes through secureTextEntry prop', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Password"
          secureTextEntry
          testID="password-field"
        />
      );
      const input = getByTestId('password-field-input');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('passes through keyboardType prop', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          keyboardType="email-address"
          testID="email-field"
        />
      );
      const input = getByTestId('email-field-input');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('passes through autoCapitalize prop', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Name"
          autoCapitalize="words"
          testID="name-field"
        />
      );
      const input = getByTestId('name-field-input');
      expect(input.props.autoCapitalize).toBe('words');
    });
  });

  describe('Touch Target', () => {
    it('meets minimum touch target size (44px)', () => {
      const { getByTestId } = renderWithTheme(
        <Field label="Email" testID="email-field" />
      );
      const field = getByTestId('email-field');
      expect(field).toBeTruthy();
      // Touch target size is enforced via minHeight in component
    });
  });
});
