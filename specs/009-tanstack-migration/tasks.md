# Tasks: TanStack Query Migration with Offline Support

**Input**: Design documents from `/specs/009-tanstack-migration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - test tasks omitted.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile (React Native/Expo)**: `app/`, `core/`, `modules/`, `shared/` at repository root
- Services layer preserved - no changes to `modules/*/services/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create base project structure for TanStack Query

- [x] T001 Install TanStack Query dependencies: `@tanstack/react-query`, `@tanstack/react-query-persist-client`, `@tanstack/query-async-storage-persister` in package.json
- [x] T002 Install query key factory: `@lukemorales/query-key-factory` in package.json
- [x] T003 Create core/query/ directory structure per plan.md
- [x] T004 [P] Create TypeScript types for query configuration in core/query/types.ts
- [x] T005 [P] Create configuration constants in core/query/config.ts (staleTime, gcTime, retry settings from contracts/config.ts)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TanStack Query infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement QueryClient with default options (staleTime: 5min, gcTime: 24hr, retry: 3) in core/query/queryClient.ts
- [x] T007 Implement AsyncStorage persister with throttling in core/query/persister.ts
- [x] T008 Integrate onlineManager with NetInfo in core/query/onlineManager.ts
- [x] T009 Create mutation defaults setup for offline persistence in core/query/mutationDefaults.ts
- [x] T010 Update AppProviders.tsx to include PersistQueryClientProvider in app/providers/AppProviders.tsx
- [x] T011 Add resumePausedMutations call in PersistQueryClientProvider onSuccess callback in app/providers/AppProviders.tsx

**Checkpoint**: Foundation ready - TanStack Query infrastructure operational, user story implementation can now begin

---

## Phase 3: User Story 1 - Seamless Data Fetching Experience (Priority: P1) 🎯 MVP

**Goal**: Migrate auth, profile, and tenant data fetching from Redux to TanStack Query while maintaining identical user experience and hook APIs.

**Independent Test**: Login, view profile, navigate app - all flows work identically to before migration.

### Query Key Factories

- [x] T012 [P] [US1] Create auth query key factory in modules/auth/queries/authQueryKeys.ts
- [x] T013 [P] [US1] Create profile query key factory in modules/profile/queries/profileQueryKeys.ts
- [x] T014 [P] [US1] Create tenant query key factory in modules/tenant/queries/tenantQueryKeys.ts

### Auth Module Migration

- [x] T015 [US1] Create useAuthQuery hook for session state in modules/auth/hooks/useAuthQuery.ts
- [x] T016 [US1] Create useAuthMutation hook for login/logout/register in modules/auth/hooks/useAuthMutation.ts
- [x] T017 [US1] Set mutation defaults for auth mutations (no offline queue) in core/query/mutationDefaults.ts
- [x] T018 [US1] Refactor useAuth.ts to use TanStack Query (maintain same public API) in modules/auth/hooks/useAuth.ts
- [x] T019 [US1] Update auth interceptor to work with TanStack Query for token refresh in core/api/interceptors/authInterceptor.ts

### Profile Module Migration

- [x] T020 [US1] Create useProfileQuery hook for profile data in modules/profile/hooks/useProfileQuery.ts
- [x] T021 [US1] Create useProfileMutation hook for profile updates in modules/profile/hooks/useProfileMutation.ts
- [x] T022 [US1] Set mutation defaults for profile mutations (enable offline queue) in core/query/mutationDefaults.ts
- [x] T023 [US1] Refactor useProfile.ts to use TanStack Query (maintain same public API) in modules/profile/hooks/useProfile.ts

### Tenant Module Migration

- [x] T024 [US1] Create useTenantQuery hook for tenant config in modules/tenant/hooks/useTenantQuery.ts
- [x] T025 [US1] Refactor useTenant.ts to use TanStack Query (maintain same public API) in modules/tenant/hooks/useTenant.ts

### Provider Updates

- [x] T026 [US1] Remove TenantProvider Redux dependency, use TanStack Query in app/providers/TenantProvider.tsx (if applicable)

**Checkpoint**: User Story 1 complete - all data fetching works via TanStack Query, Redux providers can be removed, login/profile/tenant flows functional

---

## Phase 4: User Story 2 - Offline Mode Access (Priority: P2)

**Goal**: Enable offline data access with visual indicator and mutation queuing for sync when online.

**Independent Test**: Load data while online, disable network, verify data accessible, make changes, re-enable network, verify sync.

### Network Status Integration

- [ ] T027 [P] [US2] Create useOfflineIndicator hook combining network status and pending mutations in core/hooks/useOfflineIndicator.ts
- [ ] T028 [P] [US2] Create OfflineIndicator component showing offline status and pending count in shared/components/OfflineIndicator.tsx

### Mutation Queue Management

- [ ] T029 [US2] Implement mutation queue utility for tracking pending offline mutations in core/query/mutationQueue.ts
- [ ] T030 [US2] Add mutation scope configuration for serial execution in core/query/mutationDefaults.ts
- [ ] T031 [US2] Implement sync notification system for mutation success/failure in core/query/syncNotifications.ts

### Offline UI Integration

- [ ] T032 [US2] Add OfflineIndicator to app layout (header or status area) in app/components/AppLayout.tsx or equivalent
- [ ] T033 [US2] Add offline messaging for network-required actions (login) in modules/auth/hooks/useAuth.ts
- [ ] T034 [US2] Add queued indicator when mutations are pending in offline state in modules/profile/hooks/useProfile.ts

### Cache Persistence Validation

- [ ] T035 [US2] Verify cache persists across app restarts with manual testing
- [ ] T036 [US2] Implement LRU eviction handling when storage limit reached in core/query/persister.ts

**Checkpoint**: User Story 2 complete - app works offline with cached data, mutations queue and sync automatically

---

## Phase 5: User Story 3 - Real-time Data Updates and Caching (Priority: P3)

**Goal**: Implement stale-while-revalidate pattern, optimistic updates, and automatic cache invalidation.

**Independent Test**: Fetch data, navigate away, return - cached data shows instantly while revalidating in background.

### Optimistic Updates

- [ ] T037 [US3] Implement optimistic update for profile mutations with rollback in modules/profile/hooks/useProfileMutation.ts
- [ ] T038 [US3] Add optimistic update context tracking for avatar updates in modules/profile/hooks/useProfileMutation.ts

### Cache Invalidation

- [ ] T039 [US3] Implement cache invalidation on login success in modules/auth/hooks/useAuthMutation.ts
- [ ] T040 [US3] Implement cache clear on logout in modules/auth/hooks/useAuthMutation.ts
- [ ] T041 [US3] Implement cache invalidation for profile mutations in modules/profile/hooks/useProfileMutation.ts

### Background Refetch

- [ ] T042 [US3] Configure refetchOnWindowFocus for app foreground detection in core/query/queryClient.ts
- [ ] T043 [US3] Configure refetchOnReconnect for network restoration in core/query/queryClient.ts
- [ ] T044 [US3] Add app state listener to trigger refetch when app returns from background in app/providers/AppProviders.tsx

### Error Handling

- [ ] T045 [US3] Implement retry with exponential backoff display for users in shared/hooks/useRetryStatus.ts (optional)
- [ ] T046 [US3] Add user-friendly error messages for failed operations across hooks

**Checkpoint**: User Story 3 complete - caching and revalidation work seamlessly, optimistic updates provide instant feedback

---

## Phase 6: User Story 4 - Developer Experience Improvements (Priority: P4)

**Goal**: Remove Redux completely, clean up code, and document new patterns.

**Independent Test**: Verify Redux removed from bundle, code review for boilerplate reduction.

### Redux Removal

- [ ] T047 [US4] Remove Redux Provider from AppProviders.tsx in app/providers/AppProviders.tsx
- [ ] T048 [US4] Delete auth Redux slice in modules/auth/store/authSlice.ts
- [ ] T049 [US4] Delete profile Redux slice in modules/profile/store/profileSlice.ts
- [ ] T050 [US4] Delete tenant Redux slice in core/store/slices/tenantSlice.ts
- [ ] T051 [US4] Delete Redux store configuration in core/store/store.ts
- [ ] T052 [US4] Delete Redux root reducer in core/store/rootReducer.ts
- [ ] T053 [US4] Delete Redux hooks file in core/store/hooks.ts
- [ ] T054 [US4] Remove core/store/ directory after all files deleted
- [ ] T055 [US4] Remove @reduxjs/toolkit and react-redux from package.json dependencies
- [ ] T056 [US4] Run `yarn install` to clean up node_modules

### Code Cleanup

- [ ] T057 [P] [US4] Remove any remaining Redux imports across codebase
- [ ] T058 [P] [US4] Delete old offlineCache utility if replaced by TanStack persistence in core/storage/offlineCache.ts

### Documentation

- [ ] T059 [P] [US4] Update CLAUDE.md with new TanStack Query patterns and removed Redux
- [ ] T060 [P] [US4] Verify quickstart.md is accurate and complete in specs/009-tanstack-migration/quickstart.md

**Checkpoint**: User Story 4 complete - Redux fully removed, bundle size reduced, clean codebase

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements across all user stories

- [ ] T061 Run `yarn lint` and fix any linting errors
- [ ] T062 Run `yarn typecheck` and fix any TypeScript errors
- [ ] T063 Run existing tests (`yarn test`) and verify all pass
- [ ] T064 Manual testing: Complete user flow (login → view profile → update profile → logout)
- [ ] T065 Manual testing: Offline flow (load data → go offline → view cached → make change → go online → verify sync)
- [ ] T066 Verify bundle size impact (compare before/after)
- [ ] T067 Code review for any remaining Redux references or unused imports
- [ ] T068 Update ARCHITECTURE.md if state management section needs changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - core migration
- **User Story 2 (Phase 4)**: Depends on Foundational - can parallel with US1 (different files)
- **User Story 3 (Phase 5)**: Depends on US1 completion (needs hooks to exist)
- **User Story 4 (Phase 6)**: Depends on US1-3 completion (cannot remove Redux until migration done)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

| Story | Can Start After | Dependencies |
|-------|-----------------|--------------|
| US1 (P1) | Foundational (Phase 2) | None - core migration |
| US2 (P2) | Foundational (Phase 2) | None - can parallel with US1 |
| US3 (P3) | US1 completion | Needs migrated hooks to add optimistic updates |
| US4 (P4) | US1-3 completion | Cannot remove Redux until all hooks migrated |

### Within Each User Story

- Query key factories before hooks
- Query hooks before mutation hooks
- Base hooks before refactored public API hooks
- Provider updates after all module hooks ready

### Parallel Opportunities

**Setup Phase:**
```
T001, T002 (sequential - package.json)
T003 (after T001, T002)
T004, T005 (parallel - different files)
```

**Foundational Phase:**
```
T006, T007, T008, T009 (mostly sequential - interdependent)
T010, T011 (sequential - same file)
```

**User Story 1:**
```
T012, T013, T014 (parallel - different modules)
T015, T016 → T017, T018, T019 (auth sequential)
T020, T021 → T022, T023 (profile sequential)
T024 → T025 (tenant sequential)
```

**User Story 2:**
```
T027, T028 (parallel - different files)
T029 → T030 → T031 (sequential - interdependent)
T032, T033, T034 (parallel after T028, T029)
```

**User Story 4:**
```
T047 → T048-T054 (sequential - remove in order)
T055 → T056 (sequential)
T057, T058, T059, T060 (parallel - independent files)
```

---

## Parallel Example: User Story 1

```bash
# Launch all query key factories together (different modules):
Task: T012 "Create auth query key factory in modules/auth/queries/authQueryKeys.ts"
Task: T013 "Create profile query key factory in modules/profile/queries/profileQueryKeys.ts"
Task: T014 "Create tenant query key factory in modules/tenant/queries/tenantQueryKeys.ts"

# Then launch module migrations in parallel (different modules):
# Auth track: T015 → T016 → T017 → T018 → T019
# Profile track: T020 → T021 → T022 → T023
# Tenant track: T024 → T025
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011)
3. Complete Phase 3: User Story 1 (T012-T026)
4. **STOP and VALIDATE**: Test login, profile, tenant flows
5. App should work identically to before with TanStack Query

### Incremental Delivery

1. **Setup + Foundational** → TanStack infrastructure ready
2. **Add US1** → Core migration complete → Can demo data fetching
3. **Add US2** → Offline support → Can demo offline mode
4. **Add US3** → Caching polish → Can demo instant loads
5. **Add US4** → Redux removed → Can demo reduced bundle size
6. **Polish** → Production ready

### Risk Mitigation

- Keep Redux working in parallel during US1 if needed
- Each story has rollback point (can ship without subsequent stories)
- US4 (Redux removal) is last - ensures migration is complete before deletion

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Services layer (authService, profileService, tenantService) NOT modified
- Existing tokenStorage and secure storage preserved
- Public hook APIs (`useAuth`, `useProfile`, `useTenant`) maintain same interface
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
