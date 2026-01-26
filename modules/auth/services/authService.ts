import { apiClient } from '../../../core/api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  User,
} from '../types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  ME: '/auth/me',
  VERIFY_EMAIL: '/auth/verify-email',
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.ME);
    return response.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.VERIFY_EMAIL,
      { token }
    );
    return response.data;
  },
};

export default authService;
