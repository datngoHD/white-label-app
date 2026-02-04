# ESLint Configuration Data Model

**Feature**: 008-eslint-strict-config
**Date**: 2026-02-03

## Overview

This document defines the structure and organization of the ESLint configuration for the React Native/Expo project. Since this is a configuration feature (not a data-driven feature), this document describes the configuration model rather than traditional entities.

## Configuration Structure

### ESLint Flat Config Architecture

```text
eslint.config.js
├── Ignores Block           # Files/directories to skip
├── Base Config             # ESLint recommended rules
├── TypeScript Config       # Type-aware strict rules
│   ├── Parser Options      # projectService for type checking
│   ├── Strict Rules        # strictTypeChecked preset
│   └── Stylistic Rules     # stylisticTypeChecked preset
├── React Config            # React-specific rules
├── React Hooks Config      # Hooks rules (strict)
├── React Native Config     # RN-specific rules
├── Accessibility Config    # A11y rules for RN
├── Security Config         # Security pattern detection
├── Complexity Config       # Code complexity warnings
├── Import Config           # Import ordering and validation
└── Prettier Config         # Disable formatting conflicts (MUST BE LAST)
```

## Rule Categories

### Category 1: Type Safety (ERROR)

| Rule                                               | Severity | Source                      |
| -------------------------------------------------- | -------- | --------------------------- |
| `@typescript-eslint/no-explicit-any`               | error    | strictTypeChecked           |
| `@typescript-eslint/no-unsafe-assignment`          | error    | strictTypeChecked           |
| `@typescript-eslint/no-unsafe-call`                | error    | strictTypeChecked           |
| `@typescript-eslint/no-unsafe-member-access`       | error    | strictTypeChecked           |
| `@typescript-eslint/no-unsafe-return`              | error    | strictTypeChecked           |
| `@typescript-eslint/strict-boolean-expressions`    | error    | strictTypeChecked           |
| `@typescript-eslint/no-floating-promises`          | error    | strictTypeChecked           |
| `@typescript-eslint/await-thenable`                | error    | strictTypeChecked           |
| `@typescript-eslint/no-misused-promises`           | error    | strictTypeChecked           |
| `@typescript-eslint/explicit-function-return-type` | error    | custom (exported functions) |

### Category 2: React Hooks (ERROR)

| Rule                          | Severity | Source                  |
| ----------------------------- | -------- | ----------------------- |
| `react-hooks/rules-of-hooks`  | error    | react-hooks recommended |
| `react-hooks/exhaustive-deps` | error    | upgraded from warn      |

### Category 3: React Native (ERROR/WARN)

| Rule                                          | Severity | Rationale          |
| --------------------------------------------- | -------- | ------------------ |
| `react-native/no-unused-styles`               | error    | Dead code          |
| `react-native/no-inline-styles`               | error    | Maintainability    |
| `react-native/no-raw-text`                    | error    | Accessibility/i18n |
| `react-native/no-single-element-style-arrays` | error    | Performance        |
| `react-native/split-platform-components`      | error    | Platform safety    |
| `react-native/no-color-literals`              | warn     | Theme consistency  |

### Category 4: Security (ERROR)

| Rule                                   | Severity | Risk                |
| -------------------------------------- | -------- | ------------------- |
| `security/detect-eval-with-expression` | error    | Code injection      |
| `security/detect-non-literal-regexp`   | warn     | ReDoS               |
| `security/detect-object-injection`     | warn     | Prototype pollution |
| `no-eval`                              | error    | Code injection      |

### Category 5: Accessibility (ERROR/WARN)

| Rule                                              | Severity | Impact                |
| ------------------------------------------------- | -------- | --------------------- |
| `react-native-a11y/has-accessibility-props`       | error    | Screen reader support |
| `react-native-a11y/has-valid-accessibility-role`  | error    | Semantic meaning      |
| `react-native-a11y/has-valid-accessibility-state` | error    | State communication   |
| `react-native-a11y/no-nested-touchables`          | error    | Touch target issues   |
| `react-native-a11y/has-accessibility-hint`        | warn     | Enhanced UX           |

### Category 6: Complexity (WARN)

| Rule                     | Threshold | Rationale             |
| ------------------------ | --------- | --------------------- |
| `complexity`             | max: 10   | Cyclomatic complexity |
| `max-lines-per-function` | max: 50   | Function length       |
| `max-depth`              | max: 3    | Nesting depth         |
| `max-params`             | max: 4    | Function parameters   |
| `max-nested-callbacks`   | max: 3    | Callback hell         |

### Category 7: Naming Conventions (ERROR)

| Selector   | Format                 | Example                      |
| ---------- | ---------------------- | ---------------------------- |
| default    | camelCase              | `userName`                   |
| variable   | camelCase, UPPER_CASE  | `count`, `MAX_RETRIES`       |
| function   | camelCase, PascalCase  | `getData`, `MyComponent`     |
| typeLike   | PascalCase             | `UserProfile`, `ApiResponse` |
| enumMember | PascalCase, UPPER_CASE | `Active`, `PENDING`          |
| parameter  | camelCase              | `userId` (allow `_unused`)   |

### Category 8: Import Organization (WARN)

| Group    | Order | Examples                          |
| -------- | ----- | --------------------------------- |
| builtin  | 1     | `path`, `fs`                      |
| external | 2     | `react`, `react-native`, `expo`   |
| internal | 3     | `@app/*`, `@core/*`, `@modules/*` |
| parent   | 4     | `../utils`                        |
| sibling  | 5     | `./helpers`                       |
| index    | 6     | `./`                              |

## Ignore Patterns

```text
# Build artifacts
node_modules/
ios/
android/
dist/
build/
coverage/
.expo/

# Configuration files (JS only, not TS)
*.config.js
.eslintrc.js
babel.config.js
metro.config.js

# Generated files
*.generated.ts
*.d.ts
```

## Plugin Dependencies

| Plugin                            | Version | Purpose                 |
| --------------------------------- | ------- | ----------------------- |
| `@eslint/js`                      | ^9.39.x | Core ESLint recommended |
| `typescript-eslint`               | ^8.53.x | TypeScript support      |
| `eslint-plugin-react`             | ^7.37.x | React rules             |
| `eslint-plugin-react-hooks`       | ^7.0.x  | Hooks rules             |
| `eslint-plugin-react-native`      | ^5.0.x  | RN rules                |
| `eslint-plugin-react-native-a11y` | ^3.x    | Accessibility           |
| `eslint-plugin-security`          | ^3.x    | Security patterns       |
| `eslint-plugin-import`            | ^2.32.x | Import validation       |
| `eslint-config-prettier`          | ^10.x   | Prettier compat         |

## Validation Rules

1. **Configuration Completeness**: All category rules must be present
2. **Severity Compliance**: Type/security/hooks = error; complexity = warn
3. **Ordering**: Prettier config MUST be last in the config array
4. **Parser Configuration**: `projectService: true` must be set for type-aware rules
5. **React Version**: Must use `version: 'detect'` in React settings
