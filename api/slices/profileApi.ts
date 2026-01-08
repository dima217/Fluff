import { baseApi } from "../baseApi";
import type { ProfileResponse, UpdateProfileRequest } from "../types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get profile
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),

    // Update profile
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: "/user/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;
