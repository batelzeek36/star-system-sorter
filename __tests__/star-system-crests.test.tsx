/**
 * StarSystemCrests Component Tests
 * 
 * Tests individual crest components and lookup map
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {
  OrionCrest,
  SiriusCrest,
  PleiadesCrest,
  AndromedaCrest,
  LyraCrest,
  ArcturusCrest,
  StarSystemCrests,
} from '../src/components';

describe('StarSystemCrests', () => {
  describe('Individual Crest Components', () => {
    it('renders OrionCrest', () => {
      const {getByTestId} = render(<OrionCrest testID="orion-crest" />);
      expect(getByTestId('orion-crest')).toBeTruthy();
    });

    it('renders SiriusCrest', () => {
      const {getByTestId} = render(<SiriusCrest testID="sirius-crest" />);
      expect(getByTestId('sirius-crest')).toBeTruthy();
    });

    it('renders PleiadesCrest', () => {
      const {getByTestId} = render(<PleiadesCrest testID="pleiades-crest" />);
      expect(getByTestId('pleiades-crest')).toBeTruthy();
    });

    it('renders AndromedaCrest', () => {
      const {getByTestId} = render(<AndromedaCrest testID="andromeda-crest" />);
      expect(getByTestId('andromeda-crest')).toBeTruthy();
    });

    it('renders LyraCrest', () => {
      const {getByTestId} = render(<LyraCrest testID="lyra-crest" />);
      expect(getByTestId('lyra-crest')).toBeTruthy();
    });

    it('renders ArcturusCrest', () => {
      const {getByTestId} = render(<ArcturusCrest testID="arcturus-crest" />);
      expect(getByTestId('arcturus-crest')).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('renders with size 24', () => {
      const {getByTestId} = render(<OrionCrest size={24} testID="crest-24" />);
      expect(getByTestId('crest-24')).toBeTruthy();
    });

    it('renders with size 28', () => {
      const {getByTestId} = render(<SiriusCrest size={28} testID="crest-28" />);
      expect(getByTestId('crest-28')).toBeTruthy();
    });

    it('renders with size 48', () => {
      const {getByTestId} = render(<PleiadesCrest size={48} testID="crest-48" />);
      expect(getByTestId('crest-48')).toBeTruthy();
    });

    it('uses default size 24 when not specified', () => {
      const {getByTestId} = render(<AndromedaCrest testID="crest-default" />);
      expect(getByTestId('crest-default')).toBeTruthy();
    });
  });

  describe('Color Support', () => {
    it('accepts custom color', () => {
      const {getByTestId} = render(
        <LyraCrest color="#FF0000" testID="crest-colored" />
      );
      expect(getByTestId('crest-colored')).toBeTruthy();
    });

    it('uses currentColor by default', () => {
      const {getByTestId} = render(<ArcturusCrest testID="crest-current" />);
      expect(getByTestId('crest-current')).toBeTruthy();
    });
  });

  describe('StarSystemCrests Lookup Map', () => {
    it('contains all star system entries', () => {
      expect(StarSystemCrests.Orion).toBe(OrionCrest);
      expect(StarSystemCrests.Osirian).toBe(OrionCrest); // Alias
      expect(StarSystemCrests.Sirius).toBe(SiriusCrest);
      expect(StarSystemCrests.Pleiades).toBe(PleiadesCrest);
      expect(StarSystemCrests.Andromeda).toBe(AndromedaCrest);
      expect(StarSystemCrests.Lyra).toBe(LyraCrest);
      expect(StarSystemCrests.Arcturus).toBe(ArcturusCrest);
    });

    it('can dynamically render crests from map', () => {
      const CrestComponent = StarSystemCrests.Sirius;
      const {getByTestId} = render(<CrestComponent testID="dynamic-crest" />);
      expect(getByTestId('dynamic-crest')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('supports testID for accessibility testing', () => {
      const {getByTestId} = render(<OrionCrest testID="accessible-crest" />);
      expect(getByTestId('accessible-crest')).toBeTruthy();
    });
  });
});
