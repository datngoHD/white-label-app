# Quickstart: White-Label Multi-Tenant Mobile Application

**Feature**: 001-whitelabel-multitenant
**Date**: 2026-01-23

## Prerequisites

- Node.js 18+ (LTS recommended)
- Yarn (package manager)
- Xcode 15+ (for iOS development, macOS only)
- Android Studio (for Android development)
- Expo CLI: `npm install -g expo-cli`

## Project Initialization

```bash
# Create new Expo project with bare-minimum template (per constitution)
npx create-expo-app rn-whitelabel-app --template bare-minimum

# Navigate to project directory
cd rn-whitelabel-app

# Install dependencies with Yarn
yarn install
```

## Install Required Dependencies

```bash
# Core dependencies (per constitution)
yarn add @reduxjs/toolkit react-redux
yarn add @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
yarn add react-native-screens react-native-safe-area-context
yarn add axios
yarn add i18next react-i18next
yarn add @sentry/react-native

# Expo packages
yarn add expo-secure-store
yarn add expo-constants
yarn add expo-splash-screen
yarn add expo-status-bar

# Development dependencies
yarn add -D typescript @types/react @types/react-native
yarn add -D jest @testing-library/react-native
yarn add -D eslint prettier
```

## Project Structure Setup

Create the required folder structure:

```bash
# Create directory structure (per constitution)
mkdir -p app/providers
mkdir -p modules/auth/{screens,components,hooks,services,store}
mkdir -p modules/profile/{screens,components,hooks,services,store}
mkdir -p modules/settings/{screens,components,hooks}
mkdir -p shared/{components,hooks,utils}
mkdir -p core/{config,theme,api/interceptors,store,i18n/locales,logging,errors,navigation}
mkdir -p assets/brands/{default,brand-a}
mkdir -p tests/{contract,integration,unit}
```

## Initial Configuration Files

### 1. Brand Configuration

Create `core/config/brand.config.ts`:

```typescript
import { Brand } from '../../contracts/types';

// Brand is determined at build time via BRAND environment variable
const brandId = process.env.BRAND || 'default';

const brands: Record<string, Brand> = {
  default: {
    id: 'default',
    appName: 'White Label App',
    slug: 'whitelabel-app',
    ios: {
      bundleId: 'com.example.whitelabelapp',
      teamId: 'TEAM123456',
    },
    android: {
      packageName: 'com.example.whitelabelapp',
    },
    defaultTenantId: 'tenant-default',
    assetsPath: 'assets/brands/default',
  },
  'brand-a': {
    id: 'brand-a',
    appName: 'Brand A App',
    slug: 'brand-a-app',
    ios: {
      bundleId: 'com.example.brandaapp',
      teamId: 'TEAM123456',
    },
    android: {
      packageName: 'com.example.brandaapp',
    },
    defaultTenantId: 'tenant-brand-a',
    assetsPath: 'assets/brands/brand-a',
  },
};

export const currentBrand: Brand = brands[brandId] || brands.default;
export const getBrand = (): Brand => currentBrand;
```

### 2. Dynamic Expo Configuration

Create `app.config.js` at project root:

```javascript
const brandId = process.env.BRAND || 'default';

const brands = {
  default: {
    name: 'White Label App',
    slug: 'whitelabel-app',
    ios: { bundleIdentifier: 'com.example.whitelabelapp' },
    android: { package: 'com.example.whitelabelapp' },
  },
  'brand-a': {
    name: 'Brand A App',
    slug: 'brand-a-app',
    ios: { bundleIdentifier: 'com.example.brandaapp' },
    android: { package: 'com.example.brandaapp' },
  },
};

const brand = brands[brandId] || brands.default;

export default ({ config }) => ({
  ...config,
  name: brand.name,
  slug: brand.slug,
  version: '1.0.0',
  orientation: 'portrait',
  icon: `./assets/brands/${brandId}/icon.png`,
  splash: {
    image: `./assets/brands/${brandId}/splash.png`,
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    ...config.ios,
    ...brand.ios,
    supportsTablet: true,
  },
  android: {
    ...config.android,
    ...brand.android,
    adaptiveIcon: {
      foregroundImage: `./assets/brands/${brandId}/adaptive-icon.png`,
      backgroundColor: '#ffffff',
    },
  },
  extra: {
    brandId,
  },
});
```

