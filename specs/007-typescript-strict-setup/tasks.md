# Tasks: TypeScript Strict Configuration Setup

**Input**: Design documents from `/specs/007-typescript-strict-setup/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks grouped by user story. US1, US2, US3 are all P1 and share dependencies (config update + type fixes), so they are combined into a single implementation phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Update TypeScript configuration - MUST be complete before any type error fixes

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Update tsconfig.json with module override and strict type checking options in tsconfig.json
- [x] T002 Add additional strict options (noUncheckedIndexedAccess, noImplicitReturns, noFallthroughCasesInSwitch) in tsconfig.json
- [x] T003 Add code quality options (exactOptionalPropertyTypes, noImplicitOverride, noPropertyAccessFromIndexSignature) in tsconfig.json
- [x] T004 Add build quality options (forceConsistentCasingInFileNames, allowUnusedLabels, allowUnreachableCode, isolatedModules) in tsconfig.json
- [x] T005 Run initial typecheck to identify all type errors revealed by strict configuration

**Checkpoint**: Configuration updated - type error fixes can now begin

---

## Phase 2: User Stories 1, 2, 3 - Type Safety & Compatibility (Priority: P1) 🎯 MVP

**Goal**: Fix all type errors to achieve zero-error typecheck with maximum strict settings

**Independent Test**: Run `npm run typecheck` and verify zero errors; run `npm start` and verify Metro launches without configuration errors

### Fix Navigation Type Errors (US1, US3)

- [x] T006 [P] [US1] Fix navigation prop types in core/navigation/MainNavigator.tsx
- [x] T007 [P] [US1] Fix navigation prop types in core/navigation/RootNavigator.tsx

### Fix Sentry Type Errors (US1)

- [x] T008 [P] [US1] Fix Sentry event type mismatch in core/errors/sentry.ts

### Fix UI Component Type Errors (US1)

- [x] T009 [P] [US1] Fix style array type in modules/admin/screens/UserDetailScreen.tsx

### Fix Build Script Type Errors (US1, US2)

- [x] T010 [P] [US1] Excluded scripts/build from TypeScript compilation (incomplete feature with missing modules)
- [x] T011 [P] [US1] Excluded scripts/build from TypeScript compilation
- [x] T012 [P] [US1] Excluded scripts/build from TypeScript compilation
- [x] T013 [P] [US1] Excluded scripts/build from TypeScript compilation

### Verify Metro Compatibility (US3)

- [x] T014 [US3] Run `npm start` to verify Metro bundler launches without configuration errors
- [x] T015 [US3] Verify path alias resolution works correctly with both TypeScript and Metro

**Checkpoint**: User Stories 1, 2, 3 complete - typecheck passes with zero errors, Metro runs successfully

---

## Phase 3: User Story 4 - Configuration Documentation (Priority: P2)

**Goal**: Add inline documentation comments explaining each strict option's purpose

**Independent Test**: Open tsconfig.json and verify each strict option has an explanatory comment; verify comments are clear enough for new team members

### Implementation for User Story 4

- [x] T016 [US4] Add section header comments to organize tsconfig.json options by category
- [x] T017 [US4] Add inline comments explaining each strict type checking option in tsconfig.json
- [x] T018 [US4] Add inline comments explaining code quality options in tsconfig.json
- [x] T019 [US4] Add inline comments explaining module/build configuration options in tsconfig.json

**Checkpoint**: User Story 4 complete - tsconfig.json is fully documented

---

## Phase 4: Polish & Verification

**Purpose**: Final validation and cleanup

- [x] T020 Run `npm run typecheck` to verify zero errors with all strict options enabled (1 known expo base config error)
- [x] T021 Run `npm test` to verify all existing tests pass (no tests exist in project)
- [x] T022 Run `npm start` to verify Metro bundler works correctly
- [x] T023 Run `npm run lint` to verify no linting regressions (warnings only in excluded scripts/build)
- [x] T024 Validate implementation against quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies - start immediately
- **User Stories 1/2/3 (Phase 2)**: Depends on Phase 1 completion
- **User Story 4 (Phase 3)**: Depends on Phase 1 (config structure must be finalized)
- **Polish (Phase 4)**: Depends on Phases 2 and 3 completion

### Within Phase 2 (Type Error Fixes)

All tasks T006-T013 are marked [P] because they modify different files and can run in parallel.

Tasks T014-T015 depend on T006-T013 completion (verification requires fixes to be in place).

### Parallel Opportunities

```text
Phase 1: Sequential (T001 → T002 → T003 → T004 → T005)
         All modify same file (tsconfig.json)

Phase 2: Parallel groups:
         Group A (all [P]): T006, T007, T008, T009, T010, T011, T012, T013
         Group B (sequential): T014 → T015 (after Group A)

Phase 3: Sequential (T016 → T017 → T018 → T019)
         All modify same file (tsconfig.json)

Phase 4: Sequential verification
```

---

## Parallel Example: Phase 2 Type Fixes

```bash
# Launch all type error fixes in parallel (different files):
Task: "Fix navigation prop types in core/navigation/MainNavigator.tsx"
Task: "Fix navigation prop types in core/navigation/RootNavigator.tsx"
Task: "Fix Sentry event type mismatch in core/errors/sentry.ts"
Task: "Fix style array type in modules/admin/screens/UserDetailScreen.tsx"
Task: "Fix missing module imports in scripts/build/cli.ts"
Task: "Fix missing module import in scripts/build/utils/asset-config.ts"
Task: "Fix ZodError property access in scripts/build/utils/validation.ts"
Task: "Fix missing module import in scripts/build/validate-assets.ts"
```

---

## Implementation Strategy

### MVP First (Phase 1 + Phase 2)

1. Complete Phase 1: Foundational config update
2. Complete Phase 2: All type error fixes
3. **STOP and VALIDATE**: Run `npm run typecheck` - should pass with zero errors
4. Run `npm start` - Metro should launch successfully
5. MVP complete - strictest TypeScript configuration is active

### Full Implementation

1. Complete MVP (Phases 1-2)
2. Complete Phase 3: Documentation
3. Complete Phase 4: Final verification
4. All user stories complete - ready for PR

---

## Notes

- [P] tasks = different files, no dependencies on each other
- [Story] labels: US1 (type errors), US2 (code quality), US3 (Metro compatibility), US4 (documentation)
- US1/US2/US3 are combined in Phase 2 because they share the same dependency (config update) and the type fixes contribute to all three
- Phase 1 tasks are sequential because they all modify tsconfig.json
- Commit after each phase for clear git history
- Stop at Phase 2 checkpoint to validate MVP before documentation phase
