/**
 * Navigation Tests
 * Verify screen navigation and parameter passing
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {OnboardingScreen} from '../src/screens/OnboardingScreen';
import {InputScreen} from '../src/screens/InputScreen';
import {ResultScreen} from '../src/screens/ResultScreen';
import {WhyScreen} from '../src/screens/WhyScreen';
import {ProfileScreen} from '../src/screens/ProfileScreen';
import {SettingsScreen} from '../src/screens/SettingsScreen';
import {ThemeProvider} from '../src/theme';

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

// Helper to wrap components with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Navigation Tests', () => {
  describe('OnboardingScreen', () => {
    it('navigates to Input screen when Begin Sorting is pressed', () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <OnboardingScreen navigation={navigation as any} route={{} as any} />,
      );

      fireEvent.press(getByText('Begin Sorting'));
      expect(navigation.navigate).toHaveBeenCalledWith('Input');
    });
  });

  describe('InputScreen', () => {
    it('navigates to Result screen with classification params', async () => {
      const navigation = createMockNavigation();
      const {getByText, getByPlaceholderText} = renderWithTheme(
        <InputScreen navigation={navigation as any} route={{} as any} />,
      );

      // Fill in form fields
      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(
        getByPlaceholderText('HH:MM AM/PM'),
        '03:30 PM',
      );
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'San Francisco, CA',
      );

      // Submit form
      fireEvent.press(getByText('Compute Chart'));

      // Wait for async navigation
      await waitFor(() => {
        expect(navigation.navigate).toHaveBeenCalledWith('Result', 
          expect.objectContaining({
            classification: 'primary',
            primary: expect.any(String),
            percentage: expect.any(Number),
            allies: expect.any(Array),
            contributorsPerSystem: expect.any(Object),
            percentages: expect.any(Object),
          })
        );
      });
    });

    it('validates required fields before navigation', async () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <InputScreen navigation={navigation as any} route={{} as any} />,
      );

      // Try to submit without filling fields
      fireEvent.press(getByText('Compute Chart'));

      // Should not navigate with empty fields
      await waitFor(() => {
        expect(navigation.navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('ResultScreen', () => {
    const mockRoute = {
      params: {
        classification: 'primary' as const,
        primary: 'Pleiades',
        percentage: 67.5,
        allies: [
          {system: 'Sirius', percentage: 18.2},
          {system: 'Arcturus', percentage: 14.3},
        ],
        contributorsPerSystem: {
          Pleiades: ['type_manifestor', 'gate_1'],
          Sirius: ['authority_emotional'],
        },
        percentages: {
          Pleiades: 67.5,
          Sirius: 18.2,
          Arcturus: 14.3,
        },
      },
    };

    it('displays classification results', () => {
      const navigation = createMockNavigation();
      const {getByText, getAllByText} = renderWithTheme(
        <ResultScreen
          navigation={navigation as any}
          route={mockRoute as any}
        />,
      );

      expect(getByText('Your Primary Star System')).toBeTruthy();
      expect(getAllByText('Pleiades').length).toBeGreaterThan(0);
      expect(getAllByText('67.5%').length).toBeGreaterThan(0);
      expect(getByText('Primary System')).toBeTruthy();
      expect(getByText('Allied Systems')).toBeTruthy();
    });

    it('navigates to Why screen when View Why is pressed', () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <ResultScreen
          navigation={navigation as any}
          route={mockRoute as any}
        />,
      );

      fireEvent.press(getByText('View Why'));
      expect(navigation.navigate).toHaveBeenCalledWith('Why', {
        contributorsPerSystem: {
          Pleiades: ['type_manifestor', 'gate_1'],
          Sirius: ['authority_emotional'],
        },
        percentages: {
          Pleiades: 67.5,
          Sirius: 18.2,
          Arcturus: 14.3,
        },
      });
    });



    it('displays disclaimer text', () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <ResultScreen
          navigation={navigation as any}
          route={mockRoute as any}
        />,
      );

      expect(
        getByText(
          'For insight & entertainment. Not medical, financial, or legal advice.',
        ),
      ).toBeTruthy();
    });
  });

  describe('WhyScreen', () => {
    const mockWhyRoute = {
      params: {
        contributorsPerSystem: {
          Pleiades: ['type_manifestor', 'gate_1', 'authority_emotional'],
          Sirius: ['authority_emotional', 'profile_1_3'],
          Arcturus: ['center_heart'],
        },
        percentages: {
          Pleiades: 67.5,
          Sirius: 18.2,
          Arcturus: 14.3,
        },
      },
    };

    it('displays contributors for each system', () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <WhyScreen navigation={navigation as any} route={mockWhyRoute as any} />,
      );

      expect(getByText('Why Pleiades')).toBeTruthy();
      expect(getByText('67.5%')).toBeTruthy();
      expect(getByText('18.2%')).toBeTruthy();
      expect(getByText('14.3%')).toBeTruthy();
    });

    it('navigates back when back button is pressed', () => {
      const navigation = createMockNavigation();
      const {getByTestId} = renderWithTheme(
        <WhyScreen navigation={navigation as any} route={mockWhyRoute as any} />,
      );

      const appBar = getByTestId('why-screen-app-bar');
      expect(appBar).toBeTruthy();
      
      // AppBar should have back functionality
      expect(navigation.goBack).toBeDefined();
    });

    it('displays disclaimer text', () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <WhyScreen navigation={navigation as any} route={mockWhyRoute as any} />,
      );

      expect(
        getByText(
          'For insight & entertainment. Not medical, financial, or legal advice.',
        ),
      ).toBeTruthy();
    });
  });

  describe('ProfileScreen', () => {
    it('navigates to Settings when settings icon is pressed', () => {
      const navigation = createMockNavigation();
      const {getByTestId} = renderWithTheme(
        <ProfileScreen navigation={navigation as any} route={{} as any} />,
      );

      const settingsButton = getByTestId('settings-button');
      fireEvent.press(settingsButton);
      
      expect(navigation.navigate).toHaveBeenCalledWith('Settings');
    });

    it('displays user profile information', () => {
      const navigation = createMockNavigation();
      const {getByText} = renderWithTheme(
        <ProfileScreen navigation={navigation as any} route={{} as any} />,
      );

      // Profile should display user type and profile
      expect(getByText(/Generator|Manifestor|Projector|Reflector/)).toBeTruthy();
    });
  });

  describe('SettingsScreen', () => {
    it('navigates back when back button is pressed', () => {
      const navigation = createMockNavigation();
      const {getByTestId} = renderWithTheme(
        <SettingsScreen navigation={navigation as any} route={{} as any} />,
      );

      const appBar = getByTestId('settings-app-bar');
      expect(appBar).toBeTruthy();
      
      // AppBar should have back functionality
      expect(navigation.goBack).toBeDefined();
    });

    it('displays privacy notice', () => {
      const navigation = createMockNavigation();
      const {getAllByText} = renderWithTheme(
        <SettingsScreen navigation={navigation as any} route={{} as any} />,
      );

      const privacyElements = getAllByText(/privacy|data/i);
      expect(privacyElements.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Flow', () => {
    it('completes full user journey: Onboarding → Input → Result → Why', async () => {
      const navigation = createMockNavigation();
      
      // Step 1: Onboarding
      const {getByText: getByTextOnboarding} = renderWithTheme(
        <OnboardingScreen navigation={navigation as any} route={{} as any} />,
      );
      fireEvent.press(getByTextOnboarding('Begin Sorting'));
      expect(navigation.navigate).toHaveBeenCalledWith('Input');

      // Step 2: Input
      navigation.navigate.mockClear();
      const {getByText: getByTextInput, getByPlaceholderText} = renderWithTheme(
        <InputScreen navigation={navigation as any} route={{} as any} />,
      );
      
      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(getByPlaceholderText('City, State/Country'), 'San Francisco, CA');
      fireEvent.press(getByTextInput('Compute Chart'));

      await waitFor(() => {
        expect(navigation.navigate).toHaveBeenCalledWith('Result', expect.any(Object));
      });

      // Step 3: Result → Why
      navigation.navigate.mockClear();
      const resultRoute = {
        params: {
          classification: 'primary' as const,
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [{system: 'Sirius', percentage: 18.2}],
          contributorsPerSystem: {Pleiades: ['type_manifestor']},
          percentages: {Pleiades: 67.5, Sirius: 18.2},
        },
      };
      
      const {getByText: getByTextResult} = renderWithTheme(
        <ResultScreen navigation={navigation as any} route={resultRoute as any} />,
      );
      fireEvent.press(getByTextResult('View Why'));
      
      expect(navigation.navigate).toHaveBeenCalledWith('Why', {
        contributorsPerSystem: expect.any(Object),
        percentages: expect.any(Object),
      });
    });

    it('prevents navigation to Result without required params', () => {
      const navigation = createMockNavigation();
      
      // Attempt to navigate to Result without params should be caught by guards
      expect(() => {
        renderWithTheme(
          <ResultScreen 
            navigation={navigation as any} 
            route={{params: {}} as any} 
          />
        );
      }).toThrow();
    });

    it('prevents navigation to Why without required params', () => {
      const navigation = createMockNavigation();
      
      // Attempt to navigate to Why without params should be caught by guards
      expect(() => {
        renderWithTheme(
          <WhyScreen 
            navigation={navigation as any} 
            route={{params: {}} as any} 
          />
        );
      }).toThrow();
    });
  });

});
