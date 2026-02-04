# Tasks: ESLint Strict Configuration

**Input**: Design documents from `/specs/008-eslint-strict-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Configuration files**: `eslint.config.js`, `package.json` at repository root
- **Source directories**: `app/`, `modules/`, `shared/`, `core/`, `scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies and prepare for configuration changes

- [x] T001 [P] Install eslint-plugin-security dev dependency in package.json
- [x] T002 [P] Install eslint-plugin-react-native-a11y dev dependency in package.json
- [x] T003 [P] Install eslint-config-prettier dev dependency in package.json
- [x] T004 Create backup of current eslint.config.js as eslint.config.backup.js
- [x] T005 Run `npm install` to install all new dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core ESLint configuration structure that MUST be complete before rule categories can be added

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Convert eslint.config.js to use typescript-eslint's config helper for type-safe configuration
- [x] T007 Enable type-aware linting by adding `parserOptions.projectService: true` to TypeScript config block in eslint.config.js
- [x] T008 Update ignore patterns to include `*.generated.ts` and `*.d.ts` in eslint.config.js
- [x] T009 Add eslint-config-prettier as the LAST item in config array in eslint.config.js (Prettier integration)
- [x] T010 Verify base configuration works by running `npm run lint` (expect existing rules to pass)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Developer Receives Immediate Feedback (Priority: P1) 🎯 MVP

**Goal**: Enable strict type safety, security, hooks, and React Native structural rules that catch bugs early

**Independent Test**: Run `npm run lint` on code with type errors, unused variables, missing hook dependencies, and security issues - all should be flagged as errors

### Implementation for User Story 1

- [x] T011 [US1] Replace `tseslint.configs.recommended` with `tseslint.configs.strictTypeChecked` in eslint.config.js
- [x] T012 [US1] Add `tseslint.configs.stylisticTypeChecked` to config array in eslint.config.js
- [x] T013 [US1] Configure `@typescript-eslint/explicit-function-return-type` as error for exported functions in eslint.config.js
- [x] T014 [US1] Upgrade `react-hooks/exhaustive-deps` from warn to error in eslint.config.js
- [x] T015 [US1] Add eslint-plugin-security configuration block with detect-eval-with-expression as error in eslint.config.js
- [x] T016 [US1] Configure security/detect-non-literal-regexp and security/detect-object-injection as warn in eslint.config.js
- [x] T017 [US1] Upgrade `react-native/no-inline-styles` from warn to error in eslint.config.js
- [x] T018 [US1] Add `react-native/no-unused-styles` as error in eslint.config.js
- [x] T019 [US1] Add `react-native/no-single-element-style-arrays` as error in eslint.config.js
- [x] T020 [US1] Add `react-native/split-platform-components` as error in eslint.config.js
- [x] T021 [US1] Configure `react-native/no-raw-text` as error in eslint.config.js
- [x] T022 [US1] Add eslint-plugin-react-native-a11y configuration block in eslint.config.js
- [x] T023 [US1] Configure `react-native-a11y/has-accessibility-props` as error in eslint.config.js
- [x] T024 [US1] Configure `react-native-a11y/has-valid-accessibility-role` as error in eslint.config.js
- [x] T025 [US1] Configure `react-native-a11y/has-valid-accessibility-state` as error in eslint.config.js
- [x] T026 [US1] Configure `react-native-a11y/no-nested-touchables` as error in eslint.config.js
- [x] T027 [US1] Run `npm run lint` to identify all new violations (document count for clean slate tracking)

**Checkpoint**: Type safety, security, hooks, a11y, and RN structural rules now catch issues as errors

---

## Phase 4: User Story 2 - Consistent Code Style (Priority: P2)

**Goal**: Enable naming conventions and complexity rules that enforce team-wide consistency

**Independent Test**: Run `npm run lint` on code with non-standard naming (e.g., `my_variable` instead of `myVariable`) and overly complex functions - naming should error, complexity should warn

### Implementation for User Story 2

