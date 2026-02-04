/**
 * Profile Query Hook
 *
 * Manages profile data fetching using TanStack Query.
 * Supports offline caching and background refetching.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { profileKeys } from '../queries/profileQueryKeys';
import { profileService } from '../services/profileService';
import { Profile } from '../types';

/**
 * Default tenant ID for queries
 * In a real app, this would come from context or configuration
 */
const DEFAULT_TENANT_ID = 'default';

/**
 * Hook return type for profile query
 */
export interface UseProfileQueryReturn {
  profile: Profile | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and caching profile data
 *
 * Uses the default stale and gc times from the QueryClient config.
 * Profile data is cached and served immediately while revalidating in background.
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Profile query state and actions
 */
export function useProfileQuery(
  tenantId: string = DEFAULT_TENANT_ID,
  enabled = true
): UseProfileQueryReturn {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    ...profileKeys.current(tenantId),
    queryFn: () => profileService.getProfile(),
    enabled,
  });

  const handleRefetch = async () => {
    await refetch();
  };

  return {
    profile: data ?? null,
    isLoading,
    isFetching,
    error: error,
    refetch: handleRefetch,
  };
}

/**
 * Set profile data directly in the cache
 * Used after successful profile updates
 */
export function setProfileData(
  queryClient: ReturnType<typeof useQueryClient>,
  profile: Profile,
  tenantId: string = DEFAULT_TENANT_ID
): void {
  queryClient.setQueryData(profileKeys.current(tenantId).queryKey, profile);
}

/**
 * Get profile data from cache
 */
export function getProfileData(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string = DEFAULT_TENANT_ID
): Profile | undefined {
  return queryClient.getQueryData(profileKeys.current(tenantId).queryKey);
}

/**
 * Invalidate profile query to trigger refetch
 */
export function invalidateProfile(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<void> {
  return queryClient.invalidateQueries({
    queryKey: profileKeys.current(tenantId).queryKey,
  });
}

/**
 * Clear all profile data from cache
 */
export function clearProfileCache(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string = DEFAULT_TENANT_ID
): void {
  queryClient.removeQueries({
    queryKey: profileKeys.all(tenantId).queryKey,
  });
}

export default useProfileQuery;
