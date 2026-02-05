import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, containerStyle, required, style, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            hasError && styles.inputError,
            props.multiline && styles.multiline,
            style,
          ]}
          placeholderTextColor="#999999"
          autoCapitalize="none"
          {...props}
        />
        {hint && !hasError && <Text style={styles.hint}>{hint}</Text>}
        {hasError && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  required: {
    color: '#ff3b30',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 4,
  },
});
