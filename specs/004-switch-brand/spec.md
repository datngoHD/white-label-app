# Feature Specification: Switch Brand Script

**Feature Branch**: `004-switch-brand`
**Created**: 2026-01-28
**Status**: Draft
**Input**: User description: "Switch brand script for fast brand switching without prebuild - read configuration from existing brand JSON files and update native files for iOS and Android"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Switch to a Different Brand (Priority: P1)

As a developer working on a white-label app, I want to quickly switch between brands without running prebuild, so that I can test different brand configurations in seconds instead of waiting for a full native regeneration.

**Why this priority**: This is the core functionality that directly addresses the problem statement. Without this, the feature has no value.

**Independent Test**: Can be fully tested by running a single CLI command and verifying that native project files are updated with the new brand's identifiers.

**Acceptance Scenarios**:

1. **Given** the native projects (ios/ and android/) exist from a previous prebuild, **When** I run `yarn brand brand-a`, **Then** the iOS bundle identifier is updated to `com.example.brandaapp` and Android package name is updated to `com.example.brandaapp`
2. **Given** I have brand-a configured with appName "Brand A App", **When** I run `yarn brand brand-a`, **Then** the app display name in both iOS Info.plist and Android strings.xml is updated to "Brand A App"
3. **Given** I run `yarn brand brand-a` successfully, **When** I run `yarn ios` or `yarn android`, **Then** the app builds and runs with the brand-a configuration

---

### User Story 2 - View Current Brand and Available Brands (Priority: P2)

As a developer, I want to see which brand is currently active and what brands are available, so that I can make informed decisions about which brand to switch to.

**Why this priority**: Important for usability but not required for the core brand switching functionality.

**Independent Test**: Can be tested by running the CLI without arguments and verifying the output displays current brand and available options.

**Acceptance Scenarios**:

1. **Given** I previously switched to brand-a, **When** I run `yarn brand` without arguments, **Then** I see "Current brand: brand-a" and a list of all available brands
2. **Given** multiple brand JSON files exist in core/config/brands/, **When** I run `yarn brand`, **Then** I see all available brand IDs listed (e.g., default, brand-a)

---

### User Story 3 - Handle Invalid Brand Selection (Priority: P3)

As a developer, I want helpful error messages when I specify an invalid brand, so that I can quickly identify and correct my mistake.

**Why this priority**: Error handling improves developer experience but is not essential for the happy path.

**Independent Test**: Can be tested by running the CLI with a non-existent brand name and verifying an appropriate error message is displayed.

**Acceptance Scenarios**:

1. **Given** no brand named "invalid-brand" exists, **When** I run `yarn brand invalid-brand`, **Then** I see an error message "Brand 'invalid-brand' not found" and a list of available brands
2. **Given** the ios/ directory does not exist, **When** I run `yarn brand brand-a`, **Then** I see a warning "iOS directory not found, skipping iOS updates" and the script continues with Android updates

---

### User Story 4 - Update App Icons When Switching Brand (Priority: P2)

As a developer, I want the app icons to be automatically updated when I switch brands, so that the app displays the correct brand icon without manual intervention.

**Why this priority**: App icon is a key brand identity element. Updating it together with bundleId/packageName completes the brand switching experience.

**Independent Test**: Can be tested by switching to a brand and verifying that iOS and Android icon files are updated with the brand's icon.

**Acceptance Scenarios**:

1. **Given** brand-a has an icon at `assets/brands/brand-a/icon.png` (1024x1024), **When** I run `yarn brand brand-a`, **Then** the iOS app icon at `ios/{AppName}/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png` is replaced with the brand's icon
2. **Given** brand-a has an adaptive icon at `assets/brands/brand-a/adaptive-icon.png`, **When** I run `yarn brand brand-a`, **Then** all Android adaptive icon foreground files (`ic_launcher_foreground.webp`) in `mipmap-*` folders are regenerated from the brand's adaptive icon
3. **Given** brand-a has an icon at `assets/brands/brand-a/icon.png`, **When** I run `yarn brand brand-a`, **Then** all Android launcher icons (`ic_launcher.webp`, `ic_launcher_round.webp`) in `mipmap-*` folders are regenerated at the correct sizes (mdpi: 48px, hdpi: 72px, xhdpi: 96px, xxhdpi: 144px, xxxhdpi: 192px)
4. **Given** a brand does NOT have an icon file, **When** I run `yarn brand <brand-id>`, **Then** a warning "Icon not found for brand, skipping icon update" is displayed and the script continues with other updates

---

### Edge Cases

