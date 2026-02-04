/**
 * Configuration Contracts
 * TanStack Query Migration
 *
 * Defines configuration types for QueryClient, persisters, and related setup.
 */

// =============================================================================
// QUERY CLIENT CONFIGURATION
// =============================================================================

/**
 * Default query configuration values
 * These match the spec requirements (FR-004, FR-005, FR-018, SC-002)
 */
export const QUERY_CONFIG = {
  /** Time in ms before data is considered stale (5 minutes) */
  STALE_TIME: 5 * 60 * 1000,

  /** Time in ms before inactive data is garbage collected (24 hours - spec requirement) */
  GC_TIME: 24 * 60 * 60 * 1000,

  /** Maximum retry attempts for failed queries */
  QUERY_RETRY_COUNT: 3,

  /** Maximum retry attempts for failed mutations (spec: FR-018) */
  MUTATION_RETRY_COUNT: 3,

  /** Retry delays in ms for exponential backoff (spec: 1s, 2s, 4s) */
  RETRY_DELAYS: [1000, 2000, 4000] as const,
} as const;

/**
 * Calculate retry delay with exponential backoff
 * Returns delays matching spec: 1s, 2s, 4s
 */
export function getRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * Math.pow(2, attemptIndex), 4000);
}

// =============================================================================
// PERSISTER CONFIGURATION
// =============================================================================

/**
 * AsyncStorage persister configuration
 */
export const PERSISTER_CONFIG = {
  /** Key used for storing query cache in AsyncStorage */
  STORAGE_KEY: 'REACT_QUERY_CACHE',

  /** Throttle time in ms for write operations (debounce) */
  THROTTLE_TIME: 1000,

  /** Cache buster version - increment to invalidate persisted cache */
  CACHE_VERSION: '1.0.0',
} as const;

// =============================================================================
// NETWORK MANAGER CONFIGURATION
// =============================================================================

/**
 * Online manager configuration
 */
export const ONLINE_MANAGER_CONFIG = {
  /** Time in ms to wait before considering device truly offline (debounce flaky connections) */
  OFFLINE_DEBOUNCE: 2000,

  /** Time in ms for offline indicator to appear (spec: SC-010 - within 2 seconds) */
  INDICATOR_DELAY: 2000,
} as const;

// =============================================================================
// MUTATION QUEUE CONFIGURATION
// =============================================================================

/**
 * Offline mutation queue configuration
 */
export const MUTATION_QUEUE_CONFIG = {
  /** Maximum age in ms for queued mutations before they're considered stale (24 hours) */
  MAX_MUTATION_AGE: 24 * 60 * 60 * 1000,

  /** Maximum number of mutations to queue (prevent unbounded growth) */
  MAX_QUEUE_SIZE: 100,
} as const;

// =============================================================================
// CACHE INVALIDATION PATTERNS
// =============================================================================

/**
 * Cache invalidation patterns for common scenarios
 */
export const INVALIDATION_PATTERNS = {
  /** Invalidate all queries on logout */
  ON_LOGOUT: { queryKey: [] as const },

  /** Invalidate all queries for a specific tenant */
  ON_TENANT_SWITCH: (tenantId: string) => ({ queryKey: [tenantId] as const }),

  /** Invalidate all profile queries */
  PROFILE_ALL: (tenantId: string) => ({ queryKey: ['profile', tenantId] as const }),

  /** Invalidate all auth queries */
  AUTH_ALL: (tenantId: string) => ({ queryKey: ['auth', tenantId] as const }),

  /** Invalidate all tenant queries */
  TENANT_ALL: (tenantId: string) => ({ queryKey: ['tenant', tenantId] as const }),
} as const;

// =============================================================================
// ERROR CODES
// =============================================================================

/**
 * HTTP status codes that trigger specific behaviors
 */
export const ERROR_CODES = {
  /** Unauthorized - triggers token refresh */
  UNAUTHORIZED: 401,

  /** Conflict - triggers server-wins resolution (spec: FR-016) */
  CONFLICT: 409,

  /** Rate limited - triggers extended backoff */
  RATE_LIMITED: 429,

  /** Server error - triggers retry */
  SERVER_ERROR_MIN: 500,
  SERVER_ERROR_MAX: 599,
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Feature flags for gradual rollout
 */
export const MIGRATION_FEATURE_FLAGS = {
  /** Enable offline mutation queue */
  ENABLE_OFFLINE_MUTATIONS: true,

  /** Enable cache persistence */
  ENABLE_CACHE_PERSISTENCE: true,

  /** Enable optimistic updates */
  ENABLE_OPTIMISTIC_UPDATES: true,

  /** Enable automatic refetch on reconnect */
  ENABLE_REFETCH_ON_RECONNECT: true,
} as const;
