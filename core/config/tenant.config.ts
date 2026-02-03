import { currentBrand } from './brand.config';
import { environment } from './environment.config';
import { DEFAULT_FEATURE_FLAGS, Tenant } from './tenant.types';

/**
 * Get the default tenant configuration
 * Used when no tenant config is fetched from the backend
 */
export const getDefaultTenantConfig = (): Tenant => ({
  id: currentBrand.defaultTenantId,
  name: currentBrand.appName,
  status: 'active',
  api: {
    baseUrl: environment.apiBaseUrl,
    version: 'v1',
  },
  features: DEFAULT_FEATURE_FLAGS,
  metadata: {},
  updatedAt: new Date().toISOString(),
});

/**
 * Validate tenant configuration
 */
export const validateTenantConfig = (tenant: unknown): tenant is Tenant => {
  if (typeof tenant !== 'object' || tenant === null) {
    return false;
  }

  const t = tenant as Record<string, unknown>;

  return (
    typeof t['id'] === 'string' &&
    typeof t['name'] === 'string' &&
    ['active', 'suspended', 'maintenance'].includes(t['status'] as string) &&
    typeof t['api'] === 'object' &&
    t['api'] !== null
  );
};

/**
 * Check if tenant is available for use
 */
export const isTenantAvailable = (tenant: Tenant): boolean => {
  return tenant.status === 'active';
};

/**
 * Get tenant status message
 */
export const getTenantStatusMessage = (tenant: Tenant): string | null => {
  switch (tenant.status) {
    case 'suspended':
      return 'This account has been suspended. Please contact support.';
    case 'maintenance':
      return 'Service is temporarily unavailable for maintenance. Please try again later.';
    default:
      return null;
  }
};
