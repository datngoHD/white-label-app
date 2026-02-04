# Research: TypeScript Strict Configuration Setup

**Feature**: 007-typescript-strict-setup
**Date**: 2026-02-03

## Research Topics

1. TypeScript strict options beyond `strict: true`
2. Expo/Metro compatibility with `module: "preserve"`
3. Best practices for React Native TypeScript configuration

---

## 1. TypeScript Strict Options

### Options Included in `strict: true`

When `"strict": true` is enabled, it automatically enables these 8 options:

| Option                         | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `noImplicitAny`                | Forces explicit type annotations instead of implicit `any` |
| `strictNullChecks`             | Treats `null` and `undefined` as distinct types            |
| `strictFunctionTypes`          | Enforces proper variance checking for function parameters  |
| `strictBindCallApply`          | Strict type checking for `.bind()`, `.call()`, `.apply()`  |
| `strictPropertyInitialization` | Requires class properties to be initialized                |
| `noImplicitThis`               | Errors when `this` has implied `any` type                  |
| `alwaysStrict`                 | Emits `"use strict"` in all compiled files                 |
| `useUnknownInCatchVariables`   | Catch variables default to `unknown` instead of `any`      |

### Additional Strict Options (NOT included in `strict: true`)

| Option                               | Purpose                                             | Recommendation                                |
| ------------------------------------ | --------------------------------------------------- | --------------------------------------------- |
| `noUncheckedIndexedAccess`           | Adds `undefined` to index signature results         | **Enable** - catches array/object access bugs |
| `noImplicitReturns`                  | Errors when function doesn't return on all paths    | **Enable** - prevents missing returns         |
| `noFallthroughCasesInSwitch`         | Errors on fallthrough switch cases                  | **Enable** - common bug source                |
| `exactOptionalPropertyTypes`         | Distinguishes `undefined` vs "property not present" | **Enable** - stricter optional props          |
| `noImplicitOverride`                 | Requires explicit `override` keyword                | **Enable** - prevents accidental overrides    |
| `noPropertyAccessFromIndexSignature` | Requires bracket notation for dynamic keys          | **Enable** - better index safety              |
| `forceConsistentCasingInFileNames`   | Disallows inconsistent file casing                  | **Enable** - critical for CI/Linux            |
| `allowUnusedLabels: false`           | Errors on unused labels                             | **Enable** - code quality                     |
| `allowUnreachableCode: false`        | Errors on unreachable code                          | **Enable** - code quality                     |
| `isolatedModules`                    | Files can be transpiled individually                | **Enable** - required for Metro               |

**Decision**: Enable all recommended options for maximum type safety.

**Rationale**: These options catch real bugs at compile time rather than runtime. The minor increase in verbosity (explicit undefined checks, return statements) is worth the safety benefits.

**Alternatives Considered**:

- Only use `strict: true` - rejected because it misses important safety checks like `noUncheckedIndexedAccess`
- Use `@tsconfig/strictest` package - rejected as unnecessary dependency; we can configure directly

---

## 2. Expo `module: "preserve"` Compatibility Issue

### Problem

Expo's `tsconfig.base.json` uses `"module": "preserve"`, which was introduced in **TypeScript 5.4** (March 2024). Our project uses **TypeScript 5.3.3**, causing:

```
error TS6046: Argument for '--module' option must be: 'none', 'commonjs', 'amd', 'system', 'umd', 'es6', 'es2015', 'es2020', 'es2022', 'esnext', 'node16', 'nodenext'.
```

### Solution

**Decision**: Override with `"module": "ESNext"`

**Rationale**:

- `ESNext` preserves ES Module syntax (imports/exports)
- Works perfectly with Metro bundler
- Pairs well with existing `moduleResolution: "bundler"`
- Fully compatible with TypeScript 5.3.3

**Alternatives Considered**:

- Upgrade to TypeScript 5.4+ - rejected because it may introduce breaking changes and is not a quick fix; version is pinned for Expo SDK compatibility
- Use `module: "es2022"` - viable alternative but `esnext` is more commonly used with Metro

---

## 3. Best Practices for React Native/Expo

### Recommended Configuration Pattern

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    // Override incompatible base settings
    "module": "ESNext",

    // Core strict mode
    "strict": true,

    // Additional strict options
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "forceConsistentCasingInFileNames": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "isolatedModules": true,

    // Build settings
    "noEmit": true,
    "skipLibCheck": true
  }
}
```

### Key Insights

1. **Override before extend doesn't work** - Child config properties override parent, so place overrides in child
2. **`isolatedModules: true`** is critical for Metro bundler compatibility
3. **`skipLibCheck: true`** should remain enabled to avoid blocking on third-party type issues
4. **Path aliases** require matching configuration in both `tsconfig.json` and `babel.config.js`

---

## Existing Type Errors Analysis

Current typecheck reveals 11 errors across these categories:

| Category          | Count | Files                        | Fix Strategy                                     |
| ----------------- | ----- | ---------------------------- | ------------------------------------------------ |
| Module not found  | 3     | scripts/build/\*.ts          | Create missing type files or remove dead imports |
| Implicit any      | 3     | scripts/build/\*.ts          | Add explicit type annotations                    |
| Navigation props  | 2     | core/navigation/\*.tsx       | Use proper React Navigation generics             |
| Sentry types      | 1     | core/errors/sentry.ts        | Update to correct Sentry SDK types               |
| Style array       | 1     | modules/admin/screens/\*.tsx | Use StyleSheet.flatten or correct type           |
| ZodError property | 1     | scripts/build/utils/\*.ts    | Use correct Zod API                              |

**Note**: These errors exist with current configuration. Adding stricter options may reveal additional errors that need fixing.

---

## References

- [TypeScript TSConfig: strict](https://www.typescriptlang.org/tsconfig/strict.html)
- [TypeScript 5.4 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html)
- [Expo TypeScript Guide](https://docs.expo.dev/guides/typescript/)
- [Metro Bundler Documentation](https://docs.expo.dev/guides/customizing-metro/)
