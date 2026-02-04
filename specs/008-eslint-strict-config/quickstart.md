# ESLint Strict Configuration - Developer Quick Reference

**Feature**: 008-eslint-strict-config
**Date**: 2026-02-03

## Commands

```bash
# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Check specific files
npx eslint src/app/App.tsx

# Check with verbose output
npx eslint . --debug
```

## Rule Severity Guide

### Errors (Will Block CI)

| Category          | What It Catches                  | How to Fix                                    |
| ----------------- | -------------------------------- | --------------------------------------------- |
| **Type Safety**   | `any` types, unsafe assignments  | Add explicit types, use type guards           |
| **React Hooks**   | Invalid hook usage, missing deps | Follow Rules of Hooks, add dependencies       |
| **Security**      | `eval()`, injection patterns     | Use safer alternatives                        |
| **Accessibility** | Missing a11y props               | Add `accessibilityLabel`, `accessibilityRole` |
| **React Native**  | Unused styles, raw text          | Remove unused, wrap text in `<Text>`          |

### Warnings (Won't Block CI)

| Category           | What It Catches                       | How to Fix                   |
| ------------------ | ------------------------------------- | ---------------------------- |
| **Complexity**     | Functions > 50 lines, complexity > 10 | Break into smaller functions |
| **Import Order**   | Unorganized imports                   | Run `npm run lint:fix`       |
| **Color Literals** | Hardcoded colors                      | Use theme colors             |
| **A11y Hints**     | Missing accessibility hints           | Add `accessibilityHint`      |

## Common Fixes

### Type Safety Issues

```typescript
// BAD: Implicit any
function process(data) { ... }

// GOOD: Explicit types
function process(data: UserData): ProcessResult { ... }
```

```typescript
// BAD: Unsafe assignment
const user: User = response.data;

// GOOD: Type assertion with validation
const user = response.data as User;
// OR better: use type guard
if (isUser(response.data)) {
  const user = response.data;
}
```

### React Hooks Issues

```typescript
// BAD: Missing dependency
useEffect(() => {
  fetchUser(userId);
}, []); // Warning: userId missing

// GOOD: Include all dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

### React Native Issues

```typescript
// BAD: Inline styles
<View style={{ padding: 10 }} />

// GOOD: StyleSheet
const styles = StyleSheet.create({
  container: { padding: 10 }
});
<View style={styles.container} />
```

```typescript
// BAD: Raw text
<View>Hello World</View>

// GOOD: Wrapped in Text
<View><Text>Hello World</Text></View>
```

### Accessibility Issues

```typescript
// BAD: Missing a11y props
<TouchableOpacity onPress={handlePress}>
  <Text>Submit</Text>
</TouchableOpacity>

// GOOD: With a11y props
<TouchableOpacity
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
>
  <Text>Submit</Text>
</TouchableOpacity>
```

### Naming Conventions

```typescript
// Variables: camelCase or UPPER_CASE for constants
const userName = 'John';
const MAX_RETRIES = 3;

// Functions: camelCase
function fetchUserData() { ... }

// React Components: PascalCase
function UserProfile() { ... }

// Types/Interfaces: PascalCase
interface UserProfile { ... }
type ApiResponse = { ... };

// Enums: PascalCase members
enum Status {
  Active,
  Inactive,
  Pending
}
```

### Complexity Issues

```typescript
// BAD: Function too long (> 50 lines)
function handleSubmit() {
  // 60+ lines of code
}

// GOOD: Break into smaller functions
function handleSubmit() {
  validateForm();
  prepareData();
  submitToApi();
}
```

## Disabling Rules

### For a Single Line

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData: any = getLegacyData();
```

### For a Code Block

```typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const data = externalLibrary.parse(input);
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
```

### For Entire File (Use Sparingly)

```typescript
/* eslint-disable react-native/no-inline-styles */
// This file contains dynamic styles that can't use StyleSheet
```

## When to Disable Rules

**Acceptable:**

- Third-party library integration with incompatible types
- Legacy code during gradual migration
- Performance-critical code requiring specific patterns

**Not Acceptable:**

- To avoid fixing actual issues
- Because "it works"
- For convenience

