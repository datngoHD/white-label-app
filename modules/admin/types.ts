import { UserRole } from '@core/types';

export interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  invitedBy?: string;
  invitedAt?: string;
}

export interface UserListState {
  users: TenantUser[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface InviteUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserListFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserListParams extends UserListFilters {
  page?: number;
  limit?: number;
}
