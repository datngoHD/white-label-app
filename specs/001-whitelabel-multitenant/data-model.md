# Data Model: White-Label Multi-Tenant Mobile Application

**Feature**: 001-whitelabel-multitenant
**Date**: 2026-01-23
**Status**: Complete

## Overview

This document defines the data models for the white-label multi-tenant mobile application. Models are divided into:

- **Build-time Configuration** - Baked into app at build time
- **Runtime Configuration** - Fetched/stored at runtime
- **Domain Entities** - Core business objects

---

## Build-time Configuration Models

### Brand

Represents a white-label brand configuration. Defined in JSON files under `config/brands/`.

```typescript
interface Brand {
  /** Unique brand identifier (slug format) */
  id: string;

  /** Display name shown in app stores */
  appName: string;

  /** URL-safe slug for the brand */
  slug: string;

  /** iOS-specific configuration */
  ios: {
    /** Bundle identifier (e.g., com.company.brandname) */
    bundleId: string;
    /** App Store team ID */
    teamId: string;
  };

  /** Android-specific configuration */
  android: {
    /** Package name (e.g., com.company.brandname) */
    packageName: string;
  };

  /** Default tenant ID for this brand (1:1 brand-tenant mapping) */
  defaultTenantId: string;

  /** Path to brand assets directory */
  assetsPath: string;
}
```

**Validation Rules**:

- `id`: Required, alphanumeric with hyphens, unique across brands
- `appName`: Required, 2-30 characters
- `slug`: Required, lowercase alphanumeric with hyphens
- `ios.bundleId`: Required, valid reverse domain format
- `android.packageName`: Required, valid Java package format

**Example**:

```json
{
  "id": "brand-alpha",
  "appName": "Alpha App",
  "slug": "alpha-app",
  "ios": {
    "bundleId": "com.example.alphaapp",
    "teamId": "TEAM123456"
  },
  "android": {
    "packageName": "com.example.alphaapp"
  },
  "defaultTenantId": "tenant-alpha",
  "assetsPath": "assets/brands/brand-alpha"
}
```

---

### BrandAssets

Assets required for each brand build.

```typescript
interface BrandAssets {
  /** App icon (1024x1024 PNG, will be resized) */
  icon: string;

  /** Splash screen image */
  splash: string;

  /** Adaptive icon for Android (foreground layer) */
  adaptiveIconForeground?: string;

  /** Logo for in-app display (SVG or PNG) */
  logo: string;

  /** Favicon for web (if applicable) */
  favicon?: string;
}
```

**File Requirements**:

- `icon`: PNG, 1024x1024px minimum, no transparency
- `splash`: PNG, 1284x2778px recommended (largest iPhone size)
- `logo`: PNG or SVG, transparent background preferred

---

## Runtime Configuration Models

### Tenant

Represents a tenant (data isolation boundary). Fetched from backend at runtime.

```typescript
interface Tenant {
  /** Unique tenant identifier */
  id: string;

  /** Human-readable tenant name */
  name: string;

  /** Tenant status */
  status: TenantStatus;

  /** API configuration for this tenant */
  api: {
    /** Base URL for API requests */
    baseUrl: string;
    /** API version */
    version: string;
  };

  /** Feature flags for this tenant */
  features: FeatureFlags;

  /** Theme overrides (runtime theming) */
  theme?: ThemeOverrides;

  /** Tenant metadata */
  metadata: {
    /** Contact email for support */
    supportEmail?: string;
    /** Terms of service URL */
    termsUrl?: string;
    /** Privacy policy URL */
    privacyUrl?: string;
  };

  /** Timestamp of last configuration update */
  updatedAt: string;
}

type TenantStatus = 'active' | 'suspended' | 'maintenance';
```

**Validation Rules**:

- `id`: Required, UUID format
- `status`: Required, must be valid TenantStatus
- `api.baseUrl`: Required, valid HTTPS URL

---

### FeatureFlags

Feature toggles configurable per tenant.

```typescript
interface FeatureFlags {
  /** Enable social login options */
  socialLogin: boolean;

  /** Enable push notifications */
  pushNotifications: boolean;

  /** Enable biometric authentication */
  biometricAuth: boolean;

  /** Enable offline mode */
  offlineMode: boolean;

  /** Enable analytics tracking */
  analytics: boolean;

  /** Custom feature flags (extensible) */
  [key: string]: boolean;
}
```

**Default Values**:

```typescript
const defaultFeatureFlags: FeatureFlags = {
  socialLogin: false,
  pushNotifications: true,
  biometricAuth: true,
  offlineMode: true,
  analytics: true,
};
```

---

### ThemeOverrides

Runtime theme customization per tenant.

```typescript
interface ThemeOverrides {
  colors?: Partial<ColorPalette>;
  typography?: Partial<Typography>;
}

interface ColorPalette {
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

interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
  inverse: string;
}

interface Typography {
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
```

