/**
 * Profile Mutation Hook
 *
 * Manages profile mutations (update, avatar, notifications) using TanStack Query.
 * Profile mutations CAN be queued for offline execution.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MUTATION_SCOPES } from '@core/query/types';

import { profileMutationKeys, profileKeys } from '../queries/profile-query-keys';
import { profileService } from '../services/profile-service';
import {
  Profile,
  UpdateProfileData,
  UpdateNotificationPreferences,
  ChangeAvatarResponse,
} from '../types';
import { setProfileData, getProfileData } from './use-profile-query';

/**
 * Default tenant ID for mutations
 * In a real app, this would come from context or configuration
 */
const DEFAULT_TENANT_ID = 'default';

/**
 * Update profile mutation result
 */
export interface UseUpdateProfileMutationReturn {
  updateProfile: (data: UpdateProfileData) => Promise<Profile>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Update avatar mutation result
 */
export interface UseUpdateAvatarMutationReturn {
  updateAvatar: (imageUri: string) => Promise<ChangeAvatarResponse>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Delete avatar mutation result
 */
export interface UseDeleteAvatarMutationReturn {
  deleteAvatar: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Update notification preferences mutation result
 */
export interface UseUpdateNotificationsMutationReturn {
  updateNotifications: (preferences: UpdateNotificationPreferences) => Promise<Profile>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Combined profile mutations result
 */
export interface UseProfileMutationReturn {
  updateProfile: (data: UpdateProfileData) => Promise<Profile>;
  updateAvatar: (imageUri: string) => Promise<ChangeAvatarResponse>;
  deleteAvatar: () => Promise<void>;
  updateNotifications: (preferences: UpdateNotificationPreferences) => Promise<Profile>;
  isUpdateProfileLoading: boolean;
  isUpdateAvatarLoading: boolean;
  isDeleteAvatarLoading: boolean;
  isUpdateNotificationsLoading: boolean;
  updateProfileError: Error | null;
  updateAvatarError: Error | null;
  deleteAvatarError: Error | null;
  updateNotificationsError: Error | null;
  resetUpdateProfileError: () => void;
  resetUpdateAvatarError: () => void;
  resetDeleteAvatarError: () => void;
  resetUpdateNotificationsError: () => void;
}

/**
 * Hook for update profile mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Update profile mutation state and actions
 */
export function useUpdateProfileMutation(
  tenantId: string = DEFAULT_TENANT_ID
): UseUpdateProfileMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: profileMutationKeys.update,
    mutationFn: async (data: UpdateProfileData): Promise<Profile> => {
      const profile = await profileService.updateProfile(data);

      // Update profile in cache
      setProfileData(queryClient, profile, tenantId);

      return profile;
    },
    // Profile mutations can be queued offline
    networkMode: 'offlineFirst',
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: false,
    },
    // Invalidate profile query on success
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: profileKeys.current(tenantId).queryKey,
      });
    },
  });

  return {
    updateProfile: async (data: UpdateProfileData) => {
      return mutation.mutateAsync(data);
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for update avatar mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Update avatar mutation state and actions
 */
export function useUpdateAvatarMutation(
  tenantId: string = DEFAULT_TENANT_ID
): UseUpdateAvatarMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: profileMutationKeys.updateAvatar,
    mutationFn: async (imageUri: string): Promise<ChangeAvatarResponse> => {
      const response = await profileService.updateAvatar(imageUri);

      // Update avatar URL in profile cache
      const currentProfile = getProfileData(queryClient, tenantId);
      if (currentProfile) {
        setProfileData(
          queryClient,
          { ...currentProfile, avatarUrl: response.avatarUrl },
          tenantId
        );
      }

      return response;
    },
    // Avatar uploads require network (binary data)
    networkMode: 'online',
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: true,
    },
    // Invalidate profile query on success
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: profileKeys.current(tenantId).queryKey,
      });
    },
  });

  return {
    updateAvatar: async (imageUri: string) => {
      return mutation.mutateAsync(imageUri);
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for delete avatar mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Delete avatar mutation state and actions
 */
export function useDeleteAvatarMutation(
  tenantId: string = DEFAULT_TENANT_ID
): UseDeleteAvatarMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: profileMutationKeys.deleteAvatar,
    mutationFn: async (): Promise<void> => {
      await profileService.deleteAvatar();

      // Clear avatar URL in profile cache
      const currentProfile = getProfileData(queryClient, tenantId);
      if (currentProfile) {
        setProfileData(queryClient, { ...currentProfile, avatarUrl: undefined }, tenantId);
      }
    },
    // Delete operations can be queued offline
    networkMode: 'offlineFirst',
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: false,
    },
    // Invalidate profile query on success
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: profileKeys.current(tenantId).queryKey,
      });
    },
  });

  return {
    deleteAvatar: async () => {
      return mutation.mutateAsync();
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for update notification preferences mutation
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns Update notifications mutation state and actions
 */
export function useUpdateNotificationsMutation(
  tenantId: string = DEFAULT_TENANT_ID
): UseUpdateNotificationsMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: profileMutationKeys.updatePreferences,
    mutationFn: async (preferences: UpdateNotificationPreferences): Promise<Profile> => {
      const profile = await profileService.updateNotificationPreferences(preferences);

      // Update profile in cache
      setProfileData(queryClient, profile, tenantId);

      return profile;
    },
    // Notification preferences can be queued offline
    networkMode: 'offlineFirst',
    meta: {
      scope: MUTATION_SCOPES.PROFILE,
      requiresNetwork: false,
    },
    // Invalidate profile query on success
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: profileKeys.current(tenantId).queryKey,
      });
    },
  });

  return {
    updateNotifications: async (preferences: UpdateNotificationPreferences) => {
      return mutation.mutateAsync(preferences);
    },
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Combined hook for all profile mutations
 *
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @returns All profile mutation states and actions
 */
export function useProfileMutation(tenantId: string = DEFAULT_TENANT_ID): UseProfileMutationReturn {
  const updateProfileMutation = useUpdateProfileMutation(tenantId);
  const updateAvatarMutation = useUpdateAvatarMutation(tenantId);
  const deleteAvatarMutation = useDeleteAvatarMutation(tenantId);
  const updateNotificationsMutation = useUpdateNotificationsMutation(tenantId);

  return {
    updateProfile: updateProfileMutation.updateProfile,
    updateAvatar: updateAvatarMutation.updateAvatar,
    deleteAvatar: deleteAvatarMutation.deleteAvatar,
    updateNotifications: updateNotificationsMutation.updateNotifications,
    isUpdateProfileLoading: updateProfileMutation.isLoading,
    isUpdateAvatarLoading: updateAvatarMutation.isLoading,
    isDeleteAvatarLoading: deleteAvatarMutation.isLoading,
    isUpdateNotificationsLoading: updateNotificationsMutation.isLoading,
    updateProfileError: updateProfileMutation.error,
    updateAvatarError: updateAvatarMutation.error,
    deleteAvatarError: deleteAvatarMutation.error,
    updateNotificationsError: updateNotificationsMutation.error,
    resetUpdateProfileError: updateProfileMutation.reset,
    resetUpdateAvatarError: updateAvatarMutation.reset,
    resetDeleteAvatarError: deleteAvatarMutation.reset,
    resetUpdateNotificationsError: updateNotificationsMutation.reset,
  };
}

export default useProfileMutation;
