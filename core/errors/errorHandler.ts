import { logger } from '../logging/logger';
import { ApiError } from '../types';

export interface ErrorContext {
  source?: string;
  action?: string;
  userId?: string;
  tenantId?: string;
  extra?: Record<string, unknown>;
}

export const handleError = (error: unknown, context?: ErrorContext): ApiError => {
  // Already formatted API error
  if (isApiError(error)) {
    logError(error, context);
    return error;
  }

  // JavaScript Error
  if (error instanceof Error) {
    const apiError: ApiError = {
      code: 'RUNTIME_ERROR',
      message: error.message,
      details: { stack: error.stack },
    };
    logError(apiError, context);
    return apiError;
  }

  // Unknown error type
  const unknownError: ApiError = {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: { raw: String(error) },
  };
  logError(unknownError, context);
  return unknownError;
};

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
};

const logError = (error: ApiError, context?: ErrorContext): void => {
  logger.error('Error occurred', {
    code: error.code,
    message: error.message,
    ...context,
  });

  // TODO: Report to Sentry when configured
  // if (Sentry.isInitialized()) {
  //   Sentry.captureException(error, { extra: context });
  // }
};

export const createUserFriendlyMessage = (error: ApiError): string => {
  // Map technical error codes to user-friendly messages
  const messageMap: Record<string, string> = {
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    AUTH_EXPIRED: 'Your session has expired. Please log in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NOT_FOUND: 'The requested item could not be found.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    SERVER_ERROR: 'Something went wrong. Please try again later.',
  };

  return messageMap[error.code] || error.message;
};
