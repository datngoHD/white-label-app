import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { SettingsStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { useProfile } from '@modules/profile/hooks/useProfile';
import { Card } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';


type Props = NativeStackScreenProps<SettingsStackParamList, 'Preferences'>;

export function PreferencesScreen({ navigation }: Props) {
  const theme = useTheme();
  const { profile, updateNotifications, isUpdating } = useProfile();

  const [emailNotifications, setEmailNotifications] = useState(
    profile?.notifications?.email ?? true
  );
  const [pushNotifications, setPushNotifications] = useState(profile?.notifications?.push ?? true);
  const [smsNotifications, setSmsNotifications] = useState(profile?.notifications?.sms ?? false);
  const [marketingEmails, setMarketingEmails] = useState(
    profile?.notifications?.marketing ?? false
  );

  const handleToggle = async (key: 'email' | 'push' | 'sms' | 'marketing', value: boolean) => {
    const setters = {
      email: setEmailNotifications,
      push: setPushNotifications,
      sms: setSmsNotifications,
      marketing: setMarketingEmails,
    } as const;

    // Key is guaranteed to exist in setters
    setters[key]!(value);

    try {
      await updateNotifications({ [key]: value });
    } catch {
      // Revert on error
      setters[key]!(!value);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Preferences" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            NOTIFICATIONS
          </Text>
          <Card style={styles.card}>
            <PreferenceRow
              title="Email Notifications"
              subtitle="Receive updates and alerts via email"
              value={emailNotifications}
              onValueChange={(v) => handleToggle('email', v)}
              disabled={isUpdating}
              theme={theme}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
            <PreferenceRow
              title="Push Notifications"
              subtitle="Receive push notifications on your device"
              value={pushNotifications}
              onValueChange={(v) => handleToggle('push', v)}
              disabled={isUpdating}
              theme={theme}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
            <PreferenceRow
              title="SMS Notifications"
              subtitle="Receive important alerts via SMS"
              value={smsNotifications}
              onValueChange={(v) => handleToggle('sms', v)}
              disabled={isUpdating}
              theme={theme}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            MARKETING
          </Text>
          <Card style={styles.card}>
            <PreferenceRow
              title="Marketing Emails"
              subtitle="Receive news, updates, and promotional content"
              value={marketingEmails}
              onValueChange={(v) => handleToggle('marketing', v)}
              disabled={isUpdating}
              theme={theme}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>DISPLAY</Text>
          <Card style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                Language
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                {profile?.language || 'English'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                Timezone
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                {profile?.timezone || 'Auto'}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

interface PreferenceRowProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  theme: ReturnType<typeof useTheme>;
}

function PreferenceRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
  theme,
}: PreferenceRowProps) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceContent}>
        <Text style={[styles.preferenceTitle, { color: theme.colors.text.primary }]}>{title}</Text>
        <Text style={[styles.preferenceSubtitle, { color: theme.colors.text.secondary }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.surface,
          true: theme.colors.primary + '80',
        }}
        thumbColor={value ? theme.colors.primary : '#f4f3f4'}
      />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    paddingVertical: 4,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceContent: {
    flex: 1,
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  preferenceSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
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
});

export default PreferencesScreen;
