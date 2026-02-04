# Data Model: TanStack Query Migration

**Feature Branch**: `009-tanstack-migration`
**Date**: 2026-02-04
**Related**: [spec.md](./spec.md) | [plan.md](./plan.md) | [research.md](./research.md)

## Overview

This document defines the data structures for TanStack Query cache, query keys, mutation payloads, and offline queue management.

---

## 1. Query Key Structure

### 1.1 Key Factory Types

```typescript
// Type definitions for query key factories
interface QueryKeyFactory<TParams extends unknown[] = []> {
  queryKey: readonly [...string[], ...TParams];
  queryFn?: () => Promise<unknown>;
}

// Base key structure: ['domain', tenantId, ...specificKeys]
type BaseQueryKey = readonly [string, string, ...unknown[]];
```

### 1.2 Auth Query Keys

| Key Pattern | Parameters | Description |
|-------------|------------|-------------|
| `['auth', 'session', tenantId]` | `tenantId: string` | Current user session/auth state |
| `['auth', 'tokens', tenantId]` | `tenantId: string` | Token validity check (not stored in cache) |

```typescript
// modules/auth/queries/authQueryKeys.ts
export const authKeys = createQueryKeys('auth', {
  session: (tenantId: string) => [tenantId] as const,
  all: (tenantId: string) => [tenantId] as const,
});
```

### 1.3 Profile Query Keys

| Key Pattern | Parameters | Description |
|-------------|------------|-------------|
| `['profile', tenantId]` | `tenantId: string` | Current user's profile |
| `['profile', tenantId, userId]` | `tenantId: string, userId: string` | Specific user profile |
| `['profile', tenantId, 'preferences']` | `tenantId: string` | User notification preferences |
| `['profile', tenantId, 'avatar']` | `tenantId: string` | User avatar data |

```typescript
// modules/profile/queries/profileQueryKeys.ts
export const profileKeys = createQueryKeys('profile', {
  current: (tenantId: string) => [tenantId] as const,
  byId: (tenantId: string, userId: string) => [tenantId, userId] as const,
  preferences: (tenantId: string) => [tenantId, 'preferences'] as const,
  avatar: (tenantId: string) => [tenantId, 'avatar'] as const,
  all: (tenantId: string) => [tenantId] as const,
});
```

### 1.4 Tenant Query Keys

| Key Pattern | Parameters | Description |
|-------------|------------|-------------|
| `['tenant', tenantId, 'config']` | `tenantId: string` | Tenant configuration |
| `['tenant', tenantId, 'features']` | `tenantId: string` | Tenant feature flags |

```typescript
// modules/tenant/queries/tenantQueryKeys.ts
export const tenantKeys = createQueryKeys('tenant', {
  config: (tenantId: string) => [tenantId, 'config'] as const,
  features: (tenantId: string) => [tenantId, 'features'] as const,
  all: (tenantId: string) => [tenantId] as const,
});
```

---

## 2. Query Data Entities

### 2.1 User Entity (Auth)

```typescript
// Represents authenticated user data
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// Auth session state stored in query cache
interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  lastValidated: string; // ISO 8601 timestamp
}
```

### 2.2 Profile Entity

```typescript
// User profile with extended information
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  bio: string | null;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}
```

### 2.3 Tenant Config Entity

```typescript
// Tenant configuration fetched at app startup
interface TenantConfig {
  id: string;
  name: string;
  apiBaseUrl: string;
  features: TenantFeatures;
  theme: TenantThemeOverrides | null;
  metadata: Record<string, unknown>;
}

interface TenantFeatures {
  [featureKey: string]: boolean;
}

interface TenantThemeOverrides {
  primaryColor?: string;
  secondaryColor?: string;
  // ... other theme tokens
}
```

---

## 3. Mutation Entities

### 3.1 Mutation Key Structure

```typescript
// Mutation keys follow pattern: ['domain', 'action']
type MutationKey = readonly [string, string];
```

### 3.2 Auth Mutations

