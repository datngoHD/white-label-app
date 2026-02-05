/**
 * Auth Mutation Hook
 *
 * Manages authentication mutations (login, logout, register) using TanStack Query.
 * Auth mutations require network connectivity and are NOT queued for offline execution.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryClient as globalQueryClient } from '@core/query/query-client';
import { tokenStorage, StoredTokens } from '@core/storage/token-storage';

import { authMutationKeys } from '../queries/auth-query-keys';
import { authService } from '../services/auth-service';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';
import { setAuthSession, clearAuthSession } from './use-auth-query';

/**
 * Default tenant ID for mutations
 * In a real app, this would come from context or configuration
 */
const DEFAULT_TENANT_ID = 'default';

/**
 * Convert API AuthTokens to StoredTokens format for secure storage
 */
function toStoredTokens(response: AuthResponse): StoredTokens {
  return {
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    // Convert expiresIn (seconds) to absolute timestamp
    expiresAt: Date.now() + response.tokens.expiresIn * 1000,
  };
}

/**
 * Login mutation result
 */
export interface UseLoginMutationReturn {
  login: (credentials: LoginCredentials) => Promise<User>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Logout mutation result
 */
export interface UseLogoutMutationReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Register mutation result
 */
export interface UseRegisterMutationReturn {
  register: (data: RegisterData) => Promise<User>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Combined auth mutations result
 */
export interface UseAuthMutationReturn {
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  isLoginLoading: boolean;
  isLogoutLoading: boolean;
  isRegisterLoading: boolean;
  loginError: Error | null;
  logoutError: Error | null;
  registerError: Error | null;
  resetLoginError: () => void;
  resetLogoutError: () => void;
  resetRegisterError: () => void;
}

/**
 * Hook for login mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Login mutation state and actions
 */
export function useLoginMutation(tenantId: string = DEFAULT_TENANT_ID): UseLoginMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: authMutationKeys.login,
    mutationFn: async (credentials: LoginCredentials): Promise<User> => {
      const response = await authService.login(credentials);

      // Save tokens to secure storage
      await tokenStorage.saveTokens(toStoredTokens(response));

      // Update auth session in cache
      setAuthSession(queryClient, response.user, tenantId);

      return response.user;
    },
    // Auth mutations require network - do not queue offline
    networkMode: 'online',
    // Clear all queries on successful login (fresh start)
    onSuccess: () => {
      // Invalidate any stale data from previous session
      void queryClient.invalidateQueries();
    },
  });

  return {
    login: async (credentials: LoginCredentials) => {
      return mutation.mutateAsync(credentials);
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for logout mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Logout mutation state and actions
 */
export function useLogoutMutation(tenantId: string = DEFAULT_TENANT_ID): UseLogoutMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: authMutationKeys.logout,
    mutationFn: async (): Promise<void> => {
      // Call logout API (best effort - continue even if it fails)
      try {
        await authService.logout();
      } catch {
        // Ignore logout API errors - we still want to clear local state
      }

      // Clear tokens from secure storage
      await tokenStorage.clearTokens();

      // Clear auth session from cache
      clearAuthSession(queryClient, tenantId);
    },
    // Auth mutations require network - do not queue offline
    // However, logout should work even offline (clears local state)
    networkMode: 'always',
    // Clear all cached data on logout (security)
    onSuccess: () => {
      // Remove all queries from cache
      queryClient.clear();
    },
  });

  return {
    logout: async () => {
      return mutation.mutateAsync();
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for register mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Register mutation state and actions
 */
export function useRegisterMutation(tenantId: string = DEFAULT_TENANT_ID): UseRegisterMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: authMutationKeys.register,
    mutationFn: async (data: RegisterData): Promise<User> => {
      const response = await authService.register(data);

      // Save tokens to secure storage
      await tokenStorage.saveTokens(toStoredTokens(response));

      // Update auth session in cache
      setAuthSession(queryClient, response.user, tenantId);

      return response.user;
    },
    // Auth mutations require network - do not queue offline
    networkMode: 'online',
    // Clear all queries on successful registration (fresh start)
    onSuccess: () => {
      // Invalidate any stale data
      void queryClient.invalidateQueries();
    },
  });

  return {
    register: async (data: RegisterData) => {
      return mutation.mutateAsync(data);
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Combined hook for all auth mutations
 *
 * Provides login, logout, and register mutations in a single hook.
 * Useful when a component needs access to multiple auth actions.
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns All auth mutation states and actions
 */
export function useAuthMutation(tenantId: string = DEFAULT_TENANT_ID): UseAuthMutationReturn {
  const loginMutation = useLoginMutation(tenantId);
  const logoutMutation = useLogoutMutation(tenantId);
  const registerMutation = useRegisterMutation(tenantId);

  return {
    login: loginMutation.login,
    logout: logoutMutation.logout,
    register: registerMutation.register,
    isLoginLoading: loginMutation.isLoading,
    isLogoutLoading: logoutMutation.isLoading,
    isRegisterLoading: registerMutation.isLoading,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    registerError: registerMutation.error,
    resetLoginError: loginMutation.reset,
    resetLogoutError: logoutMutation.reset,
    resetRegisterError: registerMutation.reset,
  };
}

/**
 * Logout and clear all cached data (for use outside React components)
 * Used by auth interceptor when token refresh fails
 */
export async function logoutAndClearCache(tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
  // Clear tokens from secure storage
  await tokenStorage.clearTokens();

  // Clear auth session from cache
  clearAuthSession(globalQueryClient, tenantId);

  // Clear all cached data
  globalQueryClient.clear();
}

export default useAuthMutation;
