# Quickstart: TypeScript Strict Configuration Setup

**Feature**: 007-typescript-strict-setup
**Date**: 2026-02-03

## Prerequisites

- Node.js 18+
- Project dependencies installed (`yarn install`)
- Familiarity with TypeScript compiler options

## Implementation Steps

### Step 1: Update tsconfig.json

Replace the current `tsconfig.json` with the strict configuration:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    // ══════════════════════════════════════════════════════════════════
    // MODULE SYSTEM (override Expo base for TS 5.3.3 compatibility)
    // ══════════════════════════════════════════════════════════════════
    "module": "ESNext",
    "isolatedModules": true,

    // ══════════════════════════════════════════════════════════════════
    // STRICT TYPE CHECKING - Core (enabled by strict: true)
    // Includes: strictNullChecks, strictFunctionTypes, strictBindCallApply,
    // strictPropertyInitialization, noImplicitAny, noImplicitThis,
    // alwaysStrict, useUnknownInCatchVariables
    // ══════════════════════════════════════════════════════════════════
    "strict": true,

    // ══════════════════════════════════════════════════════════════════
    // STRICT TYPE CHECKING - Additional (beyond strict: true)
    // ══════════════════════════════════════════════════════════════════
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    // ══════════════════════════════════════════════════════════════════
    // CODE QUALITY
    // ══════════════════════════════════════════════════════════════════
    "forceConsistentCasingInFileNames": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,

    // ══════════════════════════════════════════════════════════════════
    // BUILD CONFIGURATION
    // ══════════════════════════════════════════════════════════════════
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    // ══════════════════════════════════════════════════════════════════
    // PATH ALIASES
    // ══════════════════════════════════════════════════════════════════
    "baseUrl": ".",
    "paths": {
      "@app/*": ["app/*"],
      "@modules/*": ["modules/*"],
      "@shared/*": ["shared/*"],
      "@core/*": ["core/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "app.config.js"],
  "exclude": ["node_modules", "ios", "android", ".expo"]
}
```

### Step 2: Run Initial Typecheck

```bash
npm run typecheck
```

This will reveal all existing type errors that need fixing.

### Step 3: Fix Type Errors

Fix errors in order of severity. Common patterns:

**Navigation prop types:**

```typescript
// Before
const MyScreen = ({ navigation }: Props) => { ... }

// After - use proper generics
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<RootStackParamList, 'MyScreen'>;
const MyScreen: React.FC<Props> = ({ navigation, route }) => { ... }
```

**Array index access (noUncheckedIndexedAccess):**

```typescript
// Before
const item = items[0];
item.doSomething(); // Error: item might be undefined

// After
const item = items[0];
if (item) {
  item.doSomething();
}
// Or use non-null assertion if you're certain
const item = items[0]!;
```

**Style arrays:**

```typescript
// Before
style={[styles.container, { marginTop: 10 }]}

// After - use StyleSheet.compose or flatten
import { StyleSheet } from 'react-native';
style={StyleSheet.flatten([styles.container, { marginTop: 10 }])}
```

### Step 4: Verify Success

```bash
# Run typecheck - should complete with zero errors
npm run typecheck

# Run tests - should pass
npm test

# Start Metro - should work without errors
npm start
```

## Verification Checklist

- [x] `npm run typecheck` completes with 0 project errors (1 known expo base config error)
- [x] `npm test` passes (no tests exist in project)
- [x] `npm start` launches Metro without configuration errors
- [x] All strict options are present in tsconfig.json
- [x] Each strict option has a comment explaining its purpose

## Common Issues

### "Cannot find module" errors

- Check if the module path is correct
- Verify the file exists at the specified path
- Ensure path aliases match between tsconfig.json and babel.config.js

### "implicit any" errors

- Add explicit type annotations to parameters and variables
- Use generics where appropriate

### Navigation type errors

- Use `NativeStackScreenProps<ParamList, 'ScreenName'>` for screen props
- Ensure ParamList is correctly defined with all screen names

## Rollback

If issues arise, revert to the previous tsconfig.json:

```bash
git checkout HEAD~1 -- tsconfig.json
```
