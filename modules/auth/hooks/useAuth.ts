import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@core/store';

import {
  clearError,
  initializeAuth,
  login as loginAction,
  logout as logoutAction,
  register as registerAction,
} from '../store/authSlice';
import { LoginCredentials, RegisterData } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginAction(credentials)).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      return dispatch(registerAction(data)).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    return dispatch(logoutAction()).unwrap();
  }, [dispatch]);

  const initialize = useCallback(async () => {
    return dispatch(initializeAuth()).unwrap();
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user: auth.user,
    tokens: auth.tokens,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    isInitialized: auth.isInitialized,
    login,
    register,
    logout,
    initialize,
    resetError,
  };
}

export default useAuth;
