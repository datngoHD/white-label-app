import * as SecureStore from 'expo-secure-store';

import { logger } from '../logging/logger';
import { STORAGE_KEYS } from './keys';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const tokenStorage = {
  async saveAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      logger.error('Failed to save access token', { error });
      throw error;
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error('Failed to get access token', { error });
      return null;
    }
  },

  async saveRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      logger.error('Failed to save refresh token', { error });
      throw error;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      logger.error('Failed to get refresh token', { error });
      return null;
    }
  },

  async saveTokens(tokens: StoredTokens): Promise<void> {
    try {
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
        SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRY, tokens.expiresAt.toString()),
      ]);
    } catch (error) {
      logger.error('Failed to save tokens', { error });
      throw error;
    }
  },

  async getTokens(): Promise<StoredTokens | null> {
    try {
      const [accessToken, refreshToken, expiresAtStr] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);

      if (!accessToken || !refreshToken) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : 0,
      };
    } catch (error) {
      logger.error('Failed to get tokens', { error });
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);
    } catch (error) {
      logger.error('Failed to clear tokens', { error });
      throw error;
    }
  },

  async isTokenExpired(): Promise<boolean> {
    try {
      const expiresAtStr = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiresAtStr) {
        return true;
      }
      const expiresAt = parseInt(expiresAtStr, 10);
      // Add 60 second buffer for network latency
      return Date.now() >= expiresAt - 60000;
    } catch (error) {
      logger.error('Failed to check token expiry', { error });
      return true;
    }
  },
};

export default tokenStorage;