| Mutation Key | Payload | Response | Notes |
|--------------|---------|----------|-------|
| `['auth', 'login']` | `LoginPayload` | `AuthResponse` | NOT queued offline |
| `['auth', 'logout']` | `void` | `void` | NOT queued offline |
| `['auth', 'register']` | `RegisterPayload` | `AuthResponse` | NOT queued offline |
| `['auth', 'refresh']` | `void` | `TokenPair` | Handled by interceptor |

```typescript
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}
```

### 3.3 Profile Mutations

| Mutation Key | Payload | Response | Offline Queueable |
|--------------|---------|----------|-------------------|
| `['profile', 'update']` | `UpdateProfilePayload` | `UserProfile` | Yes |
| `['profile', 'updateAvatar']` | `FormData` | `{ avatarUrl: string }` | Yes |
| `['profile', 'deleteAvatar']` | `void` | `void` | Yes |
| `['profile', 'updatePreferences']` | `NotificationPreferences` | `NotificationPreferences` | Yes |

```typescript
interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  bio?: string | null;
}

// Mutation context for optimistic updates
interface ProfileMutationContext {
  previousProfile: UserProfile | undefined;
}
```

---

## 4. Cache Structure

### 4.1 Persisted Cache Schema

```typescript
// Structure of persisted cache in AsyncStorage
// Key: 'REACT_QUERY_CACHE'
interface PersistedQueryCache {
  timestamp: number;
  buster: string; // Cache version/buster for invalidation
  clientState: {
    queries: PersistedQuery[];
    mutations: PersistedMutation[];
  };
}

interface PersistedQuery {
  queryKey: readonly unknown[];
  queryHash: string;
  state: {
    data: unknown;
    dataUpdatedAt: number;
    error: null | SerializedError;
    errorUpdatedAt: number;
    fetchFailureCount: number;
    fetchFailureReason: null | SerializedError;
    fetchMeta: unknown;
    fetchStatus: 'fetching' | 'paused' | 'idle';
    isInvalidated: boolean;
    status: 'pending' | 'error' | 'success';
  };
}
```

### 4.2 Cache Configuration

```typescript
// core/query/queryClient.ts
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Data considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache retained for 24 hours (spec requirement)
      gcTime: 24 * 60 * 60 * 1000,
      // Retry 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
      // Refetch on reconnect and window focus
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      // Network mode for offline support
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry 3 times for mutations (spec: FR-018)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
      // Network mode for offline queueing
      networkMode: 'offlineFirst',
    },
  },
};
```

### 4.3 Persister Configuration

```typescript
// core/query/persister.ts
const persisterConfig: AsyncStoragePersisterOptions = {
  storage: AsyncStorage,
  key: 'REACT_QUERY_CACHE',
  throttleTime: 1000, // Debounce writes by 1 second
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};
```

---

## 5. Offline Mutation Queue

### 5.1 Queue Structure

Mutations are persisted automatically by TanStack Query. Additional metadata for our requirements:

```typescript
// Extended mutation state for offline tracking
interface OfflineMutationMeta {
  submittedAt: number;      // When user initiated (for ordering)
  retryCount: number;       // Current retry attempt
  maxRetries: number;       // Max retries (3 per spec)
  scope: string;            // Mutation scope for serial execution
  requiresNetwork: boolean; // Whether mutation requires connectivity
}
```

### 5.2 Mutation Scope Definitions

Mutations within the same scope execute serially (prevents race conditions):

| Scope ID | Mutations | Reason |
|----------|-----------|--------|
| `profile-mutations` | profile/update, profile/updateAvatar, profile/deleteAvatar, profile/updatePreferences | Prevent concurrent profile updates |
| `auth-mutations` | auth/login, auth/logout, auth/register | Auth must be serial (no offline queue) |

### 5.3 Mutation State Transitions

