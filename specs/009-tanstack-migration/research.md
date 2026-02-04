# Research: TanStack Query Migration with Offline Support

**Feature Branch**: `009-tanstack-migration`
**Date**: 2026-02-04
**Related**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Research Topics

1. [TanStack Query v5 + React Native Offline Persistence](#1-tanstack-query-v5--react-native-offline-persistence)
2. [Mutation Queue Implementation](#2-mutation-queue-implementation)
3. [Network Status Integration](#3-network-status-integration)
4. [Query Key Design Patterns](#4-query-key-design-patterns)
5. [Auth Token Handling](#5-auth-token-handling)

---

## 1. TanStack Query v5 + React Native Offline Persistence

### Decision: Use `@tanstack/query-async-storage-persister` with `PersistQueryClientProvider`

### Rationale
- Official TanStack package specifically designed for AsyncStorage integration
- Handles serialization/deserialization automatically
- Supports configurable `gcTime` (garbage collection time) for cache retention
- Works with existing `@react-native-async-storage/async-storage` dependency

### Implementation Pattern

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (matches spec requirement)
      staleTime: 1000 * 60 * 5,    // 5 minutes
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_CACHE',
});
```

### Alternatives Considered

| Alternative | Rejected Because |
|------------|------------------|
| `experimental_createQueryPersister` (per-query) | More complex setup; whole-cache persistence sufficient for our scope |
| Custom AsyncStorage wrapper | Reinventing the wheel; official persister handles edge cases |
| MMKV persistence | Would require additional dependency; AsyncStorage already in use |

### Performance Considerations
- Throttle persistence writes (default 1000ms) to avoid excessive I/O
- Large caches can cause JSON serialization overhead; monitor cache size
- Consider selective persistence for critical data only if performance issues arise

### Sources
- [TanStack Query AsyncStorage Persister Docs](https://tanstack.com/query/v5/docs/framework/react/plugins/createAsyncStoragePersister)
- [React Native Offline First with TanStack Query](https://dev.to/fedorish/react-native-offline-first-with-tanstack-query-1pe5)
- [Building Offline-First Apps with React Query](https://dev.to/msaadullah/building-offline-first-apps-using-react-native-react-query-and-asyncstorage-1h4i)

---

## 2. Mutation Queue Implementation

### Decision: Use TanStack Query's built-in mutation persistence with `setMutationDefaults`

### Rationale
- Native support in TanStack Query v5 for pausing and resuming mutations
- `scope.id` allows serial execution of related mutations (prevents race conditions)
- `submittedAt` field (v5+) enables identifying latest mutation for conflict resolution
- `resumePausedMutations()` handles automatic replay on reconnect

### Implementation Pattern

```typescript
// Set mutation defaults for persistence (REQUIRED for offline mutations to restore)
queryClient.setMutationDefaults(['profile', 'update'], {
  mutationFn: (data) => profileService.updateProfile(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000), // 1s, 2s, 4s
});

// Use scope for serial execution of same-type mutations
const mutation = useMutation({
  mutationKey: ['profile', 'update'],
  scope: { id: 'profile-mutations' }, // Prevents parallel profile updates
});

// Resume paused mutations on app startup after hydration
<PersistQueryClientProvider
  onSuccess={() => {
    queryClient.resumePausedMutations().then(() => {
      queryClient.invalidateQueries();
    });
  }}
/>
```

### Critical Implementation Notes

1. **MutationFn MUST be set via `setMutationDefaults`** - Functions cannot be serialized, so after hydration the mutation needs a default function
2. **Do NOT override `mutationFn` in `useMutation`** - It breaks persistence
3. **Call `resumePausedMutations` in `onSuccess` of PersistQueryClientProvider** - Ensures mutations resume after cache is restored

### Conflict Resolution (Server-Wins Strategy per Spec)

```typescript
// When mutation fails due to conflict (e.g., 409 status)
onError: (error, variables, context) => {
  if (error.response?.status === 409) {
    // Server wins: invalidate cache to fetch latest server state
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    // Notify user
    showNotification('Your changes conflicted with newer data. Please review and try again.');
  }
}
```

### Alternatives Considered

| Alternative | Rejected Because |
|------------|------------------|
| Custom mutation queue with AsyncStorage | TanStack has built-in support; custom implementation is error-prone |
| Redux-persist style mutation log | Adds complexity; TanStack's approach is simpler |
| Optimistic-only without queue | Loses mutations on app close; doesn't meet offline requirement |

### Sources
- [TanStack Query Mutations Docs](https://tanstack.com/query/v5/docs/react/guides/mutations)
- [Persisting Offline Mutations Discussion](https://github.com/TanStack/query/discussions/5248)
- [Deep Dive into Mutations](https://blog.logrocket.com/deep-dive-mutations-tanstack-query/)

---

## 3. Network Status Integration

### Decision: Use `onlineManager.setEventListener` with `@react-native-community/netinfo`

### Rationale
- TanStack Query provides `onlineManager` specifically for this purpose
- Already have `@react-native-community/netinfo` as dependency
- Existing `useNetworkStatus` hook can be leveraged
- Clean integration with TanStack's automatic refetch-on-reconnect

### Implementation Pattern

```typescript
// core/query/onlineManager.ts
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export function setupOnlineManager(): () => void {
  // Set up the event listener
  const unsubscribe = onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state: NetInfoState) => {
      // Check both connection and internet reachability
      const isOnline =
        state.isConnected !== null &&
        state.isConnected &&
        state.isInternetReachable !== false;
      setOnline(isOnline);
    });
  });

  return unsubscribe;
}

