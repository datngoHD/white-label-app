# ESLint Strict Configuration Research

**Feature**: 008-eslint-strict-config
**Date**: 2026-02-03
**Status**: Complete

## 1. Type-Aware Linting

**Decision**: Use `parserOptions.projectService: true` with `tseslint.configs.strictTypeChecked`

**Rationale**:

- `projectService` (stabilized in typescript-eslint v8) uses TypeScript's native type checking APIs
- Provides simpler configs without ESLint-specific TSConfig files
- Better scalability and reliability by using the same type services as editors
- Official recommended approach from typescript-eslint documentation

**Alternatives Considered**:

- `parserOptions.project: true` - Older approach, auto-detects TSConfigs but less performant
- `parserOptions.project: './tsconfig.json'` - Manual path, more brittle

## 2. Strict Rule Sets

**Decision**: Use `tseslint.configs.strictTypeChecked` combined with `tseslint.configs.stylisticTypeChecked`

**Rationale**:

- `strict-type-checked` provides maximum type safety enforcement
- `stylisticTypeChecked` ensures consistent code styling
- Aligns with project's TypeScript strict mode requirement
- Recommended for teams with high TypeScript proficiency

**Alternatives Considered**:

- `recommendedTypeChecked` only - Less strict, better for mixed-experience teams
- `all` config - Too aggressive, unstable, not production-ready

## 3. Complexity Rules

**Decision**: Use ESLint's built-in complexity rules with these thresholds:

- `complexity`: max 10 (cyclomatic complexity) - WARNING
- `max-lines-per-function`: max 50 lines - WARNING
- `max-depth`: max 3 (nesting depth) - WARNING
- `max-params`: max 4 (function parameters) - WARNING

**Rationale**:

- Built-in ESLint rules requiring no additional plugins
- Thresholds align with spec clarification (max 50 lines, complexity 10)
- Set as warnings per tiered severity approach

**Alternatives Considered**:

- `eslint-plugin-sonarjs` cognitive complexity - More sophisticated but adds dependency
- No complexity rules - Not recommended for maintaining code quality

## 4. Security Rules

**Decision**: Use `eslint-plugin-security` for core security patterns

**Rationale**:

- Community-maintained plugin covering common security vulnerabilities
- Covers eval detection, regex DoS, injection patterns
- Supports ESLint 9 flat config

**Alternatives Considered**:

- `eslint-plugin-sonarjs` - More comprehensive but heavier
- `eslint-plugin-no-secrets` - Focused on credential detection (consider adding if secrets in code are a concern)

## 5. Naming Conventions

**Decision**: Use `@typescript-eslint/naming-convention` with granular selectors

**Rationale**:

- Replaces ESLint's `camelcase` rule with TypeScript-aware alternative
- Can enforce different conventions for different code elements
- Supports React component naming (PascalCase for components, camelCase for functions)

**Configuration**:

- Default: camelCase
- Variables: camelCase or UPPER_CASE (constants)
- Functions: camelCase or PascalCase (React components)
- Types/Interfaces/Enums: PascalCase
- Parameters: camelCase with leading underscore allowed for unused

**Alternatives Considered**:

- ESLint's `camelcase` rule - Less flexible, no TypeScript awareness

## 6. Prettier Integration

**Decision**: Use `eslint-config-prettier` as the **last** configuration in the array

**Rationale**:

- Disables all ESLint rules that conflict with Prettier
- Must be placed last to override any formatting rules
- typescript-eslint recommends not using ESLint for formatting

**Alternatives Considered**:

- `eslint-plugin-prettier` - Runs Prettier as ESLint rule (slower, more noise)
- No integration - Would cause constant conflicts

## 7. React Native Specific Rules

**Decision**: Use `eslint-plugin-react-native` with strict rule configuration

**Rationale**:

- Provides RN-specific rules (unused styles, inline styles, raw text)
- Maintained compatibility with ESLint 9
- Project already has this plugin installed

**Key Rules to Enable**:

- `react-native/no-unused-styles`: error
- `react-native/no-inline-styles`: error (upgraded from warn per spec)
- `react-native/no-color-literals`: warn
- `react-native/no-raw-text`: error
- `react-native/no-single-element-style-arrays`: error
- `react-native/split-platform-components`: error

**Alternatives Considered**:

- `@rnx-kit/eslint-plugin` - Narrower focus on tree shaking

## 8. Accessibility

**Decision**: Use `eslint-plugin-react-native-a11y`

**Rationale**:

- Purpose-built for React Native accessibility
- Actively maintained
- Based on eslint-plugin-jsx-a11y patterns, adapted for React Native

**Key Rules to Enable**:

- `react-native-a11y/has-accessibility-props`: error
- `react-native-a11y/has-valid-accessibility-role`: error
- `react-native-a11y/has-valid-accessibility-state`: error
- `react-native-a11y/has-valid-accessibility-value`: error
- `react-native-a11y/no-nested-touchables`: error
- `react-native-a11y/has-accessibility-hint`: warn

**Alternatives Considered**:

- `eslint-plugin-jsx-a11y` alone - Web-focused, not RN-aware

## Summary: New Dependencies Required

| Package                           | Purpose                     | Status                 |
| --------------------------------- | --------------------------- | ---------------------- |
| `eslint-plugin-security`          | Security patterns detection | NEW - install required |
| `eslint-plugin-react-native-a11y` | Accessibility rules         | NEW - install required |
| `eslint-config-prettier`          | Disable Prettier conflicts  | NEW - install required |

## Summary: Existing Plugins to Configure Strictly

| Package                            | Current     | Target                                   |
| ---------------------------------- | ----------- | ---------------------------------------- |
| `@typescript-eslint/eslint-plugin` | recommended | strictTypeChecked + stylisticTypeChecked |
| `eslint-plugin-react`              | recommended | recommended (keep)                       |
| `eslint-plugin-react-hooks`        | recommended | recommended + exhaustive-deps as error   |
| `eslint-plugin-react-native`       | partial     | full strict configuration                |
| `eslint-plugin-import`             | order only  | order + cycle detection                  |

## Rule Severity Tiers (per Spec Clarification)

### Tier 1: Errors (Block CI)

- Type safety rules (typescript-eslint strict)
- Security rules (eslint-plugin-security)
- React hooks rules (rules-of-hooks)
- Accessibility core rules
- Import issues (missing imports, cycles)
- React Native structural rules

### Tier 2: Warnings (Advisory)

- Complexity rules (function length, cyclomatic)
- Naming conventions (stylistic)
- Some accessibility hints
- Import ordering (already warning)
