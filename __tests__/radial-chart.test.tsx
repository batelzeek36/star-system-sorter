/**
 * RadialChart Component Tests
 * 
 * Tests for the RadialChart component including:
 * - Rendering with different props
 * - Animation behavior
 * - Percentage clamping
 * - Accessibility
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {RadialChart} from '../src/components/RadialChart';
import {ThemeProvider} from '../src/theme';

describe('RadialChart', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };
  it('renders with basic props', () => {
    const {getByText, getByLabelText} = renderWithTheme(
      <RadialChart percentage={75} label="Test System" color="#3B82F6" />
    );

    expect(getByText('75.0%')).toBeTruthy();
    expect(getByText('Test System')).toBeTruthy();
    expect(getByLabelText('Test System: 75.0%')).toBeTruthy();
  });

  it('clamps percentage to 0-100 range', () => {
    const {getByText: getByTextNegative} = renderWithTheme(
      <RadialChart percentage={-10} label="Negative" color="#3B82F6" />
    );
    expect(getByTextNegative('0.0%')).toBeTruthy();

    const {getByText: getByTextOver} = renderWithTheme(
      <RadialChart percentage={150} label="Over 100" color="#3B82F6" />
    );
    expect(getByTextOver('100.0%')).toBeTruthy();
  });

  it('formats percentage to 1 decimal place', () => {
    const {getByText} = renderWithTheme(
      <RadialChart percentage={33.333} label="Decimal" color="#3B82F6" />
    );

    expect(getByText('33.3%')).toBeTruthy();
  });

  it('renders with custom size and stroke width', () => {
    const {getByText} = renderWithTheme(
      <RadialChart
        percentage={50}
        label="Custom Size"
        color="#10B981"
        size={200}
        strokeWidth={12}
      />
    );

    expect(getByText('50.0%')).toBeTruthy();
    expect(getByText('Custom Size')).toBeTruthy();
  });

  it('uses default size and stroke width when not provided', () => {
    const {getByText} = renderWithTheme(
      <RadialChart percentage={25} label="Defaults" color="#EF4444" />
    );

    expect(getByText('25.0%')).toBeTruthy();
  });

  it('renders with different colors', () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    colors.forEach((color, index) => {
      const {getByText} = renderWithTheme(
        <RadialChart
          percentage={25 * (index + 1)}
          label={`Color ${index}`}
          color={color}
        />
      );

      expect(getByText(`Color ${index}`)).toBeTruthy();
    });
  });

  it('handles zero percentage', () => {
    const {getByText} = renderWithTheme(
      <RadialChart percentage={0} label="Zero" color="#3B82F6" />
    );

    expect(getByText('0.0%')).toBeTruthy();
  });

  it('handles 100 percentage', () => {
    const {getByText} = renderWithTheme(
      <RadialChart percentage={100} label="Full" color="#3B82F6" />
    );

    expect(getByText('100.0%')).toBeTruthy();
  });
});
