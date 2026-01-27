# Tasks: Setting up Path Aliases

**Input**: Design documents from `/specs/002-setup-aliases/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Not requested in this specification. Only configuration verification tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a configuration-only feature. Files modified:
- `babel.config.js` - Babel configuration
- `package.json` - Dependencies
- `tsconfig.json` - Already configured (no changes needed)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install required dependency for runtime alias resolution

- [x] T001 Install babel-plugin-module-resolver as dev dependency via `yarn add -D babel-plugin-module-resolver`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure Babel with module-resolver plugin - MUST be complete before aliases work at runtime

**⚠️ CRITICAL**: No alias imports will work until this phase is complete

- [x] T002 Update babel.config.js with module-resolver plugin configuration at babel.config.js
- [x] T003 Clear Metro cache by running `npx expo start --clear`

**Checkpoint**: Foundation ready - aliases now resolve at runtime

---

## Phase 3: User Story 1 - Import with Aliases (Priority: P1) 🎯 MVP

**Goal**: Enable clean import paths (@app, @modules, @shared, @core, @assets) to work at both compile-time and runtime

**Independent Test**: Create a test import using `@shared/` alias and verify app builds and runs successfully

### Implementation for User Story 1

- [x] T004 [US1] Verify tsconfig.json paths configuration is correct at tsconfig.json
- [x] T005 [US1] Create a test file using aliased import to verify resolution at any existing component file
- [x] T006 [US1] Verify development build works with aliased imports via `npx expo start`
- [x] T007 [US1] Verify iOS build works with aliased imports via `npx expo run:ios`
- [x] T008 [US1] Verify Android build works with aliased imports via `npx expo run:android`
- [x] T009 [US1] Verify hot reload works when modifying files with aliased imports

**Checkpoint**: User Story 1 complete - all 5 alias prefixes resolve correctly at runtime

---

## Phase 4: User Story 2 - IDE Support for Aliases (Priority: P2)

**Goal**: Ensure VS Code provides autocomplete and "Go to Definition" for aliased imports

**Independent Test**: Type `@shared/` in IDE and verify autocomplete suggestions appear; Cmd+Click navigates to source

### Implementation for User Story 2

- [x] T010 [US2] Restart VS Code TypeScript server to pick up tsconfig.json paths
- [x] T011 [US2] Verify autocomplete works by typing `import { } from '@shared/'` in any .tsx file
- [x] T012 [US2] Verify "Go to Definition" (Cmd+Click) navigates to correct source file
- [x] T013 [US2] Verify TypeScript shows error for invalid aliased import paths

**Checkpoint**: User Story 2 complete - IDE fully supports aliased imports

---

## Phase 5: User Story 3 - Consistent Configuration (Priority: P3)

**Goal**: Document alias configuration to enable easy maintenance and future alias additions

**Independent Test**: Add a new alias and verify it works across TypeScript, Babel, and IDE

### Implementation for User Story 3

- [x] T014 [US3] Document alias mapping in a comment block at top of babel.config.js
- [x] T015 [US3] Verify alias definitions match between tsconfig.json and babel.config.js

**Checkpoint**: User Story 3 complete - configuration is documented and consistent

---

## Phase 6: User Story 4 - Refactor Existing Code to Use Aliases (Priority: P1)

**Goal**: Update all existing relative imports in the codebase to use path aliases for consistency

**Independent Test**: Search for `../../` patterns and verify no cross-directory imports remain

### Implementation for User Story 4

- [x] T017 [US4] Refactor app/ directory imports to use aliases (4 files)
- [x] T018 [US4] Refactor modules/ directory imports to use aliases (~30 files)
- [x] T019 [US4] Refactor shared/ directory imports to use aliases (~8 files)
- [x] T020 [US4] Refactor core/ directory imports to use aliases (~10 files)
- [x] T021 [US4] Verify no deep relative imports (`../../` or deeper) exist for aliasable paths

**Checkpoint**: User Story 4 complete - all cross-directory imports use aliases

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T022 Run full quickstart.md validation checklist
- [x] T023 Run TypeScript check to verify alias resolution

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 2 and 3 can proceed in parallel after US1 verification
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 verification - IDE support depends on TypeScript config being correct
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Documentation can happen anytime after config is complete

### Within Each User Story

- Verification tasks should be sequential (build → iOS → Android → hot reload)
- Documentation tasks can run in parallel with verification

### Parallel Opportunities

- T007 and T008 (iOS and Android builds) can run in parallel after T006
- T011, T012, T013 (IDE verification tasks) can run in parallel
- User Stories 2 and 3 can run in parallel after User Story 1 is verified

---

## Parallel Example: User Story 1 Build Verification

```bash
# After T006 (dev build) passes, launch platform builds in parallel:
Task: "Verify iOS build works with aliased imports via npx expo run:ios"
Task: "Verify Android build works with aliased imports via npx expo run:android"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: User Story 1 (T004-T009)
4. **STOP and VALIDATE**: Test aliases work in dev and production builds
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Runtime resolution ready
2. Add User Story 1 → Verify builds → MVP complete!
3. Add User Story 2 → Verify IDE support → Enhanced DX
4. Add User Story 3 → Document configuration → Maintainability

### Single Developer Strategy

This is a small configuration feature ideal for a single developer:
1. Complete all phases sequentially
2. Estimated effort: minimal (configuration changes only)

---

## Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Setup | 1 | Install dependency |
| Foundational | 2 | Configure Babel |
| User Story 1 | 6 | Runtime alias resolution |
| User Story 2 | 4 | IDE support verification |
| User Story 3 | 2 | Documentation |
| User Story 4 | 5 | Refactor existing imports |
| Polish | 2 | Final validation |
| **Total** | **22** | |

---

## Notes

- This is a configuration-only feature with no new code files
- All alias prefixes (@app, @modules, @shared, @core, @assets) are configured identically
- TypeScript paths in tsconfig.json are already configured (verified in research)
- Only babel.config.js needs modification for runtime resolution
- Clear Metro cache after any config changes to avoid stale cache issues
