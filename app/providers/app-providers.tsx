import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { ReactNode, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';


import { ErrorBoundary } from '@core/errors';
import { setupMutationDefaults } from '@core/query/mutation-defaults';
import { setupOnlineManager } from '@core/query/online-manager';
import { asyncStoragePersister } from '@core/query/persister';
import { queryClient } from '@core/query/query-client';
import { store } from '@core/store';
import { ThemeProvider } from '@core/theme';
import { ThemeMode, ThemeOverrides } from '@core/types';

import { TenantProvider } from './tenant-provider';

// Setup mutation defaults before provider mounts
setupMutationDefaults(queryClient);

interface AppProvidersProps {
  children: ReactNode;
  themeMode?: ThemeMode;
  themeOverrides?: ThemeOverrides;
}

export const AppProviders: React.FC<AppProvidersProps> = ({
  children,
  themeMode = 'system',
  themeOverrides,
}) => {
  // Setup online manager for network status tracking
  useEffect(() => {
    const cleanup = setupOnlineManager();
    return cleanup;
  }, []);

  /**
   * Handle successful cache restoration
   * Resume any paused mutations that were persisted (FR-014)
   */
  const handlePersistSuccess = async (): Promise<void> => {
    // Resume paused mutations after cache is restored
    await queryClient.resumePausedMutations();
    // Invalidate stale queries to trigger background refetch
    await queryClient.invalidateQueries();
  };

  return (
    <ErrorBoundary>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
        onSuccess={() => void handlePersistSuccess()}
      >
        <ReduxProvider store={store}>
          <SafeAreaProvider>
            <TenantProvider>
              <ThemeProvider mode={themeMode} overrides={themeOverrides}>
                {children}
              </ThemeProvider>
            </TenantProvider>
          </SafeAreaProvider>
        </ReduxProvider>
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
};
