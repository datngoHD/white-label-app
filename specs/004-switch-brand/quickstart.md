# Quickstart: Switch Brand Script

**Feature**: 004-switch-brand
**Date**: 2026-01-28

## Overview

The switch-brand script allows rapid switching between white-label brand configurations without running `expo prebuild`. This is useful during development when testing multiple brand configurations.

## Usage

### Switch to a brand

```bash
yarn brand brand-a
```

**Output**:
```
🔄 Switching to brand: brand-a

📱 Updating Android...
   ✅ Updated applicationId: com.example.brandaapp
   ✅ Updated app_name: Brand A App

🍎 Updating iOS...
   ✅ Updated Bundle ID: com.example.brandaapp
   ✅ Updated display name: Brand A App

📝 Saved current brand to .current-brand

✨ Successfully switched to brand: brand-a

You can now run:
   yarn ios
   yarn android
```

### View current brand and available brands

```bash
yarn brand
```

**Output**:
```
Current brand: brand-a

Available brands:
  • default - White Label App
  • brand-a - Brand A App (current)
```

### Handle invalid brand

```bash
yarn brand invalid-brand
```

**Output**:
```
❌ Brand 'invalid-brand' not found

Available brands:
  • default
  • brand-a
```

## Prerequisites

1. Native projects must exist (run `yarn prebuild` at least once)
2. Brand configuration files must exist in `core/config/brands/`
3. **For icon updates**: Install sharp library

```bash
yarn add sharp --dev
```

## Adding a New Brand

1. Create a new brand configuration file:

```bash
# Copy from existing brand
cp core/config/brands/default.json core/config/brands/brand-b.json
```

2. Create brand assets folder with icons:

```bash
mkdir -p assets/brands/brand-b
# Add icon.png (1024x1024) - required for icon updates
# Add adaptive-icon.png (1024x1024) - optional, for Android adaptive icons
```

3. Edit the new brand file:

```json
{
  "id": "brand-b",
  "appName": "Brand B App",
  "slug": "brand-b-app",
  "ios": {
    "bundleId": "com.example.brandbapp",
    "teamId": "TEAM123456"
  },
  "android": {
    "packageName": "com.example.brandbapp"
  },
  "defaultTenantId": "tenant-brand-b",
  "assetsPath": "assets/brands/brand-b",
  "theme": {
    "colors": {
      "primary": "#FF5733",
      "secondary": "#C70039",
      "accent": "#FFC300"
    }
  }
}
```

3. Switch to the new brand:

```bash
yarn brand brand-b
```

## Workflow Comparison

### Before (with prebuild)

```bash
# Switch brand - takes 30+ seconds
BRAND=brand-a yarn prebuild:clean
yarn ios
```

### After (with switch-brand script)

```bash
# Switch brand - takes <5 seconds
yarn brand brand-a
yarn ios
```

### Icon update (with sharp installed)

```bash
yarn brand brand-a
```

**Output**:
```
🔄 Switching to brand: brand-a

📱 Updating Android...
   ✅ Updated applicationId: com.example.brandaapp
   ✅ Updated app_name: Brand A App

🍎 Updating iOS...
   ✅ Updated Bundle ID: com.example.brandaapp
   ✅ Updated display name: Brand A App

🖼️  Updating icons...
   ✅ iOS: Copied icon to AppIcon.appiconset
   ✅ Android: Generated 5 launcher icons
   ✅ Android: Generated 5 round icons
   ✅ Android: Generated 5 foreground icons

📝 Saved current brand to .current-brand

✨ Successfully switched to brand: brand-a
```

### Handle missing icon

```bash
yarn brand brand-b  # brand-b has no icon.png
```

**Output**:
```
🔄 Switching to brand: brand-b

📱 Updating Android...
   ✅ Updated applicationId: com.example.brandbapp
   ✅ Updated app_name: Brand B App

🍎 Updating iOS...
   ✅ Updated Bundle ID: com.example.brandbapp
   ✅ Updated display name: Brand B App

⚠️  Icon not found for brand 'brand-b', skipping icon update

📝 Saved current brand to .current-brand

✨ Successfully switched to brand: brand-b
```

### Handle missing sharp library

```bash
yarn brand brand-a  # sharp not installed
```

**Output**:
```
🔄 Switching to brand: brand-a

📱 Updating Android...
   ✅ Updated applicationId: com.example.brandaapp
   ✅ Updated app_name: Brand A App

🍎 Updating iOS...
   ✅ Updated Bundle ID: com.example.brandaapp
   ✅ Updated display name: Brand A App

⚠️  sharp library not found, skipping icon update
   Install with: yarn add sharp --dev

📝 Saved current brand to .current-brand

✨ Successfully switched to brand: brand-a
```

## Limitations

- Requires native directories to already exist
- After switching bundle ID, iOS may require a clean build
- Icon update requires `sharp` library (`yarn add sharp --dev`)

## Troubleshooting

### "iOS directory not found"

Run prebuild first:
```bash
yarn prebuild
```

### iOS build fails after switching bundle ID

Clean the iOS build:
```bash
cd ios && xcodebuild clean && cd ..
yarn ios
```

### Android build shows old package name

Clean the Android build:
```bash
cd android && ./gradlew clean && cd ..
yarn android
```

## Related Commands

| Command | Purpose |
|---------|---------|
| `yarn brand <id>` | Switch to a brand |
| `yarn brand` | Show current brand and list |
| `yarn prebuild` | Generate native projects |
| `yarn prebuild:clean` | Regenerate native projects from scratch |
