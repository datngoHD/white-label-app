/**
 * Mutation Defaults Setup
 *
 * Configures default mutation functions for offline persistence.
 * Required for mutations to restore correctly after app restart (FR-013, FR-014).
 *
 * IMPORTANT: Mutation defaults MUST be set before PersistQueryClientProvider
 * attempts to restore paused mutations, otherwise they will fail with
 * "No mutationFn found" error.
 */

import type { QueryClient } from '@tanstack/react-query';

import { authMutationKeys } from '@modules/auth/queries/auth-query-keys';
import { profileMutationKeys } from '@modules/profile/queries/profile-query-keys';

import { MUTATION_SCOPES } from './types';

/**
 * Setup mutation defaults on the QueryClient
 *
 * This function should be called during app initialization,
 * before the PersistQueryClientProvider mounts.
 *
 * Mutation defaults are set here so that when mutations are restored
 * from persistence, they have the necessary functions to execute.
 *
 * @param queryClient - The QueryClient instance to configure
 */
export function setupMutationDefaults(queryClient: QueryClient): void {
  // Auth mutations: NOT queued offline (requiresNetwork: true)
  // These mutations require network connectivity to function
  // and should fail immediately when offline rather than queue

  // Login mutation defaults
  queryClient.setMutationDefaults(authMutationKeys.login, {
    mutationFn: () => {
      // This should never be called - hooks provide their own mutationFn
      // This exists only to satisfy TanStack Query's restoration requirements
      throw new Error('Login mutation must be called through useLoginMutation hook');
    },
    networkMode: 'online',
    retry: false, // Auth should not auto-retry
    meta: {
      scope: MUTATION_SCOPES.AUTH,
      requiresNetwork: true,
    },
  });

  // Logout mutation defaults
  queryClient.setMutationDefaults(authMutationKeys.logout, {
    mutationFn: () => {
      throw new Error('Logout mutation must be called through useLogoutMutation hook');
    },
    networkMode: 'always', // Logout works offline (clears local state)
    retry: false,
    meta: {
      scope: MUTATION_SCOPES.AUTH,
      requiresNetwork: false, // Logout can work offline
    },
  });

  // Register mutation defaults
  queryClient.setMutationDefaults(authMutationKeys.register, {
    mutationFn: () => {
      throw new Error('Register mutation must be called through useRegisterMutation hook');
    },
    networkMode: 'online',
    retry: false,
    meta: {
      scope: MUTATION_SCOPES.AUTH,
      requiresNetwork: true,
    },
  });

  // Refresh token mutation defaults
  queryClient.setMutationDefaults(authMutationKeys.refresh, {
    mutationFn: () => {
      throw new Error('Refresh mutation must be called through auth interceptor');
    },
    networkMode: 'online',
    retry: false,
    meta: {
      scope: MUTATION_SCOPES.AUTH,
      requiresNetwork: true,
    },
  });

  // Profile mutations: CAN be queued offline (requiresNetwork: false for most)
  // These mutations can be executed when the device comes back online

  // Update profile mutation defaults
  queryClient.setMutationDefaults(profileMutationKeys.update, {
    mutationFn: () => {
      throw new Error('Update profile mutation must be called through useUpdateProfileMutation hook');
    },
    networkMode: 'offlineFirst',
    retry: 3,
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: false,
    },
  });

  // Update avatar mutation defaults (requires network for binary upload)
  queryClient.setMutationDefaults(profileMutationKeys.updateAvatar, {
    mutationFn: () => {
      throw new Error('Update avatar mutation must be called through useUpdateAvatarMutation hook');
    },
    networkMode: 'online',
    retry: 3,
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: true,
    },
  });

  // Delete avatar mutation defaults
  queryClient.setMutationDefaults(profileMutationKeys.deleteAvatar, {
    mutationFn: () => {
      throw new Error('Delete avatar mutation must be called through useDeleteAvatarMutation hook');
    },
    networkMode: 'offlineFirst',
    retry: 3,
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: false,
    },
  });

  // Update notification preferences mutation defaults
  queryClient.setMutationDefaults(profileMutationKeys.updatePreferences, {
    mutationFn: () => {
      throw new Error('Update preferences mutation must be called through useUpdateNotificationsMutation hook');
    },
    networkMode: 'offlineFirst',
    retry: 3,
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: false,
    },
  });
}

/**
 * Check if a mutation should be queued offline
 * Auth mutations require network, profile mutations can be queued
 */
export function shouldQueueOffline(mutationKey: readonly string[]): boolean {
  const domain = mutationKey[0];

  // Auth mutations require network connectivity
  if (domain === 'auth') {
    return false;
  }

  // Profile and other mutations can be queued
  return true;
}
