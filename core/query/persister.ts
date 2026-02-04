/**
 * AsyncStorage Persister for TanStack Query
 *
 * Persists query cache to device storage so data survives app restarts (FR-009).
 * Uses AsyncStorage for non-sensitive cached data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { PERSISTER_CONFIG } from './config';

/**
 * AsyncStorage persister for TanStack Query cache
 *
 * Configuration:
 * - Storage key: REACT_QUERY_CACHE
 * - Throttle: 1 second (prevents excessive writes)
 * - Serialization: JSON
 */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: PERSISTER_CONFIG.STORAGE_KEY,
  throttleTime: PERSISTER_CONFIG.THROTTLE_TIME,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

/**
 * Clear the persisted query cache
 * Used on logout or when cache needs to be invalidated
 */
export async function clearPersistedCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PERSISTER_CONFIG.STORAGE_KEY);
  } catch (error) {
    console.error('[Persister] Failed to clear cache:', error);
  }
}

/**
 * Get the current size of the persisted cache
 * Useful for debugging and monitoring
 */
export async function getPersistedCacheSize(): Promise<number> {
  try {
    const cache = await AsyncStorage.getItem(PERSISTER_CONFIG.STORAGE_KEY);
    return cache ? cache.length : 0;
  } catch {
    return 0;
  }
}
