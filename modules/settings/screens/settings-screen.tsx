import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';


import { useHasPermission } from '@core/hooks/use-has-permission';
import { SettingsStackParamList } from '@core/navigation/types';
import { PERMISSIONS } from '@core/permissions/permissions';
import { useTheme } from '@core/theme';
import { useAuth } from '@modules/auth/hooks/use-auth';
import { Card } from '@shared/components';
import { Header } from '@shared/components/header/header';
import { Text } from '@shared/components/text/text';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

interface SettingsItem {
  title: string;
  subtitle: string;
  onPress: () => void;
  requiresPermission?: string;
}

export function SettingsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user } = useAuth();
  const canManageUsers = useHasPermission(PERMISSIONS.MANAGE_USERS);

  const settingsItems: SettingsItem[] = [
    {
      title: 'Preferences',
      subtitle: 'Notifications, language, and display options',
      onPress: () => {
        navigation.navigate('Preferences');
      },
    },
    {
      title: 'Brand Preview',
      subtitle: 'View current brand theme and assets',
      onPress: () => {
        navigation.navigate('BrandPreview');
      },
    },
    ...(canManageUsers
      ? [
          {
            title: 'User Management',
            subtitle: 'Invite and manage tenant users',
            // @ts-expect-error - Navigating to different stack
            onPress: () => {
              navigation.navigate('Admin', { screen: 'UserList' });
            },
            requiresPermission: PERMISSIONS.MANAGE_USERS,
          },
        ]
      : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={[styles.userRole, { color: theme.colors.text.secondary }]}>
                {user?.role || 'User'}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>GENERAL</Text>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={[
                styles.settingsItem,
                { borderBottomColor: theme.colors.surface },
                index === settingsItems.length - 1 && styles.lastItem,
              ]}
            >
              <View style={styles.settingsItemContent}>
                <Text style={[styles.settingsItemTitle, { color: theme.colors.text.primary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.settingsItemSubtitle, { color: theme.colors.text.secondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: theme.colors.text.secondary }]}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>ABOUT</Text>
          <View style={[styles.aboutItem, { borderBottomColor: theme.colors.surface }]}>
            <Text style={[styles.aboutLabel, { color: theme.colors.text.secondary }]}>Version</Text>
            <Text style={[styles.aboutValue, { color: theme.colors.text.primary }]}>1.0.0</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.colors.text.secondary }]}>Build</Text>
            <Text style={[styles.aboutValue, { color: theme.colors.text.primary }]}>1</Text>
          </View>
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
    padding: 16,
  },
  userCard: {
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 14,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    marginLeft: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    fontSize: 14,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingsScreen;