---

## Domain Entities

### User

An individual user account within a tenant.

```typescript
interface User {
  /** Unique user identifier */
  id: string;

  /** Tenant this user belongs to */
  tenantId: string;

  /** User's email address (globally unique) */
  email: string;

  /** User's display name */
  displayName: string;

  /** User's first name */
  firstName?: string;

  /** User's last name */
  lastName?: string;

  /** URL to user's avatar image */
  avatarUrl?: string;

  /** User's role within the tenant */
  role: UserRole;

  /** Account status */
  status: UserStatus;

  /** User preferences */
  preferences: UserPreferences;

  /** Account creation timestamp */
  createdAt: string;

  /** Last login timestamp */
  lastLoginAt?: string;
}

type UserRole = 'admin' | 'user';
type UserStatus = 'active' | 'inactive' | 'pending';
```

**Validation Rules**:

- `email`: Required, valid email format, globally unique across all tenants
- `displayName`: Required, 1-100 characters
- `tenantId`: Required, must reference valid tenant
- `role`: Required, must be valid UserRole

**State Transitions**:

```
pending → active (email verified)
active → inactive (admin deactivation)
inactive → active (admin reactivation)
```

---

### UserPreferences

User-specific preferences stored locally and synced with backend.

```typescript
interface UserPreferences {
  /** Preferred locale (e.g., 'en', 'es', 'fr') */
  locale: string;

  /** Preferred theme mode */
  themeMode: 'light' | 'dark' | 'system';

  /** Notification preferences */
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };

  /** Accessibility preferences */
  accessibility: {
    reduceMotion: boolean;
    largeText: boolean;
  };
}
```

**Default Values**:

```typescript
const defaultPreferences: UserPreferences = {
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
```

---

### AuthTokens

Authentication tokens for API access.

```typescript
interface AuthTokens {
  /** JWT access token for API requests */
  accessToken: string;

  /** Refresh token for obtaining new access tokens */
  refreshToken: string;

  /** Access token expiration timestamp (ISO 8601) */
  expiresAt: string;

  /** Token type (always 'Bearer') */
  tokenType: 'Bearer';
}
```

**Storage**: Stored in `expo-secure-store` (encrypted device storage)

---

### AuthState

Redux state for authentication.

```typescript
interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;

  /** Authentication tokens */
  tokens: AuthTokens | null;

  /** Authentication status */
  status: AuthStatus;

  /** Error from last auth operation */
  error: string | null;

  /** Whether auth state has been restored from storage */
  isRestored: boolean;
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
```

---

## Environment Configuration

### EnvironmentConfig

Environment-specific configuration.

```typescript
interface EnvironmentConfig {
  /** Environment name */
  name: 'development' | 'staging' | 'production';

  /** Default API base URL (can be overridden by tenant) */
  apiBaseUrl: string;

  /** Sentry DSN for error reporting */
  sentryDsn?: string;

  /** Enable debug mode */
  debug: boolean;

  /** Enable mock data/APIs */
  useMocks: boolean;

  /** Log level */
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
```

---

## Entity Relationships

```
┌─────────────┐     1:1      ┌─────────────┐
│    Brand    │─────────────▶│   Tenant    │
└─────────────┘              └─────────────┘
                                   │
                                   │ 1:N
                                   ▼
                             ┌─────────────┐
                             │    User     │
                             └─────────────┘
                                   │
                                   │ 1:1
                                   ▼
                             ┌─────────────┐
                             │ Preferences │
                             └─────────────┘
```

**Relationships**:

- Brand → Tenant: 1:1 (each brand maps to exactly one tenant)
- Tenant → User: 1:N (a tenant has many users)
- User → UserPreferences: 1:1 (each user has one preferences object)

---

## Local Storage Schema

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  // User preferences (not sensitive)
  USER_PREFERENCES: '@app/userPreferences',

  // Cached tenant configuration
  TENANT_CONFIG: '@app/tenantConfig',

  // API response cache prefix
  CACHE_PREFIX: '@app/cache/',

  // Onboarding completed flag
  ONBOARDING_COMPLETE: '@app/onboardingComplete',
} as const;
```

### SecureStore Keys

```typescript
const SECURE_KEYS = {
  // Authentication tokens
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',

  // Biometric auth credential reference
  BIOMETRIC_CREDENTIAL: 'biometricCredential',
} as const;
```

---

## Validation Summary

| Entity     | Required Fields                                      | Unique Constraints                    |
| ---------- | ---------------------------------------------------- | ------------------------------------- |
| Brand      | id, appName, slug, ios.bundleId, android.packageName | id, ios.bundleId, android.packageName |
| Tenant     | id, name, status, api.baseUrl                        | id                                    |
| User       | id, tenantId, email, displayName, role, status       | email (global)                        |
| AuthTokens | accessToken, refreshToken, expiresAt                 | -                                     |
