/**
 * Query Key Contracts
 * TanStack Query Migration
 *
 * This file defines the type-safe query key structure for all domains.
 * Implementation should use @lukemorales/query-key-factory with these patterns.
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/** Tenant ID is always the first parameter for multi-tenant isolation */
export type TenantId = string;

/** Base query key always includes domain and tenant */
export type BaseQueryKey<TDomain extends string> = readonly [TDomain, TenantId];

// =============================================================================
// AUTH DOMAIN
// =============================================================================

export type AuthQueryKey = BaseQueryKey<'auth'>;

export interface AuthQueryKeys {
  /** Current user session - ['auth', tenantId] */
  session: (tenantId: TenantId) => readonly ['auth', TenantId];

  /** All auth queries for invalidation - ['auth', tenantId] */
  all: (tenantId: TenantId) => readonly ['auth', TenantId];
}

export type AuthMutationKey =
  | readonly ['auth', 'login']
  | readonly ['auth', 'logout']
  | readonly ['auth', 'register']
  | readonly ['auth', 'refresh'];

// =============================================================================
// PROFILE DOMAIN
// =============================================================================

export type ProfileQueryKey =
  | readonly ['profile', TenantId]
  | readonly ['profile', TenantId, string]
  | readonly ['profile', TenantId, 'preferences']
  | readonly ['profile', TenantId, 'avatar'];

export interface ProfileQueryKeys {
  /** Current user profile - ['profile', tenantId] */
  current: (tenantId: TenantId) => readonly ['profile', TenantId];

  /** Specific user profile - ['profile', tenantId, userId] */
  byId: (tenantId: TenantId, userId: string) => readonly ['profile', TenantId, string];

  /** User notification preferences - ['profile', tenantId, 'preferences'] */
  preferences: (tenantId: TenantId) => readonly ['profile', TenantId, 'preferences'];

  /** User avatar - ['profile', tenantId, 'avatar'] */
  avatar: (tenantId: TenantId) => readonly ['profile', TenantId, 'avatar'];

  /** All profile queries for invalidation - ['profile', tenantId] */
  all: (tenantId: TenantId) => readonly ['profile', TenantId];
}

export type ProfileMutationKey =
  | readonly ['profile', 'update']
  | readonly ['profile', 'updateAvatar']
  | readonly ['profile', 'deleteAvatar']
  | readonly ['profile', 'updatePreferences'];

// =============================================================================
// TENANT DOMAIN
// =============================================================================

export type TenantQueryKey =
  | readonly ['tenant', TenantId, 'config']
  | readonly ['tenant', TenantId, 'features'];

export interface TenantQueryKeys {
  /** Tenant configuration - ['tenant', tenantId, 'config'] */
  config: (tenantId: TenantId) => readonly ['tenant', TenantId, 'config'];

  /** Tenant features - ['tenant', tenantId, 'features'] */
  features: (tenantId: TenantId) => readonly ['tenant', TenantId, 'features'];

  /** All tenant queries for invalidation - ['tenant', tenantId] */
  all: (tenantId: TenantId) => readonly ['tenant', TenantId];
}

// =============================================================================
// COMBINED QUERY KEYS
// =============================================================================

export interface AllQueryKeys {
  auth: AuthQueryKeys;
  profile: ProfileQueryKeys;
  tenant: TenantQueryKeys;
}

// =============================================================================
// MUTATION SCOPES
// =============================================================================

/**
 * Mutation scopes for serial execution.
 * Mutations within the same scope execute one at a time.
 */
export const MUTATION_SCOPES = {
  /** Profile mutations execute serially to prevent race conditions */
  PROFILE: 'profile-mutations',
  /** Auth mutations execute serially (but are not queued offline) */
  AUTH: 'auth-mutations',
} as const;

export type MutationScope = (typeof MUTATION_SCOPES)[keyof typeof MUTATION_SCOPES];
