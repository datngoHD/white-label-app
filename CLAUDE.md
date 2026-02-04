# rn-demo-spec1 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-23

## Active Technologies

- TypeScript 5.3.3 (strict mode) + Node.js built-in modules only (fs, path) (004-switch-brand)
- File system (native project files, .current-brand state file) (004-switch-brand)
- JavaScript (Node.js 18+) + Node.js built-in modules (fs, path) + sharp (for image processing) (004-switch-brand)
- N/A (file-based configuration) (004-switch-brand)
- TypeScript 5.3.3 (strict mode) + Expo SDK 54, React Native 0.81.5, Metro bundler (007-typescript-strict-setup)
- TypeScript 5.4.x (strict mode enabled) + ESLint 9.39.x, @typescript-eslint/eslint-plugin 8.53.x, eslint-plugin-react 7.37.x, eslint-plugin-react-hooks 7.0.x, eslint-plugin-react-native 5.0.x, eslint-plugin-import 2.32.x (008-eslint-strict-config)

- TypeScript 5.3.3 (strict mode) + Prettier 3.8.1, @ianvs/prettier-plugin-sort-imports 4.7.0 (existing), eslint-plugin-import (to add) (003-prettier-import-sort)

- TypeScript 5.3.3 (strict mode) + Expo SDK 54, React Native 0.81.5, babel-preset-expo, babel-plugin-module-resolver (to add) (002-setup-aliases)
- TypeScript 5.3.3 (strict mode) + Prettier 3.8.1 (existing), Prettier import sorting plugin (to be added) (003-prettier-import-sort)
- N/A (configuration files only) (003-prettier-import-sort)

- TypeScript (strict mode) (001-whitelabel-multitenant)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

### ESLint Commands
- `npm run lint` - Run linting (errors block CI, warnings don't)
- `npm run lint:fix` - Auto-fix fixable issues (import order, formatting)

## Code Style

TypeScript (strict mode): Follow standard conventions

### ESLint Strict Configuration (008-eslint-strict-config)
- **Type Safety**: strictTypeChecked + stylisticTypeChecked presets enabled
- **React Hooks**: exhaustive-deps as error
- **Security**: eslint-plugin-security with eval detection
- **Accessibility**: eslint-plugin-react-native-a11y with required props
- **React Native**: no-inline-styles, no-unused-styles, no-raw-text as errors
- **Naming**: camelCase default, PascalCase for types/components, UPPER_CASE for constants
- **Complexity**: max 50 lines/function, cyclomatic max 10 (warnings only)
- **Prettier**: eslint-config-prettier integrated (must be last in config)

## Recent Changes

- 008-eslint-strict-config: Added TypeScript 5.4.x (strict mode enabled) + ESLint 9.39.x, @typescript-eslint/eslint-plugin 8.53.x, eslint-plugin-react 7.37.x, eslint-plugin-react-hooks 7.0.x, eslint-plugin-react-native 5.0.x, eslint-plugin-import 2.32.x
- 007-typescript-strict-setup: Added TypeScript 5.3.3 (strict mode) + Expo SDK 54, React Native 0.81.5, Metro bundler
- 004-switch-brand: Added JavaScript (Node.js 18+) + Node.js built-in modules (fs, path) + sharp (for image processing)

<!-- MANUAL ADDITIONS START -->

## Context7 Integration

Always use Context7 MCP when I need:
- Library/API documentation for React Native, Expo, or any npm packages
- Code generation with specific libraries (FlashList, Reanimated, expo-image, etc.)
- Setup or configuration steps for new packages

This applies automatically without me explicitly asking.

### Library References (use these for faster lookups)
- React Native: `/facebook/react-native`
- Expo: `/expo/expo`
- FlashList: `/shopify/flash-list`
- Reanimated: `/software-mansion/react-native-reanimated`
- Zustand: `/pmndrs/zustand`

## Vercel React Native Skills

Reference `.claude/skills/vercel-react-native-skills/AGENTS.md` when:
- Building React Native or Expo components
- Optimizing list and scroll performance (use FlashList, not FlatList)
- Implementing animations (use Reanimated, animate only transform/opacity)
- Working with images (use expo-image, not Image from react-native)
- Managing state (prefer Zustand over Redux)

<!-- MANUAL ADDITIONS END -->

