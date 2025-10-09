/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'No circular dependencies allowed',
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
          '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$', // build configs
        ],
      },
      to: {},
    },
    {
      name: 'no-deep-imports',
      severity: 'error',
      comment: 'Only import from module index.ts, no deep imports',
      from: {
        pathNot: '^src/(scorer|moderation|bridge|hd|state|lib|components|screens)/',
      },
      to: {
        path: '^src/(scorer|moderation|bridge|hd|state|lib|components|screens)/.+',
        pathNot: [
          '^src/(scorer|moderation|bridge|hd|state|lib|components|screens)/index\\.(ts|tsx)$',
          '^src/(scorer|moderation|bridge|hd|state|lib|components|screens)/types\\.(ts|tsx)$',
        ],
      },
    },
    {
      name: 'enforce-layering',
      severity: 'error',
      comment: 'Enforce layering: Screens → Components → Theme/Tokens → Utils',
      from: {
        path: '^src/(lib|state)/',
      },
      to: {
        path: '^src/(screens|components)/',
      },
    },
    {
      name: 'no-reverse-deps',
      severity: 'error',
      comment: 'Components should not import from screens',
      from: {
        path: '^src/components/',
      },
      to: {
        path: '^src/screens/',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
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
