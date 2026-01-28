# Research: Switch Brand Script

**Feature**: 004-switch-brand
**Date**: 2026-01-28

## Overview

This document captures research findings for implementing the switch-brand CLI script. Since no NEEDS CLARIFICATION markers were identified in the technical context, research focuses on best practices and implementation patterns.

## Research Areas

### 1. Native File Modification Patterns

**Decision**: Use regex-based string replacement for native file modifications

**Rationale**:
- Native files (build.gradle, project.pbxproj, Info.plist, strings.xml) have well-defined, stable formats
- Regex patterns provide reliable matching without requiring full parsers
- Node.js built-in `fs` module is sufficient; no need for external dependencies

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| XML/plist parsers | Adds dependencies; overkill for simple value replacement |
| AST manipulation | Complex; project.pbxproj and build.gradle have non-standard formats |
| Template regeneration | Would require maintaining templates; duplicates prebuild logic |

**Implementation Pattern**:
```typescript
// Read file → Replace pattern → Write file
const content = fs.readFileSync(filePath, 'utf8');
const updated = content.replace(pattern, replacement);
fs.writeFileSync(filePath, updated);
```

### 2. iOS project.pbxproj Bundle ID Pattern

**Decision**: Match `PRODUCT_BUNDLE_IDENTIFIER = "value";` pattern with global replace

**Rationale**:
- project.pbxproj contains multiple occurrences (Debug, Release configurations)
- All occurrences should be updated to the same value
- Pattern is consistent across Expo-generated projects

**Pattern**:
```regex
/PRODUCT_BUNDLE_IDENTIFIER = "?[^";]+"?;/g
```

**Replacement**: `PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";`

### 3. Android build.gradle Package Name Pattern

**Decision**: Update both `namespace` and `applicationId` fields

**Rationale**:
- Modern Android projects use both fields (namespace for R class, applicationId for package identity)
- Both should match for consistency
- Located in `android/app/build.gradle`

**Patterns**:
```regex
/namespace\s+['"].*['"]/  → namespace '${packageName}'
/applicationId\s+['"].*['"]/ → applicationId '${packageName}'
```

### 4. iOS Info.plist Display Name Pattern

**Decision**: Update `CFBundleDisplayName` using plist XML structure

**Rationale**:
- Info.plist is standard XML format
- CFBundleDisplayName controls the app name shown under the icon
- Pattern matching on key-value pairs is reliable

**Pattern**:
```regex
/(<key>CFBundleDisplayName<\/key>\s*<string>)([^<]*)(<\/string>)/
```

**Replacement**: `$1${appName}$3`

### 5. Android strings.xml App Name Pattern

**Decision**: Update `app_name` string resource

**Rationale**:
- Standard Android pattern for app display name
- XML format is simple and predictable

**Pattern**:
```regex
/<string name="app_name">.*<\/string>/
```

**Replacement**: `<string name="app_name">${appName}</string>`

### 6. Error Handling Strategy

**Decision**: Validate before modifying; warn and continue on missing platforms

**Rationale**:
- Developers may only have one platform set up (iOS-only or Android-only development)
- Complete failure is too disruptive; partial success is acceptable
- Validation prevents partial state from corrupted brand configs

**Approach**:
1. Validate brand config exists and has required fields
2. Check which platform directories exist
3. Warn if platform missing, continue with available platforms
4. Error only if no platforms available

### 7. CLI Output Format

**Decision**: Use emoji indicators with concise status messages

**Rationale**:
- Consistent with modern CLI tools
- Easy visual scanning of success/warning/error states
- Provides actionable information

**Format**:
```
🔄 Switching to brand: brand-a

📱 Updating Android...
   ✅ Updated applicationId
   ✅ Updated app_name

🍎 Updating iOS...
   ✅ Updated Bundle ID
   ✅ Updated display name

📝 Saved current brand to .current-brand

✨ Successfully switched to brand: brand-a
```

### 8. Script Execution Method

**Decision**: Use ts-node for development, compile to JS for package.json script

**Rationale**:
- TypeScript provides type safety during development
- ts-node allows direct execution without build step
- Project already has TypeScript configured

**package.json**:
```json
{
  "scripts": {
    "brand": "npx ts-node scripts/switch-brand.ts"
  }
}
```

### 9. Icon Processing Library Selection

**Decision**: Use `sharp` library for image processing

