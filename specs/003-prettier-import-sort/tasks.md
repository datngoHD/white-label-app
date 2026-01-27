# Tasks: Prettier Import Sorting

**Input**: Design documents from `/specs/003-prettier-import-sort/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Not explicitly requested - verification tasks included instead.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Plugin Installation)

**Purpose**: Install the Prettier import sorting plugin

- [x] T001 Install @ianvs/prettier-plugin-sort-imports via `yarn add -D @ianvs/prettier-plugin-sort-imports`

---

## Phase 2: Foundational (Base Configuration)

**Purpose**: Configure Prettier with import sorting rules that enable all user stories

**⚠️ CRITICAL**: User story implementation cannot be verified until this phase is complete

- [x] T002 Update .prettierrc to add plugin to plugins array
- [x] T003 Configure importOrder array with React/RN group pattern `^react(-native)?$` in .prettierrc
- [x] T004 Configure importOrder with React Native ecosystem pattern `^react-native-.*$` in .prettierrc
- [x] T005 Configure importOrder with Expo packages pattern `^expo.*$` in .prettierrc
- [x] T006 Configure importOrder with third-party modules placeholder `<THIRD_PARTY_MODULES>` in .prettierrc
- [x] T007 Configure importOrder with internal aliases pattern `^@(app|modules|shared|core|assets)/(.*)$` in .prettierrc
- [x] T008 Configure importOrder with relative imports pattern `^[./]` in .prettierrc
- [x] T009 Add empty strings between import groups for blank line separation in .prettierrc
- [x] T010 Configure importOrderParserPlugins with `["typescript", "jsx"]` in .prettierrc
- [x] T011 Configure importOrderTypeScriptVersion to `"5.3.3"` in .prettierrc

**Checkpoint**: Configuration complete - Prettier plugin is now active with import sorting rules

---

## Phase 3: User Story 1 - Automatic Import Sorting on Save (Priority: P1) 🎯 MVP

**Goal**: Developers can save files and have imports automatically sorted without manual intervention

**Independent Test**: Save a file with unsorted imports and verify imports are reorganized into correct groups with alphabetical ordering

### Verification for User Story 1

- [x] T012 [US1] Create a test file with unsorted imports at src/**tests**/import-sort-test.tsx (temporary)
- [x] T013 [US1] Run `npx prettier --write src/__tests__/import-sort-test.tsx` and verify imports are sorted
- [x] T014 [US1] Verify React/RN imports appear first after side-effects
- [x] T015 [US1] Verify third-party imports appear after React/RN group
- [x] T016 [US1] Verify internal alias imports (@app/, @modules/, etc.) appear after third-party
- [x] T017 [US1] Verify relative imports appear last
- [x] T018 [US1] Verify blank lines separate each import group
- [x] T019 [US1] Verify alphabetical sorting within each group
- [x] T020 [US1] Verify type imports stay with their source group (e.g., `import type` from react stays in React group)
- [x] T021 [US1] Delete temporary test file src/**tests**/import-sort-test.tsx

**Checkpoint**: User Story 1 complete - Automatic import sorting works on file save

---

## Phase 4: User Story 2 - Consistent Import Order Across Team (Priority: P2)

**Goal**: All developers produce identical import ordering when formatting the same file content

**Independent Test**: Have the configuration committed to version control so all team members use the same rules

### Implementation for User Story 2

- [x] T022 [US2] Verify .prettierrc changes are tracked by git via `git status`
- [x] T023 [US2] Stage .prettierrc for commit via `git add .prettierrc`
- [x] T024 [US2] Stage package.json for commit via `git add package.json`
- [x] T025 [US2] Stage yarn.lock for commit via `git add yarn.lock`

**Checkpoint**: User Story 2 complete - Configuration is ready to be shared via version control

---

## Phase 5: User Story 3 - Command Line Formatting (Priority: P3)

**Goal**: Developers can format imports via CLI for CI/CD integration and pre-commit hooks

**Independent Test**: Run `yarn format` and `npx prettier --check .` from command line

### Verification for User Story 3

- [x] T026 [US3] Run `yarn format` and verify it completes without errors
- [x] T027 [US3] Run `npx prettier --check .` and verify it reports formatting status
- [x] T028 [US3] Verify `yarn format` sorts imports in all TypeScript files
- [x] T029 [US3] Verify `yarn format` sorts imports in all JavaScript files (if any exist)

**Checkpoint**: User Story 3 complete - CLI formatting works for CI/CD integration

---

## Phase 6: Migration & Polish

**Purpose**: Migrate all existing files and finalize documentation

### Codebase Migration (FR-010)

- [ ] T030 Run `yarn format` to reformat all existing source files with sorted imports
- [ ] T031 Review git diff to verify import changes look correct across the codebase
- [ ] T032 Stage all reformatted files via `git add -A`

### Documentation

- [ ] T033 [P] Verify quickstart.md matches final configuration in specs/003-prettier-import-sort/quickstart.md
- [ ] T034 [P] Add ESLint alignment note to project documentation if eslint-plugin-import is added later

### Final Commit

- [ ] T035 Create commit with message "feat(tooling): Add Prettier import sorting plugin with codebase migration"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Migration & Polish (Phase 6)**: Depends on all user stories being verified

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each Phase

- Foundational tasks T002-T011 should be executed sequentially (all modify same file)
- Verification tasks within US1 should be sequential (build on each other)
- US2 tasks should be sequential (git staging order)
- US3 tasks should be sequential (verification order)

### Parallel Opportunities

- Once Foundational phase completes, US1/US2/US3 verification can run in parallel
- Documentation tasks T033 and T034 can run in parallel

---

## Parallel Example: After Foundational Phase

```bash
# These user story phases can be verified in parallel after Phase 2:
Phase 3: User Story 1 verification (T012-T021)
Phase 4: User Story 2 git staging (T022-T025)
Phase 5: User Story 3 CLI verification (T026-T029)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T011)
3. Complete Phase 3: User Story 1 (T012-T021)
4. **STOP and VALIDATE**: Imports sort correctly on save
5. Ready for team demo

### Incremental Delivery

1. Complete Setup + Foundational → Plugin configured
2. Verify User Story 1 → Auto-sort works → MVP!
3. Verify User Story 2 → Ready for team sharing
4. Verify User Story 3 → CI/CD ready
5. Run Migration → Codebase consistent
6. Commit → Feature complete

### Suggested MVP Scope

**User Story 1 only** - This delivers the core value of automatic import sorting on save. User Stories 2 and 3 are about team/CI integration which can be added incrementally.

---

## Notes

- All tasks modify or verify configuration files only (no application code changes)
- The .prettierrc file is modified by multiple tasks in Phase 2 - execute sequentially
- Migration (T030) will modify many files - review diff before committing
- Temporary test file (T012) should be deleted after verification (T021)
- Commit after Phase 6 completion with all changes bundled together
