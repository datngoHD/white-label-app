import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { profileService } from '../services/profile-service';
import { Profile, ProfileState, UpdateNotificationPreferences, UpdateProfileData } from '../types';

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
};

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    return await profileService.getProfile();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return rejectWithValue(message);
  }
});

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      return await profileService.updateProfile(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  'profile/updateAvatar',
  async (imageUri: string, { rejectWithValue }) => {
    try {
      const response = await profileService.updateAvatar(imageUri);
      return response.avatarUrl;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update avatar';
      return rejectWithValue(message);
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  'profile/deleteAvatar',
  async (_, { rejectWithValue }) => {
    try {
      await profileService.deleteAvatar();
      return;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete avatar';
      return rejectWithValue(message);
    }
  }
);

export const updateNotifications = createAsyncThunk(
  'profile/updateNotifications',
  async (preferences: UpdateNotificationPreferences, { rejectWithValue }) => {
    try {
      return await profileService.updateNotificationPreferences(preferences);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update notifications';
      return rejectWithValue(message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Update avatar
      .addCase(updateAvatar.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.avatarUrl = action.payload;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete avatar
      .addCase(deleteAvatar.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.avatarUrl = undefined;
        }
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Update notifications
      .addCase(updateNotifications.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, clearProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;
