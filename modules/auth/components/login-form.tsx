import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@core/theme';
import { Input } from '@shared/components';
import { Text } from '@shared/components/text/text';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  error: string | null;
}

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  error,
}: LoginFormProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      )}

      <Input
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
      />

      <View style={styles.inputSpacing}>
        <Input
          label="Password"
          value={password}
          onChangeText={onPasswordChange}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  inputSpacing: {
    marginTop: 16,
  },
});

export default LoginForm;