- [x] T028 [US2] Add `@typescript-eslint/naming-convention` rule with default camelCase selector in eslint.config.js
- [x] T029 [US2] Configure variable selector to allow camelCase and UPPER_CASE in naming-convention rule in eslint.config.js
- [x] T030 [US2] Configure function selector to allow camelCase and PascalCase in naming-convention rule in eslint.config.js
- [x] T031 [US2] Configure typeLike selector to require PascalCase in naming-convention rule in eslint.config.js
- [x] T032 [US2] Configure parameter selector with leadingUnderscore allowed in naming-convention rule in eslint.config.js
- [x] T033 [US2] Add `complexity` rule with max: 10 as warn in eslint.config.js
- [x] T034 [US2] Add `max-lines-per-function` rule with max: 50, skipBlankLines: true, skipComments: true as warn in eslint.config.js
- [x] T035 [US2] Add `max-depth` rule with max: 3 as warn in eslint.config.js
- [x] T036 [US2] Add `max-params` rule with max: 4 as warn in eslint.config.js
- [x] T037 [US2] Add `max-nested-callbacks` rule with max: 3 as warn in eslint.config.js
- [x] T038 [US2] Configure `react-native/no-color-literals` as warn in eslint.config.js
- [x] T039 [US2] Configure `react-native-a11y/has-accessibility-hint` as warn in eslint.config.js
- [x] T040 [US2] Run `npm run lint` to verify naming and complexity rules trigger appropriately

**Checkpoint**: Naming conventions and complexity rules now enforce team consistency

---

## Phase 5: User Story 3 - Fix Issues Efficiently (Priority: P3)

**Goal**: Ensure auto-fix works correctly and error messages are clear

**Independent Test**: Run `npm run lint:fix` and verify fixable issues are automatically corrected

### Implementation for User Story 3

- [x] T041 [US3] Verify `npm run lint:fix` command exists in package.json scripts
- [x] T042 [US3] Test auto-fix on import ordering violations using `npm run lint:fix`
- [x] T043 [US3] Test auto-fix on simple TypeScript violations using `npm run lint:fix`
- [x] T044 [US3] Document which rules are auto-fixable vs manual-fix in specs/008-eslint-strict-config/quickstart.md
- [x] T045 [US3] Add troubleshooting section for common errors to specs/008-eslint-strict-config/quickstart.md

**Checkpoint**: Auto-fix works and developers have clear guidance for manual fixes

---

## Phase 6: User Story 4 - CI Pipeline Quality Gates (Priority: P4)

**Goal**: Ensure ESLint integrates properly with CI and returns correct exit codes

**Independent Test**: Run `npm run lint` on clean code (exit 0) and code with errors (exit 1) to verify CI behavior

### Implementation for User Story 4

- [x] T046 [US4] Verify `npm run lint` returns exit code 0 when no errors exist
- [x] T047 [US4] Verify `npm run lint` returns exit code 1 when errors exist (type safety, security, hooks)
- [x] T048 [US4] Verify warnings (complexity, naming) do NOT cause non-zero exit code
- [x] T049 [US4] Run full lint to measure performance: must complete within 30 seconds locally
- [x] T050 [US4] Document expected CI behavior in specs/008-eslint-strict-config/quickstart.md

**Checkpoint**: CI integration verified - errors block, warnings pass

---

## Phase 7: Clean Slate - Fix All Existing Violations

**Purpose**: Fix all existing code violations to achieve clean slate (per spec clarification)

**⚠️ CRITICAL**: Must complete before considering feature done

- [x] T051 Run `npm run lint` and capture full violation report
- [x] T052 [P] Fix type safety violations in app/ directory
- [x] T053 [P] Fix type safety violations in modules/ directory
- [x] T054 [P] Fix type safety violations in shared/ directory
- [x] T055 [P] Fix type safety violations in core/ directory
- [x] T056 [P] Fix React hooks violations (exhaustive-deps) across all directories
- [x] T057 [P] Fix React Native violations (inline styles, unused styles) across all directories
- [x] T058 [P] Fix accessibility violations across all directories
- [x] T059 [P] Fix naming convention violations across all directories
- [x] T060 Run `npm run lint` to verify zero errors (warnings acceptable)

