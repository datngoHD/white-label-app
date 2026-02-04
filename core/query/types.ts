/**
 * TanStack Query Type Definitions
 *
 * Core types for query configuration, mutation state, and network status.
 */

import type { QueryClient } from '@tanstack/react-query';

// =============================================================================
// QUERY KEY TYPES
// =============================================================================

/** Tenant ID is always included in query keys for multi-tenant isolation */
export type TenantId = string;

/** Base query key structure: ['domain', tenantId, ...specificKeys] */
export type BaseQueryKey<TDomain extends string> = readonly [TDomain, TenantId];

// =============================================================================
// NETWORK STATUS TYPES
// =============================================================================

/** Network connectivity state from NetInfo */
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: 'wifi' | 'cellular' | 'none' | 'unknown';
}

/** Hook return type for network status */
export interface NetworkStatusHookReturn {
  isOnline: boolean;
  isOffline: boolean;
  networkType: NetworkStatus['type'];
}

// =============================================================================
// OFFLINE MUTATION TYPES
// =============================================================================

/** Extended mutation metadata for offline tracking */
export interface OfflineMutationMeta {
  /** When user initiated the mutation (for ordering) */
  submittedAt: number;
  /** Current retry attempt count */
  retryCount: number;
  /** Maximum retries allowed (3 per spec) */
  maxRetries: number;
  /** Mutation scope for serial execution */
  scope: string;
  /** Whether this mutation requires network connectivity */
  requiresNetwork: boolean;
}

/** Mutation scope identifiers for serial execution */
export const MUTATION_SCOPES = {
  /** Profile mutations execute serially to prevent race conditions */
  PROFILE: 'profile-mutations',
  /** Auth mutations execute serially (but are not queued offline) */
  AUTH: 'auth-mutations',
} as const;

export type MutationScope = (typeof MUTATION_SCOPES)[keyof typeof MUTATION_SCOPES];

// =============================================================================
// SYNC NOTIFICATION TYPES
// =============================================================================

/** Sync notification for mutation success/failure */
export interface SyncNotification {
  id: string;
  type: 'success' | 'error' | 'conflict';
  message: string;
  mutationKey: readonly string[];
  timestamp: number;
}

// =============================================================================
// QUERY CLIENT CONTEXT
// =============================================================================

/** Type for accessing QueryClient from context */
export interface QueryClientContextValue {
  queryClient: QueryClient;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

/** Serialized error for persistence */
export interface SerializedError {
  message: string;
  name: string;
  stack?: string;
  status?: number;
}

/** API error response structure */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}
