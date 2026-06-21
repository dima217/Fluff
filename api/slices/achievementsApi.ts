import { baseApi } from "../baseApi";
import type { AchievementResponse } from "../types";

const normalizeAchievementsResponse = (
  response: unknown
): AchievementResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    response &&
    typeof response === "object" &&
    Array.isArray((response as { data?: unknown }).data)
  ) {
    return (response as { data: AchievementResponse[] }).data;
  }

  return [];
};

export const achievementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAchievements: builder.query<AchievementResponse[], void>({
      query: () => "/achievements",
      transformResponse: normalizeAchievementsResponse,
      providesTags: ["Achievement"],
    }),
  }),
});
export const { useGetAchievementsQuery } = achievementsApi;
