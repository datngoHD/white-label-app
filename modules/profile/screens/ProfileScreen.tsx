import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { Button, Card, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { useProfile } from '../hooks/useProfile';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { profile, isLoading, error, fetchProfile } = useProfile();
  const { logout, isLoading: isLoggingOut } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditProfile = () => {
    // @ts-expect-error - Navigate to nested stack
    navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    // @ts-expect-error - Navigate to nested stack
    navigation.navigate('ChangePassword');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Error handled by auth slice
    }
  };

  if (isLoading) {
    return <Loading message="Loading profile..." />;
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <Button title="Retry" onPress={fetchProfile} style={styles.retryButton} />
        </View>
      </View>
    );
  }

  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : '??';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <Text style={[styles.name, { color: theme.colors.text.primary }]}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={[styles.email, { color: theme.colors.text.secondary }]}>
            {profile?.email}
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Role</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {profile?.role || 'User'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Phone</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {profile?.phone || 'Not set'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
              Member since
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button title="Edit Profile" onPress={handleEditProfile} style={styles.actionButton} />
          <Button
            title="Change Password"
            onPress={handleChangePassword}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title={isLoggingOut ? 'Signing out...' : 'Sign Out'}
            onPress={handleLogout}
            variant="text"
            style={styles.logoutButton}
            disabled={isLoggingOut}
          />
        </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
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
  logoutButton: {
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
});

export default ProfileScreen;
