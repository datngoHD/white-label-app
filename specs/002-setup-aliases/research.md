# Research: Setting up Path Aliases

**Feature Branch**: `002-setup-aliases`
**Date**: 2026-01-26

## Research Summary

No NEEDS CLARIFICATION items in Technical Context. This research documents best practices for babel-plugin-module-resolver in Expo/React Native projects.

## Decisions

### D1: Runtime Alias Resolution Method

**Decision**: Use `babel-plugin-module-resolver`

**Rationale**:

- Official recommendation for Babel-based React Native projects
- Widely adopted in the community with stable maintenance
- Seamless integration with Metro bundler
- Supports same alias patterns as TypeScript paths

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| tsconfig-paths-webpack-plugin | Not applicable for React Native/Metro |
| Custom Metro resolver | Unnecessary complexity |
| babel-plugin-root-import | Less maintained, fewer features |

### D2: Configuration Synchronization

**Decision**: Mirror TypeScript paths exactly in Babel config

**Rationale**:

- TypeScript (tsconfig.json) handles compile-time type checking and IDE support
- Babel plugin handles runtime module resolution
- Identical mappings prevent runtime errors

**Alias Mapping**:

| TypeScript Path               | Babel Alias               |
| ----------------------------- | ------------------------- |
| `"@app/*": ["app/*"]`         | `"@app": "./app"`         |
| `"@modules/*": ["modules/*"]` | `"@modules": "./modules"` |
| `"@shared/*": ["shared/*"]`   | `"@shared": "./shared"`   |
| `"@core/*": ["core/*"]`       | `"@core": "./core"`       |
| `"@assets/*": ["assets/*"]`   | `"@assets": "./assets"`   |

**Note**: Babel plugin uses different syntax (no `/*` suffix) but resolves identically.

### D3: Plugin Configuration

**Decision**: Place module-resolver as first plugin, use root "."

**Rationale**:

- Module resolution should happen early in transformation pipeline
- Root "." ensures paths resolve from project root
- Extensions array ensures proper file resolution

**Configuration**:

```javascript
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
```

## Dependencies

### Development Dependencies to Add

| Package                      | Version | Purpose                  |
| ---------------------------- | ------- | ------------------------ |
| babel-plugin-module-resolver | ^5.0.2  | Runtime alias resolution |

## Best Practices

1. **Clear Metro cache after config changes**: `npx expo start --clear`
2. **Restart TypeScript server** in IDE after any tsconfig.json changes
3. **Use consistent naming** across TypeScript and Babel configs
4. **Document new aliases** when adding them

## Risks & Mitigations

| Risk                             | Likelihood | Impact | Mitigation                             |
| -------------------------------- | ---------- | ------ | -------------------------------------- |
| Cache issues after config change | Medium     | Low    | Clear Metro cache; restart IDE         |
| Alias mismatch between TS/Babel  | Low        | High   | Use same alias names; document mapping |
| Plugin version conflicts         | Very Low   | Low    | Pin to stable version                  |

## Conclusion

Implementation is straightforward:

1. Add `babel-plugin-module-resolver` as dev dependency
2. Configure aliases in `babel.config.js`
3. Clear cache and test

**No unresolved clarifications.** Ready for Phase 1.

## Import Migration Strategy

### Cross-Directory Imports (MUST use aliases)

| From        | To            | Pattern                                    | Example               |
| ----------- | ------------- | ------------------------------------------ | --------------------- |
| `modules/*` | `core/*`      | `../../../core/X` → `@core/X`              | `@core/theme`         |
| `modules/*` | `shared/*`    | `../../../shared/X` → `@shared/X`          | `@shared/components`  |
| `modules/*` | other modules | `../../{module}/X` → `@modules/{module}/X` | `@modules/auth/types` |
| `app/*`     | `core/*`      | `../core/X` → `@core/X`                    | `@core/navigation`    |
| `app/*`     | `shared/*`    | `../shared/X` → `@shared/X`                | `@shared/components`  |
| `core/*`    | `modules/*`   | `../../modules/X` → `@modules/X`           | `@modules/auth/store` |
| `core/*`    | `shared/*`    | `../../shared/X` → `@shared/X`             | `@shared/components`  |
| `core/*`    | `app/*`       | `../../app/X` → `@app/X`                   | `@app/providers`      |
| `shared/*`  | `core/*`      | `../../../core/X` → `@core/X`              | `@core/theme`         |

### Intra-Directory Imports (KEEP relative)

These should remain relative for module encapsulation:

- Within same feature module: `./services/authService`, `../types`, `../hooks/useAuth`
- Within same core subdirectory: `../logging/logger`, `./types`
- Within same shared component folder: `../Loading/Loading`
