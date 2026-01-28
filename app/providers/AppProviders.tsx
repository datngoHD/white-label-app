import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';

import { ErrorBoundary } from '@core/errors';
import { store } from '@core/store';
import { ThemeProvider } from '@core/theme';
import { ThemeMode, ThemeOverrides } from '@core/types';

import { TenantProvider } from './TenantProvider';

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
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <TenantProvider>
            <ThemeProvider mode={themeMode} overrides={themeOverrides}>
              {children}
            </ThemeProvider>
          </TenantProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};
