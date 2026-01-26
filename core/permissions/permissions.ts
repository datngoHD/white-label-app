import { UserRole } from '../types';

/**
 * Permission definitions for role-based access control
 */

export const PERMISSIONS = {
  // User management
  VIEW_USERS: 'view_users',
  INVITE_USERS: 'invite_users',
  MANAGE_USERS: 'manage_users',
  DEACTIVATE_USERS: 'deactivate_users',

  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',

  // Admin
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_TENANT: 'manage_tenant',

  // Profile
  VIEW_PROFILE: 'view_profile',
  EDIT_PROFILE: 'edit_profile',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role-permission mapping
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.DEACTIVATE_USERS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_ADMIN_PANEL,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_TENANT,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],
  user: [
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],
};

/**
 * Check if a role has a specific permission
 */
export const roleHasPermission = (role: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

/**
 * Check if a role has all specified permissions
 */
export const roleHasAllPermissions = (
  role: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.every((permission) => roleHasPermission(role, permission));
};

/**
 * Check if a role has any of the specified permissions
 */
export const roleHasAnyPermission = (
  role: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.some((permission) => roleHasPermission(role, permission));
};

/**
 * Get all permissions for a role
 */
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] ?? [];
};