- What happens when neither ios/ nor android/ directories exist? Script warns that no native directories found and exits gracefully without changes
- How does the system handle brand JSON files with missing required fields? Script validates and reports specific missing fields before making any changes
- What happens if the brand JSON file has invalid JSON syntax? Script reports JSON parse error with the file path
- How does the system handle file permission errors? Script reports the specific file that couldn't be written and suggests checking permissions
- What happens if icon.png is missing for a brand? Script warns "Icon not found" and continues with other updates (identifier changes still apply)
- What happens if adaptive-icon.png is missing but icon.png exists? Script uses icon.png as fallback for Android adaptive icon foreground
- What happens if icon.png is not 1024x1024? Script validates minimum size (1024x1024) and reports error if too small
- What happens if sharp library is not installed? Script reports dependency error with installation instructions (`yarn add sharp --dev`)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST read brand configuration from `core/config/brands/{brand-id}.json` files
- **FR-002**: System MUST update iOS bundle identifier in `ios/*.xcodeproj/project.pbxproj` file (PRODUCT_BUNDLE_IDENTIFIER)
- **FR-003**: System MUST update iOS display name in `ios/{AppName}/Info.plist` (CFBundleDisplayName and CFBundleName keys)
- **FR-004**: System MUST update Android package name (applicationId) in `android/app/build.gradle`
- **FR-005**: System MUST update Android app name in `android/app/src/main/res/values/strings.xml` (app_name string)
- **FR-006**: System MUST persist the currently active brand to a `.current-brand` file for tracking
- **FR-007**: System MUST display current brand and available brands when run without arguments
- **FR-008**: System MUST display error message and available brands when run with invalid brand name
- **FR-009**: System MUST validate that required fields (appName, ios.bundleId, android.packageName) exist in brand config before applying changes
- **FR-010**: System MUST provide warning messages when ios/ or android/ directories are missing and continue with available platforms
- **FR-011**: System MUST provide a CLI command accessible via `yarn brand <brand-id>`
- **FR-012**: System MUST display progress feedback showing which files are being updated
- **FR-013**: System MUST copy iOS app icon from `assets/brands/{brand-id}/icon.png` to `ios/{AppName}/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png`
- **FR-014**: System MUST generate Android launcher icons (`ic_launcher.webp`) at all required densities (mdpi: 48px, hdpi: 72px, xhdpi: 96px, xxhdpi: 144px, xxxhdpi: 192px) from the source icon
- **FR-015**: System MUST generate Android round launcher icons (`ic_launcher_round.webp`) at all required densities from the source icon
- **FR-016**: System MUST generate Android adaptive icon foreground (`ic_launcher_foreground.webp`) from `assets/brands/{brand-id}/adaptive-icon.png` (or fallback to icon.png) at required densities (mdpi: 108px, hdpi: 162px, xhdpi: 216px, xxhdpi: 324px, xxxhdpi: 432px)
- **FR-017**: System MUST validate that source icon is at least 1024x1024 pixels before processing
- **FR-018**: System MUST warn and continue if icon files are missing for a brand (icon update is optional)

### Key Entities

- **Brand Configuration**: Represents a brand's identity including id, appName, ios.bundleId, android.packageName (sourced from existing JSON files in core/config/brands/)
- **Native Project Files**: iOS and Android configuration files that store app identity (project.pbxproj, Info.plist, build.gradle, strings.xml)
- **Current Brand State**: Tracks which brand is currently active (persisted in .current-brand file)
- **Brand Assets**: Visual assets for each brand stored at `assets/brands/{brand-id}/` including icon.png (1024x1024), adaptive-icon.png (for Android adaptive icons)
- **iOS App Icon**: Single 1024x1024 PNG at `ios/{AppName}/Images.xcassets/AppIcon.appiconset/`
- **Android Launcher Icons**: Multi-density icons at `android/app/src/main/res/mipmap-*/` including ic_launcher.webp, ic_launcher_round.webp, and ic_launcher_foreground.webp

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developers can switch brands in under 5 seconds (compared to 30+ seconds for prebuild)
- **SC-002**: After switching brands, running `yarn ios` or `yarn android` builds the app with the correct brand identifiers
- **SC-003**: 100% of brand configuration fields (appName, bundleId, packageName) are correctly applied to native files
- **SC-004**: Script provides clear feedback showing which files were updated and the new values applied
- **SC-005**: Script completes successfully on first attempt for valid brand configurations (no manual intervention needed)
- **SC-006**: iOS app icon is correctly replaced with brand's 1024x1024 icon
- **SC-007**: All 5 Android launcher icon densities are correctly generated and saved as WebP format
- **SC-008**: All 5 Android round launcher icon densities are correctly generated
- **SC-009**: All 5 Android adaptive icon foreground densities are correctly generated
- **SC-010**: Generated Android icons match expected pixel dimensions (mdpi: 48px, hdpi: 72px, xhdpi: 96px, xxhdpi: 144px, xxxhdpi: 192px)

## Assumptions

- Native project directories (ios/ and android/) have been generated at least once via `yarn prebuild`
- Brand JSON files follow the existing structure with `appName`, `ios.bundleId`, and `android.packageName` fields
- The `.current-brand` file should be added to `.gitignore` as it represents local state
- Script runs on macOS or Linux environments where Node.js is available
- Brand icon source files are located at `assets/brands/{brand-id}/icon.png` (minimum 1024x1024 pixels)
- Brand adaptive icon source files (optional) are located at `assets/brands/{brand-id}/adaptive-icon.png`
- The `sharp` library is available as a dev dependency for image resizing and WebP conversion
- iOS uses single 1024x1024 icon (Xcode auto-generates other sizes), Android requires explicit multi-density icons
