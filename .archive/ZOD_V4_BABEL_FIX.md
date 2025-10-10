# Zod v4 Babel Configuration Fix

## Issue

When using Zod v4 with React Native, you may encounter this error:

```
Export namespace should be first transformed by `@babel/plugin-transform-export-namespace-from`.
> 1 | export * as core from "../core/index.js";
```

This happens because Zod v4 uses the `export * as` syntax which requires Babel transformation.

## Root Cause

Zod v4 uses modern ES module syntax (`export * as namespace`) that needs to be transformed for React Native's JavaScript engine. While the `@babel/plugin-transform-export-namespace-from` plugin is included in `@babel/preset-env`, it needs to be explicitly enabled in the Babel config for React Native.

## Solution

Add the plugin explicitly to `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',  // Add this line
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@hdkit': './hdkit',
          '@components': './components',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};
```

## Steps to Fix

1. **Update babel.config.js** (already done)
   - Add `'@babel/plugin-transform-export-namespace-from'` to plugins array

2. **Clear Metro cache**
   ```bash
   npm start -- --reset-cache
   ```

3. **Rebuild the app**
   
   For iOS:
   ```bash
   npm run rebuild:ios
   # or
   npm run reload:ios:clean
   ```
   
   For Android:
   ```bash
   npm run rebuild:android
   # or
   npm run reload:android:clean
   ```

## Verification

After rebuilding, the app should start without the Babel transform error. You can verify by:

1. Starting Metro bundler: `npm start`
2. Running the app: `npm run ios` or `npm run android`
3. Checking that the Input screen loads without errors

## Alternative Solutions

If the issue persists, you can try:

### Option 1: Downgrade to Zod v3

```bash
npm install zod@^3.23.8
```

Zod v3 doesn't use the `export * as` syntax and works without additional Babel configuration.

### Option 2: Use Metro transformer

Add to `metro.config.js`:

```javascript
module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

## Related Issues

- Zod v4 uses ES2020+ module syntax
- React Native requires Babel transformation for modern syntax
- Metro bundler needs cache clearing after Babel config changes

## Prevention

When upgrading dependencies that use modern ES module syntax:

1. Check if they use `export * as` syntax
2. Ensure appropriate Babel plugins are configured
3. Clear Metro cache after config changes
4. Test on both iOS and Android

## References

- [Babel Plugin: transform-export-namespace-from](https://babeljs.io/docs/babel-plugin-transform-export-namespace-from)
- [Zod v4 Release Notes](https://github.com/colinhacks/zod/releases)
- [React Native Babel Preset](https://github.com/facebook/react-native/tree/main/packages/react-native-babel-preset)
