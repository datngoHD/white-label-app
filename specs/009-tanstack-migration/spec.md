# Feature Specification: TanStack Query Migration with Offline Support

**Feature Branch**: `009-tanstack-migration`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "using TanStack, support offline mode, remove redux, update existing code"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Seamless Data Fetching Experience (Priority: P1)

As a user, I expect the app to fetch and display data (profile, tenant config, auth status) smoothly without degradation in user experience during and after the migration.

**Why this priority**: Core functionality must remain intact. Users rely on authentication, profile data, and tenant configuration for every interaction with the app. Breaking these flows would render the app unusable.

**Independent Test**: Can be fully tested by logging in, viewing profile, and navigating through the app. Delivers confirmed working authentication and data fetching.

**Acceptance Scenarios**:

1. **Given** a user is logged out, **When** they enter valid credentials and submit login, **Then** they are authenticated and redirected to the home screen with their profile data loaded.
2. **Given** a user is authenticated, **When** they navigate to their profile screen, **Then** their profile information displays correctly with appropriate loading states.
3. **Given** a user has the app closed and reopens it, **When** the app initializes, **Then** their authentication state is restored from persisted storage without requiring re-login.

---

### User Story 2 - Offline Mode Access (Priority: P2)

As a user, I want to continue using the app when I lose network connectivity, viewing my previously loaded data and queuing any changes I make for later synchronization.

**Why this priority**: Offline support is critical for mobile apps where connectivity is unreliable. Users expect to access their data even without internet, and any changes they make should not be lost.

**Independent Test**: Can be tested by loading data while online, disabling network, and verifying data remains accessible and changes are queued.

**Acceptance Scenarios**:

1. **Given** a user has previously viewed their profile while online, **When** they lose network connectivity and navigate to the profile screen, **Then** their cached profile data displays with an offline indicator.
2. **Given** a user is offline, **When** they attempt to update their profile, **Then** the change is queued locally and a message indicates it will sync when online.
3. **Given** a user made changes while offline, **When** they regain network connectivity, **Then** queued changes automatically synchronize and the user is notified of success or failure.
4. **Given** a user is offline, **When** they attempt an action that requires network (e.g., login), **Then** they see a clear message explaining the action requires connectivity.

---

### User Story 3 - Real-time Data Updates and Caching (Priority: P3)

As a user, I want to see fresh data when it changes and not experience unnecessary loading states for previously fetched data.

**Why this priority**: Caching improves perceived performance and reduces redundant network requests. This enhances user experience but builds upon the core functionality.

**Independent Test**: Can be tested by fetching profile data, navigating away, returning to profile screen, and verifying cached data displays instantly.

**Acceptance Scenarios**:

1. **Given** a user has previously fetched their profile, **When** they navigate back to the profile screen within a short period, **Then** cached data displays immediately while revalidation occurs in the background.
2. **Given** a user updates their profile, **When** the update succeeds, **Then** all screens displaying that profile data reflect the changes without manual refresh.
3. **Given** a data fetch fails, **When** the user retries, **Then** the system automatically retries with appropriate backoff and displays user-friendly error messages.

---

### User Story 4 - Developer Experience Improvements (Priority: P4)

As a developer, I want cleaner, more maintainable state management code with less boilerplate and better separation between server state and UI state.

**Why this priority**: Developer experience improvements speed up future development and reduce bugs, but don't directly impact end users.

**Independent Test**: Can be tested by reviewing code complexity, measuring lines of code reduction, and verifying simpler mental model for state management.

**Acceptance Scenarios**:

1. **Given** a developer needs to add a new API endpoint, **When** they implement the data fetching logic, **Then** they use a consistent hook-based pattern with automatic loading/error states.
2. **Given** the codebase after migration, **When** compared to before, **Then** Redux boilerplate (slices, reducers, async thunks) is removed and replaced with declarative query/mutation hooks.

---

### Edge Cases

- What happens when the device loses network connectivity during a data mutation?
- How does the system handle conflicting updates? → Server wins: discard local, notify user
- What happens when cached data becomes stale while the user is actively viewing it?
- How does the system handle token refresh when multiple queries fire simultaneously?
- What happens if the user logs out while background queries or queued mutations are in progress?
- What happens when the offline storage limit is reached? → LRU eviction removes least recently used data
- How long should offline data be retained before being considered too stale?
- What happens if a queued mutation fails after coming back online? → Retry 3 times with exponential backoff, then notify user

## Requirements _(mandatory)_

### Functional Requirements

