import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Input, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { useProfile } from '../hooks/useProfile';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { profile, isUpdating, error, updateProfile, resetError } = useProfile();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

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
              setFirstName(value);
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
                setLastName(value);
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
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputSpacing}>
            <Input
              label="Bio"
              value={bio}
              onChangeText={setBio}
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
