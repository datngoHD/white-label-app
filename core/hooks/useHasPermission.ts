import { useUserRole } from './useUserRole';
import {
  Permission,
  roleHasPermission,
  roleHasAllPermissions,
  roleHasAnyPermission,
  getPermissionsForRole,
} from '../permissions/permissions';

/**
 * Hook to check if the current user has a specific permission
 */
export const useHasPermission = (permission: Permission): boolean => {
  const role = useUserRole();

  if (!role) return false;

  return roleHasPermission(role, permission);
};

/**
 * Hook to check if the current user has all specified permissions
 */
export const useHasAllPermissions = (permissions: Permission[]): boolean => {
  const role = useUserRole();

  if (!role) return false;

  return roleHasAllPermissions(role, permissions);
};

/**
 * Hook to check if the current user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: Permission[]): boolean => {
  const role = useUserRole();

  if (!role) return false;

  return roleHasAnyPermission(role, permissions);
};

/**
 * Hook to get all permissions for the current user
 */
export const useUserPermissions = (): Permission[] => {
  const role = useUserRole();

  if (!role) return [];

  return getPermissionsForRole(role);
};
