import { logger } from '@core/logging/logger';
import { tokenStorage } from '@core/storage/token-storage';

import { AuthTokens } from '../types';

export const authPersistence = {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      const expiresAt = Date.now() + tokens.expiresIn * 1000;
      await tokenStorage.saveTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
      });
      logger.debug('Auth tokens saved successfully');
    } catch (error) {
      logger.error('Failed to persist auth tokens', { error });
      throw error;
    }
  },

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const stored = await tokenStorage.getTokens();
      if (!stored) {
        return null;
      }

      // Check if token is expired
      if (await tokenStorage.isTokenExpired()) {
        logger.debug('Stored token is expired');
        return null;
      }

      // Convert back to AuthTokens format
      const remainingTime = Math.max(0, stored.expiresAt - Date.now());
      return {
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
        expiresIn: Math.floor(remainingTime / 1000),
        tokenType: 'Bearer',
      };
    } catch (error) {
      logger.error('Failed to retrieve auth tokens', { error });
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await tokenStorage.clearTokens();
      logger.debug('Auth tokens cleared');
    } catch (error) {
      logger.error('Failed to clear auth tokens', { error });
      throw error;
    }
  },

  async hasValidTokens(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      return tokens !== null && !(await tokenStorage.isTokenExpired());
    } catch {
      return false;
    }
  },
};

export default authPersistence;
