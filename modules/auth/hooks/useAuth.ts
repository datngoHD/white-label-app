/**
 * Auth Hook
 *
 * Main authentication hook that provides a unified API for auth operations.
 * Internally uses TanStack Query for state management.
 *
 * This hook maintains backward compatibility with the previous Redux-based API.
 */

import { useCallback, useMemo } from 'react';

import { LoginCredentials, RegisterData, User, AuthTokens } from '../types';
import { useAuthMutation } from './useAuthMutation';
import { useAuthQuery } from './useAuthQuery';

/**
 * Auth hook return type (backward compatible with Redux version)
 */
export interface UseAuthReturn {
  user: User | null;
  /** @deprecated Tokens are now stored in secure storage only. Use tokenStorage directly if needed. */
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  resetError: () => void;
}

/**
 * Main authentication hook
 *
 * Provides access to auth state and actions using TanStack Query.
 * Maintains the same public API as the previous Redux-based implementation.
 *
 * @returns Auth state and actions
 *
 * @example
 * ```tsx
 * function LoginScreen() {
 *   const { login, isLoading, error } = useAuth();
 *
 *   const handleLogin = async () => {
 *     try {
 *       await login({ email, password });
 *       // Navigate to home
 *     } catch (err) {
 *       // Error is also available via `error`
 *     }
 *   };
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  // Query for auth session state
  const {
    user,
    isAuthenticated,
    isInitialized,
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useAuthQuery();

  // Mutations for auth actions
  const {
    login: loginMutation,
    logout: logoutMutation,
    register: registerMutation,
    isLoginLoading,
    isLogoutLoading,
    isRegisterLoading,
    loginError,
    logoutError,
    registerError,
    resetLoginError,
    resetLogoutError,
    resetRegisterError,
  } = useAuthMutation();

  // Combine loading states
  const isLoading = isQueryLoading || isLoginLoading || isLogoutLoading || isRegisterLoading;

  // Get the most relevant error (mutation errors take precedence)
  const error = useMemo(() => {
    if (loginError) return loginError.message;
    if (registerError) return registerError.message;
    if (logoutError) return logoutError.message;
    if (queryError) return queryError.message;
    return null;
  }, [loginError, registerError, logoutError, queryError]);

  // Login action
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      return loginMutation(credentials);
    },
    [loginMutation]
  );

  // Register action
  const register = useCallback(
    async (data: RegisterData): Promise<User> => {
      return registerMutation(data);
    },
    [registerMutation]
  );

  // Logout action
  const logout = useCallback(async (): Promise<void> => {
    return logoutMutation();
  }, [logoutMutation]);

  // Initialize action (re-fetch auth session)
  const initialize = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);

  // Reset error action (clears all mutation errors)
  const resetError = useCallback(() => {
    resetLoginError();
    resetLogoutError();
    resetRegisterError();
  }, [resetLoginError, resetLogoutError, resetRegisterError]);

  return {
    user,
    // Tokens are now stored in secure storage only (not in TanStack Query cache)
    // This maintains API compatibility but tokens should be accessed via tokenStorage
    tokens: null,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login,
    register,
    logout,
    initialize,
    resetError,
  };
}

export default useAuth;
