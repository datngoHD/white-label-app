import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';


import { useTenant } from '@core/hooks/use-tenant';
import { AuthStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Loading } from '@shared/components';
import { Header } from '@shared/components/header/header';
import { Text } from '@shared/components/text/text';

import { RegisterForm } from '../components/register-form';
import { useAuth } from '../hooks/use-auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { register, isLoading, error, resetError } = useAuth();
  const { tenant } = useTenant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async () => {
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    if (!tenant?.id) {
      setFormError('Unable to determine tenant');
      return;
    }

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        tenantId: tenant.id,
      });
    } catch {
      // Error is handled by the auth slice
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  if (isLoading) {
    return <Loading message="Creating account..." />;
  }

  const displayError = formError || error;
  const isFormValid = email && password && confirmPassword && firstName && lastName;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Header title="Create Account" showLogo />

        <View style={styles.formContainer}>
          <RegisterForm
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            firstName={firstName}
            lastName={lastName}
            onEmailChange={(value) => {
              setEmail(value);
              if (error) resetError();
              if (formError) setFormError(null);
            }}
            onPasswordChange={(value) => {
              setPassword(value);
              if (error) resetError();
              if (formError) setFormError(null);
            }}
            onConfirmPasswordChange={(value) => {
              setConfirmPassword(value);
              if (formError) setFormError(null);
            }}
            onFirstNameChange={(value) => {
              setFirstName(value);
              if (error) resetError();
            }}
            onLastNameChange={(value) => {
              setLastName(value);
              if (error) resetError();
            }}
            error={displayError}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            disabled={!isFormValid}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
            Already have an account?
          </Text>
          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="outline"
            style={styles.loginButton}
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
  formContainer: {
    flex: 1,
  },
  registerButton: {
    marginTop: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    marginBottom: 12,
  },
  loginButton: {
    width: '100%',
  },
});

export default RegisterScreen;
