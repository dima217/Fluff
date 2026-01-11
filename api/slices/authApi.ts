import { baseApi } from "../baseApi";
import type {
  AuthResponse,
  LoginRequest,
  OAuthLoginRequest,
  RecoveryConfirmRequest,
  RecoveryInitRequest,
  SignUpInitRequest,
  SignUpRequest,
} from "../types";
import { tokenStorage } from "../utils/tokenStorage";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Sign up initialization
    signUpInit: builder.mutation<{ message: string }, SignUpInitRequest>({
      query: (body) => ({
        url: "/user/sign-up-init",
        method: "POST",
        body,
      }),
    }),

    // Sign up completion
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (body) => ({
        url: "/user/sign-up",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.access && typeof data.access === "string") {
            await tokenStorage.setAccessToken(data.access);
          }
          if (data?.refresh && typeof data.refresh === "string") {
            await tokenStorage.setRefreshToken(data.refresh);
          }
        } catch (error) {
          // Token storage failed, but mutation might have succeeded
          console.error("Failed to store tokens:", error);
        }
      },
    }),

    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/user/sign-in",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.access && typeof data.access === "string") {
            await tokenStorage.setAccessToken(data.access);
          }
          if (data?.refresh && typeof data.refresh === "string") {
            await tokenStorage.setRefreshToken(data.refresh);
          }
        } catch (error) {
          console.error("Failed to store tokens:", error);
        }
      },
    }),

    // Refresh token
    refreshToken: builder.mutation<string, void>({
      query: () => ({
        url: "/user/new-access-token",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Returns just the access token as a string
          if (data && typeof data === "string") {
            await tokenStorage.setAccessToken(data);
          }
          // Refresh token stays in cookie
        } catch (error) {
          console.error("Failed to store token:", error);
        }
      },
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/sign-out",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          await tokenStorage.clearTokens();
        } catch {
          // Even if logout fails, clear local tokens
          await tokenStorage.clearTokens();
        }
      },
    }),

    // Recovery initialization
    recoveryInit: builder.mutation<{ message: string }, RecoveryInitRequest>({
      query: (body) => ({
        url: "/user/recovery-init",
        method: "POST",
        body,
      }),
    }),

    // Recovery confirmation
    recoveryConfirm: builder.mutation<
      { message: string },
      RecoveryConfirmRequest
    >({
      query: (body) => ({
        url: "/user/recovery-confirm",
        method: "POST",
        body,
      }),
    }),

    // OAuth login
    oauthLogin: builder.mutation<AuthResponse, OAuthLoginRequest>({
      query: (body) => ({
        url: "/oauth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.access && typeof data.access === "string") {
            await tokenStorage.setAccessToken(data.access);
          }
          if (data?.refresh && typeof data.refresh === "string") {
            await tokenStorage.setRefreshToken(data.refresh);
          }
        } catch (error) {
          console.error("Failed to store tokens:", error);
        }
      },
    }),
  }),
});

export const {
  useSignUpInitMutation,
  useSignUpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRecoveryInitMutation,
  useRecoveryConfirmMutation,
  useOauthLoginMutation,
} = authApi;
