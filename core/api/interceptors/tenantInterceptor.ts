import { InternalAxiosRequestConfig } from 'axios';

import { logger } from '@core/logging/logger';

let currentTenantId: string | null = null;

export const setTenantId = (tenantId: string | null): void => {
  currentTenantId = tenantId;
  logger.debug('Tenant ID updated', { tenantId });
};

export const getTenantId = (): string | null => currentTenantId;

export const tenantRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (currentTenantId) {
    config.headers.set('X-Tenant-ID', currentTenantId);
  }
  return config;
};
