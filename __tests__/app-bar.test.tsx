/**
 * AppBar Component Tests
 * Tests for navigation header with back button
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppBar } from '../src/components/AppBar';
import { ThemeProvider } from '../src/theme';

describe('AppBar', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByTestId } = renderWithTheme(<AppBar testID="app-bar" />);
      expect(getByTestId('app-bar')).toBeTruthy();
    });

    it('renders title when provided', () => {
      const { getByText } = renderWithTheme(<AppBar title="Test Title" />);
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('does not render title when not provided', () => {
      const { queryByText } = renderWithTheme(<AppBar />);
      expect(queryByText('Test Title')).toBeNull();
    });

    it('renders back button when showBack is true and onBack is provided', () => {
      const onBack = jest.fn();
      const { getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack onBack={onBack} />
      );
      expect(getByTestId('app-bar-back')).toBeTruthy();
    });

    it('does not render back button when showBack is false', () => {
      const onBack = jest.fn();
      const { queryByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack={false} onBack={onBack} />
      );
      expect(queryByTestId('app-bar-back')).toBeNull();
    });

    it('does not render back button when onBack is not provided', () => {
      const { queryByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack />
      );
      expect(queryByTestId('app-bar-back')).toBeNull();
    });
  });

  describe('Interaction', () => {
    it('calls onBack when back button is pressed', () => {
      const onBack = jest.fn();
      const { getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack onBack={onBack} />
      );

      fireEvent.press(getByTestId('app-bar-back'));
      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('handles multiple back button presses', () => {
      const onBack = jest.fn();
      const { getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack onBack={onBack} />
      );

      const backButton = getByTestId('app-bar-back');
      fireEvent.press(backButton);
      fireEvent.press(backButton);
      fireEvent.press(backButton);

      expect(onBack).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has accessible back button with correct label', () => {
      const onBack = jest.fn();
      const { getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack onBack={onBack} />
      );

      const backButton = getByTestId('app-bar-back');
      expect(backButton.props.accessibilityLabel).toBe('Go back');
      expect(backButton.props.accessibilityRole).toBe('button');
    });

    it('back button has minimum touch target size', () => {
      const onBack = jest.fn();
      const { getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" showBack onBack={onBack} />
      );

      const backButton = getByTestId('app-bar-back');
      const style = backButton.props.style;
      
      // Extract width and height from style array
      const flatStyle = Array.isArray(style) 
        ? Object.assign({}, ...style.filter(Boolean))
        : style;

      expect(flatStyle.width).toBeGreaterThanOrEqual(44);
      expect(flatStyle.height).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Layout', () => {
    it('renders with title and back button together', () => {
      const onBack = jest.fn();
      const { getByText, getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" title="Screen Title" showBack onBack={onBack} />
      );

      expect(getByText('Screen Title')).toBeTruthy();
      expect(getByTestId('app-bar-back')).toBeTruthy();
    });

    it('maintains symmetrical layout with spacers', () => {
      const { getByTestId } = renderWithTheme(
        <AppBar testID="app-bar" title="Test" />
      );

      const container = getByTestId('app-bar');
      expect(container).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('applies theme colors to title', () => {
      const { getByText } = renderWithTheme(<AppBar title="Themed Title" />);
      const title = getByText('Themed Title');
      
      const style = title.props.style;
      const flatStyle = Array.isArray(style)
        ? Object.assign({}, ...style.filter(Boolean))
        : style;

      expect(flatStyle.color).toBeDefined();
    });

    it('applies theme colors to back button icon', () => {
      const onBack = jest.fn();
      const { getByText } = renderWithTheme(
        <AppBar showBack onBack={onBack} />
      );

      const backIcon = getByText('‹');
      const style = backIcon.props.style;
      const flatStyle = Array.isArray(style)
        ? Object.assign({}, ...style.filter(Boolean))
        : style;

      expect(flatStyle.color).toBeDefined();
    });
  });
});
