# Data Model: Switch Brand Script

**Feature**: 004-switch-brand
**Date**: 2026-01-28

## Overview

This document defines the data structures used by the switch-brand script. The script primarily reads existing brand configuration and manages a simple state file.

## Entities

### 1. BrandConfig (Existing)

**Source**: `core/config/types.ts` - Already defined in codebase

The script reads brand configuration from existing JSON files. No new brand types are introduced.

```typescript
// Existing interface (reference only)
interface BrandConfig {
  id: string;
  appName: string;
  slug: string;
  ios: {
    bundleId: string;
    teamId: string;
  };
  android: {
    packageName: string;
  };
  defaultTenantId: string;
  assetsPath: string;
  theme?: BrandTheme;
}
```

**Required Fields for Script**:
| Field | Type | Usage |
|-------|------|-------|
| `id` | string | Brand identifier for selection |
| `appName` | string | Updates iOS CFBundleDisplayName, Android app_name |
| `ios.bundleId` | string | Updates iOS PRODUCT_BUNDLE_IDENTIFIER |
| `android.packageName` | string | Updates Android applicationId/namespace |

### 2. CurrentBrandState (New)

**Purpose**: Track the currently active brand for developer reference

**Storage**: `.current-brand` file at project root (plain text, gitignored)

```typescript
// Simple string content
type CurrentBrandState = string; // Brand ID, e.g., "brand-a"
```

**File Format**: Single line containing the brand ID

**Example**:

```
brand-a
```

### 3. SwitchBrandResult (New)

**Purpose**: Represent the outcome of a brand switch operation

```typescript
interface SwitchBrandResult {
  success: boolean;
  brandId: string;
  updates: PlatformUpdate[];
  warnings: string[];
  error?: string;
}

interface PlatformUpdate {
  platform: 'ios' | 'android';
  files: FileUpdate[];
}

interface FileUpdate {
  file: string;
  field: string;
  oldValue?: string;
  newValue: string;
}
```

**States**:
| State | Condition |
|-------|-----------|
| Full Success | Both platforms updated successfully |
| Partial Success | One platform updated, other missing/skipped |
| Failure | No platforms available or validation failed |

## Data Flow

```
┌─────────────────────────────────────┐
│  core/config/brands/{brand-id}.json │  ← Read brand config
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌───────────────┐
         │   Validate    │  ← Check required fields
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌───────────────┐  ┌───────────────┐
│  Update iOS   │  │ Update Android│
│  - pbxproj    │  │  - build.gradle│
│  - Info.plist │  │  - strings.xml │
└───────┬───────┘  └───────┬───────┘
        │                  │
        └────────┬─────────┘
                 ▼
        ┌───────────────┐
        │ .current-brand│  ← Write state
        └───────────────┘
```

## Validation Rules

### Brand Config Validation

| Rule                           | Error Message                                              |
| ------------------------------ | ---------------------------------------------------------- |
| Brand file must exist          | `Brand '{id}' not found. Available: {list}`                |
| `appName` required             | `Brand config missing required field: appName`             |
| `ios.bundleId` required        | `Brand config missing required field: ios.bundleId`        |
| `android.packageName` required | `Brand config missing required field: android.packageName` |
| Valid JSON format              | `Failed to parse brand config: {error}`                    |

### Platform Directory Validation

| Condition          | Behavior                      |
| ------------------ | ----------------------------- |
| `ios/` missing     | Warning, skip iOS updates     |
| `android/` missing | Warning, skip Android updates |
| Both missing       | Error, exit with code 1       |

### 4. IconConfig (New - US4)

**Purpose**: Configuration for icon processing during brand switch

```typescript
interface IconConfig {
  /** Source icon path (1024x1024 PNG) */
  iconPath: string;
  /** Source adaptive icon path (optional, for Android foreground) */
  adaptiveIconPath?: string;
  /** Whether icon files exist and are valid */
  valid: boolean;
  /** Validation errors if any */
  errors: string[];
}
```