// Call in app initialization (e.g., App.tsx or providers setup)
useEffect(() => {
  const cleanup = setupOnlineManager();
  return cleanup;
}, []);
```

### Integration with Existing `useNetworkStatus` Hook

The existing hook at `core/hooks/useNetworkStatus.ts` can remain for UI purposes (showing offline indicator), while `onlineManager` handles TanStack Query's internal state.

```typescript
// The existing useNetworkStatus can be simplified or kept as-is for UI
// TanStack Query will use onlineManager internally for:
// - Pausing queries when offline
// - Resuming mutations when online
// - Triggering refetches on reconnect
```

### TypeScript Considerations
- `state.isConnected` is `boolean | null`, requires `!!` or explicit null check
- `state.isInternetReachable` can be `null` initially; treat as "assume online"

### Alternatives Considered

| Alternative | Rejected Because |
|------------|------------------|
| Expo Network API | Would add another dependency; NetInfo already works well |
| Manual online state tracking | Duplicates TanStack's built-in functionality |
| Polling-based connectivity check | Wastes resources; event-based is more efficient |

### Known Issues
- iPhone simulator may have connectivity detection issues (not affecting real devices)

### Sources
- [TanStack Query React Native Docs](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [OnlineManager API Reference](https://tanstack.com/query/v4/docs/reference/onlineManager)
- [Building Offline-First React Native Apps](https://www.whitespectre.com/ideas/how-to-build-offline-first-react-native-apps-with-react-query-and-typescript/)

---

## 4. Query Key Design Patterns

### Decision: Use query key factory pattern with `@lukemorales/query-key-factory`

### Rationale
- Type-safe query keys with full IDE autocomplete
- Centralized key management per feature (aligns with modular architecture)
- Simplifies cache invalidation patterns
- Community-recommended approach (listed in TanStack's community resources)

### Implementation Pattern

```typescript
// modules/profile/queries/profileQueryKeys.ts
import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';

export const profileKeys = createQueryKeys('profile', {
  current: (tenantId: string) => ({
    queryKey: [tenantId],
    queryFn: () => profileService.getProfile(),
  }),
  byId: (tenantId: string, userId: string) => ({
    queryKey: [tenantId, userId],
    queryFn: () => profileService.getProfileById(userId),
  }),
  preferences: (tenantId: string) => ({
    queryKey: [tenantId, 'preferences'],
    queryFn: () => profileService.getPreferences(),
  }),
});

// modules/auth/queries/authQueryKeys.ts
export const authKeys = createQueryKeys('auth', {
  session: (tenantId: string) => ({
    queryKey: [tenantId],
    // Note: auth is hybrid - session validated server-side but tokens stored client-side
  }),
});

// modules/tenant/queries/tenantQueryKeys.ts
export const tenantKeys = createQueryKeys('tenant', {
  config: (tenantId: string) => ({
    queryKey: [tenantId],
    queryFn: () => tenantService.getTenantConfig(),
  }),
  features: (tenantId: string) => ({
    queryKey: [tenantId, 'features'],
  }),
});

// Merge all keys for global access
export const queryKeys = mergeQueryKeys(authKeys, profileKeys, tenantKeys);
```

### Tenant Isolation Pattern
- All query keys include `tenantId` as first parameter
- On tenant switch, invalidate all queries: `queryClient.invalidateQueries()`
- On logout, clear entire cache: `queryClient.clear()`

### Usage in Hooks

```typescript
// modules/profile/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { profileKeys } from '../queries/profileQueryKeys';
import { useTenantId } from '@core/hooks/useTenantId';

