import { useTenantContext } from '@app/providers/TenantProvider';

import { getTenantStatusMessage, isTenantAvailable } from '../config/tenant.config';

/**
 * Hook to access tenant information
 */
export const useTenant = () => {
  const { tenant, isLoading, error, refreshTenant } = useTenantContext();

  return {
    tenant,
    tenantId: tenant?.id ?? null,
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
 */
export const useTenantMetadata = () => {
  const { tenant } = useTenantContext();

  return {
    supportEmail: tenant?.metadata.supportEmail ?? null,
    termsUrl: tenant?.metadata.termsUrl ?? null,
    privacyUrl: tenant?.metadata.privacyUrl ?? null,
  };
};
