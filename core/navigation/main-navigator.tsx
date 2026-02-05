import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';


// Admin screens
import { InviteUserScreen, UserDetailScreen, UserListScreen } from '@modules/admin/screens';
// Profile screens
import { ChangePasswordScreen, EditProfileScreen, ProfileScreen } from '@modules/profile/screens';
// Settings screens
import { BrandPreviewScreen, PreferencesScreen, SettingsScreen } from '@modules/settings/screens';
import { Text } from '@shared/components/text/text';

import { useIsAdmin } from '../hooks/use-user-role';
import { useTheme } from '../theme';
import {
  AdminStackParamList,
  MainTabParamList,
  ProfileStackParamList,
  SettingsStackParamList,
} from './types';

// Home placeholder
const HomeScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Welcome</Text>
      <Text style={{ color: theme.colors.text.secondary }}>
        This is the home screen of your white-label app
      </Text>
    </View>
  );
};

// Create stack navigators
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const ProfileNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </ProfileStack.Navigator>
  );
};

const SettingsNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Preferences" component={PreferencesScreen} />
      <SettingsStack.Screen name="BrandPreview" component={BrandPreviewScreen} />
    </SettingsStack.Navigator>
  );
};

const AdminNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <AdminStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <AdminStack.Screen name="UserList" component={UserListScreen} />
      <AdminStack.Screen name="InviteUser" component={InviteUserScreen} />
      <AdminStack.Screen name="UserDetail" component={UserDetailScreen} />
    </AdminStack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  const theme = useTheme();
  const isAdmin = useIsAdmin();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarLabel: 'Admin',
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
});
