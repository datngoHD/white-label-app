import { api } from '../../../core/api';
import { Tenant, TenantStatus } from '../../../core/config/tenant.types';
import { logger } from '../../../core/logging/logger';

interface TenantStatusResponse {
  status: TenantStatus;
  message: string;
  estimatedResolution?: string;
}

/**
 * Tenant Service
 * Handles all tenant-related API operations
 */
export const tenantService = {
  /**
   * Get tenant configuration by ID
   */
  getTenantConfig: async (tenantId: string): Promise<Tenant> => {
    logger.debug('Fetching tenant config', { tenantId });
    const response = await api.get<Tenant>(`/tenants/${tenantId}/config`);
    return response;
  },

  /**
   * Get tenant status
   */
  getTenantStatus: async (tenantId: string): Promise<TenantStatusResponse> => {
    logger.debug('Fetching tenant status', { tenantId });
    const response = await api.get<TenantStatusResponse>(`/tenants/${tenantId}/status`);
    return response;
  },

  /**
   * Refresh tenant configuration
   */
  refreshTenantConfig: async (tenantId: string): Promise<Tenant> => {
    logger.debug('Refreshing tenant config', { tenantId });
    const response = await api.get<Tenant>(`/tenants/${tenantId}/config?refresh=true`);
    return response;
  },

  /**
   * Get tenant feature flags
   */
  getFeatureFlags: async (tenantId: string): Promise<Record<string, boolean>> => {
    logger.debug('Fetching feature flags', { tenantId });
    const response = await api.get<{ features: Record<string, boolean> }>(
      `/tenants/${tenantId}/features`
    );
    return response.features;
  },

  /**
   * Check if a specific feature is enabled for tenant
   */
  isFeatureEnabled: async (tenantId: string, featureKey: string): Promise<boolean> => {
    const features = await tenantService.getFeatureFlags(tenantId);
    return features[featureKey] ?? false;
  },
};
