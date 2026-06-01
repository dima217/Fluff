import type { RootState } from "@/api";
import { baseApi } from "../baseApi";
import type { ProfileResponse, UpdateProfileRequest } from "../types";
import { setProfile } from "./userSlice";

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

      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const previousProfile = (getState() as RootState).user.profile;

        if (previousProfile) {
          if (arg.recipeFromCheatMealId != null) {
            dispatch(
              setProfile({
                ...previousProfile,
                cheatMeal: previousProfile.cheatMeal.filter(
                  (id) => id !== arg.recipeFromCheatMealId
                ),
              })
            );
          } else if (arg.recipeToCheatMealId != null) {
            const recipeId = arg.recipeToCheatMealId;
            if (!previousProfile.cheatMeal.includes(recipeId)) {
              dispatch(
                setProfile({
                  ...previousProfile,
                  cheatMeal: [...previousProfile.cheatMeal, recipeId],
                })
              );
            }
          }
        }

        try {
          const { data } = await queryFulfilled;
          dispatch(setProfile(data));
        } catch (error) {
          if (previousProfile) {
            dispatch(setProfile(previousProfile));
          }
          console.log(error);
        }
      },

      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;
