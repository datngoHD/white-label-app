/**
 * Auth Query Key Factory
 *
 * Type-safe query keys for authentication-related queries.
 * Uses @lukemorales/query-key-factory for consistency and autocomplete.
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

/**
 * Auth query keys factory
 *
 * Query key patterns:
 * - ['auth', 'session', tenantId] - Current user session state
 * - ['auth', 'all', tenantId] - All auth queries (for invalidation)
 */
export const authKeys = createQueryKeys('auth', {
  /**
   * Current user session query key
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  session: (tenantId: string) => ({
    queryKey: ['session', tenantId] as const,
  }),

  /**
   * All auth queries for a tenant (for bulk invalidation)
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  all: (tenantId: string) => ({
    queryKey: [tenantId] as const,
  }),
});

/**
 * Auth mutation keys
 * These are used for setMutationDefaults and tracking
 */
export const authMutationKeys = {
  login: ['auth', 'login'] as const,
  logout: ['auth', 'logout'] as const,
  register: ['auth', 'register'] as const,
  refresh: ['auth', 'refresh'] as const,
} as const;

export type AuthMutationKey = (typeof authMutationKeys)[keyof typeof authMutationKeys];
