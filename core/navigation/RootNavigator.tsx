import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { TenantStatusScreen } from '../../modules/tenant/screens/TenantStatusScreen';
import { useTheme } from '../theme';
import { useTenant } from '../hooks/useTenant';
import { Loading } from '../../shared/components';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const { tenant, isLoading, isAvailable } = useTenant();

  // For now, simulate authenticated state
  // TODO: Replace with actual auth state from Redux
  const isAuthenticated = false;

  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  // Show tenant status screen if tenant is not available
  if (tenant && !isAvailable) {
    return (
      <TenantStatusScreen
        status={tenant.status}
        onRetry={() => {
          // TODO: Implement retry logic
        }}
        onContactSupport={() => {
          // TODO: Implement contact support
        }}
      />
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text.primary,
          border: theme.colors.surface,
          notification: theme.colors.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        <Stack.Screen
          name="TenantStatus"
          component={TenantStatusScreenWrapper}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrapper to handle route params
const TenantStatusScreenWrapper: React.FC<{ route: { params: { status: 'suspended' | 'maintenance'; message?: string } } }> = ({
  route,
}) => {
  return (
    <TenantStatusScreen
      status={route.params.status}
      message={route.params.message}
    />
  );
};
