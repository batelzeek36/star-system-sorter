/**
 * ScoreDisplay Component Tests
 * 
 * Tests for the ScoreDisplay component displaying classification results.
 */

import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {ScoreDisplay} from '../src/components/ScoreDisplay';

describe('ScoreDisplay', () => {
  it('renders primary classification correctly', () => {
    render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={45.3}
        allies={[
          {system: 'Sirius', percentage: 23.1},
          {system: 'Arcturus', percentage: 15.7},
        ]}
        classification="primary"
      />,
    );

    expect(screen.getByText('Pleiades')).toBeTruthy();
    expect(screen.getByText('Primary System')).toBeTruthy();
    expect(screen.getByText('45.3%')).toBeTruthy();
    expect(screen.getByText('Alignment')).toBeTruthy();
  });

  it('renders hybrid classification correctly', () => {
    render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={42.5}
        allies={[{system: 'Arcturus', percentage: 15.0}]}
        hybrid={['Pleiades', 'Sirius']}
        classification="hybrid"
      />,
    );

    expect(screen.getByText('Pleiades / Sirius')).toBeTruthy();
    expect(screen.getByText('Hybrid System')).toBeTruthy();
    expect(screen.getByText('42.5%')).toBeTruthy();
  });

  it('renders allied systems', () => {
    render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={45.3}
        allies={[
          {system: 'Sirius', percentage: 23.1},
          {system: 'Arcturus', percentage: 15.7},
          {system: 'Orion', percentage: 10.2},
        ]}
        classification="primary"
      />,
    );

    expect(screen.getByText('Allied Systems')).toBeTruthy();
    expect(screen.getByText('Sirius 23.1%')).toBeTruthy();
    expect(screen.getByText('Arcturus 15.7%')).toBeTruthy();
    expect(screen.getByText('Orion 10.2%')).toBeTruthy();
  });

  it('renders disclaimer text', () => {
    render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={45.3}
        allies={[]}
        classification="primary"
      />,
    );

    expect(
      screen.getByText(
        'For insight & entertainment. Not medical, financial, or legal advice.',
      ),
    ).toBeTruthy();
  });

  it('handles empty allies array', () => {
    render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={45.3}
        allies={[]}
        classification="primary"
      />,
    );

    expect(screen.queryByText('Allied Systems')).toBeNull();
  });

  it('formats percentages to one decimal place', () => {
    render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={45.678}
        allies={[{system: 'Sirius', percentage: 23.456}]}
        classification="primary"
      />,
    );

    expect(screen.getByText('45.7%')).toBeTruthy();
    expect(screen.getByText('Sirius 23.5%')).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    const {getByLabelText} = render(
      <ScoreDisplay
        primary="Pleiades"
        percentage={45.3}
        allies={[]}
        classification="primary"
      />,
    );

    expect(getByLabelText('Pleiades crest')).toBeTruthy();
  });

  it('handles undefined primary for hybrid classification', () => {
    render(
      <ScoreDisplay
        percentage={42.5}
        allies={[]}
        hybrid={['Pleiades', 'Sirius']}
        classification="hybrid"
      />,
    );

    expect(screen.getByText('Pleiades / Sirius')).toBeTruthy();
    expect(screen.getByText('Hybrid System')).toBeTruthy();
  });
});
