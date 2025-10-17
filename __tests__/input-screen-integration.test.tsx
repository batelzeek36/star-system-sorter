/**
 * Input Screen Integration Tests
 * Tests the wiring between Input screen, hdkit adapter, and scorer
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {InputScreen} from '../src/screens/InputScreen';
import {computeHDExtract} from '../src/hd';
import {classify} from '../src/scorer';
import {ThemeProvider} from '../src/theme';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as any;

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock HD module
jest.mock('../src/hd');
const mockComputeHDExtract = computeHDExtract as jest.MockedFunction<
  typeof computeHDExtract
>;

// Mock scorer
jest.mock('../src/scorer');
const mockClassify = classify as jest.MockedFunction<typeof classify>;

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('InputScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tab Navigation', () => {
    it('should render both tabs with correct labels', () => {
      const {getByTestId, getByText} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      expect(getByTestId('tab-birth-data')).toBeTruthy();
      expect(getByTestId('tab-upload-pdf')).toBeTruthy();
      expect(getByText('Birth Data')).toBeTruthy();
      expect(getByText('Upload Chart PDF')).toBeTruthy();
    });

    it('should have Birth Data tab active by default', () => {
      const {getByTestId, getByPlaceholderText} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      const birthDataTab = getByTestId('tab-birth-data');
      expect(birthDataTab.props.accessibilityState.selected).toBe(true);

      // Birth data form should be visible
      expect(getByPlaceholderText('MM/DD/YYYY')).toBeTruthy();
    });

    it('should switch to Upload PDF tab when clicked', () => {
      const {getByTestId, getByText, queryByPlaceholderText} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      const uploadTab = getByTestId('tab-upload-pdf');
      fireEvent.press(uploadTab);

      // Upload tab should be active
      expect(uploadTab.props.accessibilityState.selected).toBe(true);

      // Birth data form should be hidden
      expect(queryByPlaceholderText('MM/DD/YYYY')).toBeNull();

      // Upload placeholder should be visible
      expect(getByText('PDF upload functionality coming soon')).toBeTruthy();
    });

    it('should switch back to Birth Data tab', () => {
      const {getByTestId, getByPlaceholderText} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      // Switch to Upload tab
      fireEvent.press(getByTestId('tab-upload-pdf'));

      // Switch back to Birth Data tab
      const birthDataTab = getByTestId('tab-birth-data');
      fireEvent.press(birthDataTab);

      expect(birthDataTab.props.accessibilityState.selected).toBe(true);
      expect(getByPlaceholderText('MM/DD/YYYY')).toBeTruthy();
    });

    it('should have proper accessibility attributes for tabs', () => {
      const {getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      const birthDataTab = getByTestId('tab-birth-data');
      const uploadTab = getByTestId('tab-upload-pdf');

      expect(birthDataTab.props.accessibilityRole).toBe('tab');
      expect(birthDataTab.props.accessibilityLabel).toBe('Birth Data tab');
      expect(uploadTab.props.accessibilityRole).toBe('tab');
      expect(uploadTab.props.accessibilityLabel).toBe('Upload Chart PDF tab');
    });
  });

  it('should wire form submission to hdkit adapter and scorer', async () => {
    // Mock HD extract result
    const mockHDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: ['Sacral', 'Throat'],
      channels: [34, 57],
      gates: [1, 13, 25],
    };
    mockComputeHDExtract.mockResolvedValue(mockHDExtract);

    // Mock classification result
    const mockResult = {
      classification: 'primary' as const,
      primary: 'Pleiades',
      allies: [
        {system: 'Sirius', percentage: 18.2},
        {system: 'Arcturus', percentage: 14.3},
      ],
      percentages: {
        Pleiades: 67.5,
        Sirius: 18.2,
        Arcturus: 14.3,
      },
      contributorsPerSystem: {
        Pleiades: ['type_manifestor', 'gate_1'],
        Sirius: ['center_sacral'],
        Arcturus: ['channel_34'],
      },
      meta: {
        canonVersion: '0.1.0',
        canonChecksum: 'abc123',
      },
    };
    mockClassify.mockResolvedValue(mockResult);

    const {getByPlaceholderText, getByText} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    // Fill in form
    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'New York, NY'
    );

    // Submit form
    fireEvent.press(getByText('Compute Chart'));

    // Wait for async operations
    await waitFor(() => {
      expect(mockComputeHDExtract).toHaveBeenCalledWith({
        dateISO: '1990-01-15',
        time: '15:30',
        timeZone: expect.any(String),
      });
    });

    await waitFor(() => {
      expect(mockClassify).toHaveBeenCalledWith(mockHDExtract);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Result', {
        classification: 'primary',
        primary: 'Pleiades',
        percentage: 67.5,
        allies: mockResult.allies,
        contributorsPerSystem: mockResult.contributorsPerSystem,
        percentages: mockResult.percentages,
      });
    });
  });

  it('should handle time conversion correctly (AM)', async () => {
    mockComputeHDExtract.mockResolvedValue({
      type: 'Generator',
      authority: 'Sacral',
      profile: '2/4',
      centers: [],
      channels: [],
      gates: [],
    });

    mockClassify.mockResolvedValue({
      classification: 'primary',
      primary: 'Sirius',
      allies: [],
      percentages: {Sirius: 100},
      contributorsPerSystem: {},
      meta: {canonVersion: '0.1.0', canonChecksum: 'abc'},
    });

    const {getByPlaceholderText, getByText} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '06/20/1985');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '09:15 AM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Los Angeles, CA'
    );

    fireEvent.press(getByText('Compute Chart'));

    await waitFor(() => {
      expect(mockComputeHDExtract).toHaveBeenCalledWith({
        dateISO: '1985-06-20',
        time: '09:15',
        timeZone: expect.any(String),
      });
    });
  });

  it('should handle midnight (12:00 AM) correctly', async () => {
    mockComputeHDExtract.mockResolvedValue({
      type: 'Projector',
      authority: 'Splenic',
      profile: '3/5',
      centers: [],
      channels: [],
      gates: [],
    });

    mockClassify.mockResolvedValue({
      classification: 'primary',
      primary: 'Arcturus',
      allies: [],
      percentages: {Arcturus: 100},
      contributorsPerSystem: {},
      meta: {canonVersion: '0.1.0', canonChecksum: 'abc'},
    });

    const {getByPlaceholderText, getByText} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '12/25/2000');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '12:00 AM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Chicago, IL'
    );

    fireEvent.press(getByText('Compute Chart'));

    await waitFor(() => {
      expect(mockComputeHDExtract).toHaveBeenCalledWith({
        dateISO: '2000-12-25',
        time: '00:00',
        timeZone: expect.any(String),
      });
    });
  });

  it('should handle noon (12:00 PM) correctly', async () => {
    mockComputeHDExtract.mockResolvedValue({
      type: 'Reflector',
      authority: 'Lunar',
      profile: '6/2',
      centers: [],
      channels: [],
      gates: [],
    });

    mockClassify.mockResolvedValue({
      classification: 'primary',
      primary: 'Andromeda',
      allies: [],
      percentages: {Andromeda: 100},
      contributorsPerSystem: {},
      meta: {canonVersion: '0.1.0', canonChecksum: 'abc'},
    });

    const {getByPlaceholderText, getByText} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '03/10/1995');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '12:00 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Miami, FL'
    );

    fireEvent.press(getByText('Compute Chart'));

    await waitFor(() => {
      expect(mockComputeHDExtract).toHaveBeenCalledWith({
        dateISO: '1995-03-10',
        time: '12:00',
        timeZone: expect.any(String),
      });
    });
  });

  it('should show development alert when scorer not implemented', async () => {
    mockComputeHDExtract.mockResolvedValue({
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: ['Sacral'],
      channels: [34],
      gates: [5, 14],
    });

    // Scorer throws error (not yet implemented)
    mockClassify.mockRejectedValue(
      new Error('classify() not yet implemented')
    );

    const {getByPlaceholderText, getByText} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '07/04/1992');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '06:45 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Boston, MA'
    );

    fireEvent.press(getByText('Compute Chart'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Development Mode',
        'The scoring system is not yet implemented. Showing sample results for testing.',
        [{text: 'OK'}]
      );
    });

    // Should still navigate with mock data
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Result', expect.any(Object));
    });
  });

  it('should handle hdkit adapter errors gracefully', async () => {
    mockComputeHDExtract.mockRejectedValue(
      new Error('Invalid timezone: XYZ')
    );

    const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '11/11/2011');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '11:11 AM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Seattle, WA'
    );

    fireEvent.press(getByText('Compute Chart'));

    // Toast should be shown with error message
    await waitFor(() => {
      expect(getByTestId('input-toast')).toBeTruthy();
      expect(getByText(/Invalid timezone/i)).toBeTruthy();
    });

    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  describe('Toast Notifications', () => {
    it('should show success toast when computing chart', async () => {
      mockComputeHDExtract.mockResolvedValue({
        type: 'Generator',
        authority: 'Sacral',
        profile: '2/4',
        centers: [],
        channels: [],
        gates: [],
      });

      mockClassify.mockResolvedValue({
        classification: 'primary',
        primary: 'Sirius',
        allies: [],
        percentages: {Sirius: 100},
        contributorsPerSystem: {},
        meta: {canonVersion: '0.1.0', canonChecksum: 'abc'},
      });

      const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'New York, NY'
      );

      fireEvent.press(getByText('Compute Chart'));

      // Toast should appear with success message
      await waitFor(() => {
        expect(getByTestId('input-toast')).toBeTruthy();
        expect(getByText('Computing your chart...')).toBeTruthy();
      });
    });

    it('should show error toast for network errors', async () => {
      mockComputeHDExtract.mockRejectedValue(
        new Error('No internet connection')
      );

      const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'New York, NY'
      );

      fireEvent.press(getByText('Compute Chart'));

      await waitFor(() => {
        expect(getByTestId('input-toast')).toBeTruthy();
        expect(
          getByText('No internet connection. Please check your network and try again.')
        ).toBeTruthy();
      });
    });

    it('should show error toast for server errors', async () => {
      mockComputeHDExtract.mockRejectedValue(new Error('Server error'));

      const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'New York, NY'
      );

      fireEvent.press(getByText('Compute Chart'));

      await waitFor(() => {
        expect(getByTestId('input-toast')).toBeTruthy();
        expect(
          getByText('Service temporarily unavailable. Please try again later.')
        ).toBeTruthy();
      });
    });

    it('should show error toast for rate limiting', async () => {
      mockComputeHDExtract.mockRejectedValue(new Error('Rate limit exceeded'));

      const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'New York, NY'
      );

      fireEvent.press(getByText('Compute Chart'));

      await waitFor(() => {
        expect(getByTestId('input-toast')).toBeTruthy();
        expect(
          getByText('Too many requests. Please wait a moment before trying again.')
        ).toBeTruthy();
      });
    });

    it('should show error toast for invalid input', async () => {
      mockComputeHDExtract.mockRejectedValue(new Error('Invalid input data'));

      const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'New York, NY'
      );

      fireEvent.press(getByText('Compute Chart'));

      await waitFor(() => {
        expect(getByTestId('input-toast')).toBeTruthy();
        expect(
          getByText('Invalid data. Please check your birth date, time, and timezone.')
        ).toBeTruthy();
      });
    });

    it('should show generic error toast for unknown errors', async () => {
      mockComputeHDExtract.mockRejectedValue(new Error('Unknown error'));

      const {getByPlaceholderText, getByText, getByTestId} = renderWithTheme(
        <InputScreen navigation={mockNavigation} route={{} as any} />
      );

      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/15/1990');
      fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '03:30 PM');
      fireEvent.changeText(
        getByPlaceholderText('City, State/Country'),
        'New York, NY'
      );

      fireEvent.press(getByText('Compute Chart'));

      await waitFor(() => {
        expect(getByTestId('input-toast')).toBeTruthy();
        expect(
          getByText('Unable to process your birth data. Please check your inputs and try again.')
        ).toBeTruthy();
      });
    });
  });

  it('should handle hybrid classification correctly', async () => {
    mockComputeHDExtract.mockResolvedValue({
      type: 'Manifesting Generator',
      authority: 'Emotional',
      profile: '4/6',
      centers: ['Sacral', 'Solar Plexus'],
      channels: [34, 57, 18, 58],
      gates: [1, 2, 3, 5, 14, 34, 57],
    });

    const mockHybridResult = {
      classification: 'hybrid' as const,
      hybrid: ['Pleiades', 'Sirius'] as [string, string],
      allies: [{system: 'Arcturus', percentage: 10.5}],
      percentages: {
        Pleiades: 45.2,
        Sirius: 44.3,
        Arcturus: 10.5,
      },
      contributorsPerSystem: {
        Pleiades: ['type_manifesting_generator', 'gate_1'],
        Sirius: ['authority_emotional', 'gate_2'],
        Arcturus: ['channel_34'],
      },
      meta: {
        canonVersion: '0.1.0',
        canonChecksum: 'def456',
      },
    };
    mockClassify.mockResolvedValue(mockHybridResult);

    const {getByPlaceholderText, getByText} = renderWithTheme(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '08/08/1988');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '08:08 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Denver, CO'
    );

    fireEvent.press(getByText('Compute Chart'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Result', {
        classification: 'hybrid',
        primary: undefined,
        hybrid: ['Pleiades', 'Sirius'],
        percentage: 45.2, // Max of the two hybrid systems
        allies: mockHybridResult.allies,
        contributorsPerSystem: mockHybridResult.contributorsPerSystem,
        percentages: mockHybridResult.percentages,
      });
    });
  });
});
