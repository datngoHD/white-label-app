/**
 * Profile Hook
 *
 * Main profile hook that provides a unified API for profile operations.
 * Internally uses TanStack Query for state management.
 *
 * This hook maintains backward compatibility with the previous Redux-based API.
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';


import { UpdateNotificationPreferences, UpdateProfileData, Profile } from '../types';
import useProfileMutation from './use-profile-mutation';
import useProfileQuery, { clearProfileCache } from './use-profile-query';

/**
 * Profile hook return type (backward compatible with Redux version)
 */
export interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<Profile>;
  updateAvatar: (imageUri: string) => Promise<{ avatarUrl: string }>;
  deleteAvatar: () => Promise<void>;
  updateNotifications: (preferences: UpdateNotificationPreferences) => Promise<Profile>;
  resetError: () => void;
  resetProfile: () => void;
}

/**
 * Main profile hook
 *
 * Provides access to profile state and actions using TanStack Query.
 * Maintains the same public API as the previous Redux-based implementation.
 *
 * @returns Profile state and actions
 *
 * @example
 * ```tsx
 * function ProfileScreen() {
 *   const { profile, isLoading, updateProfile } = useProfile();
 *
 *   const handleUpdate = async () => {
 *     try {
 *       await updateProfile({ firstName: 'John' });
 *     } catch (err) {
 *       // Handle error
 *     }
 *   };
 * }
 * ```
 */
export function useProfile(): UseProfileReturn {
  const queryClient = useQueryClient();

  // Query for profile data
  const {
    profile,
    isLoading: isQueryLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useProfileQuery();

  // Mutations for profile actions
  const {
    updateProfile: updateProfileMutation,
    updateAvatar: updateAvatarMutation,
    deleteAvatar: deleteAvatarMutation,
    updateNotifications: updateNotificationsMutation,
    isUpdateProfileLoading,
    isUpdateAvatarLoading,
    isDeleteAvatarLoading,
    isUpdateNotificationsLoading,
    updateProfileError,
    updateAvatarError,
    deleteAvatarError,
    updateNotificationsError,
    resetUpdateProfileError,
    resetUpdateAvatarError,
    resetDeleteAvatarError,
    resetUpdateNotificationsError,
  } = useProfileMutation();

  // Combined updating state
  const isUpdating =
    isUpdateProfileLoading ||
    isUpdateAvatarLoading ||
    isDeleteAvatarLoading ||
    isUpdateNotificationsLoading;

  // Combined loading state (query loading or initial fetch)
  const isLoading = isQueryLoading || isFetching;

  // Get the most relevant error (mutation errors take precedence)
  const error = useMemo(() => {
    if (updateProfileError) return updateProfileError.message;
    if (updateAvatarError) return updateAvatarError.message;
    if (deleteAvatarError) return deleteAvatarError.message;
    if (updateNotificationsError) return updateNotificationsError.message;
    if (queryError) return queryError.message;
    return null;
  }, [
    updateProfileError,
    updateAvatarError,
    deleteAvatarError,
    updateNotificationsError,
    queryError,
  ]);

  // Fetch profile action (triggers refetch)
  const fetchProfile = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);

  // Update profile action
  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<Profile> => {
      return updateProfileMutation(data);
    },
    [updateProfileMutation]
  );

  // Update avatar action
  const updateAvatar = useCallback(
    async (imageUri: string): Promise<{ avatarUrl: string }> => {
      return updateAvatarMutation(imageUri);
    },
    [updateAvatarMutation]
  );

  // Delete avatar action
  const deleteAvatar = useCallback(async (): Promise<void> => {
    return deleteAvatarMutation();
  }, [deleteAvatarMutation]);

  // Update notifications action
  const updateNotifications = useCallback(
    async (preferences: UpdateNotificationPreferences): Promise<Profile> => {
      return updateNotificationsMutation(preferences);
    },
    [updateNotificationsMutation]
  );

  // Reset error action (clears all mutation errors)
  const resetError = useCallback(() => {
    resetUpdateProfileError();
    resetUpdateAvatarError();
    resetDeleteAvatarError();
    resetUpdateNotificationsError();
  }, [
    resetUpdateProfileError,
    resetUpdateAvatarError,
    resetDeleteAvatarError,
    resetUpdateNotificationsError,
  ]);

  // Reset profile action (clears profile from cache)
  const resetProfile = useCallback(() => {
    clearProfileCache(queryClient);
  }, [queryClient]);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
    deleteAvatar,
    updateNotifications,
    resetError,
    resetProfile,
  };
}

export default useProfile;