**Checkpoint**: Clean slate achieved - all code passes strict linting

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and validation

- [x] T061 [P] Update CLAUDE.md with new ESLint configuration details
- [x] T062 [P] Add rule severity reference table to specs/008-eslint-strict-config/quickstart.md
- [x] T063 Verify Prettier integration: run `npm run format` then `npm run lint` - zero conflicts expected
- [x] T064 Run final performance benchmark: full lint must complete within 30 seconds
- [x] T065 Delete eslint.config.backup.js after confirming new config works
- [x] T066 Run `npm test && npm run lint` to verify full CI command passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - US1 → US2 → US3 → US4 (sequential recommended due to eslint.config.js changes)
- **Clean Slate (Phase 7)**: Depends on all rule configurations being complete (Phases 3-6)
- **Polish (Phase 8)**: Depends on Clean Slate completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Core rule categories
- **User Story 2 (P2)**: Can start after US1 - Adds naming/complexity rules to same file
- **User Story 3 (P3)**: Can start after US2 - Tests auto-fix on configured rules
- **User Story 4 (P4)**: Can start after US3 - Tests CI integration on complete config

### Within Each User Story

- Configuration rules in eslint.config.js should be added in logical groups
- Run lint after each group to verify no conflicts
- All changes are to the same file (eslint.config.js) - sequential within story

### Parallel Opportunities

- **Phase 1**: T001, T002, T003 can run in parallel (different npm commands)
- **Phase 7**: T052, T053, T054, T055 can run in parallel (different directories)
- **Phase 7**: T056, T057, T058, T059 can run in parallel (different fix categories)
- **Phase 8**: T061, T062 can run in parallel (different files)

---

## Parallel Example: Phase 7 Clean Slate Fixes

```bash
# Launch directory fixes in parallel:
Task: "Fix type safety violations in app/ directory"
Task: "Fix type safety violations in modules/ directory"
Task: "Fix type safety violations in shared/ directory"
Task: "Fix type safety violations in core/ directory"

# Then launch category fixes in parallel:
Task: "Fix React hooks violations across all directories"
Task: "Fix React Native violations across all directories"
Task: "Fix accessibility violations across all directories"
Task: "Fix naming convention violations across all directories"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (5 tasks)
2. Complete Phase 2: Foundational (5 tasks)
3. Complete Phase 3: User Story 1 (17 tasks)
4. **STOP and VALIDATE**: Verify type safety and security rules catch issues
5. Partial clean slate: Fix only type safety and security violations

### Incremental Delivery

1. Setup + Foundational → Base config ready
2. Add US1 (type safety, security, hooks, a11y, RN) → Core protection active
3. Add US2 (naming, complexity) → Team consistency enforced
4. Add US3 (auto-fix verification) → Developer productivity validated
5. Add US4 (CI integration) → Pipeline integration verified
6. Clean Slate → All violations fixed
7. Polish → Documentation complete

### Recommended Execution Order

Since all configuration changes are to `eslint.config.js`, sequential execution is recommended:

1. **Day 1**: Phases 1-2 (Setup + Foundation) + US1 core rules
2. **Day 2**: US1 completion + US2 (naming/complexity)
3. **Day 3**: US3 + US4 (auto-fix + CI verification)
4. **Day 4**: Phase 7 (Clean slate fixes)
5. **Day 5**: Phase 8 (Polish + final validation)

---

## Notes

- All config changes are to `eslint.config.js` - avoid concurrent edits
- Run `npm run lint` after each task group to catch conflicts early
- Prettier config MUST remain last in the config array
- Clean slate (Phase 7) is mandatory - no legacy violations permitted
- Warnings don't block CI but should be addressed over time
