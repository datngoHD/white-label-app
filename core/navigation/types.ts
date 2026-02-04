import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root stack navigator params
 */
export interface RootStackParamList {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  TenantStatus: {
    status: 'suspended' | 'maintenance';
    message?: string;
  };
}

/**
 * Auth stack navigator params
 */
export interface AuthStackParamList {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
  };
}

/**
 * Main tab navigator params
 */
export interface MainTabParamList {
  Home: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
}

/**
 * Profile stack navigator params
 */
export interface ProfileStackParamList {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
}

/**
 * Settings stack navigator params
 */
export interface SettingsStackParamList {
  Settings: undefined;
  Preferences: undefined;
  BrandPreview: undefined;
}

/**
 * Admin stack navigator params (admin only)
 */
export interface AdminStackParamList {
  UserList: undefined;
  UserDetail: {
    userId: string;
  };
  InviteUser: undefined;
}

/**
 * Screen props types
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>;

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> =
  NativeStackScreenProps<SettingsStackParamList, T>;

export type AdminStackScreenProps<T extends keyof AdminStackParamList> = NativeStackScreenProps<
  AdminStackParamList,
  T
>;

/**
 * Declare global navigation types for React Navigation
 * Using module augmentation pattern
 */
declare module '@react-navigation/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RootParamList extends RootStackParamList {}
}
