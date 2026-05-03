import { baseApi } from "../baseApi";
import type {
  AuthResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  LoginRequest,
  NotificationResponse,
  OAuthLoginRequest,
  RecoveryConfirmRequest,
  RecoveryInitRequest,
  SetFcmTokenRequest,
  SignUpInitRequest,
  SignUpRequest
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
          console.log("[authApi] SignUp successful, received tokens:", {
            hasAccess: !!data?.access,
            hasRefresh: !!data?.refresh,
            accessType: typeof data?.access,
            refreshType: typeof data?.refresh,
          });
          if (data?.access && typeof data.access === "string") {
            await tokenStorage.setAccessToken(data.access);
          }
          if (data?.refresh && typeof data.refresh === "string") {
            await tokenStorage.setRefreshToken(data.refresh);
          }
        } catch (error) {
          // Token storage failed, but mutation might have succeeded
          console.error("[authApi] Failed to store tokens:", error);
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
          console.log("[authApi] Login successful, received tokens:", {
            hasAccess: !!data?.access,
            hasRefresh: !!data?.refresh,
            accessType: typeof data?.access,
            refreshType: typeof data?.refresh,
          });
          if (data?.access && typeof data.access === "string") {
            await tokenStorage.setAccessToken(data.access);
          }
          if (data?.refresh && typeof data.refresh === "string") {
            await tokenStorage.setRefreshToken(data.refresh);
          }
        } catch (error) {
          console.error("[authApi] Failed to store tokens:", error);
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
          if (data && typeof data === "string") {
            await tokenStorage.setAccessToken(data);
          }
        } catch (error) {
          console.error("Failed to store token:", error);
        }
      },
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => {
        console.log("[authApi] Logout mutation query called");
        return {
          url: "/user/sign-out",
          method: "POST",
        };
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

    oauthLogin: builder.mutation<AuthResponse, OAuthLoginRequest>({
      query: (body) => ({
        url: "/oauth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("[authApi] OAuth login successful, received tokens:", {
            hasAccess: !!data?.access,
            hasRefresh: !!data?.refresh,
            accessType: typeof data?.access,
            refreshType: typeof data?.refresh,
          });
          if (data?.access && typeof data.access === "string") {
            await tokenStorage.setAccessToken(data.access);
          }
          if (data?.refresh && typeof data.refresh === "string") {
            await tokenStorage.setRefreshToken(data.refresh);
          }
        } catch (error) {
          console.error("[authApi] Failed to store tokens:", error);
        }
      },
    }),

    setFcmToken: builder.mutation<void, SetFcmTokenRequest>({
      query: (body) => ({
        url: "/user/fcm-token",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getNotification: builder.query<NotificationResponse[], void>({
      query: () => ({
        url: "/user/notifications",
      }),
      providesTags: ["Notification"]
    }),
    markNotificationsAsRead: builder.mutation<{ success: boolean }, number[]>({
      query: (ids) => ({
        url: "/user/notifications/read", 
        method: "POST",
        body: { ids },
      }),
      async onQueryStarted(ids, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          authApi.util.updateQueryData('getNotification', undefined, (draft) => {
            draft.forEach((notification) => {
              if (ids.includes(notification.id)) {
                notification.isRead = true;
              }
            });
          })
        );
        try {
          await queryFulfilled;
          console.log('Уведомления отмечены как прочитанные на сервере');
        } catch (error) {
          patchResult.undo();
          console.error('Ошибка при отметке уведомлений:', error);
        }
      },
    }),
    createSupportTicket: builder.mutation<CreateTicketResponse, CreateTicketRequest>({
      query: () => ({
        url: "/support/tickets",
        method: "POST",
      })
    })
  }),
});

export const {
  useSignUpInitMutation,
  useSignUpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRecoveryInitMutation,
  useGetNotificationQuery,
  useRecoveryConfirmMutation,
  useOauthLoginMutation,
  useMarkNotificationsAsReadMutation,
  useCreateSupportTicketMutation,
} = authApi;
