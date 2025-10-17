/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'No circular dependencies allowed (Requirement 11.7)',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Orphan modules should be avoided',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // dot files
          '\\.d\\.ts$', // TypeScript declaration files
          '(^|/)tsconfig\\.json$', // TypeScript config
          '(^|/)(babel|webpack|metro|jest)\\.config\\.(js|cjs|mjs|ts|json)$', // build configs
          '(^|/)index\\.(js|ts)$', // entry points
          '__tests__/', // test files
          '\\.test\\.(ts|tsx)$', // test files
          '\\.spec\\.(ts|tsx)$', // spec files
        ],
      },
      to: {},
    },
    {
      name: 'no-deep-imports',
      severity: 'error',
      comment: 'Only import from module index.ts, no deep imports (Requirement 11.6)',
      from: {
        pathNot: [
          // Allow deep imports within the same module
          '^src/scorer/[^/]+$',
          '^src/moderation/[^/]+$',
          '^src/bridge/[^/]+$',
          '^src/hd/[^/]+$',
          '^src/state/[^/]+$',
          '^src/lib/[^/]+$',
          '^src/components/[^/]+$',
          '^src/components/ui/', // Allow deep imports within ui subdirectory
          '^src/components/icons/', // Allow deep imports within icons subdirectory
          '^src/screens/[^/]+$',
          // Allow test files to import anything
          '__tests__/',
          '\\.test\\.(ts|tsx)$',
          '\\.spec\\.(ts|tsx)$',
        ],
      },
      to: {
        path: '^src/(scorer|moderation|bridge|hd|state|lib|components|screens)/.+',
        pathNot: [
          // Allow imports from index.ts
          '^src/(scorer|moderation|bridge|hd|state|lib|components|screens)/index\\.(ts|tsx)$',
        ],
      },
    },
    {
      name: 'enforce-layering-utils-no-screens',
      severity: 'error',
      comment: 'Utils (lib/state) cannot import from screens (Requirement 11.5)',
      from: {
        path: '^src/(lib|state)/',
      },
      to: {
        path: '^src/screens/',
      },
    },
    {
      name: 'enforce-layering-utils-no-components',
      severity: 'error',
      comment: 'Utils (lib/state) cannot import from components (Requirement 11.5)',
      from: {
        path: '^src/(lib|state)/',
      },
      to: {
        path: '^src/components/',
      },
    },
    {
      name: 'enforce-layering-components-no-screens',
      severity: 'error',
      comment: 'Components cannot import from screens (Requirement 11.5)',
      from: {
        path: '^src/components/',
      },
      to: {
        path: '^src/screens/',
      },
    },
    {
      name: 'enforce-layering-theme-no-screens',
      severity: 'error',
      comment: 'Theme/tokens cannot import from screens (Requirement 11.5)',
      from: {
        path: '^(globals\\.css|.*tokens.*)',
      },
      to: {
        path: '^src/screens/',
      },
    },
    {
      name: 'enforce-layering-theme-no-components',
      severity: 'error',
      comment: 'Theme/tokens cannot import from components (Requirement 11.5)',
      from: {
        path: '^(globals\\.css|.*tokens.*)',
      },
      to: {
        path: '^src/components/',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: [
        'node_modules',
        'android',
        'ios',
        '__tests__',
        'e2e',
        '\\.test\\.(ts|tsx)$',
        '\\.spec\\.(ts|tsx)$',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      archi: {
        collapsePattern: '^(node_modules|packages|src/[^/]+)',
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
