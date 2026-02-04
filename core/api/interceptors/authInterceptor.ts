import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';


import { logger } from '@core/logging/logger';
import { SECURE_KEYS } from '@core/storage/keys';

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

export const createAuthResponseInterceptor = (
  refreshTokenFn: () => Promise<string>,
  onRefreshFailed: () => void
) => {
  return async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
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
        .catch((err) => { throw err; });
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
