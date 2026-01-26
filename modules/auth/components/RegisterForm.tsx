import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../../shared/components';
import { Text } from '../../../shared/components/Text/Text';
import { useTheme } from '../../../core/theme';

interface RegisterFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  error: string | null;
}

export function RegisterForm({
  email,
  password,
  confirmPassword,
  firstName,
  lastName,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  error,
}: RegisterFormProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Input
            label="First Name"
            value={firstName}
            onChangeText={onFirstNameChange}
            placeholder="First name"
            autoCapitalize="words"
            autoComplete="given-name"
            returnKeyType="next"
          />
        </View>
        <View style={styles.halfInput}>
          <Input
            label="Last Name"
            value={lastName}
            onChangeText={onLastNameChange}
            placeholder="Last name"
            autoCapitalize="words"
            autoComplete="family-name"
            returnKeyType="next"
          />
        </View>
      </View>

      <View style={styles.inputSpacing}>
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
      </View>

      <View style={styles.inputSpacing}>
        <Input
          label="Password"
          value={password}
          onChangeText={onPasswordChange}
          placeholder="Create a password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputSpacing}>
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          placeholder="Confirm your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          returnKeyType="done"
        />
      </View>

      <Text style={[styles.hint, { color: theme.colors.text.secondary }]}>
        Password must be at least 8 characters long
      </Text>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputSpacing: {
    marginTop: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
});

export default RegisterForm;
