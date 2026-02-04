/**
 * Tenant Query Key Factory
 *
 * Type-safe query keys for tenant configuration queries.
 * Uses @lukemorales/query-key-factory for consistency and autocomplete.
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

/**
 * Tenant query keys factory
 *
 * Query key patterns:
 * - ['tenant', 'config', tenantId] - Tenant configuration
 * - ['tenant', 'features', tenantId] - Tenant feature flags
 * - ['tenant', 'all', tenantId] - All tenant queries (for invalidation)
 */
export const tenantKeys = createQueryKeys('tenant', {
  /**
   * Tenant configuration query key
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  config: (tenantId: string) => ({
    queryKey: ['config', tenantId] as const,
  }),

  /**
   * Tenant feature flags
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  features: (tenantId: string) => ({
    queryKey: ['features', tenantId] as const,
  }),

  /**
   * All tenant queries for a tenant (for bulk invalidation)
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  all: (tenantId: string) => ({
    queryKey: [tenantId] as const,
  }),
});
