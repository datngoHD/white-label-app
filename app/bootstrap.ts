import { apiClient, setupAuthInterceptors, authRequestInterceptor } from '@core/api';
import { currentBrand } from '@core/config/brand.config';
import { initializeSentry } from '@core/errors/sentry';
import { logger } from '@core/logging/logger';
import { performanceMonitor } from '@core/utils/performance';
import { logoutAndClearCache } from '@modules/auth/hooks/use-auth-mutation';
import { authService } from '@modules/auth/services/auth-service';

import '@core/i18n/i18n';

/**
 * Initialize the application
 * Called before rendering the root component
 */
export const bootstrap = async (): Promise<void> => {
  const startTime = Date.now();
  performanceMonitor.mark('bootstrap_start');

  try {
    // Initialize error tracking (Sentry)
    initializeSentry();

    // Setup API interceptors
    // Add request interceptor
    apiClient.interceptors.request.use(authRequestInterceptor, (error) => Promise.reject(error));
    
    // Add response interceptor with dependencies to break cycles
    setupAuthInterceptors(
      apiClient,
      (refreshToken) => authService.refreshToken(refreshToken),
      () => logoutAndClearCache()
    );

    // Initialize i18n (already imported)
    logger.debug('i18n initialized');

    // Mark bootstrap end and record startup time
    performanceMonitor.mark('bootstrap_end');
    const bootTime = Date.now() - startTime;
    performanceMonitor.setStartupTime(bootTime);
    performanceMonitor.measure('bootstrap', 'bootstrap_start', 'bootstrap_end');

    logger.info('App bootstrap complete', {
      bootTimeMs: bootTime,
      brand: currentBrand.id,
      tenant: currentBrand.defaultTenantId,
    });
  } catch (error) {
    logger.error('Bootstrap failed', { error });
    throw error;
  }
};

/**
 * Check if bootstrap has completed
 */
let bootstrapComplete = false;

export const isBootstrapped = (): boolean => bootstrapComplete;

export const markBootstrapped = (): void => {
  bootstrapComplete = true;
};
