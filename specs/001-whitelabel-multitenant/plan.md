# Implementation Plan: White-Label Multi-Tenant Mobile Application

**Branch**: `001-whitelabel-multitenant` | **Date**: 2026-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-whitelabel-multitenant/spec.md`

## Summary

Build a production-grade React Native mobile application using Expo that supports white-label (multi-brand) visual customization and multi-tenant data isolation. The system enables brand owners to configure visual identity (logos, colors, app name) while maintaining complete data isolation between tenants. Architecture prioritizes maintainability (5+ year horizon), single codebase for all brands, and CI/CD automation via GitHub Actions and Fastlane.

## Technical Context

**Language/Version**: TypeScript (strict mode)
**Framework**: Expo SDK (latest) with prebuild workflow
**Package Manager**: Yarn
**Primary Dependencies**:
- React Navigation (navigation architecture)
- Redux Toolkit (RTK) with React-Redux hooks (state management)
- Axios (HTTP client with interceptors and token handling)
- i18n (internationalization)
- Sentry (error tracking, ready integration)

**Storage**:
- Remote: Backend API (tenant-isolated data storage)
- Local: AsyncStorage for preferences, SecureStore for tokens

**Testing**: Jest with React Native Testing Library

**Target Platform**: iOS 15+ and Android (API 24+)

**Project Type**: Mobile application with backend API dependency

**Performance Goals**:
- Sub-3-second screen load times for 95% of interactions
- Smooth 60fps UI animations
- App startup to interactive < 3 seconds

**Constraints**:
- Single codebase serving 10+ brands
- Complete tenant data isolation
- Build pipeline generating all brand variants within 1 hour
- Offline capability for basic operations

**Scale/Scope**:
- 10 concurrent brands (initial target)
- Hundreds of users per tenant
- Feature-based modular architecture

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture / Modular Architecture | ✅ PASS | Feature-based modules with presentation/domain/data layers |
| II. Clear Folder Structure | ✅ PASS | Following required: app/, modules/, shared/, core/, assets/ |
| III. Separation of Concerns | ✅ PASS | UI components presentational; business logic in services/hooks |
| IV. Strong TypeScript Typing | ✅ PASS | All contracts and configs typed; no `any` |
| V. Externalized Configuration | ✅ PASS | Environment variables, app.config.js, runtime tenant config |
| VI. White-label & Multi-tenant Design | ✅ PASS | Brand config (build-time) + Tenant config (runtime) |
| VII. Expo Prebuild Workflow | ✅ PASS | expo prebuild with native customization support |

**Required Configurations (per Constitution):**
- `brand.config.ts` - White-label brand definition (build-time)
- `tenant.config.ts` - Runtime tenant definition
- Centralized theme system (brand-aware, tenant-aware)
- Environment configuration loader (dev/staging/prod)
- API client abstraction (Axios-based with interceptors)
- Modular navigation setup (React Navigation)
- Error handling system (Sentry-ready)
- Logging abstraction
- Feature flags / Remote configuration system

**CI/CD Requirements:**
- GitHub Actions workflows for brand builds
- Fastlane lanes for iOS/Android builds
- Matrix builds for multiple brands and environments
- Automated testing before builds

## Project Structure

### Documentation (this feature)

```text
specs/001-whitelabel-multitenant/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── api/             # API contracts
│   └── types/           # Shared type definitions
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
# React Native Mobile Application with Expo

app/
├── App.tsx              # Root component with providers
├── bootstrap.ts         # App initialization
└── providers/           # Context providers (Theme, Auth, Tenant)

modules/
├── auth/                # Authentication feature module
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── store/           # Redux slice for auth
├── profile/             # User profile management
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── store/
├── settings/            # App settings feature
│   ├── screens/
│   ├── components/
│   └── hooks/
└── [feature]/           # Additional feature modules follow same pattern

shared/
├── components/          # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   └── [component]/
├── hooks/               # Shared custom hooks
└── utils/               # Utility functions

core/
├── config/
│   ├── brand.config.ts        # Build-time brand configuration
│   ├── tenant.config.ts       # Runtime tenant configuration
│   ├── environment.config.ts  # Environment-specific config
│   └── index.ts
├── theme/
│   ├── ThemeProvider.tsx      # Theme context provider
│   ├── theme.ts               # Theme definition (brand-aware)
│   ├── colors.ts              # Color palette definitions
│   ├── typography.ts          # Font definitions
│   └── index.ts
├── api/
│   ├── client.ts              # Axios client with interceptors
│   ├── interceptors/          # Request/response interceptors
│   └── index.ts
├── store/
│   ├── store.ts               # Redux store configuration
│   ├── rootReducer.ts         # Combined reducers
│   └── index.ts
├── i18n/
│   ├── i18n.ts                # i18n configuration
│   ├── locales/               # Translation files per locale
│   └── index.ts
├── logging/
│   ├── logger.ts              # Logging abstraction
│   └── index.ts
├── errors/
│   ├── ErrorBoundary.tsx      # Error boundary component
│   ├── errorHandler.ts        # Error handling utilities
│   └── index.ts
└── navigation/
    ├── RootNavigator.tsx      # Root navigation setup
    ├── AuthNavigator.tsx      # Auth flow navigation
    ├── MainNavigator.tsx      # Main app navigation
    └── index.ts

assets/
├── brands/
│   ├── default/               # Default brand assets
│   │   ├── logo.png
│   │   ├── splash.png
│   │   └── icon.png
│   ├── brand-a/               # Brand A assets
│   │   ├── logo.png
│   │   ├── splash.png
│   │   └── icon.png
│   └── [brand-name]/          # Additional brand assets
├── fonts/
└── images/

ios/                           # Generated by expo prebuild
android/                       # Generated by expo prebuild

tests/
├── contract/                  # Contract tests
├── integration/               # Integration tests
└── unit/                      # Unit tests

# Configuration files (root)
app.config.js                  # Dynamic Expo configuration
babel.config.js
tsconfig.json
package.json
yarn.lock

# CI/CD
.github/
└── workflows/
    ├── ci.yml                 # Lint, type-check, test
    ├── build-ios.yml          # iOS builds per brand
    ├── build-android.yml      # Android builds per brand
    └── deploy.yml             # Deployment workflow

fastlane/
├── Fastfile                   # Fastlane lanes
├── Appfile
└── Matchfile                  # iOS code signing
```

**Structure Decision**: Mobile application structure following Constitution's required folder organization. Feature-based modules under `modules/`, core infrastructure under `core/`, shared components under `shared/`, and brand-specific assets under `assets/brands/`. Native directories (`ios/`, `android/`) generated via `expo prebuild`.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
