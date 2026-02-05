import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';


import { logger } from '../logging/logger';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: NetInfoStateType;
  isWifi: boolean;
  isCellular: boolean;
  details: NetInfoState['details'];
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: NetInfoStateType.unknown,
    isWifi: false,
    isCellular: false,
    details: null,
  });

  const handleNetworkChange = useCallback((state: NetInfoState) => {
    const newStatus: NetworkStatus = {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      isWifi: state.type === NetInfoStateType.wifi,
      isCellular: state.type === NetInfoStateType.cellular,
      details: state.details,
    };

    setNetworkStatus(newStatus);

    // Log network status changes
    if (!newStatus.isConnected) {
      logger.warn('Network disconnected');
    } else if (newStatus.isInternetReachable === false) {
      logger.warn('Network connected but internet not reachable');
    }
  }, []);

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then(handleNetworkChange);

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, [handleNetworkChange]);

  return networkStatus;
}

export function useIsOnline(): boolean {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  return isConnected && isInternetReachable !== false;
}

export function useIsOffline(): boolean {
  return !useIsOnline();
}

export default useNetworkStatus;
