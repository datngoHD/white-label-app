import { combineReducers } from '@reduxjs/toolkit';
import tenantReducer from './slices/tenantSlice';
import authReducer from '@modules/auth/store/authSlice';
import profileReducer from '@modules/profile/store/profileSlice';

export const rootReducer = combineReducers({
  tenant: tenantReducer,
  auth: authReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
