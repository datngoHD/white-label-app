import { ThemeOverrides } from '../types';

/**
 * Tenant Configuration Types
 * Runtime configuration for multi-tenant isolation
 */

export type TenantStatus = 'active' | 'suspended' | 'maintenance';

export interface TenantMetadata {
  supportEmail?: string;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface FeatureFlags {
  socialLogin: boolean;
  pushNotifications: boolean;
  biometricAuth: boolean;
  offlineMode: boolean;
  analytics: boolean;
  [key: string]: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  api: {
    baseUrl: string;
    version: string;
  };
  features: FeatureFlags;
  theme?: ThemeOverrides;
  metadata: TenantMetadata;
  updatedAt: string;
}

export interface TenantConfig {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  socialLogin: false,
  pushNotifications: true,
  biometricAuth: true,
  offlineMode: true,
  analytics: true,
};
