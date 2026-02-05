import Constants from 'expo-constants';

import { Environment, EnvironmentConfig } from '../types';

const ENV =
  (Constants.expoConfig?.extra?.['APP_ENV'] as Environment) ||
  (process.env['APP_ENV'] as Environment) ||
  'development';

const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'development',
    apiBaseUrl: 'http://localhost:3000/api/v1',
    debug: true,
    useMocks: true,
    logLevel: 'debug',
  },
  staging: {
    name: 'staging',
    apiBaseUrl: 'https://staging-api.example.com/api/v1',
    sentryDsn: process.env['SENTRY_DSN'],
    debug: true,
    useMocks: false,
    logLevel: 'info',
  },
  production: {
    name: 'production',
    apiBaseUrl: 'https://api.example.com/api/v1',
    sentryDsn: process.env['SENTRY_DSN'],
    debug: false,
    useMocks: false,
    logLevel: 'error',
  },
};

export const environment: EnvironmentConfig = configs[ENV];
export const isDev = ENV === 'development';
export const isStaging = ENV === 'staging';
export const isProd = ENV === 'production';
export const currentEnv = ENV;
