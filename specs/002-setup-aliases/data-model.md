# Data Model: Setting up Path Aliases

**Feature Branch**: `002-setup-aliases`
**Date**: 2026-01-26

## Overview

This feature is **configuration-only** and does not introduce new data entities. The "data" in this context refers to configuration structures.

## Configuration Entities

### AliasMapping

Represents a single path alias configuration.

| Field | Type | Description |
|-------|------|-------------|
| prefix | string | The alias prefix (e.g., `@app`) |
| target | string | The target directory path (e.g., `./app`) |

**Validation Rules**:
- Prefix MUST start with `@`
- Target MUST be a valid relative path from project root
- Target directory MUST exist

### TypeScriptPathConfig

TypeScript paths configuration in tsconfig.json.

| Field | Type | Description |
|-------|------|-------------|
| baseUrl | string | Base URL for path resolution (`.`) |
| paths | Record<string, string[]> | Mapping of alias patterns to paths |

**Example**:
```json
{
  "baseUrl": ".",
  "paths": {
    "@app/*": ["app/*"],
    "@modules/*": ["modules/*"]
  }
}
```

### BabelAliasConfig

Babel module-resolver plugin configuration.

| Field | Type | Description |
|-------|------|-------------|
| root | string[] | Root directories for resolution |
| alias | Record<string, string> | Mapping of alias to path |

**Example**:
```javascript
{
  root: ['.'],
  alias: {
    '@app': './app',
    '@modules': './modules'
  }
}
```

## Relationships

```
TypeScriptPathConfig (compile-time)
        ↓
   mirrors exactly
        ↓
BabelAliasConfig (runtime)
```

## State Transitions

N/A - Configuration is static after setup.

## Notes

- No database entities
- No API contracts
- Configuration stored in JSON/JS files only
