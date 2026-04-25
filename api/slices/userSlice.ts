import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ProfileResponse } from "../types";
import { authApi } from "./authApi";
import { profileApi } from "./profileApi";

interface UserState {
  profile: ProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileResponse | null>) => {
      state.profile = action.payload;
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle login success
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state) => {
      state.isAuthenticated = true;
    });

    // Handle signup success
    builder.addMatcher(authApi.endpoints.signUp.matchFulfilled, (state) => {
      state.isAuthenticated = true;
    });

    // Handle logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    });

    // Handle get profile
    builder.addMatcher(
      profileApi.endpoints.getProfile.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      profileApi.endpoints.getProfile.matchRejected,
      (state) => {
        state.isLoading = false;
        // Don't clear auth on profile fetch error, might be network issue
      }
    );

    // Handle update profile
    builder.addMatcher(
      profileApi.endpoints.updateProfile.matchFulfilled,
      (state, action) => {
        state.profile = action.payload;
      }
    );
  },
});

export const { setProfile, setAuth, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