export function useProfile() {
  const tenantId = useTenantId();

  return useQuery({
    ...profileKeys.current(tenantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Alternatives Considered

| Alternative | Rejected Because |
|------------|------------------|
| String-based keys | No type safety; easy to have typos and mismatches |
| Array-based keys without factory | Inconsistent patterns across codebase |
| TanStack's `queryOptions` helper alone | Less structured; factory pattern more maintainable at scale |

### Sources
- [Query Key Factory GitHub](https://github.com/lukemorales/query-key-factory)
- [Effective React Query Keys (TkDodo)](https://tkdodo.eu/blog/effective-react-query-keys)
- [TanStack Query TypeScript Docs](https://tanstack.com/query/latest/docs/react/typescript)

---

## 5. Auth Token Handling

### Decision: Hybrid approach - tokens in secure storage, auth state via TanStack Query mutations

### Rationale
- Auth tokens are sensitive and MUST remain in secure storage (expo-secure-store)
- Auth "state" (user object, isAuthenticated) can leverage TanStack Query's caching
- Login/logout are mutations that update the query cache
- Token refresh handled by Axios interceptor (existing pattern preserved)

### Implementation Pattern

```typescript
// modules/auth/hooks/useAuth.ts - Maintaining same public API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../queries/authQueryKeys';
import { authService } from '../services/authService';
import { tokenStorage } from '@core/storage/tokenStorage';

export function useAuth() {
  const queryClient = useQueryClient();
  const tenantId = useTenantId();

  // Auth state query - fetches user from cache or validates session
  const { data: user, isLoading, error } = useQuery({
    ...authKeys.session(tenantId),
    queryFn: async () => {
      const tokens = await tokenStorage.getTokens();
      if (!tokens || tokenStorage.isTokenExpired(tokens)) {
        return null;
      }
      // Optionally validate session with server
      return authService.getCurrentUser();
    },
    staleTime: Infinity, // Auth state doesn't auto-refetch
    gcTime: Infinity,    // Keep forever until explicit logout
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      await tokenStorage.saveTokens(response.tokens);
      queryClient.setQueryData(authKeys.session(tenantId).queryKey, response.user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
      await tokenStorage.clearTokens();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  };
}
```

### Token Refresh Pattern (Axios Interceptor)

The existing `authInterceptor.ts` pattern is preserved. Token refresh is handled at the HTTP layer, not the query layer:

```typescript
// core/api/interceptors/authInterceptor.ts (existing pattern, enhanced)
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            error.config.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(error.config));
          });
        });
      }

      isRefreshing = true;
      error.config._retry = true;

      try {
        const newTokens = await authService.refreshToken();
        await tokenStorage.saveTokens(newTokens);

        // Notify all subscribers
        refreshSubscribers.forEach((cb) => cb(newTokens.accessToken));
        refreshSubscribers = [];

        error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(error.config);
      } catch (refreshError) {
        // Refresh failed - logout user
        await tokenStorage.clearTokens();
        queryClient.clear();
        // Navigate to login (handled by auth state change)
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### Why NOT Put Tokens in Query Cache
1. **Security**: Query cache persists to AsyncStorage (insecure); tokens must stay in expo-secure-store
2. **Serialization**: Tokens should never be serialized to disk in plain text
3. **Separation of concerns**: Tokens are transport-layer; user state is application-layer

### Alternatives Considered

| Alternative | Rejected Because |
|------------|------------------|
| Store tokens in query cache | Security risk; AsyncStorage is not encrypted |
| Separate auth context + TanStack | Unnecessary complexity; TanStack can handle it |
| Full migration to TanStack for token refresh | Axios interceptor pattern more robust for concurrent requests |

### Sources
- [Refreshing Auth Token in TanStack Query](https://akhilaariyachandra.com/blog/refreshing-an-authentication-in-token-in-tanstack-query)
- [React Query Authentication Flow](https://dev.to/this-is-learning/react-query-authentication-flow-id2)
- [Efficient Refresh Token with React Query and Axios](https://dev.to/elmehdiamlou/efficient-refresh-token-implementation-with-react-query-and-axios-f8d)

---

## Summary of Decisions

| Topic | Decision | Key Package/Pattern |
|-------|----------|---------------------|
| Cache Persistence | AsyncStorage persister | `@tanstack/query-async-storage-persister` |
| Mutation Queue | Built-in TanStack persistence | `setMutationDefaults` + `resumePausedMutations` |
| Network Status | OnlineManager with NetInfo | `onlineManager.setEventListener` |
| Query Keys | Type-safe factory pattern | `@lukemorales/query-key-factory` |
| Auth Handling | Hybrid (tokens secure, state in cache) | expo-secure-store + query cache |

## New Dependencies Required

```json
{
  "@tanstack/react-query": "^5.x",
  "@tanstack/react-query-persist-client": "^5.x",
  "@tanstack/query-async-storage-persister": "^5.x",
  "@lukemorales/query-key-factory": "^1.x"
}
```

## Dependencies to Remove (after migration complete)

```json
{
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0"
}
```
