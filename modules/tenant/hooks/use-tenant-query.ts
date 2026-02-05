/**
 * Tenant Query Hook
 *
 * Manages tenant configuration fetching using TanStack Query.
 * Supports offline caching and automatic refetching.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getDefaultTenantConfig } from '@core/config/tenant.config';
import { Tenant } from '@core/config/tenant.types';

import { tenantKeys } from '../queries/tenant-query-keys';
import { tenantService } from '../services/tenant-service';

/**
 * Hook return type for tenant query
 */
export interface UseTenantQueryReturn {
  tenant: Tenant | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch tenant configuration
 * Falls back to default config if API call fails
 */
async function fetchTenantConfig(tenantId: string): Promise<Tenant> {
  try {
    return await tenantService.getTenantConfig(tenantId);
  } catch {
    // Fall back to default tenant config if API fails
    const defaultConfig = getDefaultTenantConfig();
    if (defaultConfig.id === tenantId) {
      return defaultConfig;
    }
    throw new Error(`Failed to fetch tenant config for ${tenantId}`);
  }
}

/**
 * Hook for fetching and caching tenant configuration
 *
 * @param tenantId - Tenant ID to fetch configuration for
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Tenant query state and actions
 */
export function useTenantQuery(
  tenantId: string,
  enabled = true
): UseTenantQueryReturn {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    ...tenantKeys.config(tenantId),
    queryFn: () => fetchTenantConfig(tenantId),
    enabled: enabled && !!tenantId,
    // Tenant config doesn't change often, use longer stale time
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleRefetch = async () => {
    await refetch();
  };

  return {
    tenant: data ?? null,
    isLoading,
    isFetching,
    error: error,
    refetch: handleRefetch,
  };
}

/**
 * Hook for fetching tenant feature flags
 *
 * @param tenantId - Tenant ID to fetch features for
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Feature flags query state
 */
export function useTenantFeaturesQuery(
  tenantId: string,
  enabled = true
): {
  features: Record<string, boolean> | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useQuery({
    ...tenantKeys.features(tenantId),
    queryFn: () => tenantService.getFeatureFlags(tenantId),
    enabled: enabled && !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    features: data ?? null,
    isLoading,
    error: error,
  };
}

/**
 * Set tenant data directly in the cache
 */
export function setTenantData(
  queryClient: ReturnType<typeof useQueryClient>,
  tenant: Tenant,
  tenantId: string
): void {
  queryClient.setQueryData(tenantKeys.config(tenantId).queryKey, tenant);
}

/**
 * Invalidate tenant query to trigger refetch
 */
export function invalidateTenant(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string
): Promise<void> {
  return queryClient.invalidateQueries({
    queryKey: tenantKeys.config(tenantId).queryKey,
  });
}

/**
 * Clear all tenant data from cache
 */
export function clearTenantCache(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string
): void {
  queryClient.removeQueries({
    queryKey: tenantKeys.all(tenantId).queryKey,
  });
}

export default useTenantQuery;
