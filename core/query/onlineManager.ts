/**
 * Online Manager Integration with NetInfo
 *
 * Connects TanStack Query's onlineManager with React Native's NetInfo
 * to properly handle offline/online state transitions (FR-010).
 */

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Setup the online manager to track network status
 *
 * This integrates NetInfo with TanStack Query so that:
 * - Queries pause when offline
 * - Mutations queue when offline
 * - Refetch triggers when coming back online
 *
 * @returns Cleanup function to unsubscribe from network events
 */
export function setupOnlineManager(): () => void {
  // Store the NetInfo unsubscribe function
  let netInfoUnsubscribe: (() => void) | null = null;

  // Set up the event listener for network status changes
  onlineManager.setEventListener((setOnline) => {
    // Subscribe to NetInfo and store the unsubscribe function
    netInfoUnsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      // Check both connection status and internet reachability
      // isInternetReachable can be null initially, treat as "assume online"
      const isOnlineStatus =
        state.isConnected !== null &&
        state.isConnected &&
        state.isInternetReachable !== false;

      setOnline(isOnlineStatus);
    });

    // Return cleanup for the event listener callback
    return () => {
      netInfoUnsubscribe?.();
    };
  });

  // Return cleanup function
  return () => {
    netInfoUnsubscribe?.();
  };
}

/**
 * Get the current online status
 * Useful for checking network state synchronously
 */
export function isOnline(): boolean {
  return onlineManager.isOnline();
}

/**
 * Manually set online status
 * Useful for testing or overriding network detection
 */
export function setOnline(online: boolean): void {
  onlineManager.setOnline(online);
}
