import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@modules/auth/store/authSlice';
import profileReducer from '@modules/profile/store/profileSlice';

import tenantReducer from './slices/tenantSlice';

export const rootReducer = combineReducers({
  tenant: tenantReducer,
  auth: authReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
