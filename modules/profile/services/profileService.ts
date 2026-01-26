import { apiClient } from '../../../core/api';
import {
  Profile,
  UpdateProfileData,
  UpdateNotificationPreferences,
  ChangeAvatarResponse,
} from '../types';
import { ChangePasswordData } from '../../auth/types';

const PROFILE_ENDPOINTS = {
  PROFILE: '/profile',
  AVATAR: '/profile/avatar',
  NOTIFICATIONS: '/profile/notifications',
  CHANGE_PASSWORD: '/profile/change-password',
  DELETE_ACCOUNT: '/profile/delete',
};

export const profileService = {
  async getProfile(): Promise<Profile> {
    const response = await apiClient.get<Profile>(PROFILE_ENDPOINTS.PROFILE);
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<Profile> {
    const response = await apiClient.patch<Profile>(
      PROFILE_ENDPOINTS.PROFILE,
      data
    );
    return response.data;
  },

  async updateAvatar(imageUri: string): Promise<ChangeAvatarResponse> {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    } as unknown as Blob);

    const response = await apiClient.post<ChangeAvatarResponse>(
      PROFILE_ENDPOINTS.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async deleteAvatar(): Promise<void> {
    await apiClient.delete(PROFILE_ENDPOINTS.AVATAR);
  },

  async updateNotificationPreferences(
    preferences: UpdateNotificationPreferences
  ): Promise<Profile> {
    const response = await apiClient.patch<Profile>(
      PROFILE_ENDPOINTS.NOTIFICATIONS,
      preferences
    );
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      PROFILE_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete(PROFILE_ENDPOINTS.DELETE_ACCOUNT);
  },
};

export default profileService;
