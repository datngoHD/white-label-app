import { UserRole } from '../types';

/**
 * Hook to get the current user's role
 * Returns null if no user is authenticated
 */
export const useUserRole = (): UserRole | null => {
  // TODO: Get from auth state when auth slice is implemented
  // const user = useAppSelector((state) => state.auth.user);
  // return user?.role ?? null;

  // For now, return 'user' as default
  return 'user';
};

/**
 * Hook to check if the current user is an admin
 */
export const useIsAdmin = (): boolean => {
  const role = useUserRole();
  return role === 'admin';
};

/**
 * Hook to check if the current user has a specific role
 */
export const useHasRole = (requiredRole: UserRole): boolean => {
  const role = useUserRole();

  if (!role) return false;

  // Admin has access to everything
  if (role === 'admin') return true;

  return role === requiredRole;
};
