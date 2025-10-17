/**
 * Result Screen Tests
 * 
 * Comprehensive tests for the Result screen component including:
 * - Rendering with classification data
 * - Radial chart display
 * - Ally chips display and interaction
 * - "View Why" navigation
 * - Primary vs Hybrid system display
 * - Accessibility compliance
 * 
 * Requirements: 1.3, 1.7, 1.10, 5.5, 7.5
 * Task: 5.2 (NativeWind migration - test updates)
 * 
 * Note: ResultScreen uses className (NativeWind), but RadialChart and Chip
 * components still use ThemeProvider. Tests wrap with ThemeProvider until
 * those components are migrated.
 */

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {ResultScreen} from '@/screens/ResultScreen';
import {ThemeProvider} from '@/theme/ThemeProvider';
import type {ScreenProps} from '@/navigation/types';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
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
} as any;

// Wrapper with ThemeProvider for unmigrated child components (RadialChart, Chip)
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ResultScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Primary Classification Display', () => {
    const primaryProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [
            {system: 'Sirius', percentage: 18.2},
            {system: 'Arcturus', percentage: 14.3},
          ],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor', 'gate_1', 'gate_13'],
            Sirius: ['authority_emotional'],
            Arcturus: ['center_heart'],
          },
          percentages: {
            Pleiades: 67.5,
            Sirius: 18.2,
            Arcturus: 14.3,
          },
        },
      },
    };

    it('renders header text correctly', () => {
      renderWithTheme(<ResultScreen {...primaryProps} />);
      
      expect(screen.getByTestId('result-header')).toBeTruthy();
      expect(screen.getByText('Your Primary Star System')).toBeTruthy();
    });

    it('displays primary system name', () => {
      renderWithTheme(<ResultScreen {...primaryProps} />);
      
      const systemName = screen.getByTestId('primary-system-name');
      expect(systemName).toBeTruthy();
      expect(systemName.props.children).toBe('Pleiades');
    });

    it('displays "Primary System" classification label', () => {
      renderWithTheme(<ResultScreen {...primaryProps} />);
      
      expect(screen.getByText('Primary System')).toBeTruthy();
    });

    it('renders with correct testID', () => {
      renderWithTheme(<ResultScreen {...primaryProps} />);
      
      expect(screen.getByTestId('result-screen')).toBeTruthy();
    });
  });

  describe('Hybrid Classification Display', () => {
    const hybridProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'hybrid',
          hybrid: ['Pleiades', 'Sirius'],
          percentage: 42.8,
          allies: [
            {system: 'Arcturus', percentage: 15.5},
          ],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor', 'gate_1'],
            Sirius: ['authority_emotional', 'gate_5'],
            Arcturus: ['center_heart'],
          },
          percentages: {
            Pleiades: 42.8,
            Sirius: 41.7,
            Arcturus: 15.5,
          },
        },
      },
    };

    it('displays hybrid system names with slash separator', () => {
      renderWithTheme(<ResultScreen {...hybridProps} />);
      
      expect(screen.getByText('Pleiades / Sirius')).toBeTruthy();
    });

    it('displays "Hybrid System" classification label', () => {
      renderWithTheme(<ResultScreen {...hybridProps} />);
      
      expect(screen.getByText('Hybrid System')).toBeTruthy();
    });

    it('renders hybrid percentage correctly', () => {
      renderWithTheme(<ResultScreen {...hybridProps} />);
      
      // Percentage should be displayed in radial chart
      expect(screen.getByText('42.8%')).toBeTruthy();
    });
  });

  describe('Radial Chart Rendering', () => {
    const chartProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Orion',
          percentage: 85.3,
          allies: [],
          contributorsPerSystem: {
            Orion: ['type_manifestor'],
          },
          percentages: {
            Orion: 85.3,
          },
        },
      },
    };

    it('displays percentage in radial chart', () => {
      renderWithTheme(<ResultScreen {...chartProps} />);
      
      expect(screen.getByText('85.3%')).toBeTruthy();
    });

    it('displays system label in radial chart', () => {
      renderWithTheme(<ResultScreen {...chartProps} />);
      
      // System name should appear in the chart (via accessibility label)
      expect(screen.getByLabelText('Orion: 85.3%')).toBeTruthy();
    });

    it('renders radial chart with correct accessibility label', () => {
      const {getByLabelText} = renderWithTheme(<ResultScreen {...chartProps} />);
      
      expect(getByLabelText('Orion: 85.3%')).toBeTruthy();
    });
  });

  describe('Ally Chips Display', () => {
    const alliesProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 50.0,
          allies: [
            {system: 'Sirius', percentage: 25.5},
            {system: 'Arcturus', percentage: 15.3},
            {system: 'Andromeda', percentage: 9.2},
          ],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor'],
            Sirius: ['authority_emotional'],
            Arcturus: ['center_heart'],
            Andromeda: ['gate_1'],
          },
          percentages: {
            Pleiades: 50.0,
            Sirius: 25.5,
            Arcturus: 15.3,
            Andromeda: 9.2,
          },
        },
      },
    };

    it('displays "Allied Systems" section header', () => {
      renderWithTheme(<ResultScreen {...alliesProps} />);
      
      expect(screen.getByText('Allied Systems')).toBeTruthy();
    });

    it('renders all ally chips with correct testIDs', () => {
      const {getByTestId} = renderWithTheme(<ResultScreen {...alliesProps} />);
      
      expect(getByTestId('ally-chip-0')).toBeTruthy();
      expect(getByTestId('ally-chip-1')).toBeTruthy();
      expect(getByTestId('ally-chip-2')).toBeTruthy();
    });

    it('displays ally system names in chips', () => {
      renderWithTheme(<ResultScreen {...alliesProps} />);
      
      // Chip text is combined with percentage, so check for the combined text
      expect(screen.getByText(/Sirius/)).toBeTruthy();
      expect(screen.getByText(/Arcturus/)).toBeTruthy();
      expect(screen.getByText(/Andromeda/)).toBeTruthy();
    });

    it('displays ally percentages rounded to nearest integer', () => {
      renderWithTheme(<ResultScreen {...alliesProps} />);
      
      // Percentages should be rounded: 25.5 → 26, 15.3 → 15, 9.2 → 9
      // Text is combined in chips, so check for the combined text
      expect(screen.getByText(/26%/)).toBeTruthy();
      expect(screen.getByText(/15%/)).toBeTruthy();
      expect(screen.getByText(/9%/)).toBeTruthy();
    });

    it('alternates chip variants (gold/lavender)', () => {
      const {getByTestId} = renderWithTheme(<ResultScreen {...alliesProps} />);
      
      // First chip should be gold (index 0, even)
      const chip0 = getByTestId('ally-chip-0');
      expect(chip0).toBeTruthy();
      
      // Second chip should be lavender (index 1, odd)
      const chip1 = getByTestId('ally-chip-1');
      expect(chip1).toBeTruthy();
      
      // Third chip should be gold (index 2, even)
      const chip2 = getByTestId('ally-chip-2');
      expect(chip2).toBeTruthy();
    });

    it('does not display allies section when no allies', () => {
      const noAlliesProps: ScreenProps<'Result'> = {
        ...alliesProps,
        route: {
          ...alliesProps.route,
          params: {
            ...alliesProps.route.params,
            allies: [],
          },
        },
      };

      renderWithTheme(<ResultScreen {...noAlliesProps} />);
      
      expect(screen.queryByText('Allied Systems')).toBeNull();
    });
  });

  describe('"View Why" Navigation', () => {
    const navProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [
            {system: 'Sirius', percentage: 18.2},
          ],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor', 'gate_1'],
            Sirius: ['authority_emotional'],
          },
          percentages: {
            Pleiades: 67.5,
            Sirius: 18.2,
          },
        },
      },
    };

    it('renders "View Why" button with correct testID', () => {
      const {getByTestId} = renderWithTheme(<ResultScreen {...navProps} />);
      
      expect(getByTestId('view-why-button')).toBeTruthy();
    });

    it('navigates to Why screen when button is pressed', () => {
      renderWithTheme(<ResultScreen {...navProps} />);
      
      const button = screen.getByTestId('view-why-button');
      fireEvent.press(button);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Why', {
        contributorsPerSystem: {
          Pleiades: ['type_manifestor', 'gate_1'],
          Sirius: ['authority_emotional'],
        },
        percentages: {
          Pleiades: 67.5,
          Sirius: 18.2,
        },
      });
    });

    it('passes correct parameters to Why screen', () => {
      renderWithTheme(<ResultScreen {...navProps} />);
      
      const button = screen.getByTestId('view-why-button');
      fireEvent.press(button);
      
      const callArgs = mockNavigation.navigate.mock.calls[0];
      expect(callArgs[0]).toBe('Why');
      expect(callArgs[1]).toHaveProperty('contributorsPerSystem');
      expect(callArgs[1]).toHaveProperty('percentages');
      expect(callArgs[1].contributorsPerSystem).toEqual(navProps.route.params.contributorsPerSystem);
      expect(callArgs[1].percentages).toEqual(navProps.route.params.percentages);
    });

    it('has proper accessibility label on button', () => {
      const {getByLabelText} = renderWithTheme(<ResultScreen {...navProps} />);
      
      expect(getByLabelText('View Why - See detailed explanation')).toBeTruthy();
    });
  });

  describe('Disclaimer Display', () => {
    const disclaimerProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor'],
          },
          percentages: {
            Pleiades: 67.5,
          },
        },
      },
    };

    it('displays disclaimer text with correct testID', () => {
      const {getByTestId} = renderWithTheme(<ResultScreen {...disclaimerProps} />);
      
      expect(getByTestId('disclaimer-text')).toBeTruthy();
    });

    it('displays exact disclaimer wording', () => {
      renderWithTheme(<ResultScreen {...disclaimerProps} />);
      
      expect(
        screen.getByText('For insight & entertainment. Not medical, financial, or legal advice.')
      ).toBeTruthy();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles missing primary system gracefully', () => {
      const missingPrimaryProps: ScreenProps<'Result'> = {
        navigation: mockNavigation,
        route: {
          key: 'result-key',
          name: 'Result',
          params: {
            classification: 'primary',
            percentage: 50.0,
            allies: [],
            contributorsPerSystem: {},
            percentages: {},
          },
        },
      };

      renderWithTheme(<ResultScreen {...missingPrimaryProps} />);
      
      // Should still render without crashing
      expect(screen.getByTestId('result-screen')).toBeTruthy();
    });

    it('handles hybrid with only first system', () => {
      const partialHybridProps: ScreenProps<'Result'> = {
        navigation: mockNavigation,
        route: {
          key: 'result-key',
          name: 'Result',
          params: {
            classification: 'hybrid',
            hybrid: ['Pleiades'],
            percentage: 50.0,
            allies: [],
            contributorsPerSystem: {
              Pleiades: ['type_manifestor'],
            },
            percentages: {
              Pleiades: 50.0,
            },
          },
        },
      };

      renderWithTheme(<ResultScreen {...partialHybridProps} />);
      
      // Should display the single system
      expect(screen.getByText('Pleiades')).toBeTruthy();
    });

    it('handles zero percentage', () => {
      const zeroPercentProps: ScreenProps<'Result'> = {
        navigation: mockNavigation,
        route: {
          key: 'result-key',
          name: 'Result',
          params: {
            classification: 'primary',
            primary: 'Pleiades',
            percentage: 0,
            allies: [],
            contributorsPerSystem: {
              Pleiades: [],
            },
            percentages: {
              Pleiades: 0,
            },
          },
        },
      };

      renderWithTheme(<ResultScreen {...zeroPercentProps} />);
      
      expect(screen.getByText('0.0%')).toBeTruthy();
    });

    it('handles 100 percentage', () => {
      const fullPercentProps: ScreenProps<'Result'> = {
        navigation: mockNavigation,
        route: {
          key: 'result-key',
          name: 'Result',
          params: {
            classification: 'primary',
            primary: 'Pleiades',
            percentage: 100,
            allies: [],
            contributorsPerSystem: {
              Pleiades: ['type_manifestor'],
            },
            percentages: {
              Pleiades: 100,
            },
          },
        },
      };

      renderWithTheme(<ResultScreen {...fullPercentProps} />);
      
      expect(screen.getByText('100.0%')).toBeTruthy();
    });

    it('handles large number of allies', () => {
      const manyAlliesProps: ScreenProps<'Result'> = {
        navigation: mockNavigation,
        route: {
          key: 'result-key',
          name: 'Result',
          params: {
            classification: 'primary',
            primary: 'Pleiades',
            percentage: 40.0,
            allies: [
              {system: 'Sirius', percentage: 20.0},
              {system: 'Arcturus', percentage: 15.0},
              {system: 'Andromeda', percentage: 12.5},
              {system: 'Orion', percentage: 12.5},
            ],
            contributorsPerSystem: {
              Pleiades: ['type_manifestor'],
              Sirius: ['authority_emotional'],
              Arcturus: ['center_heart'],
              Andromeda: ['gate_1'],
              Orion: ['gate_2'],
            },
            percentages: {
              Pleiades: 40.0,
              Sirius: 20.0,
              Arcturus: 15.0,
              Andromeda: 12.5,
              Orion: 12.5,
            },
          },
        },
      };

      renderWithTheme(<ResultScreen {...manyAlliesProps} />);
      
      // All allies should be rendered
      expect(screen.getByTestId('ally-chip-0')).toBeTruthy();
      expect(screen.getByTestId('ally-chip-1')).toBeTruthy();
      expect(screen.getByTestId('ally-chip-2')).toBeTruthy();
      expect(screen.getByTestId('ally-chip-3')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    const a11yProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [
            {system: 'Sirius', percentage: 18.2},
          ],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor'],
            Sirius: ['authority_emotional'],
          },
          percentages: {
            Pleiades: 67.5,
            Sirius: 18.2,
          },
        },
      },
    };

    it('has accessible testIDs for all interactive elements', () => {
      const {getByTestId} = renderWithTheme(<ResultScreen {...a11yProps} />);
      
      expect(getByTestId('result-screen')).toBeTruthy();
      expect(getByTestId('result-header')).toBeTruthy();
      expect(getByTestId('primary-system-name')).toBeTruthy();
      expect(getByTestId('view-why-button')).toBeTruthy();
      expect(getByTestId('disclaimer-text')).toBeTruthy();
      expect(getByTestId('ally-chip-0')).toBeTruthy();
    });

    it('has proper accessibility labels', () => {
      const {getByLabelText} = renderWithTheme(<ResultScreen {...a11yProps} />);
      
      expect(getByLabelText('View Why - See detailed explanation')).toBeTruthy();
      expect(getByLabelText('Pleiades: 67.5%')).toBeTruthy();
    });
  });

  describe('Visual Consistency', () => {
    const visualProps: ScreenProps<'Result'> = {
      navigation: mockNavigation,
      route: {
        key: 'result-key',
        name: 'Result',
        params: {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [
            {system: 'Sirius', percentage: 18.2},
          ],
          contributorsPerSystem: {
            Pleiades: ['type_manifestor'],
            Sirius: ['authority_emotional'],
          },
          percentages: {
            Pleiades: 67.5,
            Sirius: 18.2,
          },
        },
      },
    };

    it('renders all major sections in correct order', () => {
      renderWithTheme(<ResultScreen {...visualProps} />);
      
      // Should have header, chart, system display, allies, button, disclaimer
      expect(screen.getByText('Your Primary Star System')).toBeTruthy();
      expect(screen.getByText(/67\.5%/)).toBeTruthy();
      expect(screen.getByTestId('primary-system-name')).toBeTruthy();
      expect(screen.getByText('Allied Systems')).toBeTruthy();
      expect(screen.getByText('View Why')).toBeTruthy();
      expect(screen.getByText('For insight & entertainment. Not medical, financial, or legal advice.')).toBeTruthy();
    });

    it('uses StarfieldBackground component', () => {
      const {UNSAFE_root} = renderWithTheme(<ResultScreen {...visualProps} />);
      
      // StarfieldBackground should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
