/**
 * Babel Configuration
 *
 * React Compiler:
 *   Enabled via experiments.reactCompiler in app.json (Expo SDK 54+)
 *   Provides automatic memoization - no need for useMemo/useCallback/memo
 *   See: https://react.dev/learn/react-compiler
 *
 * Path Aliases (must match tsconfig.json):
 *   @app     -> ./app       (Application entry, bootstrap, providers)
 *   @modules -> ./modules   (Feature-based, domain-driven modules)
 *   @shared  -> ./shared    (Reusable UI components, hooks, utilities)
 *   @core    -> ./core      (Core infrastructure: config, theme, api, store, i18n)
 *   @assets  -> ./assets    (Brand-specific assets)
 *
 * When adding a new alias:
 *   1. Add to tsconfig.json paths (for TypeScript/IDE support)
 *   2. Add to module-resolver alias below (for runtime resolution)
 *   3. Clear Metro cache: npx expo start --clear
 */
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // React Compiler configuration
          // Requires experiments.reactCompiler: true in app.json
          'react-compiler': {
            // Incremental adoption: only compile our source directories
            // Excludes node_modules and other potentially problematic code
            sources: (filename) => {
              return (
                filename.includes('/app/') ||
                filename.includes('/core/') ||
                filename.includes('/modules/') ||
                filename.includes('/shared/')
              );
            },
          },
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@app': './app',
            '@modules': './modules',
            '@shared': './shared',
            '@core': './core',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
