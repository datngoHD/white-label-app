/**
 * Hook Contracts
 * TanStack Query Migration
 *
 * Defines the PUBLIC API for hooks after migration.
 * These interfaces maintain backward compatibility with existing components.
 */

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

// =============================================================================
// SHARED TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// =============================================================================
// AUTH HOOK CONTRACT
// =============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * useAuth hook return type
 * MUST maintain backward compatibility with existing Redux-based implementation
 */
export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;

  // Actions (maintain same signatures as Redux version)
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  register: (data: RegisterData) => void;

  // Mutation states (new - for improved UX)
  isLoginPending: boolean;
  isLogoutPending: boolean;
  isRegisterPending: boolean;
  loginError: Error | null;
  registerError: Error | null;
}

// =============================================================================
// PROFILE HOOK CONTRACT
// =============================================================================

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  bio: string | null;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  bio?: string | null;
}

/**
 * useProfile hook return type
 * MUST maintain backward compatibility with existing Redux-based implementation
 */
export interface UseProfileReturn {
  // State
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;

  // Actions (maintain same signatures as Redux version)
  updateProfile: (data: UpdateProfileData) => void;
  updateAvatar: (formData: FormData) => void;
  deleteAvatar: () => void;
  updateNotifications: (preferences: NotificationPreferences) => void;
  refreshProfile: () => void;

  // Mutation states (new - for improved UX)
  isUpdatePending: boolean;
  isAvatarUpdatePending: boolean;
  updateError: Error | null;

  // Offline status (new)
  isPending: boolean; // True when there are pending offline mutations
}

// =============================================================================
// TENANT HOOK CONTRACT
// =============================================================================

export interface TenantFeatures {
  [featureKey: string]: boolean;
}

export interface TenantThemeOverrides {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  apiBaseUrl: string;
  features: TenantFeatures;
  theme: TenantThemeOverrides | null;
  metadata: Record<string, unknown>;
}

/**
 * useTenant hook return type
 * MUST maintain backward compatibility with existing Redux-based implementation
 */
export interface UseTenantReturn {
  // State
  config: TenantConfig | null;
  isLoading: boolean;
  error: Error | null;

  // Derived state
  features: TenantFeatures;

  // Actions
  refreshConfig: () => void;

  // Helper functions
  hasFeature: (featureKey: string) => boolean;
}

// =============================================================================
// NETWORK STATUS HOOK CONTRACT
// =============================================================================

/**
 * useNetworkStatus hook return type
 * Existing hook - no changes needed, but documented for completeness
 */
export interface UseNetworkStatusReturn {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: 'wifi' | 'cellular' | 'none' | 'unknown';
}

/**
 * useIsOnline hook return type
 * Convenience wrapper around useNetworkStatus
 */
export type UseIsOnlineReturn = boolean;

/**
 * useIsOffline hook return type
 * Convenience wrapper around useNetworkStatus
 */
export type UseIsOfflineReturn = boolean;

// =============================================================================
// OFFLINE INDICATOR HOOK CONTRACT (NEW)
// =============================================================================

/**
 * useOfflineIndicator hook return type
 * NEW hook for showing offline status in UI
 */
export interface UseOfflineIndicatorReturn {
  /** Whether the device is offline */
  isOffline: boolean;
  /** Number of pending mutations waiting to sync */
  pendingMutationCount: number;
  /** Whether there are any pending mutations */
  hasPendingMutations: boolean;
}
