/**
 * Chip Component Tests
 * Tests for star system ally chips with percentages
 * 
 * Requirements: 2.1.2 (Core Components - Chip.tsx)
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from '../src/components';
import { ThemeProvider } from '../src/theme';

describe('Chip Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  describe('Basic Rendering', () => {
    it('renders star system name', () => {
      const { getByText } = renderWithTheme(
        <Chip starSystem="Sirius" testID="chip" />
      );
      expect(getByText(/Sirius/)).toBeTruthy();
    });

    it('renders star system name with percentage', () => {
      const { getByText } = renderWithTheme(
        <Chip starSystem="Sirius" percentage={18} testID="chip" />
      );
      expect(getByText(/Sirius 18%/)).toBeTruthy();
    });

    it('renders without percentage when not provided', () => {
      const { getByText, queryByText } = renderWithTheme(
        <Chip starSystem="Orion" testID="chip" />
      );
      expect(getByText(/Orion/)).toBeTruthy();
      expect(queryByText(/%/)).toBeNull();
    });
  });

  describe('Variants', () => {
    it('renders with gold variant', () => {
      const { getByTestId } = renderWithTheme(
        <Chip starSystem="Sirius" variant="gold" testID="chip" />
      );
      expect(getByTestId('chip')).toBeTruthy();
    });

    it('renders with lavender variant (default)', () => {
      const { getByTestId } = renderWithTheme(
        <Chip starSystem="Pleiades" testID="chip" />
      );
      expect(getByTestId('chip')).toBeTruthy();
    });

    it('renders with lavender variant explicitly', () => {
      const { getByTestId } = renderWithTheme(
        <Chip starSystem="Andromeda" variant="lavender" testID="chip" />
      );
      expect(getByTestId('chip')).toBeTruthy();
    });
  });

  describe('Selectable Chips', () => {
    it('calls onSelect when pressed', () => {
      const onSelect = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Chip
          starSystem="Lyra"
          selectable={true}
          onSelect={onSelect}
          testID="chip"
        />
      );

      fireEvent.press(getByTestId('chip'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('renders as non-selectable by default', () => {
      const onSelect = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Chip starSystem="Arcturus" onSelect={onSelect} testID="chip" />
      );

      // Should not be pressable when selectable is false
      const chip = getByTestId('chip');
      expect(chip.props.accessibilityRole).toBeUndefined();
    });

    it('shows selected state', () => {
      const { getByTestId } = renderWithTheme(
        <Chip
          starSystem="Orion"
          selectable={true}
          selected={true}
          onSelect={() => {}}
          testID="chip"
        />
      );

      const chip = getByTestId('chip');
      expect(chip.props.accessibilityState).toEqual({ selected: true });
    });

    it('shows unselected state', () => {
      const { getByTestId } = renderWithTheme(
        <Chip
          starSystem="Sirius"
          selectable={true}
          selected={false}
          onSelect={() => {}}
          testID="chip"
        />
      );

      const chip = getByTestId('chip');
      expect(chip.props.accessibilityState).toEqual({ selected: false });
    });
  });

  describe('Dismissible Chips', () => {
    it('shows dismiss button when dismissible', () => {
      const onDismiss = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <Chip
          starSystem="Pleiades"
          dismissible={true}
          onDismiss={onDismiss}
          testID="chip"
        />
      );

      expect(getByLabelText('Dismiss Pleiades')).toBeTruthy();
    });

    it('calls onDismiss when dismiss button pressed', () => {
      const onDismiss = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <Chip
          starSystem="Andromeda"
          dismissible={true}
          onDismiss={onDismiss}
          testID="chip"
        />
      );

      fireEvent.press(getByLabelText('Dismiss Andromeda'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not show dismiss button when not dismissible', () => {
      const { queryByLabelText } = renderWithTheme(
        <Chip starSystem="Lyra" testID="chip" />
      );

      expect(queryByLabelText(/Dismiss/)).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility label for selectable chip', () => {
      const { getByTestId } = renderWithTheme(
        <Chip
          starSystem="Sirius"
          percentage={18}
          selectable={true}
          onSelect={() => {}}
          testID="chip"
        />
      );

      const chip = getByTestId('chip');
      expect(chip.props.accessibilityLabel).toBe('Sirius 18%');
    });

    it('has correct accessibility label without percentage', () => {
      const { getByTestId } = renderWithTheme(
        <Chip
          starSystem="Orion"
          selectable={true}
          onSelect={() => {}}
          testID="chip"
        />
      );

      const chip = getByTestId('chip');
      expect(chip.props.accessibilityLabel).toBe('Orion');
    });

    it('has button role when selectable', () => {
      const { getByTestId } = renderWithTheme(
        <Chip
          starSystem="Pleiades"
          selectable={true}
          onSelect={() => {}}
          testID="chip"
        />
      );

      const chip = getByTestId('chip');
      expect(chip.props.accessibilityRole).toBe('button');
    });

    it('dismiss button has correct accessibility', () => {
      const { getByLabelText } = renderWithTheme(
        <Chip
          starSystem="Andromeda"
          dismissible={true}
          onDismiss={() => {}}
          testID="chip"
        />
      );

      const dismissButton = getByLabelText('Dismiss Andromeda');
      expect(dismissButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Combined Features', () => {
    it('renders selectable chip with percentage and gold variant', () => {
      const onSelect = jest.fn();
      const { getByTestId, getByText } = renderWithTheme(
        <Chip
          starSystem="Sirius"
          percentage={18}
          variant="gold"
          selectable={true}
          selected={false}
          onSelect={onSelect}
          testID="chip"
        />
      );

      expect(getByText(/Sirius 18%/)).toBeTruthy();
      fireEvent.press(getByTestId('chip'));
      expect(onSelect).toHaveBeenCalled();
    });

    it('renders dismissible chip with percentage and lavender variant', () => {
      const onDismiss = jest.fn();
      const { getByText, getByLabelText } = renderWithTheme(
        <Chip
          starSystem="Lyra"
          percentage={12}
          variant="lavender"
          dismissible={true}
          onDismiss={onDismiss}
          testID="chip"
        />
      );

      expect(getByText(/Lyra 12%/)).toBeTruthy();
      fireEvent.press(getByLabelText('Dismiss Lyra'));
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('All Star Systems', () => {
    const starSystems = [
      'Orion',
      'Sirius',
      'Pleiades',
      'Andromeda',
      'Lyra',
      'Arcturus',
    ];

    starSystems.forEach((system) => {
      it(`renders ${system} chip correctly`, () => {
        const { getByText } = renderWithTheme(
          <Chip starSystem={system} percentage={15} testID={`chip-${system}`} />
        );
        expect(getByText(new RegExp(`${system} 15%`))).toBeTruthy();
      });
    });
  });
});
