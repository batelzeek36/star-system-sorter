/**
 * Scorer Types Tests
 * 
 * Verify that scorer types are correctly defined and can be used.
 */

import type {
  HDExtract,
  Canon,
  SystemWeights,
  TiePolicy,
  Contributor,
  SystemScore,
  ScorerResult,
  ClassificationOptions,
} from '../src/scorer';

describe('Scorer Types', () => {
  it('should define HDExtract interface', () => {
    const extract: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: ['Sacral', 'Throat'],
      channels: [34, 57],
      gates: [1, 2, 3],
    };

    expect(extract.type).toBe('Manifestor');
    expect(extract.centers).toHaveLength(2);
  });

  it('should define Canon interface', () => {
    const canon: Canon = {
      version: '0.1.0',
      systems: {
        Pleiades: {
          weights: {
            type_manifestor: 15,
            gate_1: 5,
          },
          why: 'Test explanation',
        },
      },
    };

    expect(canon.version).toBe('0.1.0');
    expect(canon.systems.Pleiades).toBeDefined();
  });

  it('should define TiePolicy interface', () => {
    const policy: TiePolicy = {
      minPrimaryPct: 0,
      hybridWindowPct: 6.0,
      leadPct: 0,
    };

    expect(policy.hybridWindowPct).toBe(6.0);
  });

  it('should define ScorerResult interface', () => {
    const result: ScorerResult = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [
        { system: 'Sirius', percentage: 25.5 },
      ],
      percentages: {
        Pleiades: 45.2,
        Sirius: 25.5,
      },
      contributorsPerSystem: {
        Pleiades: ['type_manifestor', 'gate_1'],
        Sirius: ['authority_splenic'],
      },
      meta: {
        canonVersion: '0.1.0',
        canonChecksum: 'abc123',
      },
    };

    expect(result.classification).toBe('primary');
    expect(result.primary).toBe('Pleiades');
    expect(result.meta.canonVersion).toBe('0.1.0');
  });

  it('should define hybrid classification result', () => {
    const result: ScorerResult = {
      classification: 'hybrid',
      hybrid: ['Pleiades', 'Sirius'],
      allies: [],
      percentages: {
        Pleiades: 35.0,
        Sirius: 33.5,
      },
      contributorsPerSystem: {},
      meta: {
        canonVersion: '0.1.0',
        canonChecksum: 'abc123',
      },
    };

    expect(result.classification).toBe('hybrid');
    expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
  });

  it('should define Contributor interface', () => {
    const contributor: Contributor = {
      key: 'type_manifestor',
      weight: 15,
      label: 'Type: Manifestor',
    };

    expect(contributor.key).toBe('type_manifestor');
    expect(contributor.weight).toBe(15);
  });

  it('should define SystemScore interface', () => {
    const score: SystemScore = {
      system: 'Pleiades',
      rawScore: 45,
      percentage: 45.2,
      contributors: [
        {
          key: 'type_manifestor',
          weight: 15,
          label: 'Type: Manifestor',
        },
      ],
    };

    expect(score.system).toBe('Pleiades');
    expect(score.percentage).toBe(45.2);
  });

  it('should define ClassificationOptions interface', () => {
    const options: ClassificationOptions = {
      tiePolicy: {
        hybridWindowPct: 8.0,
      },
      includeContributors: true,
    };

    expect(options.tiePolicy?.hybridWindowPct).toBe(8.0);
    expect(options.includeContributors).toBe(true);
  });
});
