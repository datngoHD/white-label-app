import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../core/theme';
import { TenantStatus } from '../../../core/config/tenant.types';
import { Button } from '../../../shared/components';
import { Text } from '../../../shared/components/Text/Text';

interface TenantStatusScreenProps {
  status: TenantStatus;
  message?: string;
  estimatedResolution?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export const TenantStatusScreen: React.FC<TenantStatusScreenProps> = ({
  status,
  message,
  estimatedResolution,
  onRetry,
  onContactSupport,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const getStatusConfig = () => {
    switch (status) {
      case 'suspended':
        return {
          title: 'Account Suspended',
          defaultMessage:
            'Your account has been suspended. Please contact support for assistance.',
          icon: 'alert-circle',
          color: theme.colors.error,
        };
      case 'maintenance':
        return {
          title: 'Under Maintenance',
          defaultMessage:
            'We are currently performing scheduled maintenance. Please try again later.',
          icon: 'tools',
          color: theme.colors.warning,
        };
      default:
        return {
          title: 'Service Unavailable',
          defaultMessage: 'Service is temporarily unavailable. Please try again later.',
          icon: 'cloud-off',
          color: theme.colors.text.secondary,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Text style={[styles.icon, { color: config.color }]}>!</Text>
        </View>

        <Text variant="h2" center style={styles.title}>
          {config.title}
        </Text>

        <Text variant="body" color="secondary" center style={styles.message}>
          {message || config.defaultMessage}
        </Text>

        {estimatedResolution && status === 'maintenance' && (
          <View style={[styles.estimatedTime, { backgroundColor: theme.colors.surface }]}>
            <Text variant="caption" color="secondary">
              Estimated completion:
            </Text>
            <Text variant="body" bold>
              {estimatedResolution}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {status === 'maintenance' && onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        )}

        {status === 'suspended' && onContactSupport && (
          <Button
            title="Contact Support"
            onPress={onContactSupport}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        )}

        {onRetry && status !== 'maintenance' && (
          <Button
            title="Retry"
            onPress={onRetry}
            variant="outline"
            fullWidth
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
    fontWeight: '700',
  },
  title: {
    marginBottom: 12,
  },
  message: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  estimatedTime: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  actions: {
    width: '100%',
  },
  button: {
    marginTop: 12,
  },
});
