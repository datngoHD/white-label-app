# Tasks: Switch Brand Script

**Input**: Design documents from `/specs/004-switch-brand/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification. Implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Script location**: `scripts/switch-brand.js`
- **Brand configs**: `core/config/brands/*.json`
- **Brand assets**: `assets/brands/{brand-id}/`
- **Native files**: `ios/`, `android/` directories

---

## Phase 1: Setup

**Purpose**: Project initialization and script structure

- [x] T001 Create scripts directory if not exists at repository root
- [x] T002 Create switch-brand.ts scaffold with main entry point in scripts/switch-brand.ts
- [x] T003 [P] Add "brand" script to package.json scripts section
- [x] T004 [P] Add .current-brand to .gitignore

---

## Phase 2: Foundational (Core Utilities)

**Purpose**: Core infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: All user stories require these utilities

- [x] T005 Implement getBrandsDirectory() helper to resolve core/config/brands/ path in scripts/switch-brand.js
- [x] T006 Implement getAvailableBrands() to list all brand JSON files in scripts/switch-brand.js
- [x] T007 Implement loadBrandConfig(brandId) to read and parse brand JSON in scripts/switch-brand.js
- [x] T008 Implement validateBrandConfig(config) to check required fields (appName, ios.bundleId, android.packageName) in scripts/switch-brand.js
- [x] T009 Implement getCurrentBrand() to read .current-brand file in scripts/switch-brand.js
- [x] T010 Implement saveCurrentBrand(brandId) to write .current-brand file in scripts/switch-brand.js
- [x] T011 Implement CLI argument parsing (process.argv) in scripts/switch-brand.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Switch to a Different Brand (Priority: P1) ✅ COMPLETE

**Goal**: Enable developers to switch brands in seconds by updating native project files

**Independent Test**: Run `yarn brand brand-a` and verify iOS/Android native files are updated with correct identifiers

### Implementation for User Story 1

- [x] T012 [US1] Implement findIosProjectFiles() to locate project.pbxproj and Info.plist in scripts/switch-brand.js
- [x] T013 [US1] Implement findAndroidProjectFiles() to locate build.gradle and strings.xml in scripts/switch-brand.js
- [x] T014 [P] [US1] Implement updateIosBundleId(bundleId) using regex pattern for PRODUCT_BUNDLE_IDENTIFIER in scripts/switch-brand.js
- [x] T015 [P] [US1] Implement updateIosDisplayName(appName) using regex pattern for CFBundleDisplayName in scripts/switch-brand.js
- [x] T016 [P] [US1] Implement updateAndroidPackageName(packageName) using regex patterns for namespace and applicationId in scripts/switch-brand.js
- [x] T017 [P] [US1] Implement updateAndroidAppName(appName) using regex pattern for app_name string in scripts/switch-brand.js
- [x] T018 [US1] Implement updateIosPlatform(brandConfig) orchestrating iOS file updates in scripts/switch-brand.js
- [x] T019 [US1] Implement updateAndroidPlatform(brandConfig) orchestrating Android file updates in scripts/switch-brand.js
- [x] T020 [US1] Implement switchBrand(brandId) main function orchestrating full brand switch in scripts/switch-brand.js
- [x] T021 [US1] Implement CLI output with emoji indicators (🔄, ✅, 📝, ✨) showing progress in scripts/switch-brand.js
- [x] T022 [US1] Wire switchBrand to CLI when brandId argument is provided in scripts/switch-brand.js

**Checkpoint**: User Story 1 complete - `yarn brand brand-a` updates all native files

---

## Phase 4: User Story 2 - View Current Brand and Available Brands (Priority: P2) ✅ COMPLETE

**Goal**: Display current brand and list of available brands when run without arguments

**Independent Test**: Run `yarn brand` without arguments and verify current brand and available brands are displayed

### Implementation for User Story 2

- [x] T023 [US2] Implement formatBrandList(brands, currentBrand) to display brands with current marker in scripts/switch-brand.js
- [x] T024 [US2] Implement showStatus() to display current brand and available brands in scripts/switch-brand.js
- [x] T025 [US2] Wire showStatus to CLI when no arguments provided in scripts/switch-brand.js

**Checkpoint**: User Story 2 complete - `yarn brand` shows status and available brands

---

## Phase 5: User Story 3 - Handle Invalid Brand Selection (Priority: P3) ✅ COMPLETE

**Goal**: Provide helpful error messages for invalid inputs and missing platforms

**Independent Test**: Run `yarn brand invalid-brand` and verify error message with available brands list

### Implementation for User Story 3

- [x] T026 [US3] Implement handleBrandNotFound(brandId, availableBrands) error handler in scripts/switch-brand.js
- [x] T027 [US3] Implement handleMissingPlatform(platform) warning handler (warn and continue) in scripts/switch-brand.js
- [x] T028 [US3] Implement handleNoPlatforms() error handler when both ios/ and android/ missing in scripts/switch-brand.js
- [x] T029 [US3] Implement handleInvalidConfig(errors) error handler for missing required fields in scripts/switch-brand.js
- [x] T030 [US3] Implement handleJsonParseError(filePath, error) error handler for malformed JSON in scripts/switch-brand.js
- [x] T031 [US3] Integrate all error handlers into switchBrand and showStatus functions in scripts/switch-brand.js

**Checkpoint**: User Story 3 complete - all error scenarios handled gracefully

---

## Phase 6: User Story 4 - Update App Icons When Switching Brand (Priority: P2) ✅ COMPLETE

**Goal**: Automatically update iOS and Android app icons when switching brands

**Independent Test**: Run `yarn brand brand-a` and verify iOS app icon and all 15 Android icon files are updated

### Setup for Icon Processing

- [x] T037 [US4] Implement checkSharpAvailability() to detect if sharp library is installed in scripts/switch-brand.js
- [x] T038 [US4] Implement handleMissingSharp() warning handler with install instructions in scripts/switch-brand.js
- [x] T039 [US4] Implement getBrandAssetsPath(brandId) to resolve assets/brands/{brand-id}/ path in scripts/switch-brand.js
- [x] T040 [US4] Implement getBrandIconPath(brandId) to get icon.png path for a brand in scripts/switch-brand.js
- [x] T041 [US4] Implement getBrandAdaptiveIconPath(brandId) to get adaptive-icon.png path (optional) in scripts/switch-brand.js

### Icon Validation

- [x] T042 [US4] Implement validateIconSize(iconPath) to check icon is at least 1024x1024 using sharp in scripts/switch-brand.js
- [x] T043 [US4] Implement handleMissingIcon(brandId) warning handler in scripts/switch-brand.js
- [x] T044 [US4] Implement handleInvalidIconSize(width, height) error handler in scripts/switch-brand.js

### iOS Icon Update

- [x] T045 [US4] Implement findIosAppIconPath() to locate AppIcon.appiconset directory in scripts/switch-brand.js
- [x] T046 [US4] Implement updateIosAppIcon(brandId) to copy 1024x1024 icon to AppIcon.appiconset in scripts/switch-brand.js

### Android Icon Generation

- [x] T047 [P] [US4] Define ANDROID_ICON_SIZES constant with density/size mapping in scripts/switch-brand.js
- [x] T048 [P] [US4] Implement generateAndroidLauncherIcon(iconPath, density, size) to resize and convert to WebP in scripts/switch-brand.js
- [x] T049 [P] [US4] Implement generateAndroidRoundIcon(iconPath, density, size) to resize with circular mask and convert to WebP in scripts/switch-brand.js
- [x] T050 [P] [US4] Implement generateAndroidForegroundIcon(iconPath, density, size) to resize adaptive foreground and convert to WebP in scripts/switch-brand.js
- [x] T051 [US4] Implement updateAndroidIcons(brandId) orchestrating all Android icon generation in scripts/switch-brand.js

### Integration

- [x] T052 [US4] Implement updateIcons(brandId) orchestrating both iOS and Android icon updates in scripts/switch-brand.js
- [x] T053 [US4] Integrate updateIcons() into switchBrand() function with proper error handling in scripts/switch-brand.js
- [x] T054 [US4] Add icon update progress output with emoji indicators (🖼️) in scripts/switch-brand.js

**Checkpoint**: User Story 4 complete - `yarn brand brand-a` updates all icons (iOS 1 file + Android 15 files)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and documentation

- [x] T032 Add JSDoc comments to all exported functions in scripts/switch-brand.js
- [x] T033 Add usage instructions to script header comment in scripts/switch-brand.js
- [x] T034 [P] Verify script works with existing brand-a config by manual testing
- [x] T035 [P] Verify script works with default brand config by manual testing
- [x] T036 Run quickstart.md validation scenarios to confirm all features work
- [x] T055 [P] Update JSDoc comments for new icon-related functions in scripts/switch-brand.js
- [x] T056 [P] Verify icon update works with brand-a (has icon.png) by manual testing
- [x] T057 [P] Verify icon update skips gracefully for brand without icon by manual testing
- [x] T058 [P] Verify sharp missing warning is displayed correctly by manual testing
- [x] T059 Run quickstart.md icon scenarios to confirm US4 features work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately ✅ COMPLETE
- **Foundational (Phase 2)**: Depends on Setup completion ✅ COMPLETE
- **User Story 1 (Phase 3)**: Depends on Foundational ✅ COMPLETE
- **User Story 2 (Phase 4)**: Depends on US1 completion ✅ COMPLETE
- **User Story 3 (Phase 5)**: Can integrate after US1/US2 ✅ COMPLETE
- **User Story 4 (Phase 6)**: Depends on US1 completion (adds to switchBrand function) ✅ COMPLETE
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story 4 Task Dependencies

```
T037 (checkSharpAvailability)
  ├── T038 (handleMissingSharp)
  └── T042 (validateIconSize) ─── depends on sharp being available

T039 (getBrandAssetsPath)
  ├── T040 (getBrandIconPath)
  └── T041 (getBrandAdaptiveIconPath)

T040 + T042 → T043 (handleMissingIcon)
T042 → T044 (handleInvalidIconSize)

T045 (findIosAppIconPath) → T046 (updateIosAppIcon)

T047 (ANDROID_ICON_SIZES) → T048, T049, T050 (can run in parallel)
T048, T049, T050 → T051 (updateAndroidIcons)

T046, T051 → T052 (updateIcons)
T052 → T053 (integrate into switchBrand)
T053 → T054 (add CLI output)
```

### Parallel Opportunities

**Phase 6 (US4)**:
- T047, T048, T049, T050 can run in parallel (different icon types)
- T055, T056, T057, T058 can run in parallel (different test scenarios)

---

## Implementation Strategy

### Current Progress

**Phase 1-5 COMPLETE** (36 tasks)
- US1: Brand switching with identifier updates ✅
- US2: View current brand and available brands ✅
- US3: Error handling ✅

### US4 Implementation (Icon Updates)

1. **Setup icon utilities** (T037-T041) - 5 tasks
2. **Icon validation** (T042-T044) - 3 tasks
3. **iOS icon** (T045-T046) - 2 tasks
4. **Android icons** (T047-T051) - 5 tasks
5. **Integration** (T052-T054) - 3 tasks
6. **Polish** (T055-T059) - 5 tasks

**Total new tasks**: 23 tasks (T037-T059)

### Suggested Implementation Order

1. Install sharp: `yarn add sharp --dev`
2. Complete T037-T044 (setup + validation)
3. Complete T045-T046 (iOS icons)
4. Complete T047-T051 (Android icons) - use parallel execution
5. Complete T052-T054 (integration)
6. Complete T055-T059 (polish) - use parallel execution
7. **VALIDATE**: Run `yarn brand brand-a` and verify all icons updated

### After US4 Complete

Developers can:
- Switch brands with `yarn brand <brand-id>`
- Native files are correctly updated (identifiers + app name)
- App icons are automatically updated (iOS + Android)
- Current brand is persisted to .current-brand

---

## Summary

| Phase | User Story | Tasks | Status |
|-------|------------|-------|--------|
| Phase 1 | Setup | T001-T004 (4) | ✅ COMPLETE |
| Phase 2 | Foundational | T005-T011 (7) | ✅ COMPLETE |
| Phase 3 | US1 - Switch Brand | T012-T022 (11) | ✅ COMPLETE |
| Phase 4 | US2 - View Status | T023-T025 (3) | ✅ COMPLETE |
| Phase 5 | US3 - Error Handling | T026-T031 (6) | ✅ COMPLETE |
| Phase 6 | US4 - Icon Updates | T037-T054 (18) | ✅ COMPLETE |
| Phase 7 | Polish | T032-T036, T055-T059 (10) | ✅ COMPLETE |

**Total tasks**: 59
**Completed**: 59

---

## Notes

- [P] tasks = different files/functions, no dependencies
- [Story] label maps task to specific user story for traceability
- All tasks target single file: scripts/switch-brand.js
- US4 requires `sharp` library: `yarn add sharp --dev`
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
