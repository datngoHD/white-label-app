// Core module barrel export
// Re-exports from all core submodules

// API
export * from './api';

// Config
export * from './config';

// Errors
export * from './errors';

// Hooks
export * from './hooks';

// i18n
export * from './i18n';

// Logging
export { logger, setLogContext } from './logging/logger';
export * from './logging/accessLogger';

// Navigation
export * from './navigation';

// Permissions
export * from './permissions/permissions';

// Store
export * from './store';

// Theme
export * from './theme';

// Utils
export * from './utils';

// Types - explicitly export to avoid conflicts with config types
export type { UserRole, ApiError } from './types';
