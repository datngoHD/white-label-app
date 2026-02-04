/**
 * Profile Query Key Factory
 *
 * Type-safe query keys for profile-related queries.
 * Uses @lukemorales/query-key-factory for consistency and autocomplete.
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

/**
 * Profile query keys factory
 *
 * Query key patterns:
 * - ['profile', 'current', tenantId] - Current user's profile
 * - ['profile', 'byId', tenantId, userId] - Specific user profile
 * - ['profile', 'preferences', tenantId] - User notification preferences
 * - ['profile', 'avatar', tenantId] - User avatar data
 * - ['profile', 'all', tenantId] - All profile queries (for invalidation)
 */
export const profileKeys = createQueryKeys('profile', {
  /**
   * Current user profile query key
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  current: (tenantId: string) => ({
    queryKey: ['current', tenantId] as const,
  }),

  /**
   * Specific user profile by ID
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @param userId - User ID to fetch
   */
  byId: (tenantId: string, userId: string) => ({
    queryKey: ['byId', tenantId, userId] as const,
  }),

  /**
   * User notification preferences
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  preferences: (tenantId: string) => ({
    queryKey: ['preferences', tenantId] as const,
  }),

  /**
   * User avatar data
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  avatar: (tenantId: string) => ({
    queryKey: ['avatar', tenantId] as const,
  }),

  /**
   * All profile queries for a tenant (for bulk invalidation)
   * @param tenantId - Tenant ID for multi-tenant isolation
   */
  all: (tenantId: string) => ({
    queryKey: [tenantId] as const,
  }),
});

/**
 * Profile mutation keys
 * These are used for setMutationDefaults and tracking
 */
export const profileMutationKeys = {
  update: ['profile', 'update'] as const,
  updateAvatar: ['profile', 'updateAvatar'] as const,
  deleteAvatar: ['profile', 'deleteAvatar'] as const,
  updatePreferences: ['profile', 'updatePreferences'] as const,
} as const;

export type ProfileMutationKey = (typeof profileMutationKeys)[keyof typeof profileMutationKeys];
