/**
 * Toast Component Tests
 * Tests for Toast notifications and InlineAlert components
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Toast, InlineAlert } from '../src/components/Toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders with message', () => {
    const { getByText } = render(
      <Toast message="Test message" onClose={jest.fn()} />
    );
    expect(getByText('Test message')).toBeTruthy();
  });

  it('renders success type with checkmark icon', () => {
    const { getByText } = render(
      <Toast message="Success" type="success" onClose={jest.fn()} />
    );
    expect(getByText('✓')).toBeTruthy();
  });

  it('renders error type with X icon', () => {
    const { getByText } = render(
      <Toast message="Error" type="error" onClose={jest.fn()} />
    );
    expect(getByText('✕')).toBeTruthy();
  });

  it('renders warning type with warning icon', () => {
    const { getByText } = render(
      <Toast message="Warning" type="warning" onClose={jest.fn()} />
    );
    expect(getByText('⚠')).toBeTruthy();
  });

  it('renders info type with info icon', () => {
    const { getByText } = render(
      <Toast message="Info" type="info" onClose={jest.fn()} />
    );
    expect(getByText('ℹ')).toBeTruthy();
  });

  it('calls onClose after duration', async () => {
    const onClose = jest.fn();
    render(<Toast message="Test" onClose={onClose} duration={1000} />);

    expect(onClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('has testID for accessibility', () => {
    const { getByTestId } = render(
      <Toast message="Test" onClose={jest.fn()} testID="toast-notification" />
    );
    expect(getByTestId('toast-notification')).toBeTruthy();
  });
});

describe('InlineAlert', () => {
  it('renders with message', () => {
    const { getByText } = render(<InlineAlert message="Alert message" />);
    expect(getByText('Alert message')).toBeTruthy();
  });

  it('renders success type with checkmark icon', () => {
    const { getByText } = render(
      <InlineAlert message="Success" type="success" />
    );
    expect(getByText('✓')).toBeTruthy();
  });

  it('renders error type with warning icon', () => {
    const { getByText } = render(
      <InlineAlert message="Error" type="error" />
    );
    expect(getByText('⚠')).toBeTruthy();
  });

  it('renders warning type with warning icon', () => {
    const { getByText } = render(
      <InlineAlert message="Warning" type="warning" />
    );
    expect(getByText('⚠')).toBeTruthy();
  });

  it('renders info type with info icon', () => {
    const { getByText } = render(
      <InlineAlert message="Info" type="info" />
    );
    expect(getByText('ℹ')).toBeTruthy();
  });

  it('renders dismiss button when onDismiss provided', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      <InlineAlert message="Test" onDismiss={onDismiss} />
    );
    expect(getByText('✕')).toBeTruthy();
  });

  it('does not render dismiss button when onDismiss not provided', () => {
    const { queryByText } = render(<InlineAlert message="Test" />);
    expect(queryByText('✕')).toBeNull();
  });

  it('has testID for accessibility', () => {
    const { getByTestId } = render(
      <InlineAlert message="Test" testID="inline-alert" />
    );
    expect(getByTestId('inline-alert')).toBeTruthy();
  });

  it('has accessibility label for dismiss button', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      <InlineAlert message="Test" onDismiss={onDismiss} />
    );
    expect(getByLabelText('Dismiss alert')).toBeTruthy();
  });
});
