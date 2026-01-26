import { User } from '../auth/types';

export interface Profile extends User {
  phone?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  avatarUrl?: string;
}

export interface UpdateNotificationPreferences {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  marketing?: boolean;
}

export interface ChangeAvatarResponse {
  avatarUrl: string;
}
