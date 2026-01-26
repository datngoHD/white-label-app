# Tasks: White-Label Multi-Tenant Mobile Application

**Input**: Design documents from `/specs/001-whitelabel-multitenant/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is a React Native mobile application:
- `app/` - Application entry point, bootstrap, providers
- `modules/` - Feature-based modules
- `shared/` - Reusable components, hooks, utilities
- `core/` - Core infrastructure (config, theme, api, store, etc.)
- `assets/` - Brand-specific assets

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Expo project with required dependencies and folder structure

- [x] T001 Initialize Expo project with bare-minimum template using `npx create-expo-app . --template bare-minimum`
- [x] T002 Install core dependencies: @reduxjs/toolkit, react-redux, @react-navigation/native, axios, i18next per package.json
- [x] T003 [P] Install Expo packages: expo-secure-store, expo-constants, expo-splash-screen, expo-status-bar per package.json
- [x] T004 [P] Install navigation dependencies: @react-navigation/native-stack, @react-navigation/bottom-tabs, react-native-screens, react-native-safe-area-context per package.json
- [x] T005 [P] Install dev dependencies: typescript, @types/react, jest, @testing-library/react-native, eslint, prettier per package.json
- [x] T006 Configure TypeScript with strict mode in tsconfig.json
- [x] T007 [P] Configure ESLint with React Native rules in .eslintrc.js
- [x] T008 [P] Configure Prettier in .prettierrc
- [x] T009 Create project directory structure: app/, modules/, shared/, core/, assets/, tests/
- [x] T010 Copy type definitions from contracts/types/index.ts to core/types/index.ts

**Checkpoint**: Project initialized with dependencies and folder structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create environment configuration in core/config/environment.config.ts
- [x] T012 [P] Create logging abstraction in core/logging/logger.ts
- [x] T013 [P] Create storage keys constants in core/storage/keys.ts
- [x] T014 Create API client with Axios in core/api/client.ts
- [x] T015 Create request interceptor for tenant ID injection in core/api/interceptors/tenantInterceptor.ts
- [x] T016 [P] Create response interceptor for error handling in core/api/interceptors/errorInterceptor.ts
- [x] T017 [P] Create auth interceptor for token injection in core/api/interceptors/authInterceptor.ts
- [x] T018 Create API client barrel export in core/api/index.ts
- [x] T019 Create Redux store configuration in core/store/store.ts
- [x] T020 [P] Create root reducer in core/store/rootReducer.ts
- [x] T021 [P] Create typed hooks (useAppDispatch, useAppSelector) in core/store/hooks.ts
- [x] T022 Create store barrel export in core/store/index.ts
- [x] T023 Create error handler utility in core/errors/errorHandler.ts
- [x] T024 [P] Create ErrorBoundary component in core/errors/ErrorBoundary.tsx
- [x] T025 Create errors barrel export in core/errors/index.ts
- [x] T026 Create i18n configuration in core/i18n/i18n.ts
- [x] T027 [P] Create English locale file in core/i18n/locales/en.json
- [x] T028 Create i18n barrel export in core/i18n/index.ts
- [x] T029 Create base Button component in shared/components/Button/Button.tsx
- [x] T030 [P] Create base Input component in shared/components/Input/Input.tsx
- [x] T031 [P] Create base Card component in shared/components/Card/Card.tsx
- [x] T032 [P] Create Loading component in shared/components/Loading/Loading.tsx
- [x] T033 Create shared components barrel export in shared/components/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Brand Owner Configures App Identity (Priority: P1) 🎯 MVP

**Goal**: Enable brand owners to configure visual identity (logo, colors, app name) that displays consistently throughout the app

**Independent Test**: Configure a new brand's visual identity and verify the resulting app displays correct branding throughout all screens

### Implementation for User Story 1

#### Brand Configuration System

- [x] T034 [US1] Create Brand interface and types in core/config/types.ts
- [x] T035 [US1] Create default brand configuration JSON in core/config/brands/default.json
- [x] T036 [P] [US1] Create Brand A sample configuration JSON in core/config/brands/brand-a.json
- [x] T037 [US1] Create brand configuration loader in core/config/brand.config.ts
- [x] T038 [US1] Create dynamic Expo configuration in app.config.js
- [x] T038a [US1] Create brand configuration validator in core/config/brandValidator.ts
- [x] T038b [US1] Add validation to app.config.js to fail builds on incomplete brand config

#### Theme System

- [x] T039 [US1] Create color palette definitions in core/theme/colors.ts
- [x] T040 [P] [US1] Create typography definitions in core/theme/typography.ts
- [x] T041 [P] [US1] Create spacing definitions in core/theme/spacing.ts
- [x] T042 [US1] Create Theme interface in core/theme/theme.ts
- [x] T043 [US1] Create ThemeProvider with brand defaults in core/theme/ThemeProvider.tsx
- [x] T044 [US1] Create useTheme hook in core/theme/useTheme.ts
- [x] T045 [US1] Create theme barrel export in core/theme/index.ts

#### Brand Assets

- [x] T046 [P] [US1] Create default brand assets directory with placeholder icon in assets/brands/default/icon.png
- [x] T047 [P] [US1] Create default brand splash screen in assets/brands/default/splash.png
- [x] T048 [P] [US1] Create default brand logo in assets/brands/default/logo.png
- [x] T049 [P] [US1] Create Brand A assets directory with icon in assets/brands/brand-a/icon.png
- [x] T050 [P] [US1] Create Brand A splash screen in assets/brands/brand-a/splash.png
- [x] T051 [P] [US1] Create Brand A logo in assets/brands/brand-a/logo.png

#### App Bootstrap with Branding

- [x] T052 [US1] Create app providers wrapper in app/providers/AppProviders.tsx
- [x] T053 [US1] Create app bootstrap logic in app/bootstrap.ts
- [x] T054 [US1] Create root App component with ThemeProvider in app/App.tsx
- [x] T055 [US1] Create branded Header component in shared/components/Header/Header.tsx
- [x] T056 [US1] Create themed Text component in shared/components/Text/Text.tsx

#### Brand Preview Screen

- [x] T057 [US1] Create BrandPreview screen to verify theming in modules/settings/screens/BrandPreviewScreen.tsx
- [x] T058 [US1] Update shared components barrel export in shared/components/index.ts

**Checkpoint**: Brand configuration system complete - app displays brand-specific colors, logo, and splash screen

---

## Phase 4: User Story 2 - End User Experiences Isolated Tenant Environment (Priority: P1)

**Goal**: Ensure user data is completely isolated by tenant with no cross-tenant data access

**Independent Test**: Create users in two different tenant environments and verify no data leakage between them

### Implementation for User Story 2

#### Tenant Configuration System

- [x] T059a [US2] Create tenant module directory structure: modules/tenant/{screens,services,hooks}/
- [x] T059 [US2] Create Tenant interface and types in core/config/tenant.types.ts
- [x] T060 [US2] Create tenant configuration loader in core/config/tenant.config.ts
- [x] T061 [US2] Create TenantProvider context in app/providers/TenantProvider.tsx
- [x] T062 [US2] Create useTenant hook in core/hooks/useTenant.ts

#### Tenant Redux State

- [x] T063 [US2] Create tenant Redux slice in core/store/slices/tenantSlice.ts
- [x] T064 [US2] Create tenant service for API calls in modules/tenant/services/tenantService.ts
- [x] T065 [US2] Update rootReducer to include tenant slice in core/store/rootReducer.ts

#### Feature Flags System

- [x] T066 [P] [US2] Create FeatureFlags types in core/config/featureFlags.types.ts
- [x] T067 [US2] Create useFeatureFlag hook in core/hooks/useFeatureFlag.ts
- [x] T068 [P] [US2] Create FeatureGate component in shared/components/FeatureGate/FeatureGate.tsx

#### Role-Based Access Control

- [x] T068a [P] [US2] Create permissions types and constants in core/permissions/permissions.ts
- [x] T068b [US2] Create useUserRole hook in core/hooks/useUserRole.ts
- [x] T068c [US2] Create RoleGate component in shared/components/RoleGate/RoleGate.tsx
- [x] T068d [US2] Create useHasPermission hook in core/hooks/useHasPermission.ts

#### API Tenant Enforcement

- [x] T069 [US2] Update API client to use tenant context in core/api/client.ts
- [x] T070 [US2] Create tenant validation middleware utility in core/utils/tenantValidation.ts
- [x] T071 [US2] Create access logging utility in core/logging/accessLogger.ts

#### Tenant Status Handling

- [x] T072 [US2] Create TenantStatus screen for maintenance/suspended states in modules/tenant/screens/TenantStatusScreen.tsx
- [x] T073 [US2] Update AppProviders to include TenantProvider in app/providers/AppProviders.tsx

**Checkpoint**: Tenant isolation complete - all API requests include tenant context, feature flags work per tenant

---

## Phase 5: User Story 3 - Development Team Maintains Single Codebase (Priority: P1)

**Goal**: Establish architecture where one codebase serves all brands with clean separation of brand-specific customizations

**Independent Test**: Make a core feature change and verify it appears correctly across all brand configurations

### Implementation for User Story 3

#### Navigation Architecture

- [x] T074 [US3] Create navigation types in core/navigation/types.ts
- [x] T075 [US3] Create AuthNavigator for login/register flow in core/navigation/AuthNavigator.tsx
- [x] T076 [US3] Create MainNavigator with tab navigation in core/navigation/MainNavigator.tsx
- [x] T077 [US3] Create RootNavigator with auth state switching in core/navigation/RootNavigator.tsx
- [x] T078 [US3] Create navigation barrel export in core/navigation/index.ts

#### Module Structure Templates

- [x] T079 [P] [US3] Create auth module directory structure: modules/auth/{screens,components,hooks,services,store}/
- [x] T080 [P] [US3] Create profile module directory structure: modules/profile/{screens,components,hooks,services,store}/
- [x] T081 [P] [US3] Create settings module directory structure: modules/settings/{screens,components,hooks}/
- [x] T082 [US3] Create module index exports in modules/auth/index.ts, modules/profile/index.ts, modules/settings/index.ts, modules/tenant/index.ts

#### Configuration Barrel Exports

- [x] T083 [US3] Create config barrel export in core/config/index.ts
- [x] T084 [P] [US3] Create hooks barrel export in core/hooks/index.ts
- [x] T085 [P] [US3] Create utils barrel export in core/utils/index.ts
- [x] T086 [US3] Create core barrel export in core/index.ts

#### Documentation for Architecture

- [x] T087 [US3] Create ARCHITECTURE.md documenting folder structure and patterns in ARCHITECTURE.md
- [x] T088 [US3] Update app entry point to use RootNavigator in app/App.tsx

**Checkpoint**: Architecture established - clean module boundaries, navigation structure, barrel exports

---

## Phase 6: User Story 4 - Automated Build Pipeline Generates Brand Variants (Priority: P2)

**Goal**: Configure CI/CD pipelines that generate distinct app builds for each brand automatically

**Independent Test**: Trigger a pipeline and verify it produces correctly branded builds ready for app store submission

### Implementation for User Story 4

#### Build Scripts

- [x] T089 [US4] Create brand build script in scripts/build-brand.sh
- [x] T090 [P] [US4] Create environment setup script in scripts/setup-env.sh
- [x] T091 [US4] Add brand-specific build commands to package.json scripts section

#### GitHub Actions Workflows

- [x] T092 [US4] Create CI workflow for linting/testing in .github/workflows/ci.yml
- [x] T093 [P] [US4] Create iOS build workflow with brand matrix in .github/workflows/build-ios.yml
- [x] T094 [P] [US4] Create Android build workflow with brand matrix in .github/workflows/build-android.yml
- [x] T095 [US4] Create deployment workflow in .github/workflows/deploy.yml

#### Fastlane Configuration

- [x] T096 [US4] Create Fastlane directory structure: fastlane/
- [x] T097 [US4] Create Fastfile with iOS and Android lanes in fastlane/Fastfile
- [x] T098 [P] [US4] Create Appfile with app identifiers in fastlane/Appfile
- [x] T099 [P] [US4] Create Matchfile for iOS code signing in fastlane/Matchfile
- [x] T100 [US4] Create Fastlane README with usage instructions in fastlane/README.md

#### Environment Configuration for CI

- [x] T101 [US4] Create .env.example with required environment variables in .env.example
- [x] T102 [US4] Create environment-specific config files: .env.development, .env.staging, .env.production templates
- [x] T103 [US4] Update .gitignore to exclude sensitive files and build artifacts

**Checkpoint**: CI/CD complete - pipelines can build all brand variants automatically

---

## Phase 7: User Story 5 - Brand Owner Manages Tenant Users (Priority: P2)

**Goal**: Enable brand administrators to manage users within their tenant (invite, deactivate, view)

**Independent Test**: Perform user management operations and verify they only affect the administrator's own tenant

### Implementation for User Story 5

#### Authentication Module

- [x] T104 [US5] Create auth types in modules/auth/types.ts
- [x] T105 [US5] Create auth service with login/register/logout in modules/auth/services/authService.ts
- [x] T106 [US5] Create auth Redux slice in modules/auth/store/authSlice.ts
- [x] T107 [US5] Create useAuth hook in modules/auth/hooks/useAuth.ts

#### Auth Screens

- [x] T108 [US5] Create LoginScreen in modules/auth/screens/LoginScreen.tsx
- [x] T109 [P] [US5] Create RegisterScreen in modules/auth/screens/RegisterScreen.tsx
- [x] T110 [P] [US5] Create ForgotPasswordScreen in modules/auth/screens/ForgotPasswordScreen.tsx
- [x] T111 [P] [US5] Create ResetPasswordScreen in modules/auth/screens/ResetPasswordScreen.tsx
- [x] T112 [US5] Create auth screens barrel export in modules/auth/screens/index.ts

#### Auth Components

- [x] T113 [P] [US5] Create LoginForm component in modules/auth/components/LoginForm.tsx
- [x] T114 [P] [US5] Create RegisterForm component in modules/auth/components/RegisterForm.tsx
- [x] T115 [US5] Create auth components barrel export in modules/auth/components/index.ts

#### Profile Module

- [x] T116 [US5] Create profile types in modules/profile/types.ts
- [x] T117 [US5] Create profile service in modules/profile/services/profileService.ts
- [x] T118 [US5] Create profile Redux slice in modules/profile/store/profileSlice.ts
- [x] T119 [US5] Create useProfile hook in modules/profile/hooks/useProfile.ts

#### Profile Screens

- [x] T120 [US5] Create ProfileScreen in modules/profile/screens/ProfileScreen.tsx
- [x] T121 [P] [US5] Create EditProfileScreen in modules/profile/screens/EditProfileScreen.tsx
- [x] T122 [P] [US5] Create ChangePasswordScreen in modules/profile/screens/ChangePasswordScreen.tsx
- [x] T123 [US5] Create profile screens barrel export in modules/profile/screens/index.ts

#### Admin User Management Module

- [x] T123a [US5] Create admin module directory structure: modules/admin/{screens,components,services}/
- [x] T123b [US5] Create admin types in modules/admin/types.ts
- [x] T123c [US5] Create admin user service in modules/admin/services/adminUserService.ts
- [x] T123d [US5] Create UserListScreen in modules/admin/screens/UserListScreen.tsx
- [x] T123e [P] [US5] Create InviteUserScreen in modules/admin/screens/InviteUserScreen.tsx
- [x] T123f [P] [US5] Create UserDetailScreen in modules/admin/screens/UserDetailScreen.tsx
- [x] T123g [US5] Create admin screens barrel export in modules/admin/screens/index.ts
- [x] T123h [US5] Create admin module index in modules/admin/index.ts
- [x] T123i [US5] Update MainNavigator to include admin screens (admin-only routes) in core/navigation/MainNavigator.tsx

#### Settings Module

- [x] T124 [US5] Create SettingsScreen in modules/settings/screens/SettingsScreen.tsx
- [x] T125 [P] [US5] Create PreferencesScreen in modules/settings/screens/PreferencesScreen.tsx
- [x] T126 [US5] Create settings screens barrel export in modules/settings/screens/index.ts

#### Update Store and Navigation

- [x] T127 [US5] Update rootReducer to include auth and profile slices in core/store/rootReducer.ts
- [x] T128 [US5] Update AuthNavigator with all auth screens in core/navigation/AuthNavigator.tsx
- [x] T129 [US5] Update MainNavigator with profile and settings screens in core/navigation/MainNavigator.tsx

#### Token Storage

- [x] T130 [US5] Create secure token storage utility in core/storage/tokenStorage.ts
- [x] T131 [US5] Create auth persistence logic in modules/auth/services/authPersistence.ts
- [x] T132 [US5] Update auth slice to restore tokens on app launch in modules/auth/store/authSlice.ts

**Checkpoint**: User management complete - users can register, login, manage profile, update settings

---

## Phase 8: User Story 6 - System Scales with Growing Brands and Users (Priority: P3)

**Goal**: Ensure system maintains performance and reliability as brands and users grow

**Independent Test**: Simulate load with multiple brands and concurrent users, measuring response times

### Implementation for User Story 6

#### Error Tracking (Sentry)

- [x] T133 [US6] Install @sentry/react-native dependency per package.json
- [x] T134 [US6] Create Sentry configuration in core/errors/sentry.ts
- [x] T135 [US6] Integrate Sentry initialization in app/bootstrap.ts
- [x] T136 [US6] Update ErrorBoundary to report to Sentry in core/errors/ErrorBoundary.tsx

#### Performance Monitoring

- [x] T137 [P] [US6] Create performance monitoring utilities in core/utils/performance.ts
- [x] T138 [US6] Create app startup time tracking in app/bootstrap.ts

#### Offline Support

- [x] T139 [US6] Create network status hook in core/hooks/useNetworkStatus.ts
- [x] T140 [US6] Create offline cache utility in core/storage/offlineCache.ts
- [x] T141 [US6] Create OfflineBanner component in shared/components/OfflineBanner/OfflineBanner.tsx

#### Optimizations

- [x] T142 [P] [US6] Create image optimization utility in core/utils/imageOptimization.ts
- [x] T143 [US6] Create list virtualization wrapper in shared/components/VirtualizedList/VirtualizedList.tsx
- [x] T144 [US6] Add performance logging to API client in core/api/client.ts

**Checkpoint**: Scalability measures in place - error tracking, performance monitoring, offline support

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [x] T145 Add comprehensive JSDoc comments to all core modules in core/**/*.ts
- [x] T146 [P] Create app README with setup instructions in README.md
- [x] T147 [P] Verify all barrel exports are complete and correct across core/, shared/, modules/
- [x] T148 Run TypeScript compilation check and fix any type errors
- [x] T149 [P] Run ESLint and fix any linting errors
- [x] T150 Verify app.config.js works for both default and brand-a builds
- [x] T151 Run quickstart.md validation - verify all setup steps work correctly
- [x] T152 Test brand switching by building with BRAND=default and BRAND=brand-a
- [x] T153 Final code review for constitution compliance (clean architecture, separation of concerns)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - can start after Phase 2
- **User Story 2 (Phase 4)**: Depends on Foundational - can start after Phase 2 (parallel with US1 possible)
- **User Story 3 (Phase 5)**: Depends on US1 and US2 (uses theme and tenant systems)
- **User Story 4 (Phase 6)**: Depends on US1 (needs brand config) - can be parallel with US3, US5
- **User Story 5 (Phase 7)**: Depends on US2 (needs tenant context) and US3 (needs navigation)
- **User Story 6 (Phase 8)**: Depends on US5 (needs working app to monitor)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Independent of US1
- **User Story 3 (P1)**: Requires US1 (theme) and US2 (tenant) - Integrates both
- **User Story 4 (P2)**: Requires US1 (brand config) - Can parallel with US3/US5
- **User Story 5 (P2)**: Requires US2 (tenant) and US3 (navigation) - Auth flows
- **User Story 6 (P3)**: Requires US5 (working app) - Monitoring/optimization

### Within Each User Story

- Configuration/Types before Services
- Services before Redux slices
- Redux slices before Hooks
- Hooks before Screens/Components
- Core implementation before integration

### Parallel Opportunities

**Setup Phase (T001-T010)**:
```bash
# After T002, these can run in parallel:
T003, T004, T005, T007, T008
```

**Foundational Phase (T011-T033)**:
```bash
# These can run in parallel after T011:
T012, T013, T016, T017, T020, T021, T024, T027, T030, T031, T032
```

**User Story 1 (T034-T058)**:
```bash
# Brand assets can be created in parallel:
T046, T047, T048, T049, T050, T051

