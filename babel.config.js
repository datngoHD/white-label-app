/**
 * Babel Configuration
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
    presets: ['babel-preset-expo'],
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
