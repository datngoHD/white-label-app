# Research: Prettier Import Sorting Plugin Selection

**Feature**: 003-prettier-import-sort
**Date**: 2026-01-27
**Status**: Complete

## Research Questions

1. Which Prettier plugin best fits the project requirements?
2. How to configure import groups matching the specification?
3. How to handle TypeScript type imports?

---

## Plugin Comparison

### Candidates Evaluated

| Plugin                                                                                             | Weekly Downloads | GitHub Stars | Prettier 3.x | Last Update |
| -------------------------------------------------------------------------------------------------- | ---------------- | ------------ | ------------ | ----------- |
| [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)   | ~1.2M            | 3,629        | Yes          | Active      |
| [@ianvs/prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports)       | ~575K            | 1,191        | Yes          | Active      |
| [prettier-plugin-organize-imports](https://www.npmjs.com/package/prettier-plugin-organize-imports) | ~300K            | N/A          | Yes          | Active      |

### Feature Comparison

| Feature                        | @trivago | @ianvs                  | organize-imports   |
| ------------------------------ | -------- | ----------------------- | ------------------ |
| Custom import groups via regex | Yes      | Yes                     | No                 |
| Side-effect import handling    | Limited  | Configurable            | Auto               |
| Type import control            | Basic    | Advanced                | TypeScript default |
| Built-in module placeholder    | No       | `<BUILTIN_MODULES>`     | N/A                |
| Third-party placeholder        | No       | `<THIRD_PARTY_MODULES>` | N/A                |
| Merge duplicate imports        | No       | Yes                     | Yes                |
| Combine type and value imports | No       | Yes                     | Yes                |
| TypeScript version awareness   | No       | Yes                     | Yes                |

### Analysis

**@trivago/prettier-plugin-sort-imports**

- Pros: Largest user base, well-documented, stable
- Cons: Less control over type imports, no special placeholders for grouping

**@ianvs/prettier-plugin-sort-imports**

- Pros: Better TypeScript support, special placeholders (`<THIRD_PARTY_MODULES>`, `<BUILTIN_MODULES>`), type import control, actively maintained fork of @trivago with enhancements
- Cons: Smaller community (though growing)

**prettier-plugin-organize-imports**

- Pros: Uses TypeScript's built-in organize imports, minimal configuration
- Cons: Less customizable grouping, follows TS default rules only

---

## Decision: @ianvs/prettier-plugin-sort-imports

### Rationale

1. **TypeScript-first**: The `importOrderTypeScriptVersion` option ensures proper handling of TypeScript 5.3.3 features
2. **Flexible grouping**: Special placeholders allow precise control over import group ordering
3. **Type import handling**: `importOrderCombineTypeAndValueImports` keeps type imports with their source module (per spec requirement)
4. **Side-effect control**: `importOrderSideEffects` option allows preserving side-effect imports at the top
5. **Prettier 3.x compatible**: Confirmed working with Prettier 3.8.1
6. **Active maintenance**: Regular updates and responsive to issues

### Alternatives Rejected

| Alternative          | Rejection Reason                                                                  |
| -------------------- | --------------------------------------------------------------------------------- |
| @trivago plugin      | Less control over type imports; spec requires type imports stay with source group |
| organize-imports     | Cannot customize group order to match React Native convention                     |
| ESLint-only approach | Spec requires Prettier integration for format-on-save                             |

---

## Configuration Design

### Import Order Groups (Spec Requirement)

```
1. Side-effect imports       → ^(?!.*\\u0000$)[./].*(?<!\\.(css|scss|less))$
2. React and React Native    → ^react(-native)?$
3. External packages         → <THIRD_PARTY_MODULES>
4. Internal aliases          → ^@(app|modules|shared|core|assets)/
5. Relative imports          → ^\\./
```

### Recommended Configuration

```json
{
  "plugins": ["@ianvs/prettier-plugin-sort-imports"],
  "importOrder": [
    "",
    "^react(-native)?$",
    "^react-native-.*$",
    "^expo.*$",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@(app|modules|shared|core|assets)/(.*)$",
    "",
    "^[./]"
  ],
  "importOrderParserPlugins": ["typescript", "jsx"],
  "importOrderTypeScriptVersion": "5.3.3"
}
```

### Configuration Notes

- Empty strings (`""`) create blank lines between groups
- `<THIRD_PARTY_MODULES>` catches all npm packages not matched by other patterns
- Path aliases match the project's `tsconfig.json` paths configuration
- Side-effect imports without specifiers are automatically placed first by default

---

## ESLint Alignment (Per Clarification)

Since the spec requires keeping both ESLint and Prettier with documentation for alignment:

### If ESLint import rules are added later

Create `eslint.config.js` with compatible rules:

```javascript
// Example eslint-plugin-import configuration (if added)
{
  rules: {
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      pathGroups: [
        { pattern: 'react', group: 'external', position: 'before' },
        { pattern: 'react-native', group: 'external', position: 'before' },
        { pattern: '@app/**', group: 'internal' },
        { pattern: '@modules/**', group: 'internal' },
        { pattern: '@shared/**', group: 'internal' },
        { pattern: '@core/**', group: 'internal' },
        { pattern: '@assets/**', group: 'internal' }
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }]
  }
}
```

**Note**: Current project has ESLint 9.x but no import ordering rules configured. Documentation will be provided for future alignment if eslint-plugin-import is added.

---

## Sources

- [GitHub - @ianvs/prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports)
- [GitHub - @trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)
- [npm trends comparison](https://npmtrends.com/@ianvs/prettier-plugin-sort-imports-vs-@trivago/prettier-plugin-sort-imports)
- [trivago tech blog - Plugin introduction](https://tech.trivago.com/post/2021-12-17-aprettierpluginthatsortsyourimports)
