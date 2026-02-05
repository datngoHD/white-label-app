/**
 * AsyncStorage keys for non-sensitive data
 * Note: Token storage uses SECURE_KEYS (see below) for SecureStore
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: '@app/userPreferences',
  TENANT_CONFIG: '@app/tenantConfig',
  CACHE_PREFIX: '@app/cache/',
  ONBOARDING_COMPLETE: '@app/onboardingComplete',
  LAST_SYNC_TIME: '@app/lastSyncTime',
  OFFLINE_QUEUE: '@app/offlineQueue',
} as const;

/**
 * SecureStore keys for sensitive data
 * Keys must contain only alphanumeric characters, ".", "-", and "_"
 */
export const SECURE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  BIOMETRIC_CREDENTIAL: 'biometricCredential',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];
