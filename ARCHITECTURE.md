# Architecture Documentation

## Overview

This is a white-label, multi-tenant React Native application built with Expo. The architecture follows Clean Architecture principles with feature-based modules.

## Directory Structure

```
├── app/                    # Application entry point
│   ├── App.tsx            # Root component
│   ├── bootstrap.ts       # App initialization
│   └── providers/         # Context providers
│
├── core/                   # Core infrastructure
│   ├── api/               # Axios client and interceptors
│   ├── config/            # Brand, tenant, environment configs
│   │   └── brands/        # Brand-specific JSON configurations
│   ├── errors/            # Error handling and boundaries
│   ├── hooks/             # Core custom hooks
│   ├── i18n/              # Internationalization
│   │   └── locales/       # Translation files
│   ├── logging/           # Logging abstraction
│   ├── navigation/        # React Navigation setup
│   ├── permissions/       # Role-based access control
│   ├── stores/            # Zustand stores (auth, UI, tenant)
│   ├── theme/             # Theming system
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Utility functions
│
├── modules/               # Feature modules
│   ├── auth/              # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── store/
│   ├── profile/           # User profile feature
│   ├── settings/          # App settings feature
│   ├── tenant/            # Tenant management
│   └── admin/             # Admin features
│
├── shared/                # Shared UI components
│   ├── components/
│   ├── hooks/
│   └── utils/
│
└── assets/               # Static assets
    ├── brands/           # Brand-specific assets
    │   ├── default/
    │   └── brand-a/
    ├── fonts/
    └── images/
```

## Key Concepts

### White-label (Brand) System

Brands are configured at **build time**. Each brand has:

- Unique bundle ID (iOS) / package name (Android)
- Custom app icon, splash screen, and logo
- Theme colors defined in `core/config/brands/{brand-id}.json`

To build for a specific brand:

```bash
BRAND=brand-a yarn ios
```

### Multi-tenant (Tenant) System

Tenants are configured at **runtime**. Each tenant has:

- API base URL and version
- Feature flags
- Theme overrides (optional)
- User permissions

Tenant configuration is fetched from the backend and stored in Zustand.

### Clean Architecture Layers

1. **Presentation Layer** (`modules/*/screens/`, `modules/*/components/`)
   - React components
   - UI logic
   - No business logic

2. **Domain Layer** (`core/hooks/`, `modules/*/hooks/`)
   - Business logic hooks
   - Use cases
   - Domain entities

3. **Data Layer** (`core/api/`, `modules/*/services/`)
   - API clients
   - Data transformation
   - External service integration

### State Management

- **Zustand** for client state (auth, UI, tenant context)
- **TanStack React Query** for server state (API data, caching, mutations)
- **React Context** for theme and tenant providers
- **Local state** for component-specific state

### Styling

- **Uniwind** for utility-first Tailwind CSS 4 styling
- Brand colors applied via `global.css` using CSS variables
- Tenant theme overrides at runtime

### Navigation

- **React Navigation** with type-safe navigation
- Root navigator with auth state switching
- Tab navigator for main app screens
- Stack navigators for each feature

### Theming

- Brand colors applied at build time
- Tenant theme overrides at runtime
- Dark mode support via system setting

### Feature Flags

Feature flags control functionality per tenant:

```typescript
const isEnabled = useFeatureFlag('socialLogin');
```

### Role-Based Access Control

Permissions are checked via hooks:

```typescript
const canManageUsers = useHasPermission(PERMISSIONS.MANAGE_USERS);
```

## Best Practices

1. **Keep components presentational** - Use hooks for logic
2. **Use barrel exports** - Each module has an index.ts
3. **Type everything** - No `any` types allowed
4. **Follow naming conventions** - PascalCase for components, camelCase for hooks
5. **Write self-documenting code** - Clear names over comments
6. **Feature isolation** - Features should be brand/tenant agnostic

## Build Commands

```bash
# Development
yarn start                 # Start Metro bundler
yarn ios                   # Run on iOS
yarn android               # Run on Android

# Brand-specific builds
BRAND=default yarn ios     # Build default brand
BRAND=brand-a yarn ios     # Build Brand A

# Type checking
yarn typecheck

# Linting
yarn lint
yarn lint:fix

# Testing
yarn test
```

## Environment Variables

Required environment variables:

- `BRAND` - Brand ID (build-time)
- `APP_ENV` - Environment (development/staging/production)
- `SENTRY_DSN` - Sentry error tracking DSN (optional)
