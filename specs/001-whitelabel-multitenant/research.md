# Research: White-Label Multi-Tenant Mobile Application

**Feature**: 001-whitelabel-multitenant
**Date**: 2026-01-23
**Status**: Complete

## Research Summary

This document consolidates research findings for implementing a white-label multi-tenant React Native application using Expo. All technology decisions align with the project constitution.

---

## 1. White-Label Strategy (Brand Configuration)

### Decision: Hybrid Build-time + Runtime Configuration

**Rationale**: Mobile app stores require certain assets (icon, splash, app name, bundle ID) to be baked into the build. Visual theming (colors, fonts) can be applied at runtime for flexibility.

**Build-time Configuration** (per brand):
- App name
- Bundle ID / App ID
- App icon
- Splash screen

**Runtime Configuration** (per brand, changeable without rebuild):
- Color palette (primary, secondary, accent)
- Typography scale
- Logo displayed within app UI

### Implementation Pattern

```typescript
// app.config.js - Dynamic Expo config
export default ({ config }) => {
  const brand = process.env.BRAND || 'default';
  const brandConfig = require(`./config/brands/${brand}.json`);

  return {
    ...config,
    name: brandConfig.appName,
    slug: brandConfig.slug,
    ios: {
      bundleIdentifier: brandConfig.ios.bundleId,
      ...config.ios
    },
    android: {
      package: brandConfig.android.packageName,
      ...config.android
    }
  };
};
```

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Single app with runtime-only branding | App store requirements mandate build-time bundle ID and app name |
| Separate codebases per brand | Violates maintainability requirement; impossible to scale to 10+ brands |
| Native flavors only (no Expo) | Loses Expo ecosystem benefits; increases native complexity |

---

## 2. Multi-Tenant Data Isolation

### Decision: Tenant ID in All API Requests + Backend Enforcement

**Rationale**: The mobile app identifies the tenant (derived from brand configuration or user selection) and includes tenant context in all API requests. Backend enforces isolation - the mobile app cannot bypass this.

### Implementation Pattern

```typescript
// Tenant context injected via Axios interceptor
apiClient.interceptors.request.use((config) => {
  const tenantId = getTenantId(); // From brand config or auth context
  config.headers['X-Tenant-ID'] = tenantId;
  return config;
});
```

### Key Principles
- Tenant ID is determined at app startup (from brand config) or login (multi-tenant selection)
- All API requests include tenant context
- Mobile app never stores data from multiple tenants locally
- Backend is the source of truth for tenant isolation enforcement

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Client-side tenant filtering | Insecure; data leakage risk if client logic fails |
| Separate backend per tenant | Operational complexity; doesn't scale to 10+ brands |
| Tenant ID in URL path | Coupling; harder to change; potential routing issues |

---

## 3. Theme System Architecture

### Decision: React Context-based Theme with Brand Defaults + Tenant Overrides

**Rationale**: Provides runtime flexibility while maintaining type safety. Brand defaults are loaded at build time; tenant-specific overrides can be fetched at runtime.

### Implementation Pattern

```typescript
// Theme hierarchy: Brand defaults → Tenant overrides → User preferences
interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
}

const ThemeProvider: React.FC = ({ children }) => {
  const brandTheme = useBrandTheme();      // Build-time defaults
  const tenantOverrides = useTenantTheme(); // Runtime overrides

  const theme = deepMerge(brandTheme, tenantOverrides);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Theme Structure

```typescript
interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  error: string;
  success: string;
  warning: string;
}
```

---

## 4. Navigation Architecture

### Decision: React Navigation with Feature-based Navigators

**Rationale**: React Navigation is the standard for Expo apps. Feature-based navigators allow modules to own their navigation structure while maintaining a clean root navigator.

### Implementation Pattern

```typescript
// Root navigator composes feature navigators
const RootNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Each feature module exports its navigator
// modules/auth/navigation/AuthNavigator.tsx
// modules/profile/navigation/ProfileNavigator.tsx
```

### Navigation Structure
- `RootNavigator` - Authentication state switching
- `AuthNavigator` - Login, Register, Forgot Password
- `MainNavigator` - Tab navigation for main app
- Feature navigators nested as needed

---

## 5. State Management Strategy

### Decision: Redux Toolkit with Feature-based Slices

**Rationale**: Redux Toolkit (RTK) is mandated by constitution. Feature-based slices ensure modules own their state while maintaining a single store.

### Implementation Pattern

```typescript
// Each module has its own slice
// modules/auth/store/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { /* ... */ },
  extraReducers: { /* async thunks */ }
});

