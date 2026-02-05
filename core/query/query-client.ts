/**
 * TanStack Query Client Configuration
 *
 * Central QueryClient instance with default options for queries and mutations.
 * Configured per spec requirements (FR-004, FR-005, FR-018).
 */

import { QueryClient } from '@tanstack/react-query';

import { getRetryDelay, QUERY_CONFIG } from './config';

/**
 * Create and configure the QueryClient with default options
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 5 minutes
        staleTime: QUERY_CONFIG.STALE_TIME,

        // Cache retained for 24 hours (spec requirement)
        gcTime: QUERY_CONFIG.GC_TIME,

        // Retry 3 times with exponential backoff
        retry: QUERY_CONFIG.QUERY_RETRY_COUNT,
        retryDelay: getRetryDelay,

        // Refetch on reconnect and window focus (spec: FR-005)
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,

        // Network mode for offline support - serve from cache when offline
        networkMode: 'offlineFirst',
      },
      mutations: {
        // Retry 3 times for mutations (spec: FR-018)
        retry: QUERY_CONFIG.MUTATION_RETRY_COUNT,
        retryDelay: getRetryDelay,

        // Network mode for offline queueing
        networkMode: 'offlineFirst',
      },
    },
  });
}

/**
 * Singleton QueryClient instance
 * Created once and reused throughout the app
 */
export const queryClient = createQueryClient();
