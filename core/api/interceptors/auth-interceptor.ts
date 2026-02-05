/**
 * Auth Interceptor
 *
 * Handles authentication for API requests:
 * - Attaches access token to outgoing requests
 * - Handles 401 responses with token refresh
 * - Queues requests during token refresh
 * - Clears auth state on refresh failure
 */

import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { logger } from '@core/logging/logger';
import { SECURE_KEYS } from '@core/storage/keys';
import { tokenStorage } from '@core/storage/token-storage';

// Types for auth service interactions
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthResponse {
  tokens: AuthTokens;
  user: any;
}

type RefreshTokenFn = (refreshToken: string) => Promise<AuthResponse>;
type LogoutFn = () => Promise<void>;

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  }
  failedQueue = [];
};

/**
 * Request interceptor to attach access token
 */
export const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    const token = await SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } catch (error) {
    logger.error('Failed to get access token', { error });
  }
  return config;
};

/**
 * Refresh the access token using the stored refresh token
 */
async function refreshAccessToken(refreshTokenFn: RefreshTokenFn): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await refreshTokenFn(refreshToken);

  // Save new tokens to secure storage
  await tokenStorage.saveTokens({
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    expiresAt: Date.now() + response.tokens.expiresIn * 1000,
  });

  return response.tokens.accessToken;
}

/**
 * Handle refresh token failure by clearing auth state
 */
async function handleRefreshFailure(logoutFn: LogoutFn): Promise<void> {
  logger.warn('Token refresh failed, logging out user');
  await logoutFn();
}

/**
 * Create the auth response interceptor for 401 handling
 *
 * @param refreshTokenFn - Function to refresh the access token
 * @param onRefreshFailed - Callback when token refresh fails
 */
export const createAuthResponseInterceptor = (
  refreshTokenFn: () => Promise<string>,
  onRefreshFailed: () => void
) => {
  return async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      throw error;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return originalRequest;
        })
        .catch((err) => {
          throw err;
        });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshTokenFn();
      processQueue(null, newToken);
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return originalRequest;
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      onRefreshFailed();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  };
};

/**
 * Setup auth interceptors on an Axios instance
 *
 * This function should be called during app initialization to configure
 * the auth response interceptor with TanStack Query integration.
 *
 * @param axiosInstance - The Axios instance to configure
 * @param refreshTokenFn - Function to refresh the access token
 * @param logoutFn - Function to handle logout on refresh failure
 */
export function setupAuthInterceptors(
  axiosInstance: AxiosInstance,
  refreshTokenFn: RefreshTokenFn,
  logoutFn: LogoutFn
): void {
  // Add the response interceptor for 401 handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    createAuthResponseInterceptor(
      () => refreshAccessToken(refreshTokenFn),
      () => {
        void handleRefreshFailure(logoutFn);
      }
    )
  );

  logger.debug('Auth interceptors configured');
}
