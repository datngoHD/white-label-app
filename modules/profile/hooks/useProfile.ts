import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store';
import {
  fetchProfile as fetchProfileAction,
  updateProfile as updateProfileAction,
  updateAvatar as updateAvatarAction,
  deleteAvatar as deleteAvatarAction,
  updateNotifications as updateNotificationsAction,
  clearError,
  clearProfile,
} from '../store/profileSlice';
import { UpdateProfileData, UpdateNotificationPreferences } from '../types';

export function useProfile() {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state) => state.profile);

  const fetchProfile = useCallback(async () => {
    return dispatch(fetchProfileAction()).unwrap();
  }, [dispatch]);

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      return dispatch(updateProfileAction(data)).unwrap();
    },
    [dispatch]
  );

  const updateAvatar = useCallback(
    async (imageUri: string) => {
      return dispatch(updateAvatarAction(imageUri)).unwrap();
    },
    [dispatch]
  );

  const deleteAvatar = useCallback(async () => {
    return dispatch(deleteAvatarAction()).unwrap();
  }, [dispatch]);

  const updateNotifications = useCallback(
    async (preferences: UpdateNotificationPreferences) => {
      return dispatch(updateNotificationsAction(preferences)).unwrap();
    },
    [dispatch]
  );

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetProfile = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  return {
    profile: profileState.profile,
    isLoading: profileState.isLoading,
    isUpdating: profileState.isUpdating,
    error: profileState.error,
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