### 5. IconSizeConfig (New - US4)

**Purpose**: Define target icon sizes for each density

```typescript
interface IconSizeConfig {
  density: 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi';
  launcherSize: number; // 48, 72, 96, 144, 192
  foregroundSize: number; // 108, 162, 216, 324, 432
}

const ANDROID_ICON_SIZES: IconSizeConfig[] = [
  { density: 'mdpi', launcherSize: 48, foregroundSize: 108 },
  { density: 'hdpi', launcherSize: 72, foregroundSize: 162 },
  { density: 'xhdpi', launcherSize: 96, foregroundSize: 216 },
  { density: 'xxhdpi', launcherSize: 144, foregroundSize: 324 },
  { density: 'xxxhdpi', launcherSize: 192, foregroundSize: 432 },
];
```

### 6. IconUpdateResult (New - US4)

**Purpose**: Represent the outcome of icon update operation

```typescript
interface IconUpdateResult {
  /** Whether icon update was attempted */
  attempted: boolean;
  /** Whether update succeeded */
  success: boolean;
  /** iOS icon update status */
  ios?: {
    updated: boolean;
    path?: string;
    error?: string;
  };
  /** Android icon update status */
  android?: {
    updated: boolean;
    launcherCount: number;
    roundCount: number;
    foregroundCount: number;
    errors: string[];
  };
  /** Warnings (e.g., missing icon file) */
  warnings: string[];
}
```

## Data Flow

```
┌─────────────────────────────────────┐
│  core/config/brands/{brand-id}.json │  ← Read brand config
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌───────────────┐
         │   Validate    │  ← Check required fields
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌───────────────┐  ┌───────────────┐
│  Update iOS   │  │ Update Android│
│  - pbxproj    │  │  - build.gradle│
│  - Info.plist │  │  - strings.xml │
└───────┬───────┘  └───────┬───────┘
        │                  │
        └────────┬─────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  assets/brands/{brand-id}/icon.png     │  ← Read brand icon (US4)
│  assets/brands/{brand-id}/adaptive-icon│
└─────────────────┬──────────────────────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
┌───────────────┐  ┌────────────────────┐
│  iOS Icon     │  │  Android Icons     │
│  - Copy 1024  │  │  - ic_launcher     │
│    to Assets  │  │  - ic_launcher_round│
└───────┬───────┘  │  - foreground      │
        │          └───────┬────────────┘
        │                  │
        └────────┬─────────┘
                 ▼
        ┌───────────────┐
        │ .current-brand│  ← Write state
        └───────────────┘
```

## File Locations

### Input Files (Read)

| File                                         | Purpose                                     |
| -------------------------------------------- | ------------------------------------------- |
| `core/config/brands/*.json`                  | Brand configuration files                   |
| `.current-brand`                             | Current brand state (optional)              |
| `assets/brands/{brand-id}/icon.png`          | Brand app icon (1024x1024)                  |
| `assets/brands/{brand-id}/adaptive-icon.png` | Android adaptive icon foreground (optional) |

### Output Files (Write)

| File                                                                 | Purpose                     |
| -------------------------------------------------------------------- | --------------------------- |
| `android/app/build.gradle`                                           | Android package name        |
| `android/app/src/main/res/values/strings.xml`                        | Android app name            |
| `android/app/src/main/res/mipmap-*/ic_launcher.webp`                 | Android launcher icon       |
| `android/app/src/main/res/mipmap-*/ic_launcher_round.webp`           | Android round icon          |
| `android/app/src/main/res/mipmap-*/ic_launcher_foreground.webp`      | Android adaptive foreground |
| `ios/*.xcodeproj/project.pbxproj`                                    | iOS bundle identifier       |
| `ios/*/Info.plist`                                                   | iOS display name            |
| `ios/*/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png` | iOS app icon                |
| `.current-brand`                                                     | Current brand state         |