```
┌─────────────┐
│   IDLE      │ ← Initial state
└──────┬──────┘
       │ mutate()
       ▼
┌─────────────┐     offline     ┌─────────────┐
│  PENDING    │ ───────────────►│   PAUSED    │
└──────┬──────┘                 └──────┬──────┘
       │ success                       │ online
       ▼                               ▼
┌─────────────┐                 ┌─────────────┐
│  SUCCESS    │                 │  PENDING    │ → (retry loop)
└─────────────┘                 └──────┬──────┘
                                       │ success/failure
                                       ▼
                                ┌─────────────┐
                                │SUCCESS/ERROR│
                                └─────────────┘
```

### 5.4 Queue Cleanup Rules

1. **On Logout**: Clear all queued mutations (`queryClient.getMutationCache().clear()`)
2. **On Tenant Switch**: Clear all queued mutations (security boundary)
3. **After 24 hours**: Mutations older than 24 hours are considered stale
4. **On Max Retries**: Move to failed state, notify user

---

## 6. Network Status Entity

```typescript
// core/query/types.ts
interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: 'wifi' | 'cellular' | 'none' | 'unknown';
}

// Exposed to UI via hook
interface NetworkStatusHookReturn {
  isOnline: boolean;
  isOffline: boolean;
  networkType: NetworkStatus['type'];
}
```

---

## 7. Entity Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                        QueryClient                            │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │   QueryCache    │    │  MutationCache  │                  │
│  │  ┌───────────┐  │    │  ┌───────────┐  │                  │
│  │  │ Auth      │  │    │  │ Auth      │  │ (not queued)     │
│  │  │ Session   │  │    │  │ Mutations │  │                  │
│  │  └───────────┘  │    │  └───────────┘  │                  │
│  │  ┌───────────┐  │    │  ┌───────────┐  │                  │
│  │  │ Profile   │  │    │  │ Profile   │  │ (queued offline) │
│  │  │ Data      │  │    │  │ Mutations │  │                  │
│  │  └───────────┘  │    │  └───────────┘  │                  │
│  │  ┌───────────┐  │    │                 │                  │
│  │  │ Tenant    │  │    │                 │                  │
│  │  │ Config    │  │    │                 │                  │
│  │  └───────────┘  │    │                 │                  │
│  └────────┬────────┘    └────────┬────────┘                  │
│           │                      │                            │
│           ▼                      ▼                            │
│  ┌─────────────────────────────────────────┐                 │
│  │        AsyncStorage Persister           │                 │
│  │   (REACT_QUERY_CACHE - non-sensitive)   │                 │
│  └─────────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Secure Storage (Separate)                   │
│  ┌─────────────────────────────────────────┐                 │
│  │        expo-secure-store                 │                 │
│  │   - accessToken                          │                 │
│  │   - refreshToken                         │                 │
│  │   - expiresAt                            │                 │
│  └─────────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Validation Rules

### 8.1 Query Data Validation

| Entity | Field | Validation |
|--------|-------|------------|
| User | email | Valid email format |
| User | id | Non-empty string |
| UserProfile | phone | Optional, E.164 format if present |
| TenantConfig | apiBaseUrl | Valid URL format |

### 8.2 Mutation Payload Validation

| Mutation | Field | Validation |
|----------|-------|------------|
| login | email | Required, valid email |
| login | password | Required, min 8 chars |
| register | firstName | Required, max 50 chars |
| register | lastName | Required, max 50 chars |
| updateProfile | firstName | Optional, max 50 chars |
| updateProfile | lastName | Optional, max 50 chars |
| updateProfile | phone | Optional, E.164 format |
| updateProfile | bio | Optional, max 500 chars |

---

## 9. Cache Invalidation Patterns

| Event | Invalidation Action |
|-------|---------------------|
| Login success | Set auth session, invalidate profile |
| Logout | Clear entire cache |
| Profile update | Invalidate `['profile', tenantId]` |
| Avatar update | Invalidate `['profile', tenantId, 'avatar']` |
| Preferences update | Invalidate `['profile', tenantId, 'preferences']` |
| Tenant switch | Clear entire cache |
| App return from background | Refetch stale queries |
| Network reconnect | Resume paused mutations, refetch stale |
