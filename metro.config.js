const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname)],
  resolver: {
    extraNodeModules: {
      '@components': path.resolve(__dirname, 'components'),
      '@': path.resolve(__dirname, 'src'),
    },
    blockList: [
      // Exclude super_dash to avoid conflicts (will be integrated as Flutter module)
      /super_dash\/.*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