**Core Data Fetching (Migration)**
- **FR-001**: System MUST maintain all existing authentication functionality (login, logout, register, token refresh, session persistence)
- **FR-002**: System MUST maintain all existing profile functionality (fetch, update, avatar management, notification preferences)
- **FR-003**: System MUST maintain all existing tenant configuration functionality (fetch, store, access features)
- **FR-004**: System MUST provide automatic data caching with configurable stale times
- **FR-005**: System MUST automatically refetch stale data when components remount or app returns from background
- **FR-006**: System MUST handle loading, error, and success states for all data operations
- **FR-007**: System MUST support optimistic updates for mutation operations
- **FR-008**: System MUST invalidate and refetch related queries when mutations succeed

**Offline Support**
- **FR-009**: System MUST persist query cache to device storage so data survives app restarts
- **FR-010**: System MUST detect network connectivity status and expose it to the UI
- **FR-011**: System MUST allow users to view cached data when offline
- **FR-012**: System MUST display an offline indicator when the device has no network connectivity
- **FR-013**: System MUST queue mutations made while offline for later execution
- **FR-014**: System MUST automatically execute queued mutations when network connectivity is restored
- **FR-015**: System MUST notify users of the success or failure of synced mutations
- **FR-016**: System MUST resolve mutation conflicts using server-wins strategy: discard conflicting local mutation and notify user to review/re-submit if needed
- **FR-017**: System MUST clear queued mutations for a user when they log out
- **FR-018**: System MUST retry failed queued mutations up to 3 times with exponential backoff (1s, 2s, 4s) before marking as failed and notifying user
- **FR-019**: System MUST use LRU (least recently used) eviction when cache storage limit is reached, automatically removing oldest unused data to make room for new data

**Technical Migration**
- **FR-020**: System MUST persist authentication tokens securely (maintain existing secure storage behavior)
- **FR-021**: System MUST remove all Redux-related dependencies from the project
- **FR-022**: System MUST maintain the same public API for existing hooks (`useAuth`, `useProfile`) to minimize component changes
- **FR-023**: System MUST handle concurrent token refresh requests without race conditions

### Key Entities

- **Query**: Represents a cached piece of server data with associated loading/error states, automatic background refetching, and offline persistence
- **Mutation**: Represents a data modification operation with success/error callbacks, cache invalidation, and offline queuing capabilities
- **QueryClient**: Central cache manager that stores all query data, manages persistence, and provides configuration for default behaviors
- **Auth State**: Client-side authentication state including current user, tokens, and authentication status
- **Mutation Queue**: Collection of pending mutations created while offline, awaiting network restoration for execution
- **Network Status**: Observable state indicating current connectivity, used to determine online/offline behavior

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All existing user-facing functionality works identically after migration (zero regression in user flows)
- **SC-002**: Subsequent visits to screens with previously fetched data display instantly from cache (perceived load time under 100ms for cached data)
- **SC-003**: Users can access all previously loaded screens and data when offline (100% of cached data accessible offline)
- **SC-004**: Mutations made offline are successfully synchronized when connectivity returns (95%+ success rate for queued mutations)
- **SC-005**: Bundle size impact is neutral or improved (Redux + React-Redux + Redux Toolkit replaced by TanStack Query + persistence)
- **SC-006**: All existing tests continue to pass after migration
- **SC-007**: Failed operations provide clear, actionable error messages to users
- **SC-008**: 80% reduction in state management boilerplate code (lines of code in store/slice files)
- **SC-009**: Profile and tenant data refresh automatically when the app returns from background
- **SC-010**: Offline indicator appears within 2 seconds of connectivity loss

## Assumptions

- TanStack Query v5 (latest stable) will be used for this migration
- TanStack Query's built-in persistence and offline capabilities will be leveraged
- Authentication tokens will continue to be persisted using the existing secure storage (`tokenStorage`)
- The existing service layer (`authService`, `profileService`, `tenantService`) will be preserved and used by TanStack Query hooks
- Authentication state (isAuthenticated, tokens) will be managed through TanStack Query's mutation/query patterns combined with secure token persistence
- The existing `offlineCache` utility and `useNetworkStatus` hook provide patterns that can inform the TanStack implementation
- Cache persistence will use AsyncStorage (existing dependency) for non-sensitive data
- Server-side rendering (SSR) is not used in this React Native app
- Offline data retention defaults to 24 hours unless configured otherwise
- Mutation queue will be stored separately from query cache for security (no auth mutations queued)

## Clarifications

### Session 2026-02-04

- Q: How should offline mutation conflicts be resolved when queued mutation conflicts with newer server data? → A: Server wins - discard conflicting local mutation, notify user to review/re-submit
- Q: How many times should the system retry failed queued mutations before giving up? → A: 3 retries with exponential backoff (1s, 2s, 4s), then notify user
- Q: How should the system handle cache storage when limit is reached? → A: LRU eviction - automatically remove least recently used cached data
