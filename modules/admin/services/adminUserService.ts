import { apiClient } from '../../../core/api';
import {
  TenantUser,
  InviteUserData,
  UpdateUserData,
  UserListParams,
} from '../types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const ADMIN_ENDPOINTS = {
  USERS: '/admin/users',
  INVITE: '/admin/users/invite',
  USER: (id: string) => `/admin/users/${id}`,
  ACTIVATE: (id: string) => `/admin/users/${id}/activate`,
  DEACTIVATE: (id: string) => `/admin/users/${id}/deactivate`,
  RESEND_INVITE: (id: string) => `/admin/users/${id}/resend-invite`,
};

export const adminUserService = {
  async getUsers(params?: UserListParams): Promise<PaginatedResponse<TenantUser>> {
    const response = await apiClient.get<PaginatedResponse<TenantUser>>(
      ADMIN_ENDPOINTS.USERS,
      { params }
    );
    return response.data;
  },

  async getUser(id: string): Promise<TenantUser> {
    const response = await apiClient.get<TenantUser>(ADMIN_ENDPOINTS.USER(id));
    return response.data;
  },

  async inviteUser(data: InviteUserData): Promise<TenantUser> {
    const response = await apiClient.post<TenantUser>(
      ADMIN_ENDPOINTS.INVITE,
      data
    );
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<TenantUser> {
    const response = await apiClient.patch<TenantUser>(
      ADMIN_ENDPOINTS.USER(id),
      data
    );
    return response.data;
  },

  async activateUser(id: string): Promise<TenantUser> {
    const response = await apiClient.post<TenantUser>(
      ADMIN_ENDPOINTS.ACTIVATE(id)
    );
    return response.data;
  },

  async deactivateUser(id: string): Promise<TenantUser> {
    const response = await apiClient.post<TenantUser>(
      ADMIN_ENDPOINTS.DEACTIVATE(id)
    );
    return response.data;
  },

  async resendInvite(id: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      ADMIN_ENDPOINTS.RESEND_INVITE(id)
    );
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(ADMIN_ENDPOINTS.USER(id));
  },
};

export default adminUserService;
