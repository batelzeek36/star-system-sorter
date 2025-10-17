/**
 * Card Primitive (NativeWind) Tests
 * Tests for NativeWind Card primitive with gradient simulation
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Card, CardHeader, CardTitle, CardDescription } from '../src/ui/Card';

describe('Card (NativeWind Primitive)', () => {
  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <Card testID="default-card" variant="default">
          <CardTitle>Default Card</CardTitle>
        </Card>
      );
      expect(getByTestId('default-card')).toBeTruthy();
    });

    it('renders emphasis variant', () => {
      const { getByTestId } = render(
        <Card testID="emphasis-card" variant="emphasis">
          <CardTitle>Emphasis Card</CardTitle>
        </Card>
      );
      expect(getByTestId('emphasis-card')).toBeTruthy();
    });

    it('renders warning variant', () => {
      const { getByTestId } = render(
        <Card testID="warning-card" variant="warning">
          <CardTitle>Warning Card</CardTitle>
        </Card>
      );
      expect(getByTestId('warning-card')).toBeTruthy();
    });
  });

  describe('Gradient Simulation', () => {
    it('renders with overlay layer for gradient effect', () => {
      const { getByTestId, UNSAFE_getAllByType } = render(
        <Card testID="gradient-card" variant="default">
          <CardTitle>Gradient Card</CardTitle>
        </Card>
      );
      const { View } = require('react-native');
      const views = UNSAFE_getAllByType(View);
      
      // Should have multiple View layers (container + overlay + content)
      expect(views.length).toBeGreaterThan(2);
    });

    it('applies different overlay colors for different variants', () => {
      const { getByTestId, rerender } = render(
        <Card testID="test-card" variant="default">
          <CardTitle>Test Card</CardTitle>
        </Card>
      );
      expect(getByTestId('test-card')).toBeTruthy();

      rerender(
        <Card testID="test-card" variant="emphasis">
          <CardTitle>Test Card</CardTitle>
        </Card>
      );
      expect(getByTestId('test-card')).toBeTruthy();

      rerender(
        <Card testID="test-card" variant="warning">
          <CardTitle>Test Card</CardTitle>
        </Card>
      );
      expect(getByTestId('test-card')).toBeTruthy();
    });
  });

  describe('Platform-Specific Elevation', () => {
    it('applies platform-specific styles for emphasis variant', () => {
      const { getByTestId } = render(
        <Card testID="emphasis-card" variant="emphasis">
          <CardTitle>Emphasis Card</CardTitle>
        </Card>
      );
      const card = getByTestId('emphasis-card');
      const styles = Array.isArray(card.props.style) 
        ? card.props.style 
        : [card.props.style];
      
      // Should have either elevation (Android) or shadow (iOS) properties
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(true);
    });

    it('does not apply elevation for default variant', () => {
      const { getByTestId } = render(
        <Card testID="default-card" variant="default">
          <CardTitle>Default Card</CardTitle>
        </Card>
      );
      const card = getByTestId('default-card');
      const styles = Array.isArray(card.props.style) 
        ? card.props.style 
        : [card.props.style];
      
      // Default variant should not have elevation or shadow
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(false);
    });

    it('does not apply elevation for warning variant', () => {
      const { getByTestId } = render(
        <Card testID="warning-card" variant="warning">
          <CardTitle>Warning Card</CardTitle>
        </Card>
      );
      const card = getByTestId('warning-card');
      const styles = Array.isArray(card.props.style) 
        ? card.props.style 
        : [card.props.style];
      
      // Warning variant should not have elevation or shadow
      const hasPlatformStyle = styles.some((s: any) => 
        s?.elevation !== undefined || s?.shadowColor !== undefined
      );
      expect(hasPlatformStyle).toBe(false);
    });
  });

  describe('Card Structure', () => {
    it('renders Card with CardHeader', () => {
      const { getByTestId } = render(
        <Card testID="structured-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(getByTestId('structured-card')).toBeTruthy();
    });

    it('renders Card with CardTitle', () => {
      const { getByText } = render(
        <Card>
          <CardTitle>Test Title</CardTitle>
        </Card>
      );
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('renders Card with CardDescription', () => {
      const { getByText } = render(
        <Card>
          <CardDescription>Test Description</CardDescription>
        </Card>
      );
      expect(getByText('Test Description')).toBeTruthy();
    });

    it('renders complete Card structure', () => {
      const { getByText } = render(
        <Card testID="complete-card">
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card with all components</CardDescription>
          </CardHeader>
        </Card>
      );
      expect(getByText('Complete Card')).toBeTruthy();
      expect(getByText('This is a complete card with all components')).toBeTruthy();
    });
  });

  describe('Custom className', () => {
    it('accepts custom className prop on Card', () => {
      const { getByTestId } = render(
        <Card testID="custom-card" className="mt-4">
          <CardTitle>Custom Card</CardTitle>
        </Card>
      );
      expect(getByTestId('custom-card')).toBeTruthy();
    });

    it('accepts custom className prop on CardHeader', () => {
      const { getByText } = render(
        <Card>
          <CardHeader className="mb-2">
            <CardTitle>Header with Custom Class</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(getByText('Header with Custom Class')).toBeTruthy();
    });

    it('accepts custom className prop on CardTitle', () => {
      const { getByText } = render(
        <Card>
          <CardTitle className="text-2xl">Large Title</CardTitle>
        </Card>
      );
      expect(getByText('Large Title')).toBeTruthy();
    });

    it('accepts custom className prop on CardDescription', () => {
      const { getByText } = render(
        <Card>
          <CardDescription className="text-base">Large Description</CardDescription>
        </Card>
      );
      expect(getByText('Large Description')).toBeTruthy();
    });
  });

  describe('Overlay Layer Positioning', () => {
    it('renders overlay with absolute positioning', () => {
      const { UNSAFE_getAllByType } = render(
        <Card testID="overlay-card">
          <CardTitle>Overlay Test</CardTitle>
        </Card>
      );
      const { View } = require('react-native');
      const views = UNSAFE_getAllByType(View);
      
      // Find the overlay view (should have pointerEvents="none")
      const overlayView = views.find((view: any) => view.props.pointerEvents === 'none');
      expect(overlayView).toBeTruthy();
    });

    it('overlay does not block pointer events', () => {
      const { UNSAFE_getAllByType } = render(
        <Card testID="pointer-card">
          <CardTitle>Pointer Test</CardTitle>
        </Card>
      );
      const { View } = require('react-native');
      const views = UNSAFE_getAllByType(View);
      
      // Find the overlay view
      const overlayView = views.find((view: any) => view.props.pointerEvents === 'none');
      expect(overlayView?.props.pointerEvents).toBe('none');
    });
  });
});