# Theme definitions can be parallel:
T039, T040, T041
```

**User Story 5 (T104-T132)**:
```bash
# Auth screens can be parallel after T107:
T109, T110, T111

# Auth components can be parallel:
T113, T114
```

---

## Parallel Example: User Story 1

```bash
# After T038 (brand.config.ts), launch theme tasks in parallel:
Task: T039 "Create color palette definitions in core/theme/colors.ts"
Task: T040 "Create typography definitions in core/theme/typography.ts"
Task: T041 "Create spacing definitions in core/theme/spacing.ts"

# After assets directory created, launch all brand assets in parallel:
Task: T046 "Create default brand assets directory with placeholder icon"
Task: T047 "Create default brand splash screen"
Task: T048 "Create default brand logo"
Task: T049 "Create Brand A assets directory with icon"
Task: T050 "Create Brand A splash screen"
Task: T051 "Create Brand A logo"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Brand Configuration)
4. **STOP and VALIDATE**: Build app with `BRAND=default` and `BRAND=brand-a`, verify different branding
5. Deploy/demo if ready - MVP delivers brand differentiation

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Brand Config) → Test branding → MVP!
3. Add User Story 2 (Tenant Isolation) → Test tenant boundaries
4. Add User Story 3 (Architecture) → Navigation and modules ready
5. Add User Story 4 (CI/CD) → Automated builds working
6. Add User Story 5 (User Management) → Full auth flows
7. Add User Story 6 (Scalability) → Production-ready

### Parallel Team Strategy

With multiple developers after Foundational phase:

- **Developer A**: User Story 1 (Brand Config) → User Story 4 (CI/CD)
- **Developer B**: User Story 2 (Tenant Isolation) → User Story 6 (Scalability)
- **Developer C**: User Story 3 (Architecture) → User Story 5 (User Management)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable at its checkpoint
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tasks follow constitution principles: Clean Architecture, TypeScript strict, feature-based modules