### 3. Environment Configuration

Create `core/config/environment.config.ts`:

```typescript
import { Environment, EnvironmentConfig } from '../../contracts/types';

const ENV = (process.env.APP_ENV as Environment) || 'development';

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
    sentryDsn: process.env.SENTRY_DSN,
    debug: true,
    useMocks: false,
    logLevel: 'info',
  },
  production: {
    name: 'production',
    apiBaseUrl: 'https://api.example.com/api/v1',
    sentryDsn: process.env.SENTRY_DSN,
    debug: false,
    useMocks: false,
    logLevel: 'error',
  },
};

export const environment: EnvironmentConfig = configs[ENV];
export const isDev = ENV === 'development';
export const isProd = ENV === 'production';
```

### 4. Theme Provider

Create `core/theme/ThemeProvider.tsx`:

```typescript
import React, { createContext, useContext, useMemo } from 'react';
import { Theme, ColorPalette, Typography, Spacing } from '../../contracts/types';

const defaultColors: ColorPalette = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: {
    primary: '#000000',
    secondary: '#6B6B6B',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',
};

const defaultTypography: Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

const defaultSpacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const defaultTheme: Theme = {
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  overrides?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  overrides,
}) => {
  const theme = useMemo(() => {
    if (!overrides) return defaultTheme;
    return {
      ...defaultTheme,
      colors: { ...defaultTheme.colors, ...overrides.colors },
      typography: { ...defaultTheme.typography, ...overrides.typography },
      spacing: { ...defaultTheme.spacing, ...overrides.spacing },
    };
  }, [overrides]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
```

### 5. Redux Store Setup

Create `core/store/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in these paths
        ignoredActions: ['auth/setTokens'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Create `core/store/rootReducer.ts`:

```typescript
import { combineReducers } from '@reduxjs/toolkit';

// Import feature slices as they are created
// import authReducer from '../../modules/auth/store/authSlice';

export const rootReducer = combineReducers({
  // auth: authReducer,
  // Add other feature reducers here
  _placeholder: (state = {}) => state, // Remove when adding real reducers
});
```

### 6. API Client

Create `core/api/client.ts`:

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { getBrand } from '../config/brand.config';
import { environment } from '../config/environment.config';

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: environment.apiBaseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add tenant ID and auth token
  client.interceptors.request.use(
    async (config) => {
      const brand = getBrand();
      config.headers['X-Tenant-ID'] = brand.defaultTenantId;

      // TODO: Add auth token from secure storage
      // const token = await SecureStore.getItemAsync('accessToken');
      // if (token) config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // TODO: Handle 401 and token refresh
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
```

## Running the Application

### Development Mode

```bash
# Start Metro bundler
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android
```

### Building for Different Brands

```bash
# Build for default brand
BRAND=default yarn ios

# Build for Brand A
BRAND=brand-a yarn ios

# Generate native projects
BRAND=brand-a npx expo prebuild --clean
```

### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage

# Run specific test file
yarn test tests/unit/auth.test.ts
```

## Next Steps

1. **Implement Auth Module**: Create authentication screens, Redux slice, and services
2. **Set Up Navigation**: Configure React Navigation with auth flow
3. **Add Theme Integration**: Wire up theme provider with tenant overrides
4. **Configure CI/CD**: Set up GitHub Actions and Fastlane
5. **Add Sentry**: Initialize error tracking

## Useful Commands

```bash
# Type checking
yarn tsc --noEmit

# Linting
yarn lint

# Format code
yarn prettier --write .

# Clean build cache
yarn start --reset-cache

# Regenerate native projects
npx expo prebuild --clean
```

## Troubleshooting

### Metro bundler issues

```bash
# Clear Metro cache
yarn start --reset-cache

# Clear watchman
watchman watch-del-all
```

### iOS build issues

```bash
# Clean iOS build
cd ios && rm -rf build && pod install && cd ..
```

### Android build issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
```
