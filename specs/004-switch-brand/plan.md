# Implementation Plan: Switch Brand Script

**Branch**: `004-switch-brand` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-switch-brand/spec.md`

## Summary

Implement a CLI script (`yarn brand <brand-id>`) that enables rapid brand switching without running `expo prebuild`. The script reads brand configuration from existing JSON files and updates native project files (iOS and Android) including bundle identifiers, app names, and app icons.

**Scope**:

- US1 (P1): Switch brand identifiers and app name - **IMPLEMENTED**
- US2 (P2): View current brand and available brands - **IMPLEMENTED**
- US3 (P3): Handle invalid brand selection - **IMPLEMENTED**
- US4 (P2): Update app icons when switching brand - **NEW**

## Technical Context

**Language/Version**: JavaScript (Node.js 18+)
**Primary Dependencies**: Node.js built-in modules (fs, path) + sharp (for image processing)
**Storage**: N/A (file-based configuration)
**Testing**: Manual validation (no unit tests per spec)
**Target Platform**: macOS/Linux development environment
**Project Type**: CLI script for React Native/Expo project
**Performance Goals**: Complete brand switch in under 5 seconds
**Constraints**: No external dependencies except sharp; must work offline
**Scale/Scope**: Single script, ~500-700 LOC

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                  | Status | Notes                                                     |
| -------------------------- | ------ | --------------------------------------------------------- |
| Clean Architecture         | PASS   | Script is a standalone tool, not part of app architecture |
| Clear Folder Structure     | PASS   | Script in `scripts/`, follows project conventions         |
| Separation of Concerns     | PASS   | Script handles only brand switching, not app logic        |
| Strong TypeScript Typing   | N/A    | Script is JavaScript; types documented in contracts/      |
| Externalized Configuration | PASS   | Reads from brand JSON files, no hardcoded values          |
| White-label Design         | PASS   | Directly supports brand switching requirement             |
| Expo Prebuild Workflow     | PASS   | Complements prebuild, doesn't replace it                  |

**No violations requiring justification.**

## Project Structure

### Documentation (this feature)

```text
specs/004-switch-brand/
├── plan.md              # This file
├── research.md          # Phase 0 output - regex patterns, icon processing
├── data-model.md        # Phase 1 output - brand config, icon entities
├── quickstart.md        # Phase 1 output - usage guide
├── contracts/           # Phase 1 output - TypeScript types
│   └── types.ts
└── tasks.md             # Phase 2 output - implementation tasks
```

### Source Code (repository root)

```text
scripts/
└── switch-brand.js      # CLI script (implemented, needs icon update)

assets/brands/
├── default/
│   ├── icon.png           # 1024x1024 app icon
│   └── adaptive-icon.png  # Android adaptive icon foreground
└── brand-a/
    ├── icon.png
    └── adaptive-icon.png

ios/{AppName}/Images.xcassets/AppIcon.appiconset/
└── App-Icon-1024x1024@1x.png   # iOS app icon (single file)

android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.webp
│   ├── ic_launcher_round.webp
│   └── ic_launcher_foreground.webp
├── mipmap-hdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

**Structure Decision**: Script-based tool modifying native project files. No new directories required.

## Complexity Tracking

No violations requiring justification.

## Icon Processing Details (US4)

### iOS Icons

- **Source**: `assets/brands/{brand-id}/icon.png` (1024x1024)
- **Target**: `ios/{AppName}/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png`
- **Processing**: Direct copy (Xcode auto-generates other sizes)

### Android Icons

| Target File                 | mdpi  | hdpi  | xhdpi | xxhdpi | xxxhdpi |
| --------------------------- | ----- | ----- | ----- | ------ | ------- |
| ic_launcher.webp            | 48px  | 72px  | 96px  | 144px  | 192px   |
| ic_launcher_round.webp      | 48px  | 72px  | 96px  | 144px  | 192px   |
| ic_launcher_foreground.webp | 108px | 162px | 216px | 324px  | 432px   |

- **Source**: `assets/brands/{brand-id}/icon.png` for launcher/round
- **Source**: `assets/brands/{brand-id}/adaptive-icon.png` for foreground (fallback to icon.png)
- **Processing**: Resize + convert to WebP using sharp library

### Dependencies

- `sharp`: Image processing library for resize and WebP conversion
- Install: `yarn add sharp --dev`
