import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { environment } from '../config/environment.config';
import { tenantRequestInterceptor } from './interceptors/tenantInterceptor';
import { errorResponseInterceptor } from './interceptors/errorInterceptor';
import { authRequestInterceptor } from './interceptors/authInterceptor';
import { logger } from '../logging/logger';
import { addBreadcrumb } from '../errors/sentry';

const DEFAULT_TIMEOUT = 30000;

interface RequestTiming {
  startTime: number;
}

const requestTimings = new WeakMap<InternalAxiosRequestConfig, RequestTiming>();

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: environment.apiBaseUrl,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptors (order matters - last added runs first)
  client.interceptors.request.use(tenantRequestInterceptor, (error) =>
    Promise.reject(error)
  );

  client.interceptors.request.use(authRequestInterceptor, (error) =>
    Promise.reject(error)
  );

  // Performance timing interceptor
  client.interceptors.request.use(
    (config) => {
      requestTimings.set(config, { startTime: Date.now() });
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptors
  client.interceptors.response.use(
    (response) => {
      const timing = requestTimings.get(response.config);
      const duration = timing ? Date.now() - timing.startTime : 0;

      logger.debug('API Response', {
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        duration: `${duration}ms`,
      });

      // Add breadcrumb for Sentry
      addBreadcrumb('api', `${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration,
      });

      // Warn on slow requests
      if (duration > 3000) {
        logger.warn('Slow API request detected', {
          url: response.config.url,
          duration: `${duration}ms`,
        });
      }

      return response;
    },
    errorResponseInterceptor
  );

  return client;
};

export const apiClient = createApiClient();

// Typed request methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export const setBaseUrl = (url: string): void => {
  apiClient.defaults.baseURL = url;
};