**Rationale**:
- High performance, native bindings (libvips)
- Supports PNG input and WebP output natively
- Single dependency with no transitive dependencies for basic operations
- Well-maintained, widely used in Node.js ecosystem
- Supports resize with various fit modes and quality settings

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| jimp | Pure JavaScript, slower for large images |
| imagemagick (CLI) | Requires system installation, not portable |
| canvas | Overkill for simple resize operations |
| expo-image-manipulator | Runtime library, not suitable for build scripts |

**Implementation Pattern**:
```javascript
const sharp = require('sharp');

// Resize and convert to WebP
await sharp(inputPath)
  .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 90 })
  .toFile(outputPath);
```

### 10. iOS App Icon Strategy

**Decision**: Copy 1024x1024 PNG directly to AppIcon.appiconset

**Rationale**:
- Expo-generated iOS projects use single 1024x1024 icon
- Xcode auto-generates all required sizes from this single file
- Contents.json only references one file (App-Icon-1024x1024@1x.png)
- No resizing needed, just file copy

**File Location**:
```
ios/{AppName}/Images.xcassets/AppIcon.appiconset/
├── App-Icon-1024x1024@1x.png  ← Copy here
└── Contents.json               ← No modification needed
```

### 11. Android Launcher Icon Sizes

**Decision**: Generate all 5 density variants for ic_launcher.webp and ic_launcher_round.webp

**Rationale**:
- Android requires explicit density variants (no auto-generation)
- WebP format is standard for Android icons (smaller file size)
- Round variants are required for devices with circular icon masks

**Size Matrix**:
| Density | Base DP | Actual Size | Scale |
|---------|---------|-------------|-------|
| mdpi | 48dp | 48px | 1x |
| hdpi | 48dp | 72px | 1.5x |
| xhdpi | 48dp | 96px | 2x |
| xxhdpi | 48dp | 144px | 3x |
| xxxhdpi | 48dp | 192px | 4x |

### 12. Android Adaptive Icon Foreground Sizes

**Decision**: Generate foreground at 108dp equivalent sizes

**Rationale**:
- Adaptive icons use 108dp canvas with 72dp safe zone
- Foreground needs larger size to allow for masking
- Different size matrix than launcher icons

**Size Matrix**:
| Density | Base DP | Actual Size | Scale |
|---------|---------|-------------|-------|
| mdpi | 108dp | 108px | 1x |
| hdpi | 108dp | 162px | 1.5x |
| xhdpi | 108dp | 216px | 2x |
| xxhdpi | 108dp | 324px | 3x |
| xxxhdpi | 108dp | 432px | 4x |

**Source Priority**:
1. `assets/brands/{brand-id}/adaptive-icon.png` (preferred)
2. `assets/brands/{brand-id}/icon.png` (fallback)

### 13. Round Icon Generation

**Decision**: Apply circular mask to source icon for round variants

**Rationale**:
- Android devices with circular icon masks need pre-masked icons
- Better quality than runtime masking
- Uses sharp composite operation with circular mask

**Implementation**:
```javascript
// Create circular mask
const mask = Buffer.from(
  `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
);

await sharp(inputPath)
  .resize(size, size)
  .composite([{ input: mask, blend: 'dest-in' }])
  .webp({ quality: 90 })
  .toFile(outputPath);
```

### 14. Icon Validation

**Decision**: Validate source icon is at least 1024x1024 before processing

**Rationale**:
- Prevents quality loss from upscaling
- 1024x1024 is minimum for iOS App Store
- All target sizes are smaller than source

**Implementation**:
```javascript
const metadata = await sharp(iconPath).metadata();
if (metadata.width < 1024 || metadata.height < 1024) {
  throw new Error(`Icon must be at least 1024x1024, got ${metadata.width}x${metadata.height}`);
}
```

### 15. Error Handling for Missing Icons

**Decision**: Warn and continue if icon files are missing

**Rationale**:
- Icon update is optional enhancement
- Core functionality (bundleId, packageName) should still work
- Developers may not have icons ready for all brands

**Approach**:
1. Check if icon file exists
2. If missing, log warning: "⚠️ Icon not found for brand, skipping icon update"
3. Continue with other updates (identifiers, app name)

## Summary

All research items are resolved. Implementation requires:
- Node.js built-in modules (fs, path) for file operations and regex-based modifications
- `sharp` library for icon processing (resize, WebP conversion, circular mask)
