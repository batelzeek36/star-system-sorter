/**
 * Input Screen Integration Tests
 * Tests the wiring between Input screen, hdkit adapter, and scorer
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {InputScreen} from '../src/screens/InputScreen';
import {computeHDExtract} from '../src/hd/hdkit-adapter';
import {classify} from '../src/scorer';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as any;

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock hdkit adapter
jest.mock('../src/hd/hdkit-adapter');
const mockComputeHDExtract = computeHDExtract as jest.MockedFunction<
  typeof computeHDExtract
>;

// Mock scorer
jest.mock('../src/scorer');
const mockClassify = classify as jest.MockedFunction<typeof classify>;

describe('InputScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    const {getByPlaceholderText, getByText} = render(
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
    fireEvent.press(getByText('Calculate'));

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

    const {getByPlaceholderText, getByText} = render(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '06/20/1985');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '09:15 AM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Los Angeles, CA'
    );

    fireEvent.press(getByText('Calculate'));

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

    const {getByPlaceholderText, getByText} = render(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '12/25/2000');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '12:00 AM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Chicago, IL'
    );

    fireEvent.press(getByText('Calculate'));

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

    const {getByPlaceholderText, getByText} = render(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '03/10/1995');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '12:00 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Miami, FL'
    );

    fireEvent.press(getByText('Calculate'));

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

    const {getByPlaceholderText, getByText} = render(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '07/04/1992');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '06:45 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Boston, MA'
    );

    fireEvent.press(getByText('Calculate'));

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

    const {getByPlaceholderText, getByText} = render(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '11/11/2011');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '11:11 AM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Seattle, WA'
    );

    fireEvent.press(getByText('Calculate'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Invalid timezone. Please select a valid timezone.',
        [{text: 'OK'}]
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
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

    const {getByPlaceholderText, getByText} = render(
      <InputScreen navigation={mockNavigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '08/08/1988');
    fireEvent.changeText(getByPlaceholderText('HH:MM AM/PM'), '08:08 PM');
    fireEvent.changeText(
      getByPlaceholderText('City, State/Country'),
      'Denver, CO'
    );

    fireEvent.press(getByText('Calculate'));

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
