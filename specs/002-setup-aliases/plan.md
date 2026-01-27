# Implementation Plan: Setting up Path Aliases

**Branch**: `002-setup-aliases` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-setup-aliases/spec.md`

## Summary

Configure path aliases (`@app/*`, `@modules/*`, `@shared/*`, `@core/*`, `@assets/*`) for the Expo/React Native project and refactor all existing relative imports to use these aliases. The configuration is already partially complete (tsconfig.json and babel.config.js), but the codebase still uses relative imports that need to be migrated.

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode)
**Primary Dependencies**: Expo SDK 54, React Native 0.81.5, babel-preset-expo, babel-plugin-module-resolver
**Storage**: N/A
**Testing**: Jest with React Native Testing Library
**Target Platform**: iOS and Android (React Native/Expo)
**Project Type**: Mobile (React Native)
**Performance Goals**: N/A (configuration change, no runtime impact)
**Constraints**: Aliases must work in both development (Metro bundler with hot reload) and production builds
**Scale/Scope**: ~70+ TypeScript files with relative imports to refactor

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Aliases support modular architecture by making cross-module imports cleaner |
| II. Clear Folder Structure | ✅ PASS | Aliases map to documented folders: `app/`, `modules/`, `shared/`, `core/`, `assets/` |
| III. Separation of Concerns | ✅ PASS | No impact on architecture, only import syntax |
| IV. Strong TypeScript Typing | ✅ PASS | TypeScript paths configured in tsconfig.json |
| V. Externalized Configuration | ✅ PASS | Aliases defined in config files (tsconfig.json, babel.config.js) |
| VI. White-label & Multi-tenant | ✅ PASS | Aliases are brand/tenant agnostic |
| VII. Expo Prebuild Workflow | ✅ PASS | Uses babel-plugin-module-resolver compatible with Expo |

**Gate Result**: ✅ PASSED - No violations

## Project Structure

### Documentation (this feature)

```text
specs/002-setup-aliases/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no data model)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
# React Native / Expo project structure (Mobile)
app/                     # @app/* - Application entry, bootstrap, providers
├── App.tsx
├── bootstrap.ts
└── providers/

modules/                 # @modules/* - Feature-based, domain-driven modules
├── auth/
├── profile/
├── settings/
├── admin/
└── tenant/

shared/                  # @shared/* - Reusable UI components, hooks, utilities
└── components/

core/                    # @core/* - Core infrastructure
├── api/
├── config/
├── errors/
├── hooks/
├── i18n/
├── logging/
├── navigation/
├── permissions/
├── storage/
├── store/
├── theme/
├── types/
└── utils/

assets/                  # @assets/* - Brand-specific assets
├── fonts/
├── images/
└── icons/

# Configuration files affected
tsconfig.json            # TypeScript path mapping (already configured)
babel.config.js          # Runtime resolution (already configured)
```

**Structure Decision**: Mobile application with Expo/React Native. Uses constitution-defined folder structure with 5 alias mappings.

## Complexity Tracking

> No violations to justify - feature aligns with all constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Current State Analysis

### Configuration Status

| File | Status | Notes |
|------|--------|-------|
| tsconfig.json | ✅ Complete | Paths configured for all 5 aliases |
| babel.config.js | ✅ Complete | module-resolver configured with aliases |
| package.json | ✅ Complete | babel-plugin-module-resolver installed |

### Import Migration Status

| Directory | Files to Refactor | Import Pattern |
|-----------|-------------------|----------------|
| app/ | 4 files | `../core/*`, `../shared/*` → `@core/*`, `@shared/*` |
| modules/ | ~30 files | `../../../core/*`, `../../../shared/*`, `../../{module}/*` |
| shared/ | ~8 files | `../../../core/*`, `../Loading/*`, etc. |
| core/ | ~20 files | `../types`, `../../modules/*`, `../../shared/*`, `../../app/*` |

### Import Categories to Refactor

1. **Cross-directory imports** (MUST use aliases):
   - `modules/` → `core/` (e.g., `../../../core/theme` → `@core/theme`)
   - `modules/` → `shared/` (e.g., `../../../shared/components` → `@shared/components`)
   - `app/` → `core/` (e.g., `../core/navigation` → `@core/navigation`)
   - `app/` → `shared/` (e.g., `../shared/components` → `@shared/components`)
   - `core/` → `modules/` (e.g., `../../modules/auth` → `@modules/auth`)
   - `core/` → `shared/` (e.g., `../../shared/components` → `@shared/components`)
   - `core/` → `app/` (e.g., `../../app/providers` → `@app/providers`)
   - `shared/` → `core/` (e.g., `../../../core/theme` → `@core/theme`)

2. **Intra-directory imports** (keep as relative):
   - Within same module (e.g., `./services/authService`, `../types`)
   - These remain relative for module encapsulation

## Implementation Approach

### Phase 1: Verify Configuration
1. Verify tsconfig.json paths are correct
2. Verify babel.config.js module-resolver is correct
3. Test alias resolution works (create test import)

### Phase 2: Refactor Imports by Directory
1. Refactor `app/` directory imports
2. Refactor `modules/` directory imports (by module)
3. Refactor `shared/` directory imports
4. Refactor `core/` directory imports

### Phase 3: Validation
1. Run TypeScript compilation (`npm run typecheck`)
2. Run ESLint (`npm run lint`)
3. Run tests (`npm test`)
4. Start development server and verify hot reload
5. Build for iOS/Android and verify

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Broken imports | TypeScript compiler will catch unresolved modules |
| Metro cache issues | Clear cache with `npx expo start --clear` |
| IDE not recognizing aliases | Restart TypeScript server in VSCode |
| Hot reload issues | Test with `--clear` flag first |
