import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logging/logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = '@offline_cache:';

export const offlineCache = {
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = DEFAULT_TTL } = options;
    const now = Date.now();

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    try {
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(entry)
      );
      logger.debug(`Cache set: ${key}`);
    } catch (error) {
      logger.error('Failed to set cache', { key, error });
      throw error;
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);

      if (!raw) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(raw);

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        logger.debug(`Cache expired: ${key}`);
        await this.remove(key);
        return null;
      }

      logger.debug(`Cache hit: ${key}`);
      return entry.data;
    } catch (error) {
      logger.error('Failed to get cache', { key, error });
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      logger.debug(`Cache removed: ${key}`);
    } catch (error) {
      logger.error('Failed to remove cache', { key, error });
    }
  },

  async clear(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
      logger.debug(`Cache cleared: ${cacheKeys.length} entries`);
    } catch (error) {
      logger.error('Failed to clear cache', { error });
    }
  },

  async clearExpired(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter((k) => k.startsWith(CACHE_PREFIX));

      const now = Date.now();
      const expiredKeys: string[] = [];

      for (const key of cacheKeys) {
        const raw = await AsyncStorage.getItem(key);
        if (raw) {
          try {
            const entry = JSON.parse(raw);
            if (now > entry.expiresAt) {
              expiredKeys.push(key);
            }
          } catch {
            // Invalid entry, remove it
            expiredKeys.push(key);
          }
        }
      }

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
        logger.debug(`Expired cache cleared: ${expiredKeys.length} entries`);
      }
    } catch (error) {
      logger.error('Failed to clear expired cache', { error });
    }
  },

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Cache the result
    await this.set(key, data, options);

    return data;
  },

  async getStaleWhileRevalidate<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<{ data: T; isStale: boolean }> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      // Return cached data immediately, revalidate in background
      fetchFn()
        .then((freshData) => this.set(key, freshData, options))
        .catch((error) => logger.error('Background revalidation failed', { key, error }));

      return { data: cached, isStale: true };
    }

    // No cache, fetch fresh
    const data = await fetchFn();
    await this.set(key, data, options);

    return { data, isStale: false };
  },
};

export default offlineCache;
