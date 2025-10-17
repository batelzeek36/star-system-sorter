/**
 * Why Screen Tests
 * 
 * Tests for the Why screen component that displays classification reasoning.
 */

import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {WhyScreen} from '@/screens/WhyScreen';
import {ThemeProvider} from '@/theme/ThemeProvider';
import type {ScreenProps} from '@/navigation/types';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as any;

// Wrapper with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('WhyScreen', () => {
  const defaultProps: ScreenProps<'Why'> = {
    navigation: mockNavigation,
    route: {
      key: 'why-key',
      name: 'Why',
      params: {
        contributorsPerSystem: {
          Pleiades: ['type_manifestor', 'gate_1', 'gate_13'],
          Sirius: ['authority_emotional', 'center_sacral'],
          Arcturus: ['profile_1/3'],
        },
        percentages: {
          Pleiades: 45.5,
          Sirius: 32.1,
          Arcturus: 22.4,
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and subtitle', () => {
    renderWithTheme(<WhyScreen {...defaultProps} />);
    
    expect(screen.getByText('Why Pleiades')).toBeTruthy();
    expect(
      screen.getByText('Your Human Design attributes contributed to these star systems')
    ).toBeTruthy();
  });

  it('displays systems sorted by percentage', () => {
    renderWithTheme(<WhyScreen {...defaultProps} />);
    
    // All systems should be displayed
    expect(screen.getByText('Pleiades')).toBeTruthy();
    expect(screen.getByText('Sirius')).toBeTruthy();
    expect(screen.getByText('Arcturus')).toBeTruthy();
    
    // Percentages should be displayed
    expect(screen.getByText('45.5%')).toBeTruthy();
    expect(screen.getByText('32.1%')).toBeTruthy();
    expect(screen.getByText('22.4%')).toBeTruthy();
  });

  it('displays formatted contributors for each system', () => {
    renderWithTheme(<WhyScreen {...defaultProps} />);
    
    // Check formatted contributor labels
    expect(screen.getByText('Type: Manifestor')).toBeTruthy();
    expect(screen.getByText('Gate 1')).toBeTruthy();
    expect(screen.getByText('Gate 13')).toBeTruthy();
    expect(screen.getByText('Authority: Emotional')).toBeTruthy();
    expect(screen.getByText('Center: Sacral')).toBeTruthy();
    expect(screen.getByText('Profile: 1/3')).toBeTruthy();
  });

  it('displays disclaimer footer', () => {
    renderWithTheme(<WhyScreen {...defaultProps} />);
    
    expect(
      screen.getByText('For insight & entertainment. Not medical, financial, or legal advice.')
    ).toBeTruthy();
  });

  it('handles empty contributors gracefully', () => {
    const propsWithEmpty: ScreenProps<'Why'> = {
      ...defaultProps,
      route: {
        ...defaultProps.route,
        params: {
          contributorsPerSystem: {
            Pleiades: [],
          },
          percentages: {
            Pleiades: 100.0,
          },
        },
      },
    };

    renderWithTheme(<WhyScreen {...propsWithEmpty} />);
    
    expect(screen.getByText('Pleiades')).toBeTruthy();
    expect(screen.getByText('No contributing attributes')).toBeTruthy();
  });

  it('formats different contributor types correctly', () => {
    const propsWithVariety: ScreenProps<'Why'> = {
      ...defaultProps,
      route: {
        ...defaultProps.route,
        params: {
          contributorsPerSystem: {
            TestSystem: [
              'type_generator',
              'authority_sacral',
              'profile_2/4',
              'center_throat',
              'gate_5',
              'channel_34-57',
            ],
          },
          percentages: {
            TestSystem: 100.0,
          },
        },
      },
    };

    renderWithTheme(<WhyScreen {...propsWithVariety} />);
    
    expect(screen.getByText('Type: Generator')).toBeTruthy();
    expect(screen.getByText('Authority: Sacral')).toBeTruthy();
    expect(screen.getByText('Profile: 2/4')).toBeTruthy();
    expect(screen.getByText('Center: Throat')).toBeTruthy();
    expect(screen.getByText('Gate 5')).toBeTruthy();
    expect(screen.getByText('Channel 34-57')).toBeTruthy();
  });
});
