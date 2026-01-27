# Quickstart: Setting up Path Aliases

**Feature Branch**: `002-setup-aliases`
**Date**: 2026-01-26

## Prerequisites

- Node.js and Yarn installed
- Project cloned and dependencies installed

## Quick Setup

### 1. Install Dependency

```bash
yarn add -D babel-plugin-module-resolver
```

### 2. Update babel.config.js

Replace the contents of `babel.config.js` with:

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

### 3. Clear Cache and Restart

```bash
npx expo start --clear
```

## Verification

### Test Import Resolution

Create or modify a file to use an alias:

```typescript
// Before (relative path)
import { SomeComponent } from '../../shared/components/SomeComponent';

// After (alias)
import { SomeComponent } from '@shared/components/SomeComponent';
```

### Verify IDE Support

1. Open VS Code
2. Type `import { } from '@shared/'`
3. Verify autocomplete suggestions appear
4. Cmd+Click on an aliased import to verify "Go to Definition"

### Verify Build

```bash
# Development
npx expo start

# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Available Aliases

| Alias | Target Directory | Use For |
|-------|-----------------|---------|
| `@app` | `./app` | Application entry, providers |
| `@modules` | `./modules` | Feature modules |
| `@shared` | `./shared` | Reusable components, hooks |
| `@core` | `./core` | Infrastructure (API, store, theme) |
| `@assets` | `./assets` | Images, fonts, brand assets |

## Troubleshooting

### Module not found error

1. Clear Metro cache: `npx expo start --clear`
2. Delete `node_modules/.cache`
3. Restart VS Code TypeScript server: Cmd+Shift+P → "TypeScript: Restart TS Server"

### IDE not recognizing aliases

1. Ensure `tsconfig.json` has matching paths configured
2. Restart VS Code
3. Check that the file is included in tsconfig.json `include` patterns

### Hot reload not working

1. Clear Metro cache
2. Restart the development server
3. Rebuild the app if necessary

## Refactoring Existing Imports

The codebase currently uses relative imports that need to be migrated to aliases.

### What to Refactor

**Cross-directory imports** (MUST use aliases):
```typescript
// Before
import { useTheme } from '../../../core/theme';
import { Button } from '../../../shared/components';
import { useAuth } from '../../auth/hooks/useAuth';

// After
import { useTheme } from '@core/theme';
import { Button } from '@shared/components';
import { useAuth } from '@modules/auth/hooks/useAuth';
```

### What to Keep Relative

**Intra-module imports** (keep relative for encapsulation):
```typescript
// These stay relative (within same module)
import { authService } from '../services/authService';
import { LoginCredentials } from '../types';
import { useProfile } from './useProfile';
```

### Migration Commands

Run TypeScript check after refactoring:
```bash
npm run typecheck
```

Run ESLint:
```bash
npm run lint
```

Run tests:
```bash
npm test
```

### Files to Refactor (by directory)

| Directory | Approx Files | Main Patterns |
|-----------|--------------|---------------|
| `app/` | 4 | `../core/*`, `../shared/*` |
| `modules/` | ~30 | `../../../core/*`, `../../../shared/*` |
| `shared/` | ~8 | `../../../core/*` |
| `core/` | ~20 | `../../modules/*`, `../../shared/*`, `../../app/*` |
