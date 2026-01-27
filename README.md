# White-Label Multi-Tenant React Native App

A React Native mobile application built with Expo that supports white-labeling (build-time brand customization) and multi-tenancy (runtime tenant isolation).

## Features

- **White-Label Support**: Configure different brands with custom themes, assets, and app identifiers
- **Multi-Tenant Architecture**: Runtime tenant isolation with per-tenant feature flags and configurations
- **Clean Architecture**: Feature-based module structure with clear separation of concerns
- **TypeScript**: Full TypeScript support with strict mode
- **State Management**: Redux Toolkit for global state management
- **Navigation**: React Navigation with type-safe routes
- **Internationalization**: i18next for multi-language support
- **Error Tracking**: Sentry integration for error monitoring
- **Offline Support**: Network status detection and offline caching

## Prerequisites

- Node.js >= 18
- Yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio with SDK 33+ (for Android development)

## Quick Start

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Start the development server**

   ```bash
   yarn start
   ```

3. **Run on a device/simulator**

   ```bash
   # iOS
   yarn ios

   # Android
   yarn android
   ```

## Project Structure

```
├── app/                    # Application entry point
│   ├── App.tsx            # Root component
│   ├── bootstrap.ts       # App initialization
│   └── providers/         # Global providers
├── core/                   # Core infrastructure
│   ├── api/               # API client and interceptors
│   ├── config/            # Configuration (brands, tenants, env)
│   ├── errors/            # Error handling, Sentry
│   ├── hooks/             # Global hooks
│   ├── i18n/              # Internationalization
│   ├── logging/           # Logging utilities
│   ├── navigation/        # Navigation configuration
│   ├── permissions/       # RBAC system
│   ├── store/             # Redux store
│   ├── storage/           # Secure storage, cache
│   ├── theme/             # Theming system
│   ├── types/             # Shared types
│   └── utils/             # Utilities
├── modules/                # Feature modules
│   ├── admin/             # Admin user management
│   ├── auth/              # Authentication
│   ├── profile/           # User profile
│   ├── settings/          # App settings
│   └── tenant/            # Tenant management
├── shared/                 # Shared components
│   └── components/        # Reusable UI components
├── assets/                 # Static assets
│   └── brands/            # Brand-specific assets
└── scripts/               # Build scripts
```

## Brand Configuration

### Adding a New Brand

1. Create a brand configuration file in `core/config/brands/`:

   ```json
   {
     "id": "my-brand",
     "appName": "My Brand App",
     "slug": "my-brand-app",
     "defaultTenantId": "my-tenant",
     "assetsPath": "assets/brands/my-brand",
     "ios": {
       "bundleId": "com.mybrand.app"
     },
     "android": {
       "packageName": "com.mybrand.app"
     },
     "theme": {
       "primaryColor": "#007AFF"
     }
   }
   ```

2. Create brand assets in `assets/brands/my-brand/`:
   - `icon.png` (1024x1024)
   - `splash.png` (1284x2778)
   - `logo.png` (300x100)

3. Build for the brand:
   ```bash
   BRAND=my-brand yarn prebuild:clean
   BRAND=my-brand yarn ios
   ```

### Available Brands

- `default` - Default white-label configuration
- `brand-a` - Example brand configuration

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
APP_ENV=development          # development | staging | production
BRAND=default               # Brand identifier
API_BASE_URL=http://localhost:3000
SENTRY_DSN=                 # Optional: Sentry DSN for error tracking
```

## Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `yarn start`           | Start Expo development server     |
| `yarn ios`             | Run on iOS simulator              |
| `yarn android`         | Run on Android emulator           |
| `yarn test`            | Run tests                         |
| `yarn typecheck`       | TypeScript type checking          |
| `yarn lint`            | Run ESLint                        |
| `yarn format`          | Format code with Prettier         |
| `yarn build:default`   | Prebuild for default brand        |
| `yarn build:brand-a`   | Prebuild for Brand A              |
| `yarn validate:brands` | Validate all brand configurations |

## CI/CD

The project includes GitHub Actions workflows for:

- **CI** (`ci.yml`): Linting, testing, and brand validation on PRs
- **Build iOS** (`build-ios.yml`): Build iOS app for selected brand
- **Build Android** (`build-android.yml`): Build Android app for selected brand
- **Deploy** (`deploy.yml`): Deploy to TestFlight/Play Store

### Fastlane

Fastlane is configured for automated builds and deployments:

```bash
# iOS
cd fastlane && bundle exec fastlane ios build brand:default
cd fastlane && bundle exec fastlane ios beta brand:default

# Android
cd fastlane && bundle exec fastlane android build brand:default
cd fastlane && bundle exec fastlane android beta brand:default
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## License

Private - All rights reserved
