import { currentBrand } from '@core/config/brand.config';
import { environment, isDev } from '@core/config/environment.config';
import { initializeSentry } from '@core/errors/sentry';
import { logger } from '@core/logging/logger';
import { performanceMonitor } from '@core/utils/performance';

import '@core/i18n/i18n';

/**
 * Initialize the application
 * Called before rendering the root component
 */
export const bootstrap = async (): Promise<void> => {
  const startTime = Date.now();
  performanceMonitor.mark('bootstrap_start');

  try {
    logger.info('App bootstrap starting', {
      brand: currentBrand.id,
      environment: environment.name,
    });

    // Initialize error tracking (Sentry)
    initializeSentry();

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
