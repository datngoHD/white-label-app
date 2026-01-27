import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Tenant, TenantStatus } from '@core/config/tenant.types';
import { logger } from '@core/logging/logger';
import { TenantState } from '@core/types';

const initialState: TenantState = {
  config: null,
  status: 'idle',
  error: null,
};

export const fetchTenantConfig = createAsyncThunk<Tenant, string>(
  'tenant/fetchConfig',
  async (tenantId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await tenantService.getTenantConfig(tenantId);
      // return response;

      // For now, return mock data
      logger.debug('Fetching tenant config', { tenantId });

      return {
        id: tenantId,
        name: 'Default Tenant',
        status: 'active' as TenantStatus,
        api: {
          baseUrl: 'https://api.example.com',
          version: 'v1',
        },
        features: {
          socialLogin: false,
          pushNotifications: true,
          biometricAuth: true,
          offlineMode: true,
          analytics: true,
        },
        metadata: {},
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tenant config';
      logger.error('Failed to fetch tenant config', { tenantId, error: message });
      return rejectWithValue(message);
    }
  }
);

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenantConfig: (state, action: PayloadAction<Tenant>) => {
      state.config = action.payload;
      state.status = 'loaded';
      state.error = null;
    },
    clearTenantConfig: (state) => {
      state.config = null;
      state.status = 'idle';
      state.error = null;
    },
    setTenantError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'error';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantConfig.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTenantConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.status = 'loaded';
        state.error = null;
      })
      .addCase(fetchTenantConfig.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const { setTenantConfig, clearTenantConfig, setTenantError } = tenantSlice.actions;

// Selectors
export const selectTenant = (state: { tenant: TenantState }) => state.tenant.config;
export const selectTenantStatus = (state: { tenant: TenantState }) => state.tenant.status;
export const selectTenantError = (state: { tenant: TenantState }) => state.tenant.error;
export const selectTenantFeatures = (state: { tenant: TenantState }) =>
  state.tenant.config?.features ?? null;

export default tenantSlice.reducer;
