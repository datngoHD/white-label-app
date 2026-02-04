import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';


import { AdminStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Card, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { adminUserService } from '../services/adminUserService';
import { TenantUser } from '../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'UserDetail'>;

export function UserDetailScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  const theme = useTheme();
  const [user, setUser] = useState<TenantUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await adminUserService.getUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleToggleActive = async () => {
    if (!user) return;

    const action = user.isActive ? 'deactivate' : 'activate';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: user.isActive ? 'destructive' : 'default',
          onPress: async () => {
            setIsUpdating(true);
            try {
              const updatedUser = user.isActive
                ? await adminUserService.deactivateUser(userId)
                : await adminUserService.activateUser(userId);
              setUser(updatedUser);
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : `Failed to ${action} user`);
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleResendInvite = async () => {
    setIsUpdating(true);
    try {
      await adminUserService.resendInvite(userId);
      Alert.alert('Success', 'Invitation email has been resent');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to resend invitation');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = () => {
    if (!user) return;

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);
            try {
              await adminUserService.deleteUser(userId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete user');
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading message="Loading user..." />;
  }

  if (error || !user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header
          title="User Details"
          showBack
          onBack={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error || 'User not found'}
          </Text>
          <Button title="Retry" onPress={fetchUser} style={styles.retryButton} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="User Details"
        showBack
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: user.isActive ? theme.colors.primary : theme.colors.text.secondary,
              },
            ]}
          >
            <Text style={styles.avatarText}>
              {user.firstName[0]}
              {user.lastName[0]}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.colors.text.primary }]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={[styles.email, { color: theme.colors.text.secondary }]}>{user.email}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{user.role}</Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: user.isActive
                    ? theme.colors.success + '20'
                    : theme.colors.error + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: user.isActive ? theme.colors.success : theme.colors.error },
                ]}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Created</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
              Last Login
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
            </Text>
          </View>
          {user.invitedBy && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                  Invited By
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                  {user.invitedBy}
                </Text>
              </View>
            </>
          )}
        </Card>

        <View style={styles.actions}>
          <Button
            title={user.isActive ? 'Deactivate User' : 'Activate User'}
            onPress={handleToggleActive}
            variant={user.isActive ? 'outline' : 'primary'}
            disabled={isUpdating}
            style={styles.actionButton}
          />
          {!user.lastLoginAt && (
            <Button
              title="Resend Invitation"
              onPress={handleResendInvite}
              variant="outline"
              disabled={isUpdating}
              style={styles.actionButton}
            />
          )}
          <Button
            title="Delete User"
            onPress={handleDeleteUser}
            variant="text"
            disabled={isUpdating}
            style={StyleSheet.flatten([styles.actionButton, styles.deleteButton])}
          />
        </View>

        {isUpdating && (
          <View style={styles.overlay}>
            <Loading message="Updating..." />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    marginTop: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  deleteButton: {
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    minWidth: 120,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailScreen;
