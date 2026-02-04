# Implementation Plan: TanStack Query Migration with Offline Support

**Branch**: `009-tanstack-migration` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-tanstack-migration/spec.md`

## Summary

Migrate the application's server state management from Redux Toolkit to TanStack Query v5, implementing offline-first capabilities with cache persistence, mutation queuing, and automatic synchronization. This migration removes Redux dependencies (used exclusively for server state: auth, profile, tenant) and replaces them with TanStack Query's declarative data fetching patterns while maintaining backward-compatible hook APIs (`useAuth`, `useProfile`).

## Technical Context

**Language/Version**: TypeScript ~5.4.0 (strict mode enabled)
**Primary Dependencies**:
- Current: @reduxjs/toolkit ^2.11.2, react-redux ^9.2.0, axios ^1.13.2
- Target: @tanstack/react-query v5, @tanstack/query-async-storage-persister, @react-native-async-storage/async-storage (existing)
**Storage**: AsyncStorage (existing) for query cache persistence, expo-secure-store (existing) for auth tokens
**Testing**: Jest ^30.2.0 with @testing-library/react-native ^13.3.3
**Target Platform**: iOS and Android via Expo SDK 54, React Native 0.81.5
**Project Type**: Mobile (React Native / Expo)
**Performance Goals**:
- Cached data display under 100ms
- Offline indicator within 2 seconds of connectivity loss
- 95%+ success rate for queued mutation sync
**Constraints**:
- Offline-capable with 24-hour cache retention
- LRU eviction for cache storage limits
- 3 retries with exponential backoff for failed mutations
**Scale/Scope**:
- 3 data domains (auth, profile, tenant)
- Maintain same public hook APIs to minimize component changes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture / Modular Architecture | ✅ PASS | TanStack Query hooks will be organized in feature modules (auth, profile, tenant), maintaining layer separation |
| II. Clear Folder Structure | ✅ PASS | Query hooks placed in `modules/{feature}/hooks/`, query keys in `modules/{feature}/queries/` |
| III. Separation of Concerns | ✅ PASS | Services layer preserved; TanStack Query handles caching/sync, services handle API communication |
| IV. Strong TypeScript Typing | ✅ PASS | TanStack Query v5 has excellent TypeScript support; query/mutation types will be strictly defined |
| V. Externalized Configuration | ✅ PASS | Cache stale times, retry counts configurable; no hardcoded values |
| VI. White-label & Multi-tenant Design | ✅ PASS | Query keys will include tenant ID; cache isolated per tenant |
| VII. Expo Prebuild Workflow | ✅ PASS | No native code changes required; all dependencies are JS-only |

**Technology Stack Alignment**:
| Constitution Requirement | Implementation | Status |
|--------------------------|----------------|--------|
| Server State: TanStack Query | Migrating auth/profile/tenant to TanStack Query | ✅ ALIGNED |
| Local Persistence: MMKV or AsyncStorage | Using AsyncStorage for cache persistence | ✅ ALIGNED |
| Global State: Redux Toolkit for complex client-side state | No complex client-side state exists; Redux used only for server state | ✅ ALIGNED (removal justified) |

**Redux Removal Justification**: The current Redux implementation manages exclusively server state (auth tokens, profile data, tenant config). The constitution specifies Redux for "complex client-side state" while TanStack Query handles "API data fetching, caching, and synchronization." Since there is no complex client-side state requiring Redux, removal aligns with constitution intent.

## Project Structure

### Documentation (this feature)

```text
specs/009-tanstack-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
# Mobile Application Structure (Expo/React Native)
app/
├── providers/
│   └── AppProviders.tsx      # Add QueryClientProvider, remove Redux Provider

modules/
├── auth/
│   ├── hooks/
│   │   ├── useAuth.ts        # Refactor: Redux → TanStack Query
│   │   ├── useAuthMutation.ts # New: login/logout/register mutations
│   │   └── useAuthQuery.ts   # New: auth state query
│   ├── queries/
│   │   └── authQueryKeys.ts  # New: type-safe query key factory
│   └── services/
│       └── authService.ts    # Preserved (no changes)
├── profile/
│   ├── hooks/
│   │   ├── useProfile.ts     # Refactor: Redux → TanStack Query
│   │   └── useProfileMutation.ts # New: profile update mutations
│   ├── queries/
│   │   └── profileQueryKeys.ts
│   └── services/
│       └── profileService.ts # Preserved
└── tenant/
    ├── hooks/
    │   └── useTenant.ts      # Refactor: Redux → TanStack Query
    ├── queries/
    │   └── tenantQueryKeys.ts
    └── services/
        └── tenantService.ts  # Preserved

core/
├── query/                    # New directory
│   ├── queryClient.ts        # QueryClient configuration
│   ├── persister.ts          # AsyncStorage persister setup
│   ├── onlineManager.ts      # Network status integration
│   └── mutationQueue.ts      # Offline mutation queue management
├── hooks/
│   └── useNetworkStatus.ts   # Existing (integrate with TanStack)
└── store/                    # TO BE REMOVED after migration
    ├── store.ts
    ├── rootReducer.ts
    └── slices/

shared/
└── components/
    └── OfflineIndicator.tsx  # New: offline status UI component
```

**Structure Decision**: Mobile application with feature-based module organization. New `core/query/` directory houses TanStack Query infrastructure. Existing `core/store/` removed after migration complete.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| None | N/A | Migration reduces complexity by removing Redux boilerplate |

## Phase 0: Research Items

The following topics require research before implementation:

1. **TanStack Query v5 + React Native**: Best practices for offline persistence with AsyncStorage
2. **Mutation Queue Implementation**: Patterns for persisting and replaying offline mutations
3. **Network Status Integration**: Connecting @react-native-community/netinfo with TanStack's onlineManager
4. **Query Key Design**: Type-safe query key factory patterns for tenant isolation
5. **Auth Token Handling**: Managing auth state with TanStack Query (client state vs server state hybrid)

## Phase 1: Design Deliverables

1. **data-model.md**: Query/mutation entities, cache structure, offline queue schema
2. **contracts/**: Query key contracts, mutation payloads, cache serialization format
3. **quickstart.md**: Developer guide for using the new hooks pattern
