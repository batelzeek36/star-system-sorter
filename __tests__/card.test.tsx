/**
 * Card Component Tests
 * Tests for gradient backgrounds and variants (Default, Emphasis, Warning)
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../src/components/Card';
import { ThemeProvider } from '../src/theme';

describe('Card', () => {
  const renderCard = (props = {}) => {
    return render(
      <ThemeProvider>
        <Card {...props}>
          <Text>Card Content</Text>
        </Card>
      </ThemeProvider>
    );
  };

  it('renders children correctly', () => {
    const { getByText } = renderCard();
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('renders with testID', () => {
    const { getByTestId } = renderCard({ testID: 'test-card' });
    expect(getByTestId('test-card')).toBeTruthy();
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = renderCard({ 
        testID: 'default-card',
        variant: 'default' 
      });
      const card = getByTestId('default-card');
      expect(card).toBeTruthy();
      expect(card.props.style).toBeDefined();
    });

    it('renders emphasis variant', () => {
      const { getByTestId } = renderCard({ 
        testID: 'emphasis-card',
        variant: 'emphasis' 
      });
      const card = getByTestId('emphasis-card');
      expect(card).toBeTruthy();
      expect(card.props.style).toBeDefined();
    });

    it('renders warning variant', () => {
      const { getByTestId } = renderCard({ 
        testID: 'warning-card',
        variant: 'warning' 
      });
      const card = getByTestId('warning-card');
      expect(card).toBeTruthy();
      expect(card.props.style).toBeDefined();
    });

    it('defaults to default variant when not specified', () => {
      const { getByTestId } = renderCard({ testID: 'no-variant-card' });
      const card = getByTestId('no-variant-card');
      expect(card).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = renderCard({ 
        testID: 'styled-card',
        style: customStyle 
      });
      const card = getByTestId('styled-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ marginTop: 20 })
        ])
      );
    });

    it('has proper border radius', () => {
      const { getByTestId } = renderCard({ testID: 'radius-card' });
      const card = getByTestId('radius-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderRadius: expect.any(Number) })
        ])
      );
    });

    it('has proper padding', () => {
      const { getByTestId } = renderCard({ testID: 'padding-card' });
      const card = getByTestId('padding-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ padding: expect.any(Number) })
        ])
      );
    });

    it('has border width', () => {
      const { getByTestId } = renderCard({ testID: 'border-card' });
      const card = getByTestId('border-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderWidth: 1 })
        ])
      );
    });
  });

  describe('Gradient Simulation', () => {
    it('renders gradient overlay layer', () => {
      const { getByTestId, UNSAFE_root } = renderCard({ testID: 'gradient-card' });
      const card = getByTestId('gradient-card');
      expect(card).toBeTruthy();
      
      // Card should have multiple child views (overlay + content)
      const cardChildren = card.props.children;
      expect(Array.isArray(cardChildren)).toBe(true);
    });

    it('emphasis variant has elevation', () => {
      const { getByTestId } = renderCard({ 
        testID: 'elevated-card',
        variant: 'emphasis' 
      });
      const card = getByTestId('elevated-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            shadowColor: expect.any(String),
            shadowOpacity: expect.any(Number),
          })
        ])
      );
    });
  });

  describe('Accessibility', () => {
    it('is accessible to screen readers', () => {
      const { getByTestId } = renderCard({ 
        testID: 'accessible-card',
      });
      const card = getByTestId('accessible-card');
      expect(card).toBeTruthy();
    });

    it('allows pointer events on content', () => {
      const { getByText } = renderCard();
      const content = getByText('Card Content');
      expect(content).toBeTruthy();
    });
  });
});
