import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AuthStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Input, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { authService } from '../services/authService';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { token } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        token,
        password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (isLoading) {
    return <Loading message="Resetting password..." />;
  }

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
            Password Reset!
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.text.secondary }]}>
            Your password has been successfully reset. You can now sign in with your new password.
          </Text>
          <Button title="Sign In" onPress={handleBackToLogin} style={styles.signInButton} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Header title="Create New Password" />

        <View style={styles.content}>
          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
            Enter your new password below.
          </Text>

          {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

          <Input
            label="New Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError(null);
            }}
            placeholder="Enter new password"
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.inputSpacing}>
            <Input
              label="Confirm Password"
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

          <Button
            title="Reset Password"
            onPress={handleSubmit}
            disabled={!password || !confirmPassword}
            style={styles.submitButton}
          />

          <Button
            title="Back to Sign In"
            onPress={handleBackToLogin}
            variant="text"
            style={styles.backLink}
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
    flexGrow: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  error: {
    fontSize: 14,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  inputSpacing: {
    marginTop: 16,
  },
  submitButton: {
    marginTop: 24,
  },
  backLink: {
    marginTop: 16,
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
    lineHeight: 24,
  },
  signInButton: {
    width: '100%',
  },
});

export default ResetPasswordScreen;
