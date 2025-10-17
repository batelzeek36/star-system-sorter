/**
 * Field Icons Integration Tests
 * Tests for Field component with SVG icons (calendar, clock, location)
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Field } from '../src/components/Field';
import { CalendarIcon, ClockIcon, LocationIcon } from '../src/components/icons';
import { ThemeProvider } from '../src/theme';

describe('Field with Icons', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  describe('Calendar Icon', () => {
    it('renders Field with CalendarIcon', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Birth Date"
          placeholder="MM/DD/YYYY"
          icon={<CalendarIcon size={20} />}
          testID="date-field"
        />
      );
      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('renders CalendarIcon with custom size', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Field
          label="Birth Date"
          icon={<CalendarIcon size={24} />}
        />
      );
      expect(UNSAFE_getByType(CalendarIcon)).toBeTruthy();
    });
  });

  describe('Clock Icon', () => {
    it('renders Field with ClockIcon', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Birth Time"
          placeholder="HH:MM AM/PM"
          icon={<ClockIcon size={20} />}
          testID="time-field"
        />
      );
      expect(getByTestId('time-field')).toBeTruthy();
    });

    it('renders ClockIcon with custom size', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Field
          label="Birth Time"
          icon={<ClockIcon size={24} />}
        />
      );
      expect(UNSAFE_getByType(ClockIcon)).toBeTruthy();
    });
  });

  describe('Location Icon', () => {
    it('renders Field with LocationIcon', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Birth Location"
          placeholder="City, State/Country"
          icon={<LocationIcon size={20} />}
          testID="location-field"
        />
      );
      expect(getByTestId('location-field')).toBeTruthy();
    });

    it('renders LocationIcon with custom size', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Field
          label="Birth Location"
          icon={<LocationIcon size={24} />}
        />
      );
      expect(UNSAFE_getByType(LocationIcon)).toBeTruthy();
    });
  });

  describe('Icon Color Handling', () => {
    it('renders icon in default state', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          icon={<CalendarIcon size={20} />}
          testID="field"
        />
      );
      expect(getByTestId('field')).toBeTruthy();
    });

    it('renders icon in error state', () => {
      const { getByTestId } = renderWithTheme(
        <Field
          label="Email"
          icon={<CalendarIcon size={20} />}
          error="This field is required"
          testID="field"
        />
      );
      expect(getByTestId('field')).toBeTruthy();
    });
  });

  describe('Multiple Icons in Form', () => {
    it('renders multiple fields with different icons', () => {
      const { getByTestId } = renderWithTheme(
        <>
          <Field
            label="Birth Date"
            icon={<CalendarIcon size={20} />}
            testID="date-field"
          />
          <Field
            label="Birth Time"
            icon={<ClockIcon size={20} />}
            testID="time-field"
          />
          <Field
            label="Birth Location"
            icon={<LocationIcon size={20} />}
            testID="location-field"
          />
        </>
      );
      
      expect(getByTestId('date-field')).toBeTruthy();
      expect(getByTestId('time-field')).toBeTruthy();
      expect(getByTestId('location-field')).toBeTruthy();
    });
  });
});
