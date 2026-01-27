import * as Sentry from '@sentry/react-native';

import { getCurrentBrandId } from '../config/brand.config';
import { environment, isProd, isStaging } from '../config/environment.config';
import { logger } from '../logging/logger';

interface SentryConfig {
  dsn: string;
  environment: string;
  enabled: boolean;
  tracesSampleRate: number;
  debug: boolean;
}

const getSentryConfig = (): SentryConfig => {
  const dsn = process.env.SENTRY_DSN || '';

  return {
    dsn,
    environment: environment.name,
    enabled: (isProd || isStaging) && !!dsn,
    tracesSampleRate: isProd ? 0.1 : isStaging ? 0.5 : 1.0,
    debug: !isProd,
  };
};

export const initializeSentry = (): void => {
  const config = getSentryConfig();

  if (!config.enabled) {
    logger.info('Sentry disabled - not in production/staging or DSN not configured');
    return;
  }

  try {
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      tracesSampleRate: config.tracesSampleRate,
      debug: config.debug,

      // Set tags for filtering
      beforeSend: (event: Sentry.Event) => {
        event.tags = {
          ...event.tags,
          brand: getCurrentBrandId(),
        };
        return event;
      },

      // Integrations
      integrations: [Sentry.reactNativeTracingIntegration()],
    });

    // Set initial context
    Sentry.setTag('brand', getCurrentBrandId());

    logger.info('Sentry initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Sentry', { error });
  }
};

export const setUserContext = (user: { id: string; email?: string; tenantId?: string }): void => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });

  if (user.tenantId) {
    Sentry.setTag('tenant_id', user.tenantId);
  }
};

export const clearUserContext = (): void => {
  Sentry.setUser(null);
};

export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
): void => {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
};

export const addBreadcrumb = (
  category: string,
  message: string,
  data?: Record<string, unknown>
): void => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
};

export const startTransaction = (name: string, op: string): Sentry.Span | undefined => {
  return Sentry.startInactiveSpan({ name, op });
};

export { Sentry };
