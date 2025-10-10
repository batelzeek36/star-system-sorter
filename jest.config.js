module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-svg|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|msw|@mswjs|until-async)/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/super_dash/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/super_dash/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
  },
};
