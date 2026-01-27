import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store';
import { Tenant } from '@core/config/tenant.types';
import { getDefaultTenantConfig } from '@core/config/tenant.config';
import { setTenantId } from '@core/api';
import { logger } from '@core/logging/logger';

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  // For now, use default tenant config until tenant slice is integrated
  const [tenant, setTenant] = React.useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const initTenant = async () => {
      try {
        // Load default tenant config
        const defaultConfig = getDefaultTenantConfig();
        setTenant(defaultConfig);

        // Set tenant ID for API interceptor
        setTenantId(defaultConfig.id);

        logger.info('Tenant initialized', { tenantId: defaultConfig.id });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load tenant';
        setError(message);
        logger.error('Tenant initialization failed', { error: message });
      } finally {
        setIsLoading(false);
      }
    };

    initTenant();
  }, []);

  const refreshTenant = async (): Promise<void> => {
    // TODO: Fetch fresh tenant config from API
    logger.debug('Refreshing tenant config');
  };

  const value: TenantContextValue = {
    tenant,
    isLoading,
    error,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};

export const useTenantContext = (): TenantContextValue => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};
