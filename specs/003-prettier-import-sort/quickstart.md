# Quickstart: Prettier Import Sorting

**Feature**: 003-prettier-import-sort
**Date**: 2026-01-27

## Prerequisites

- Node.js installed
- Project cloned with `npm install` or `yarn install` completed
- IDE with Prettier extension (VSCode, WebStorm, etc.)

## Installation

```bash
# Using yarn (per project constitution)
yarn add -D @ianvs/prettier-plugin-sort-imports
```

## Configuration

After installation, the `.prettierrc` file will be updated with import sorting configuration. The plugin activates automatically when Prettier runs.

### Import Group Order

Imports will be organized in this order:

1. **Side-effect imports** (e.g., `import './polyfill'`)
2. **React and React Native** (e.g., `import React from 'react'`)
3. **Expo packages** (e.g., `import * as SplashScreen from 'expo-splash-screen'`)
4. **External packages** (e.g., `import axios from 'axios'`)
5. **Internal aliases** (e.g., `import { utils } from '@core/utils'`)
6. **Relative imports** (e.g., `import { Button } from './Button'`)

Blank lines separate each group for visual clarity.

## Usage

### IDE (Recommended)

1. Enable "Format on Save" in your IDE
2. Save any `.ts`, `.tsx`, `.js`, or `.jsx` file
3. Imports are automatically sorted

**VSCode Settings**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Command Line

```bash
# Format all files
yarn format

# Format specific file
npx prettier --write src/app/index.tsx

# Check formatting (CI/CD)
npx prettier --check .
```

## Example

### Before

```typescript
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import axios from 'axios';
import { useSelector } from 'react-redux';

import type { RootState } from '@app/store';
import { configService } from '@core/config';

import { Button } from './components/Button';
```

### After

```typescript
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import axios from 'axios';
import { useSelector } from 'react-redux';

import type { RootState } from '@app/store';
import { configService } from '@core/config';

import { Button } from './components/Button';
```

## Verification

Run these commands to verify the setup:

```bash
# Check if plugin is recognized
npx prettier --help | grep -i import

# Test on a single file
npx prettier --write src/App.tsx

# Verify no formatting issues
yarn format && git diff
```

## Troubleshooting

### Imports not being sorted

1. Ensure the plugin is installed: `yarn list @ianvs/prettier-plugin-sort-imports`
2. Check `.prettierrc` includes the plugin in `plugins` array
3. Restart your IDE to reload Prettier configuration

### Conflict with ESLint

If using `eslint-plugin-import` with ordering rules:

1. Disable ESLint's `import/order` rule, OR
2. Configure ESLint to match Prettier's import order (see research.md for example)

### Type imports not grouping correctly

Ensure `importOrderTypeScriptVersion` matches your TypeScript version (5.3.3).

## Next Steps

- Run `yarn format` to sort imports in all existing files
- Commit the configuration changes
- Team members pull changes and their imports auto-sort on save
