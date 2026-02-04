/**
 * TanStack Query Core Exports
 *
 * Central export point for all query-related utilities.
 */

// Configuration
export { QUERY_CONFIG, PERSISTER_CONFIG, ONLINE_MANAGER_CONFIG, MUTATION_QUEUE_CONFIG, ERROR_CODES, getRetryDelay, shouldRetry } from './config';

// Types
export type { TenantId, BaseQueryKey, NetworkStatus, NetworkStatusHookReturn, OfflineMutationMeta, SyncNotification, QueryClientContextValue, SerializedError, ApiError } from './types';
export { MUTATION_SCOPES } from './types';

// Query Client
export { queryClient, createQueryClient } from './queryClient';

// Persister
export { asyncStoragePersister, clearPersistedCache, getPersistedCacheSize } from './persister';

// Online Manager
export { setupOnlineManager, isOnline, setOnline } from './onlineManager';

// Mutation Defaults
export { setupMutationDefaults, shouldQueueOffline } from './mutationDefaults';
