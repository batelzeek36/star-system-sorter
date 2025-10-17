/**
 * Toast Component Tests
 * Tests for Toast notifications and InlineAlert components
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Toast, InlineAlert } from '../src/components/Toast';
import { ThemeProvider } from '../src/theme';

describe('Toast', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders with message', () => {
    const { getByText } = renderWithTheme(
      <Toast message="Test message" onClose={jest.fn()} />
    );
    expect(getByText('Test message')).toBeTruthy();
  });

  it('renders success type with checkmark icon', () => {
    const { getByText } = renderWithTheme(
      <Toast message="Success" type="success" onClose={jest.fn()} />
    );
    expect(getByText('✓')).toBeTruthy();
  });

  it('renders error type with X icon', () => {
    const { getByText } = renderWithTheme(
      <Toast message="Error" type="error" onClose={jest.fn()} />
    );
    expect(getByText('✕')).toBeTruthy();
  });

  it('renders warning type with warning icon', () => {
    const { getByText } = renderWithTheme(
      <Toast message="Warning" type="warning" onClose={jest.fn()} />
    );
    expect(getByText('⚠')).toBeTruthy();
  });

  it('renders info type with info icon', () => {
    const { getByText } = renderWithTheme(
      <Toast message="Info" type="info" onClose={jest.fn()} />
    );
    expect(getByText('ℹ')).toBeTruthy();
  });

  it('calls onClose after duration', async () => {
    const onClose = jest.fn();
    renderWithTheme(<Toast message="Test" onClose={onClose} duration={1000} />);

    expect(onClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('has testID for accessibility', () => {
    const { getByTestId } = renderWithTheme(
      <Toast message="Test" onClose={jest.fn()} testID="toast-notification" />
    );
    expect(getByTestId('toast-notification')).toBeTruthy();
  });
});

describe('InlineAlert', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('renders with message', () => {
    const { getByText } = renderWithTheme(<InlineAlert message="Alert message" />);
    expect(getByText('Alert message')).toBeTruthy();
  });

  it('renders success type with checkmark icon', () => {
    const { getByText } = renderWithTheme(
      <InlineAlert message="Success" type="success" />
    );
    expect(getByText('✓')).toBeTruthy();
  });

  it('renders error type with warning icon', () => {
    const { getByText } = renderWithTheme(
      <InlineAlert message="Error" type="error" />
    );
    expect(getByText('⚠')).toBeTruthy();
  });

  it('renders warning type with warning icon', () => {
    const { getByText } = renderWithTheme(
      <InlineAlert message="Warning" type="warning" />
    );
    expect(getByText('⚠')).toBeTruthy();
  });

  it('renders info type with info icon', () => {
    const { getByText } = renderWithTheme(
      <InlineAlert message="Info" type="info" />
    );
    expect(getByText('ℹ')).toBeTruthy();
  });

  it('renders dismiss button when onDismiss provided', () => {
    const onDismiss = jest.fn();
    const { getByText } = renderWithTheme(
      <InlineAlert message="Test" onDismiss={onDismiss} />
    );
    expect(getByText('✕')).toBeTruthy();
  });

  it('does not render dismiss button when onDismiss not provided', () => {
    const { queryByText } = renderWithTheme(<InlineAlert message="Test" />);
    expect(queryByText('✕')).toBeNull();
  });

  it('has testID for accessibility', () => {
    const { getByTestId } = renderWithTheme(
      <InlineAlert message="Test" testID="inline-alert" />
    );
    expect(getByTestId('inline-alert')).toBeTruthy();
  });

  it('has accessibility label for dismiss button', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <InlineAlert message="Test" onDismiss={onDismiss} />
    );
    expect(getByLabelText('Dismiss alert')).toBeTruthy();
  });
});
