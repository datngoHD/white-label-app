import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Input, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { useProfile } from '../hooks/useProfile';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
}

function useFormState(
  profile: { firstName?: string; lastName?: string; phone?: string; bio?: string } | null
) {
  const [formData, setFormData] = useState<FormData>(() => ({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  }));

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, updateField };
}

export function EditProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { profile, isUpdating, error, updateProfile, resetError } = useProfile();
  const { formData, updateField } = useFormState(profile);
  const { firstName, lastName, phone, bio } = formData;

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        phone: phone || undefined,
        bio: bio || undefined,
      });
      navigation.goBack();
    } catch {
      // Error handled by profile slice
    }
  };

  const hasChanges =
    firstName !== (profile?.firstName || '') ||
    lastName !== (profile?.lastName || '') ||
    phone !== (profile?.phone || '') ||
    bio !== (profile?.bio || '');

  if (isUpdating) {
    return <Loading message="Saving changes..." />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Edit Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="First Name"
            value={firstName}
            onChangeText={(value) => {
              updateField('firstName', value);
              if (error) resetError();
            }}
            placeholder="Enter first name"
            autoCapitalize="words"
          />

          <View style={styles.inputSpacing}>
            <Input
              label="Last Name"
              value={lastName}
              onChangeText={(value) => {
                updateField('lastName', value);
                if (error) resetError();
              }}
              placeholder="Enter last name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputSpacing}>
            <Input
              label="Phone"
              value={phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputSpacing}>
            <Input
              label="Bio"
              value={bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            disabled={!hasChanges || !firstName || !lastName}
            style={styles.saveButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
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
  actions: {
    gap: 12,
  },
  saveButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});

export default EditProfileScreen;
