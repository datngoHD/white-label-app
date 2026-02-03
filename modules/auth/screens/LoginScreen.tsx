import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';

import { AuthStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { login, isLoading, error, resetError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch {
      // Error is handled by the auth slice
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  if (isLoading) {
    return <Loading message="Signing in..." />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Header title="Welcome Back" showLogo />

        <View style={styles.formContainer}>
          <Text>{Config.APP_ENV}</Text>
          <LoginForm
            email={email}
            password={password}
            onEmailChange={(value) => {
              setEmail(value);
              if (error) resetError();
            }}
            onPasswordChange={(value) => {
              setPassword(value);
              if (error) resetError();
            }}
            onSubmit={handleLogin}
            error={error}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            disabled={!email || !password}
            style={styles.loginButton}
          />

          <Button
            title="Forgot Password?"
            onPress={handleForgotPassword}
            variant="text"
            style={styles.forgotButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
            Don&apos;t have an account?
          </Text>
          <Button
            title="Sign Up"
            onPress={handleRegister}
            variant="outline"
            style={styles.registerButton}
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
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: 24,
  },
  forgotButton: {
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    marginBottom: 12,
  },
  registerButton: {
    width: '100%',
  },
});

export default LoginScreen;
