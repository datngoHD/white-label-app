/**
 * Tenant Hooks
 *
 * Convenience hooks for accessing tenant information.
 * Uses TenantProvider context which is backed by TanStack Query.
 */

import { useTenantContext } from '@app/providers/tenant-provider';

import { getTenantStatusMessage, isTenantAvailable } from '../config/tenant.config';

/**
 * Hook to access tenant information
 *
 * @returns Tenant state and utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tenant, tenantId, isLoading, refreshTenant } = useTenant();
 *
 *   if (isLoading) return <Loading />;
 *   if (!tenant) return <Error />;
 *
 *   return <Text>{tenant.name}</Text>;
 * }
 * ```
 */
export const useTenant = () => {
  const { tenant, tenantId, isLoading, error, refreshTenant } = useTenantContext();

  return {
    tenant,
    tenantId,
    tenantName: tenant?.name ?? null,
    isLoading,
    error,
    refreshTenant,
    isAvailable: tenant ? isTenantAvailable(tenant) : false,
    statusMessage: tenant ? getTenantStatusMessage(tenant) : null,
  };
};

/**
 * Hook to get tenant API configuration
 *
 * @returns API configuration for current tenant
 */
export const useTenantApi = () => {
  const { tenant } = useTenantContext();

  return {
    baseUrl: tenant?.api.baseUrl ?? null,
    version: tenant?.api.version ?? 'v1',
  };
};

/**
 * Hook to get tenant metadata
 *
 * @returns Tenant metadata (support email, terms URL, etc.)
 */
export const useTenantMetadata = () => {
  const { tenant } = useTenantContext();

  return {
    supportEmail: tenant?.metadata.supportEmail ?? null,
    termsUrl: tenant?.metadata.termsUrl ?? null,
    privacyUrl: tenant?.metadata.privacyUrl ?? null,
  };
};
