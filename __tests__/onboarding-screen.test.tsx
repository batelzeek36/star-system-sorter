/**
 * OnboardingScreen Tests
 * Verify Figma design system integration
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {OnboardingScreen} from '../src/screens/OnboardingScreen';
import {ThemeProvider} from '../src/theme/ThemeProvider';

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

// Wrapper with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('OnboardingScreen', () => {
  it('renders with Figma design system components', () => {
    const navigation = createMockNavigation();
    const {getByText, getByTestId} = renderWithTheme(
      <OnboardingScreen navigation={navigation as any} route={{} as any} />,
    );

    // Verify header with S³ logo
    expect(getByTestId('onboarding-header')).toBeTruthy();
    expect(getByText('Star System Sorter')).toBeTruthy();
    expect(getByText('S³')).toBeTruthy();

    // Verify tagline
    expect(
      getByText(
        'Discover your star system classification based on Human Design principles.',
      ),
    ).toBeTruthy();

    // Verify 3-step explanation card
    expect(getByTestId('onboarding-card')).toBeTruthy();
    
    // Step 1: Input
    expect(getByText('Input')).toBeTruthy();
    expect(getByText('Enter your birth data (date, time, location)')).toBeTruthy();
    
    // Step 2: Sort
    expect(getByText('Sort')).toBeTruthy();
    expect(getByText('We compute your Human Design chart and classify your star system')).toBeTruthy();
    
    // Step 3: Narrative
    expect(getByText('Narrative')).toBeTruthy();
    expect(getByText('View your results, allies, and understand why')).toBeTruthy();

    // Verify disclaimer
    expect(
      getByText(
        'For insight & entertainment. Not medical, financial, or legal advice.',
      ),
    ).toBeTruthy();

    // Verify "Begin Sorting" button
    expect(getByTestId('get-started-button')).toBeTruthy();
    expect(getByText('Begin Sorting')).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    const navigation = createMockNavigation();
    const {getByLabelText} = renderWithTheme(
      <OnboardingScreen navigation={navigation as any} route={{} as any} />,
    );

    expect(getByLabelText('Begin Sorting')).toBeTruthy();
  });

  it('navigates to Input screen when Begin Sorting is pressed', () => {
    const navigation = createMockNavigation();
    const {getByTestId} = renderWithTheme(
      <OnboardingScreen navigation={navigation as any} route={{} as any} />,
    );

    const button = getByTestId('get-started-button');
    fireEvent.press(button);

    expect(navigation.navigate).toHaveBeenCalledWith('Input');
  });

  it('displays step numbers correctly', () => {
    const navigation = createMockNavigation();
    const {getByText} = renderWithTheme(
      <OnboardingScreen navigation={navigation as any} route={{} as any} />,
    );

    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });
});
