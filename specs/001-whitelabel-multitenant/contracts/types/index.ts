/**
 * Shared Type Definitions
 * White-Label Multi-Tenant Mobile Application
 *
 * These types are shared between mobile app and backend.
 * Generated from OpenAPI specifications.
 */

// ============================================================================
// Brand Configuration (Build-time)
// ============================================================================

export interface Brand {
  /** Unique brand identifier (slug format) */
  id: string;
  /** Display name shown in app stores */
  appName: string;
  /** URL-safe slug for the brand */
  slug: string;
  /** iOS-specific configuration */
  ios: {
    bundleId: string;
    teamId: string;
  };
  /** Android-specific configuration */
  android: {
    packageName: string;
  };
  /** Default tenant ID for this brand */
  defaultTenantId: string;
  /** Path to brand assets directory */
  assetsPath: string;
}

export interface BrandAssets {
  icon: string;
  splash: string;
  adaptiveIconForeground?: string;
  logo: string;
  favicon?: string;
}

// ============================================================================
// Tenant Configuration (Runtime)
// ============================================================================

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

// ============================================================================
// Theme
// ============================================================================

export interface ThemeOverrides {
  colors?: Partial<ColorPalette>;
  typography?: Partial<Typography>;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: TextColors;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
  inverse: string;
}

export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// ============================================================================
// User
// ============================================================================

export interface User {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserPreferences {
  locale: string;
  themeMode: ThemeMode;
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  marketing: boolean;
}

export interface AccessibilityPreferences {
  reduceMotion: boolean;
  largeText: boolean;
}

// ============================================================================
// Authentication
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: 'Bearer';
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface TenantStatusResponse {
  status: TenantStatus;
  message: string;
  estimatedResolution?: string;
}

// ============================================================================
// Redux State Types
// ============================================================================

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  status: AuthStateStatus;
  error: string | null;
  isRestored: boolean;
}

export type AuthStateStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface TenantState {
  config: Tenant | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error: string | null;
}

// ============================================================================
// Environment Configuration
// ============================================================================

export interface EnvironmentConfig {
  name: Environment;
  apiBaseUrl: string;
  sentryDsn?: string;
  debug: boolean;
  useMocks: boolean;
  logLevel: LogLevel;
}

export type Environment = 'development' | 'staging' | 'production';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  USER_PREFERENCES: '@app/userPreferences',
  TENANT_CONFIG: '@app/tenantConfig',
  CACHE_PREFIX: '@app/cache/',
  ONBOARDING_COMPLETE: '@app/onboardingComplete',
} as const;

export const SECURE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  BIOMETRIC_CREDENTIAL: 'biometricCredential',
} as const;

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  socialLogin: false,
  pushNotifications: true,
  biometricAuth: true,
  offlineMode: true,
  analytics: true,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  locale: 'en',
  themeMode: 'system',
  notifications: {
    push: true,
    email: true,
    marketing: false,
  },
  accessibility: {
    reduceMotion: false,
    largeText: false,
  },
};
