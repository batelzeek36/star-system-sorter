/**
 * Navigation Tests
 * Verify screen navigation and parameter passing
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {OnboardingScreen} from '../src/screens/OnboardingScreen';
import {InputScreen} from '../src/screens/InputScreen';
import {ResultScreen} from '../src/screens/ResultScreen';
import {GameHubScreen} from '../src/screens/GameHubScreen';

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

describe('Navigation Tests', () => {
  describe('OnboardingScreen', () => {
    it('navigates to Input screen when Get Started is pressed', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <OnboardingScreen navigation={navigation as any} route={{} as any} />,
      );

      fireEvent.press(getByText('Get Started'));
      expect(navigation.navigate).toHaveBeenCalledWith('Input');
    });

    it('navigates to GameHub when Game Hub button is pressed', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <OnboardingScreen navigation={navigation as any} route={{} as any} />,
      );

      fireEvent.press(getByText('Game Hub'));
      expect(navigation.navigate).toHaveBeenCalledWith('GameHub');
    });
  });

  describe('InputScreen', () => {
    it('navigates to Result screen with classification params', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <InputScreen navigation={navigation as any} route={{} as any} />,
      );

      fireEvent.press(getByText('Submit (Mock)'));
      expect(navigation.navigate).toHaveBeenCalledWith('Result', {
        classification: 'primary',
        primary: 'Pleiades',
        percentage: 67.5,
        allies: [
          {system: 'Sirius', percentage: 18.2},
          {system: 'Arcturus', percentage: 14.3},
        ],
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
      },
    };

    it('displays classification results', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <ResultScreen
          navigation={navigation as any}
          route={mockRoute as any}
        />,
      );

      expect(getByText('primary')).toBeTruthy();
      expect(getByText('Pleiades')).toBeTruthy();
      expect(getByText('67.5%')).toBeTruthy();
    });

    it('navigates to Why screen when View Why is pressed', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <ResultScreen
          navigation={navigation as any}
          route={mockRoute as any}
        />,
      );

      fireEvent.press(getByText('View Why'));
      expect(navigation.navigate).toHaveBeenCalledWith('Why', {
        contributorsPerSystem: {},
        percentages: {},
      });
    });

    it('navigates to Profile when Go to Profile is pressed', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <ResultScreen
          navigation={navigation as any}
          route={mockRoute as any}
        />,
      );

      fireEvent.press(getByText('Go to Profile'));
      expect(navigation.navigate).toHaveBeenCalledWith('Profile');
    });

    it('displays disclaimer text', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
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

  describe('GameHubScreen', () => {
    it('navigates to TeamSelect with eventId', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <GameHubScreen navigation={navigation as any} route={{} as any} />,
      );

      fireEvent.press(getByText('Start Game (Mock)'));
      expect(navigation.navigate).toHaveBeenCalledWith('TeamSelect', {
        eventId: 'event_001',
      });
    });

    it('navigates to Leaderboard with eventId', () => {
      const navigation = createMockNavigation();
      const {getByText} = render(
        <GameHubScreen navigation={navigation as any} route={{} as any} />,
      );

      fireEvent.press(getByText('View Leaderboard'));
      expect(navigation.navigate).toHaveBeenCalledWith('Leaderboard', {
        eventId: 'event_001',
      });
    });
  });
});
