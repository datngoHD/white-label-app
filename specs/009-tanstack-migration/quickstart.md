# Quickstart: TanStack Query Migration

**Feature Branch**: `009-tanstack-migration`
**Date**: 2026-02-04

This guide helps developers understand the new TanStack Query patterns after migration.

## Table of Contents

1. [Key Concepts](#key-concepts)
2. [Using Queries](#using-queries)
3. [Using Mutations](#using-mutations)
4. [Offline Support](#offline-support)
5. [Migration Cheatsheet](#migration-cheatsheet)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Key Concepts

### Before vs After

| Concept | Redux (Before) | TanStack Query (After) |
|---------|---------------|------------------------|
| Server state | Slices + Async Thunks | Queries + Mutations |
| Cache | Manual via reducers | Automatic with stale-while-revalidate |
| Loading states | Manual `isLoading` flags | Built-in `isPending`, `isError`, `isSuccess` |
| Error handling | Manual error state | Built-in `error` object |
| Refetching | Manual dispatch | Automatic on focus/reconnect |
| Offline | Not supported | Built-in with persistence |

### Core Principles

1. **Server state is not client state** - Profile data, tenant config, etc. are server state
2. **Hooks manage everything** - No more dispatch, selectors, or actions
3. **Automatic cache management** - Data cached automatically with intelligent invalidation
4. **Offline-first** - Queries work offline from cache, mutations queue automatically

---

## Using Queries

### Basic Query Usage

```typescript
import { useProfile } from '@modules/profile/hooks/useProfile';

function ProfileScreen() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileCard profile={profile} />;
}
```

### Query States

```typescript
const {
  data,           // The cached data (or undefined)
  isLoading,      // First load, no cached data
  isFetching,     // Any fetch in progress (including background)
  isError,        // Query failed
  error,          // Error object if failed
  isSuccess,      // Query succeeded
  isPending,      // Same as isLoading
  isStale,        // Data is older than staleTime
  refetch,        // Manual refetch function
} = useQuery(...);
```

### Manual Refetch

```typescript
const { profile, refetch } = useProfile();

// Pull-to-refresh handler
const onRefresh = async () => {
  await refetch();
};
```

---

## Using Mutations

### Basic Mutation Usage

```typescript
import { useProfile } from '@modules/profile/hooks/useProfile';

function EditProfileForm() {
  const { profile, updateProfile, isUpdatePending, updateError } = useProfile();

  const handleSubmit = (formData: UpdateProfileData) => {
    updateProfile(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {isUpdatePending && <Text>Saving...</Text>}
      {updateError && <Text>Error: {updateError.message}</Text>}
      {/* form fields */}
    </Form>
  );
}
```

### Mutation States

```typescript
const mutation = useMutation(...);

mutation.isPending   // Mutation in progress
mutation.isSuccess   // Mutation succeeded
mutation.isError     // Mutation failed
mutation.error       // Error object
mutation.data        // Response data
mutation.reset()     // Reset mutation state
```

### Optimistic Updates

Updates apply immediately, rollback on error:

```typescript
// This is handled internally in useProfile
// When you call updateProfile(), the UI updates immediately
// If the server returns an error, changes roll back automatically
```

---

## Offline Support

### How It Works

1. **Queries**: Cached data is stored in AsyncStorage, available offline
2. **Mutations**: Failed mutations are queued and retried when online

### Checking Offline Status

```typescript
import { useOfflineIndicator } from '@core/hooks/useOfflineIndicator';

function AppHeader() {
  const { isOffline, hasPendingMutations, pendingMutationCount } = useOfflineIndicator();

  return (
    <Header>
      {isOffline && (
        <OfflineBanner>
          You're offline
          {hasPendingMutations && ` (${pendingMutationCount} changes pending)`}
        </OfflineBanner>
      )}
    </Header>
  );
}
```

### Offline Behavior by Feature

| Feature | Offline Behavior |
|---------|------------------|
| View profile | ✅ Shows cached data |
| Update profile | ✅ Queued, syncs when online |
| Login | ❌ Requires network (shows message) |
| Logout | ✅ Works offline (clears local data) |
| View tenant config | ✅ Shows cached data |

---

## Migration Cheatsheet

### Redux → TanStack Query

**Before (Redux):**
```typescript
// Component
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { fetchProfile, updateProfile, selectProfile } from '@modules/profile/store/profileSlice';

function ProfileScreen() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const isLoading = useAppSelector(selectProfileLoading);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdate = (data) => {
    dispatch(updateProfile(data));
  };
}
```

**After (TanStack Query):**
```typescript
// Component
import { useProfile } from '@modules/profile/hooks/useProfile';

function ProfileScreen() {
  const { profile, isLoading, updateProfile } = useProfile();

  // No useEffect needed - query runs automatically

  const handleUpdate = (data) => {
    updateProfile(data);
  };
}
```

### Common Redux Patterns → TanStack Query

| Redux Pattern | TanStack Query Equivalent |
|--------------|---------------------------|
| `dispatch(fetchProfile())` | Automatic on mount |
| `dispatch(updateProfile(data))` | `updateProfile(data)` |
| `useSelector(selectProfile)` | `profile` from hook |
| `useSelector(selectLoading)` | `isLoading` from hook |
| `useSelector(selectError)` | `error` from hook |
| `dispatch({ type: 'RESET' })` | `queryClient.invalidateQueries()` |

---

## Common Patterns

### Conditional Fetching

```typescript
// Only fetch if user is authenticated
const { data } = useQuery({
  queryKey: ['profile', tenantId],
  queryFn: () => profileService.getProfile(),
  enabled: isAuthenticated, // Won't run if false
});
```

### Dependent Queries

```typescript
// Fetch profile only after we have the user
const { data: user } = useAuth();
const { data: profile } = useProfile({ enabled: !!user });
```

### Parallel Queries

```typescript
// Fetch multiple resources in parallel
const profileQuery = useProfile();
const tenantQuery = useTenant();

const isLoading = profileQuery.isLoading || tenantQuery.isLoading;
```

### Prefetching

```typescript
// Prefetch data before navigation
const queryClient = useQueryClient();

const handleNavigateToProfile = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['profile', tenantId],
    queryFn: () => profileService.getProfile(),
  });
  navigation.navigate('Profile');
};
```

### Cache Invalidation

```typescript
const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['profile', tenantId] });

// Invalidate all queries for a domain
queryClient.invalidateQueries({ queryKey: ['profile'] });

// Invalidate everything (on logout)
queryClient.clear();
```

---

## Troubleshooting

### Data not updating after mutation

**Cause**: Cache not invalidated after mutation
**Solution**: Mutations should invalidate related queries in `onSuccess`

```typescript
// This is handled internally - mutations invalidate their related queries
// If you see stale data, check the mutation's onSuccess handler
```

### Infinite loading state

**Cause**: Query function throwing without proper error handling
**Solution**: Ensure your service layer throws errors properly

```typescript
// Good - throws on error
const response = await apiClient.get('/profile');
return response.data;

// Bad - returns undefined on error
try {
  return await apiClient.get('/profile');
} catch {
  return undefined; // Query thinks this succeeded!
}
```

### Offline mutations not syncing

**Cause**: Mutation defaults not set
**Solution**: Ensure `setMutationDefaults` is called for offline-capable mutations

```typescript
// This is set up in core/query/mutationDefaults.ts
// Check that the mutation key matches
```

### Cache persister not working

**Cause**: Data too large or serialization error
**Solution**: Check for non-serializable data in query responses

```typescript
// Bad - functions can't be serialized
{ user: {...}, callback: () => {} }

// Good - only serializable data
{ user: {...} }
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `core/query/queryClient.ts` | QueryClient configuration |
| `core/query/persister.ts` | AsyncStorage persistence setup |
| `core/query/onlineManager.ts` | Network status integration |
| `modules/*/hooks/use*.ts` | Feature-specific hooks |
| `modules/*/queries/*QueryKeys.ts` | Query key factories |

---

## Need Help?

1. Check the [TanStack Query docs](https://tanstack.com/query/latest)
2. Review the [research.md](./research.md) for design decisions
3. See [data-model.md](./data-model.md) for cache structure
4. Check [contracts/](./contracts/) for TypeScript types
