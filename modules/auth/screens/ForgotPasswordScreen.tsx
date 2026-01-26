import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../../core/theme';
import { Button, Input, Loading } from '../../../shared/components';
import { Text } from '../../../shared/components/Text/Text';
import { Header } from '../../../shared/components/Header/Header';
import { AuthStackParamList } from '../../../core/navigation/types';
import { authService } from '../services/authService';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (isLoading) {
    return <Loading message="Sending reset email..." />;
  }

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
            Check Your Email
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.text.secondary }]}>
            We've sent password reset instructions to {email}
          </Text>
          <Button
            title="Back to Sign In"
            onPress={handleBackToLogin}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Reset Password" />

        <View style={styles.content}>
          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          {error && (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError(null);
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Button
            title="Send Reset Link"
            onPress={handleSubmit}
            disabled={!email}
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
  backButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;
