# Data Model: TypeScript Strict Configuration Setup

**Feature**: 007-typescript-strict-setup
**Date**: 2026-02-03

## Overview

This feature is a configuration-only change with no runtime data structures. The "entities" below describe the configuration schema and file structures affected.

---

## Configuration Entities

### TSConfig Schema

The primary entity is the TypeScript compiler configuration:

```typescript
interface TSConfigCompilerOptions {
  // Module System
  module: "ESNext" | "ES2022" | "CommonJS";
  moduleResolution: "bundler" | "node" | "node16";
  isolatedModules: boolean;

  // Strict Type Checking (enabled by strict: true)
  strict: true;

  // Additional Strict Options
  noUncheckedIndexedAccess: boolean;
  noImplicitReturns: boolean;
  noFallthroughCasesInSwitch: boolean;
  exactOptionalPropertyTypes: boolean;
  noImplicitOverride: boolean;
  noPropertyAccessFromIndexSignature: boolean;

  // Code Quality
  forceConsistentCasingInFileNames: boolean;
  allowUnusedLabels: boolean;
  allowUnreachableCode: boolean;

  // Build Configuration
  noEmit: boolean;
  skipLibCheck: boolean;
  esModuleInterop: boolean;
  resolveJsonModule: boolean;

  // JSX
  jsx: "react-jsx" | "react-native" | "react";

  // Path Mapping
  baseUrl: string;
  paths: Record<string, string[]>;
}

interface TSConfig {
  extends: string;
  compilerOptions: TSConfigCompilerOptions;
  include: string[];
  exclude: string[];
}
```

### Files Affected

| File | Type | Change |
|------|------|--------|
| `tsconfig.json` | Configuration | Add strict options, override module setting |
| `core/errors/sentry.ts` | Source | Fix Sentry type mismatch |
| `core/navigation/MainNavigator.tsx` | Source | Fix navigation prop types |
| `core/navigation/RootNavigator.tsx` | Source | Fix navigation prop types |
| `modules/admin/screens/UserDetailScreen.tsx` | Source | Fix style array type |
| `scripts/build/cli.ts` | Source | Add missing types, fix imports |
| `scripts/build/utils/asset-config.ts` | Source | Fix missing module import |
| `scripts/build/utils/validation.ts` | Source | Fix ZodError property access |
| `scripts/build/validate-assets.ts` | Source | Fix missing module import |

---

## State Transitions

N/A - This feature does not involve state management. It is a compile-time configuration.

---

## Validation Rules

### TSConfig Validation

1. `strict` MUST be `true`
2. `module` MUST be a valid TypeScript 5.3.3 module option (NOT "preserve")
3. `isolatedModules` MUST be `true` for Metro bundler compatibility
4. All additional strict options MUST be enabled as specified in requirements

### Type Error Validation

After configuration update, `npm run typecheck` MUST complete with zero errors.
