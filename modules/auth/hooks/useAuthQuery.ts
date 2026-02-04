/**
 * Auth Query Hook
 *
 * Manages authentication session state using TanStack Query.
 * Handles session initialization and token validation.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { tokenStorage } from '@core/storage/tokenStorage';

import { authKeys } from '../queries/authQueryKeys';
import { authService } from '../services/authService';
import { User } from '../types';

/**
 * Default tenant ID for queries
 * In a real app, this would come from context or configuration
 */
const DEFAULT_TENANT_ID = 'default';

/**
 * Auth session data structure stored in query cache
 */
export interface AuthSessionData {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

/**
 * Hook return type for auth session query
 */
export interface UseAuthQueryReturn {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch and validate auth session
 * Checks for stored tokens and validates with server if needed
 */
async function fetchAuthSession(): Promise<AuthSessionData> {
  try {
    // Check for stored tokens
    const tokens = await tokenStorage.getTokens();

    if (!tokens) {
      return {
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      };
    }

    // Check if token is expired
    const isExpired = await tokenStorage.isTokenExpired();
    if (isExpired) {
      // Token expired, clear and return unauthenticated
      await tokenStorage.clearTokens();
      return {
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      };
    }

    // Token valid, fetch current user
    const user = await authService.getCurrentUser();

    return {
      user,
      isAuthenticated: true,
      isInitialized: true,
    };
  } catch {
    // Failed to validate, clear tokens and return unauthenticated
    await tokenStorage.clearTokens();
    return {
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    };
  }
}

/**
 * Hook for managing auth session state
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Auth session state and actions
 */
export function useAuthQuery(tenantId: string = DEFAULT_TENANT_ID): UseAuthQueryReturn {
  const { data, isLoading, error, refetch } = useQuery({
    ...authKeys.session(tenantId),
    queryFn: fetchAuthSession,
    // Auth state doesn't auto-refetch (user action triggers updates)
    staleTime: Infinity,
    // Keep cached forever until explicit logout
    gcTime: Infinity,
    // Run on mount to initialize auth state
    refetchOnMount: 'always',
    // Don't refetch on window focus for auth (security)
    refetchOnWindowFocus: false,
  });

  const handleRefetch = async () => {
    await refetch();
  };

  return {
    user: data?.user ?? null,
    isAuthenticated: data?.isAuthenticated ?? false,
    isInitialized: data?.isInitialized ?? false,
    isLoading,
    error: error,
    refetch: handleRefetch,
  };
}

/**
 * Set auth session data directly in the cache
 * Used after successful login/register
 */
export function setAuthSession(
  queryClient: ReturnType<typeof useQueryClient>,
  user: User,
  tenantId: string = DEFAULT_TENANT_ID
): void {
  queryClient.setQueryData(authKeys.session(tenantId).queryKey, {
    user,
    isAuthenticated: true,
    isInitialized: true,
  } satisfies AuthSessionData);
}

/**
 * Clear auth session from cache
 * Used on logout
 */
export function clearAuthSession(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string = DEFAULT_TENANT_ID
): void {
  queryClient.setQueryData(authKeys.session(tenantId).queryKey, {
    user: null,
    isAuthenticated: false,
    isInitialized: true,
  } satisfies AuthSessionData);
}

export default useAuthQuery;
