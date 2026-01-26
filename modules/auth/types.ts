import { UserRole } from '../../core/types';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface ForgotPasswordData {
  email: string;
  tenantId?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
