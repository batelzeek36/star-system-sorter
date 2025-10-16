/**
 * StarSystemCrest Component Tests
 * 
 * Tests SVG crest rendering and fallback behavior
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {StarSystemCrest} from '../src/components';

describe('StarSystemCrest', () => {
  describe('Known Systems', () => {
    it('renders Pleiades crest', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Pleiades" />);
      expect(getByLabelText('Pleiades crest')).toBeTruthy();
    });

    it('renders Sirius crest', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Sirius" />);
      expect(getByLabelText('Sirius crest')).toBeTruthy();
    });

    it('renders Arcturus crest', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Arcturus" />);
      expect(getByLabelText('Arcturus crest')).toBeTruthy();
    });

    it('renders Andromeda crest', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Andromeda" />);
      expect(getByLabelText('Andromeda crest')).toBeTruthy();
    });

    it('renders Orion crest', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Orion" />);
      expect(getByLabelText('Orion crest')).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('renders small size', () => {
      const {getByLabelText} = render(
        <StarSystemCrest system="Pleiades" size="sm" />
      );
      const container = getByLabelText('Pleiades crest');
      expect(container).toBeTruthy();
    });

    it('renders medium size (default)', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Sirius" />);
      const container = getByLabelText('Sirius crest');
      expect(container).toBeTruthy();
    });

    it('renders large size', () => {
      const {getByLabelText} = render(
        <StarSystemCrest system="Arcturus" size="lg" />
      );
      const container = getByLabelText('Arcturus crest');
      expect(container).toBeTruthy();
    });
  });

  describe('Visual Variants', () => {
    it('renders default variant', () => {
      const {getByLabelText} = render(
        <StarSystemCrest system="Andromeda" variant="default" />
      );
      expect(getByLabelText('Andromeda crest')).toBeTruthy();
    });

    it('renders outlined variant', () => {
      const {getByLabelText} = render(
        <StarSystemCrest system="Orion" variant="outlined" />
      );
      expect(getByLabelText('Orion crest')).toBeTruthy();
    });
  });

  describe('Color Override', () => {
    it('accepts custom color', () => {
      const {getByLabelText} = render(
        <StarSystemCrest system="Pleiades" color="#FF0000" />
      );
      expect(getByLabelText('Pleiades crest')).toBeTruthy();
    });
  });

  describe('Fallback Behavior', () => {
    it('renders fallback for unknown system', () => {
      const {getByLabelText} = render(
        <StarSystemCrest system="UnknownSystem" />
      );
      expect(getByLabelText('UnknownSystem crest')).toBeTruthy();
    });

    it('shows fallback text when enabled', () => {
      const {getByText} = render(
        <StarSystemCrest system="UnknownSystem" showFallbackText={true} />
      );
      expect(getByText('UnknownSystem')).toBeTruthy();
    });

    it('does not show fallback text by default', () => {
      const {queryByText} = render(
        <StarSystemCrest system="UnknownSystem" />
      );
      expect(queryByText('UnknownSystem')).toBeNull();
    });

    it('does not show fallback text for known systems', () => {
      const {queryByText} = render(
        <StarSystemCrest system="Pleiades" showFallbackText={true} />
      );
      expect(queryByText('Pleiades')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility label', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Sirius" />);
      expect(getByLabelText('Sirius crest')).toBeTruthy();
    });

    it('has image accessibility role', () => {
      const {getByLabelText} = render(<StarSystemCrest system="Arcturus" />);
      const element = getByLabelText('Arcturus crest');
      expect(element.props.accessibilityRole).toBe('image');
    });
  });
});
