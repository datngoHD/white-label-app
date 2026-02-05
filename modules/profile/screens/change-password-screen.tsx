import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';


import { ProfileStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Input, Loading } from '@shared/components';
import { Header } from '@shared/components/header/header';
import { Text } from '@shared/components/text/text';

import { profileService } from '../services/profile-service';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ChangePassword'>;

export function ChangePasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsLoading(true);

    try {
      await profileService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Changing password..." />;
  }

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
            Password Changed!
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.text.secondary }]}>
            Your password has been successfully updated.
          </Text>
          <Button
            title="Back to Profile"
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  const isFormValid = currentPassword && newPassword && confirmPassword;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="Change Password"
        showBack
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Current Password"
            value={currentPassword}
            onChangeText={(value) => {
              setCurrentPassword(value);
              setError(null);
            }}
            placeholder="Enter current password"
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.inputSpacing}>
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                setError(null);
              }}
              placeholder="Enter new password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputSpacing}>
            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setError(null);
              }}
              placeholder="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.hint, { color: theme.colors.text.secondary }]}>
            Password must be at least 8 characters long
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Change Password"
            onPress={handleSubmit}
            disabled={!isFormValid}
            style={styles.submitButton}
          />
          <Button
            title="Cancel"
            onPress={() => {
              navigation.goBack();
            }}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  inputSpacing: {
    marginTop: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    gap: 12,
  },
  submitButton: {
    width: '100%',
  },
  cancelButton: {
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
  backButton: {
    width: '100%',
  },
});

export default ChangePasswordScreen;
