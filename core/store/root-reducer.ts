import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@modules/auth/store/auth-slice';
import profileReducer from '@modules/profile/store/profile-slice';

import tenantReducer from './slices/tenant-slice';

export const rootReducer = combineReducers({
  tenant: tenantReducer,
  auth: authReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