// Root reducer combines all slices
// core/store/rootReducer.ts
export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  // ... other feature slices
});
```

### State Structure
- `auth` - Authentication state (user, tokens, status)
- `tenant` - Current tenant configuration
- `theme` - Active theme (if runtime changes needed)
- Feature-specific state (profile, settings, etc.)

---

## 6. CI/CD Pipeline Architecture

### Decision: GitHub Actions + Fastlane with Matrix Builds

**Rationale**: GitHub Actions provides native CI/CD integration. Fastlane handles platform-specific build complexity. Matrix builds enable parallel brand/platform builds.

### Implementation Pattern

```yaml
# .github/workflows/build-ios.yml
jobs:
  build:
    strategy:
      matrix:
        brand: [default, brand-a, brand-b]
        environment: [staging, production]
    steps:
      - name: Build iOS
        run: |
          BRAND=${{ matrix.brand }} bundle exec fastlane ios build \
            --env ${{ matrix.environment }}
```

### Fastlane Lanes
- `ios build` - Build iOS app for specified brand
- `ios beta` - Deploy to TestFlight
- `ios release` - Deploy to App Store
- `android build` - Build Android APK/AAB
- `android beta` - Deploy to Play Store internal track
- `android release` - Deploy to Play Store production

### Build Artifacts
- Each brand produces separate iOS and Android builds
- Artifacts named with brand and environment: `brand-a-staging.ipa`, `brand-a-production.aab`

---

## 7. Authentication Flow

### Decision: Token-based Auth with Secure Storage

**Rationale**: Standard JWT/OAuth2 pattern. Tokens stored in expo-secure-store for security. Refresh token flow handled by Axios interceptors.

### Implementation Pattern

```typescript
// Token storage
import * as SecureStore from 'expo-secure-store';

const storeTokens = async (tokens: AuthTokens) => {
  await SecureStore.setItemAsync('accessToken', tokens.accessToken);
  await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
};

// Axios interceptor for token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newTokens = await refreshTokens();
      // Retry original request
    }
    return Promise.reject(error);
  }
);
```

---

## 8. Error Handling Strategy

### Decision: Centralized Error Boundary + Sentry Integration

**Rationale**: Error boundaries catch React errors. Sentry provides production error tracking. Centralized handler normalizes error shapes.

### Implementation Pattern

```typescript
// Global error handler
const handleError = (error: unknown, context?: string) => {
  const normalizedError = normalizeError(error);

  // Log locally
  logger.error(normalizedError, context);

  // Report to Sentry (production)
  if (!__DEV__) {
    Sentry.captureException(normalizedError);
  }
};

// Error boundary for UI
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    handleError(error, 'ErrorBoundary');
  }
}
```

---

## 9. Feature Flags / Remote Configuration

### Decision: Configuration Endpoint with Local Fallback

**Rationale**: Simple initial implementation. Tenant configuration endpoint returns feature flags. Local defaults ensure offline functionality.

### Implementation Pattern

```typescript
interface TenantConfig {
  features: {
    [featureKey: string]: boolean;
  };
  settings: {
    [settingKey: string]: unknown;
  };
}

const useFeatureFlag = (flag: string): boolean => {
  const tenantConfig = useSelector(selectTenantConfig);
  return tenantConfig?.features?.[flag] ?? defaultFeatureFlags[flag] ?? false;
};
```

### Future Enhancement
- Consider dedicated feature flag service (LaunchDarkly, Firebase Remote Config) if complexity increases

---

## 10. Offline Support Strategy

### Decision: Read-only Offline Mode for Basic Operations

**Rationale**: Full offline sync is complex. Initial implementation caches read data; write operations require connectivity.

### Implementation Pattern

```typescript
// Cache API responses for offline reading
const fetchWithCache = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    await AsyncStorage.setItem(`cache:${url}`, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (!isConnected()) {
      const cached = await AsyncStorage.getItem(`cache:${url}`);
      if (cached) return JSON.parse(cached);
    }
    throw error;
  }
};
```

### Offline Capabilities
- View cached profile data
- View cached settings
- Queue write operations for later (stretch goal)

---

## Resolved Clarifications

All technical context items from the plan have been resolved:

| Item | Resolution |
|------|------------|
| Language/Version | TypeScript (strict mode) - per constitution |
| Framework | Expo SDK (latest) with prebuild - per constitution |
| State Management | Redux Toolkit (RTK) - per constitution |
| Navigation | React Navigation - per constitution |
| HTTP Client | Axios with interceptors - per constitution |
| CI/CD | GitHub Actions + Fastlane - per constitution |

---

## References

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Fastlane Documentation](https://docs.fastlane.tools/)
