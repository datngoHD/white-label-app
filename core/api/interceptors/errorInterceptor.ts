import { AxiosError, AxiosResponse } from 'axios';
import { ApiError } from '@core/types';
import { logger } from '@core/logging/logger';

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const errorResponseInterceptor = (
  error: AxiosError<ApiErrorResponse>
): Promise<never> => {
  const { response, request, message } = error;

  if (response) {
    const { status, data } = response;

    const apiError: ApiError = {
      code: data?.code || `HTTP_${status}`,
      message: data?.message || getDefaultErrorMessage(status),
      details: data?.details,
    };

    logger.error('API Error', {
      status,
      code: apiError.code,
      message: apiError.message,
      url: error.config?.url,
    });

    return Promise.reject(apiError);
  }

  if (request) {
    const networkError: ApiError = {
      code: 'NETWORK_ERROR',
      message: 'Network request failed. Please check your connection.',
    };
    logger.error('Network Error', { message });
    return Promise.reject(networkError);
  }

  const unknownError: ApiError = {
    code: 'UNKNOWN_ERROR',
    message: message || 'An unexpected error occurred.',
  };
  logger.error('Unknown Error', { message });
  return Promise.reject(unknownError);
};

const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. Please try again.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please wait and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};
