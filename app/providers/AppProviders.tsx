import React, { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '@core/store';
import { ThemeProvider } from '@core/theme';
import { ErrorBoundary } from '@core/errors';
import { TenantProvider } from './TenantProvider';
import { ThemeMode, ThemeOverrides } from '@core/types';

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
