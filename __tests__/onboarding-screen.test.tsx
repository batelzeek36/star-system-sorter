/**
 * OnboardingScreen Tests
 * Verify Figma design system integration
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {OnboardingScreen} from '../src/screens/OnboardingScreen';

// Mock navigation
const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => true),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn(),
  setParams: jest.fn(),
});

describe('OnboardingScreen', () => {
  it('renders with Figma design system components', () => {
    const navigation = createMockNavigation();
    const {getByText, getByTestId} = render(
      <OnboardingScreen navigation={navigation as any} route={{} as any} />,
    );

    // Verify header
    expect(getByTestId('onboarding-header')).toBeTruthy();
    expect(getByText('Star System Sorter')).toBeTruthy();
    expect(getByText('S³')).toBeTruthy();

    // Verify card content
    expect(getByTestId('onboarding-card')).toBeTruthy();
    expect(
      getByText(
        'Discover your star system classification based on Human Design principles.',
      ),
    ).toBeTruthy();

    // Verify disclaimer
    expect(
      getByText(
        'For insight & entertainment. Not medical, financial, or legal advice.',
      ),
    ).toBeTruthy();

    // Verify button
    expect(getByTestId('get-started-button')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    const navigation = createMockNavigation();
    const {getByLabelText} = render(
      <OnboardingScreen navigation={navigation as any} route={{} as any} />,
    );

    expect(getByLabelText('Get Started')).toBeTruthy();
  });
});
