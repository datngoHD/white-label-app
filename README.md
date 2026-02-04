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

## AI-Assisted Development

This project is configured for AI-assisted development with **Claude Code** and other MCP-compatible tools.

### Prerequisites for AI Tools

- Node.js >= 18 (required for MCP servers)
- [Claude Code](https://code.claude.com/) or compatible AI IDE

### Automatic Setup (via Git)

The following are **automatically available** when you clone the repo:

| Tool | Config File | Purpose |
|------|-------------|---------|
| **Context7 MCP** | `.mcp.json` | Real-time library documentation |
| **Vercel React Native Skills** | `.claude/skills/` | Best practices for RN/Expo |
| **Speckit Constitution** | `.specify/memory/` | Project architecture rules |

### Manual Skills Installation (Optional)

If skills need to be reinstalled:

```bash
npx skills add vercel-labs/agent-skills
```

### Usage Tips

**Context7** auto-fetches docs when mentioned:
```
How do I use FlashList with pull-to-refresh?
```

**Vercel Skills** are referenced in `.claude/skills/vercel-react-native-skills/AGENTS.md`:
- Use FlashList instead of FlatList
- Use expo-image instead of Image
- Use Reanimated for animations
- Prefer Zustand over Redux

### Team Onboarding

1. Clone the repository
2. **(Recommended)** Get a free API key at [context7.com/dashboard](https://context7.com/dashboard)
3. **Configure local environment**:
   Create a `.env.local` file in the project root (ignored by Git):
   ```bash
   CONTEXT7_API_KEY="your-api-key-here"
   ```
4. Open with **Claude Code** → MCP servers will auto-load with your personal key.
5. Skills are available immediately from `.claude/skills/`.

> **Note**: While you can also use shell `export`, using `.env.local` is recommended to keep it project-specific. Context7 still works without a key using shared rate limits.


**📖 Full Guide**: See [docs/AI_TOOLS_GUIDE.md](./docs/AI_TOOLS_GUIDE.md) for detailed usage instructions, example prompts, and troubleshooting.

## License


Private - All rights reserved

