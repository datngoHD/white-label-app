/**
 * Feature Flags Configuration
 * Runtime feature toggles for tenant-specific functionality
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
}

export interface FeatureFlagsConfig {
  flags: Record<string, boolean>;
  lastUpdated: string;
}

/**
 * Known feature flag keys
 * Use these constants instead of string literals
 */
export const FEATURE_FLAGS = {
  SOCIAL_LOGIN: 'socialLogin',
  PUSH_NOTIFICATIONS: 'pushNotifications',
  BIOMETRIC_AUTH: 'biometricAuth',
  OFFLINE_MODE: 'offlineMode',
  ANALYTICS: 'analytics',
  DARK_MODE: 'darkMode',
  BETA_FEATURES: 'betaFeatures',
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

/**
 * Default feature flag values
 */
export const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  [FEATURE_FLAGS.SOCIAL_LOGIN]: false,
  [FEATURE_FLAGS.PUSH_NOTIFICATIONS]: true,
  [FEATURE_FLAGS.BIOMETRIC_AUTH]: true,
  [FEATURE_FLAGS.OFFLINE_MODE]: true,
  [FEATURE_FLAGS.ANALYTICS]: true,
  [FEATURE_FLAGS.DARK_MODE]: true,
  [FEATURE_FLAGS.BETA_FEATURES]: false,
};
