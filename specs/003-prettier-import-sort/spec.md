# Feature Specification: Prettier Import Sorting

**Feature Branch**: `003-prettier-import-sort`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Set up Prettier plugin to automatically sort imports in React Native (Expo Bare) project with TypeScript"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Automatic Import Sorting on Save (Priority: P1)

As a developer, I want my imports to be automatically sorted whenever I save a file, so that I don't have to manually organize imports and can focus on writing code.

**Why this priority**: This is the core value proposition of the feature. Automatic sorting on save provides immediate, continuous value to developers without requiring any manual intervention.

**Independent Test**: Can be fully tested by saving a file with unsorted imports and verifying the imports are automatically organized according to the defined sorting rules.

**Acceptance Scenarios**:

1. **Given** a TypeScript/JavaScript file with unsorted imports, **When** the developer saves the file (with Prettier formatting enabled), **Then** all imports are automatically sorted according to the configured grouping rules.
2. **Given** a file with already sorted imports, **When** the developer saves the file, **Then** the import order remains unchanged (no unnecessary modifications).
3. **Given** a file with mixed import types (React, third-party, local), **When** the developer saves the file, **Then** imports are grouped by type with consistent ordering within each group.

---

### User Story 2 - Consistent Import Order Across Team (Priority: P2)

As a team lead, I want all developers to have the same import sorting configuration, so that code reviews are focused on logic rather than import formatting and the codebase maintains a consistent style.

**Why this priority**: Team consistency is the secondary benefit that multiplies the value of automatic sorting across the entire development team.

**Independent Test**: Can be fully tested by having two developers format the same file with unsorted imports and comparing the results are identical.

**Acceptance Scenarios**:

1. **Given** a shared configuration committed to the repository, **When** any developer formats a file, **Then** the resulting import order matches what any other team member would produce.
2. **Given** a new developer joining the project, **When** they clone the repository and open a file, **Then** their IDE automatically uses the project's import sorting rules without additional setup.

---

### User Story 3 - Command Line Formatting (Priority: P3)

As a developer, I want to format imports via command line, so that I can integrate import sorting into CI/CD pipelines and pre-commit hooks.

**Why this priority**: CI/CD integration ensures consistent formatting is enforced even when developers forget to format locally, providing a safety net for the team.

**Independent Test**: Can be fully tested by running a format command on files with unsorted imports and verifying the output matches the expected sorted format.

**Acceptance Scenarios**:

1. **Given** a file with unsorted imports, **When** the developer runs the Prettier format command, **Then** the file is updated with sorted imports.
2. **Given** the CI/CD pipeline runs the Prettier check command, **When** a file has unsorted imports, **Then** the check fails with a clear indication of which files need formatting.

---

### Edge Cases

- What happens when a file has no imports? The file should be left unchanged.
- What happens when a file has only one import? The single import should remain as-is without adding unnecessary blank lines.
- How does the system handle commented-out imports? Commented imports should be ignored by the sorting logic and remain in their original positions.
- What happens with side-effect imports (e.g., `import './polyfill'`)? Side-effect imports should be preserved at the top of the import section before other imports.
- How are type-only imports handled in TypeScript? Type-only imports (`import type`) should remain in the same group as their source module (e.g., a type import from `react` stays in the React group, a type import from `lodash` stays in the external packages group). They are sorted alphabetically alongside regular imports within each group.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST sort imports automatically when Prettier formats a file.
- **FR-002**: The system MUST group imports into distinct sections (React/React Native, external packages, internal/local imports).
- **FR-003**: The system MUST sort imports alphabetically within each group.
- **FR-004**: The system MUST preserve side-effect imports (imports without specifiers) at the top of the import section.
- **FR-005**: The system MUST work with both TypeScript (.ts, .tsx) and JavaScript (.js, .jsx) files.
- **FR-006**: The system MUST add a blank line between import groups for visual separation.
- **FR-007**: The system MUST integrate with existing Prettier configuration without conflicting with other formatting rules.
- **FR-008**: The system MUST support import sorting via both IDE save actions and command line execution.
- **FR-009**: The configuration MUST be shareable via version control (committed configuration files).
- **FR-010**: All existing source files MUST be reformatted in a one-time migration commit to establish a consistent baseline.
- **FR-011**: The system MUST install and configure `eslint-plugin-import` with the `import/order` rule aligned to match the Prettier import sorting configuration.
- **FR-012**: The ESLint `import/order` rule configuration MUST match the same grouping order defined in this specification to prevent conflicts between ESLint and Prettier.

### Import Grouping Order

The import groups should follow this order (standard React Native convention):

1. **Side-effect imports** (e.g., `import './polyfill'`)
2. **React and React Native** (e.g., `import React from 'react'`, `import { View } from 'react-native'`)
3. **External/third-party packages** (e.g., `import lodash from 'lodash'`)
4. **Internal aliases** (e.g., `import { utils } from '@/utils'`)
5. **Relative imports** (e.g., `import { Button } from './components'`)

### Key Entities

- **Import Statement**: A JavaScript/TypeScript import declaration including the imported items and source path.
- **Import Group**: A logical categorization of imports based on their source (React, external, internal, relative).
- **Prettier Configuration**: The project's `.prettierrc` or equivalent configuration file that defines formatting rules.
- **Plugin Configuration**: Settings specific to the import sorting plugin that define grouping and ordering rules.
- **ESLint Import Plugin**: The `eslint-plugin-import` package with `import/order` rule that provides linting feedback for import ordering.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of saved files have imports automatically sorted without developer intervention.
- **SC-002**: All developers on the team produce identical import ordering for the same file content.
- **SC-003**: The format command completes within the existing Prettier execution time (no perceptible delay added).
- **SC-004**: Zero import-related formatting comments in code reviews after adoption.
- **SC-005**: New team members can start using the feature immediately after cloning the repository with no additional configuration required.
- **SC-006**: 100% of existing source files pass the Prettier format check after the migration commit.
- **SC-007**: ESLint `import/order` rule produces no errors/warnings on files that have been formatted by Prettier (tools are aligned).

## Clarifications

### Session 2026-01-27

- Q: How should conflicts with ESLint import ordering rules be handled? → A: Use both tools with aligned configurations: ESLint `import/order` rule for linting warnings/errors, Prettier plugin for auto-fixing. Both must use identical grouping order.
- Q: Where should TypeScript type-only imports be placed? → A: Type imports stay with their source group (e.g., `import type` from `react` stays in React group).
- Q: How should existing codebase files be migrated? → A: One-time migration: Run `yarn format` on all files in a single commit.

## Assumptions

- The project MUST use `eslint-plugin-import` with the `import/order` rule to provide linting-time feedback on import ordering, complementing Prettier's auto-fix capability.
- Prettier is already installed and configured in the project (or will be as part of setup).
- Developers use IDEs that support "format on save" functionality with Prettier.
- The project uses standard ES module import syntax.
- Path aliases (like `@/`) are configured in the project's TypeScript configuration.
- The team agrees on the standard React Native import ordering convention defined in this specification.
