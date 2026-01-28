import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';


import { AdminStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { UserRole } from '@core/types';
import { Button, Input, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { adminUserService } from '../services/adminUserService';

type Props = NativeStackScreenProps<AdminStackParamList, 'InviteUser'>;

export function InviteUserScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInvite = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await adminUserService.inviteUser({
        email,
        firstName,
        lastName,
        role,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Sending invitation..." />;
  }

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
            Invitation Sent!
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.text.secondary }]}>
            An invitation email has been sent to {email}
          </Text>
          <Button
            title="Invite Another"
            onPress={() => {
              setIsSuccess(false);
              setEmail('');
              setFirstName('');
              setLastName('');
              setRole('user');
            }}
            style={styles.button}
          />
          <Button
            title="Back to Users"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  const isFormValid = email && firstName && lastName;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Invite User" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError(null);
            }}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.roleSection}>
            <Text style={[styles.roleLabel, { color: theme.colors.text.primary }]}>Role</Text>
            <View style={styles.roleOptions}>
              <RoleOption
                label="User"
                selected={role === 'user'}
                onPress={() => setRole('user')}
                theme={theme}
              />
              <RoleOption
                label="Admin"
                selected={role === 'admin'}
                onPress={() => setRole('admin')}
                theme={theme}
              />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Send Invitation"
            onPress={handleInvite}
            disabled={!isFormValid}
            style={styles.button}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface RoleOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}

function RoleOption({ label, selected, onPress, theme: _theme }: RoleOptionProps) {
  return (
    <Button
      title={label}
      onPress={onPress}
      variant={selected ? 'primary' : 'outline'}
      style={styles.roleButton}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  halfInput: {
    flex: 1,
  },
  roleSection: {
    marginTop: 24,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default InviteUserScreen;
