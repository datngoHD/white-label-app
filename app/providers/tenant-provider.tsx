/**
 * Tenant Provider
 *
 * Provides tenant context using TanStack Query for state management.
 * Supports offline caching and automatic refetching.
 */

import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';


import { setTenantId } from '@core/api';
import { getDefaultTenantConfig } from '@core/config/tenant.config';
import { Tenant } from '@core/config/tenant.types';
import { logger } from '@core/logging/logger';
import { useTenantQuery, invalidateTenant } from '@modules/tenant/hooks/use-tenant-query';


interface TenantContextValue {
  tenant: Tenant | null;
  tenantId: string;
  isLoading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  /** Override the default tenant ID (useful for testing or multi-tenant apps) */
  tenantId?: string;
}

/**
 * TenantProvider component
 *
 * Wraps the app with tenant context backed by TanStack Query.
 * Automatically loads tenant configuration on mount.
 */
export const TenantProvider: React.FC<TenantProviderProps> = ({
  children,
  tenantId: propTenantId,
}) => {
  const queryClient = useQueryClient();

  // Get default tenant ID from config if not provided
  const defaultConfig = getDefaultTenantConfig();
  const tenantId = propTenantId ?? defaultConfig.id;

  // Use TanStack Query for tenant data
  const {
    tenant: queriedTenant,
    isLoading,
    error: queryError,
    refetch,
  } = useTenantQuery(tenantId);

  // Use default config as fallback while loading or on error
  const tenant = useMemo(() => {
    if (queriedTenant) {
      return queriedTenant;
    }
    // Return default config if query hasn't loaded yet or failed
    if (tenantId === defaultConfig.id) {
      return defaultConfig;
    }
    return null;
  }, [queriedTenant, tenantId, defaultConfig]);

  // Set tenant ID for API interceptor when tenant changes
  useEffect(() => {
    if (tenant?.id) {
      setTenantId(tenant.id);
      logger.info('Tenant initialized', { tenantId: tenant.id });
    }
  }, [tenant?.id]);

  // Refresh tenant configuration
  const refreshTenant = useCallback(async (): Promise<void> => {
    logger.debug('Refreshing tenant config', { tenantId });
    await invalidateTenant(queryClient, tenantId);
    await refetch();
  }, [queryClient, tenantId, refetch]);

  // Convert error to string for context
  const error = queryError?.message ?? null;

  const value: TenantContextValue = useMemo(
    () => ({
      tenant,
      tenantId,
      isLoading,
      error,
      refreshTenant,
    }),
    [tenant, tenantId, isLoading, error, refreshTenant]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

/**
 * Hook to access tenant context
 *
 * @throws Error if used outside of TenantProvider
 */
export const useTenantContext = (): TenantContextValue => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};