**Always document why:**

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Third-party library returns unknown structure
```

## IDE Integration

### VS Code

Install the ESLint extension and add to settings.json:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact"]
}
```

### WebStorm

ESLint is built-in. Enable at:
Preferences → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint

## Troubleshooting

### "Parsing error: Cannot read file tsconfig.json"

Ensure your working directory contains `tsconfig.json` or run ESLint from project root.

### "Rule X requires type information"

Check that `parserOptions.projectService: true` is set in eslint.config.js.

### Performance Issues

1. Ensure `node_modules/` is in ignores
2. Check that type-aware rules aren't running on JS files
3. Consider using `TIMING=1 npx eslint .` to identify slow rules

### Auto-fix Not Working

Some rules can't be auto-fixed:

- Type errors (require manual type annotations)
- Hook dependency arrays (may cause behavior changes)
- Accessibility props (require semantic decisions)

## Auto-Fixable vs Manual-Fix Rules

### Auto-Fixable (run `npm run lint:fix`)

| Rule                                           | What It Fixes                               |
| ---------------------------------------------- | ------------------------------------------- |
| `import/order`                                 | Reorders imports to match configured groups |
| `@typescript-eslint/prefer-nullish-coalescing` | Converts `\|\|` to `??` where safe          |
| `@typescript-eslint/consistent-type-imports`   | Converts to type-only imports               |
| `prettier` conflicts                           | Formatting issues                           |
| `no-extra-semi`                                | Removes extra semicolons                    |

### Manual-Fix Required

| Rule                                               | Why Manual                            |
| -------------------------------------------------- | ------------------------------------- |
| `@typescript-eslint/explicit-function-return-type` | Requires understanding function logic |
| `@typescript-eslint/no-explicit-any`               | Requires proper type design           |
| `react-hooks/exhaustive-deps`                      | May change component behavior         |
| `react-native/no-inline-styles`                    | Requires StyleSheet refactoring       |
| `react-native/no-raw-text`                         | Requires wrapping in Text component   |
| `react-native-a11y/*`                              | Requires semantic a11y decisions      |
| `complexity`                                       | Requires function refactoring         |
| `max-lines-per-function`                           | Requires function splitting           |

## Common Error Messages and Solutions

### "@typescript-eslint/no-unsafe-assignment"

```
Unsafe assignment of an `any` value
```

**Solution**: Add proper typing to the source of the value, or use type assertion with validation.

### "@typescript-eslint/no-floating-promises"

```
Promises must be awaited, end with a call to .catch, or end with a call to .then
```

**Solution**: Add `await`, `.catch()`, or `void` operator if intentionally ignoring.

### "react-native/no-raw-text"

```
Raw text cannot be used outside of a <Text> tag
```

**Solution**: Wrap text content in `<Text>` component.

### "@typescript-eslint/naming-convention"

```
Variable name 'my_var' must match camelCase
```

**Solution**: Rename to camelCase (e.g., `myVar`). Use UPPER_CASE for constants.

## CI Pipeline Behavior

### Exit Codes

| Exit Code | Meaning                    | CI Result |
| --------- | -------------------------- | --------- |
| 0         | No errors (warnings OK)    | ✅ PASS   |
| 1         | Errors found               | ❌ FAIL   |
| 2         | Fatal error (config issue) | ❌ FAIL   |

### What Blocks CI

**Errors (exit code 1):**

- Type safety violations
- Security issues (`eval`, injection patterns)
- React hooks violations
- Accessibility violations
- React Native structural issues
- Naming convention violations

**Warnings (exit code 0):**

- Complexity warnings (function length, cyclomatic)
- Color literals
- Accessibility hints
- Import ordering

### Performance

- **Local**: ~15 seconds for full project lint
- **CI**: ~30-60 seconds (depending on runner specs)
- Type-aware rules are the most expensive; disabled for JS files

### CI Configuration Example

```yaml
# GitHub Actions example
- name: Lint
  run: npm run lint
  # Fails if exit code != 0 (errors found)
```

### Recommended CI Commands

```bash
# Full CI validation
npm test && npm run lint && npm run typecheck

# Quick lint check only
npm run lint

# Lint with auto-fix (for local development)
npm run lint:fix
```
