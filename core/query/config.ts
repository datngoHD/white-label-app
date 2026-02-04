/**
 * TanStack Query Configuration
 *
 * Centralized configuration for QueryClient, persisters, and related settings.
 * Values match spec requirements (FR-004, FR-005, FR-018, SC-002, SC-010).
 */

// =============================================================================
// QUERY CLIENT CONFIGURATION
// =============================================================================

/**
 * Default query configuration values
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
 * Returns delays matching spec: 1s, 2s, 4s, max 4s
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

  /** Server error range - triggers retry */
  SERVER_ERROR_MIN: 500,
  SERVER_ERROR_MAX: 599,
} as const;

/**
 * Check if an error status code should trigger retry
 */
export function shouldRetry(status: number): boolean {
  return status >= ERROR_CODES.SERVER_ERROR_MIN && status <= ERROR_CODES.SERVER_ERROR_MAX;
}
