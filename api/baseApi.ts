import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "./config";
import { tokenStorage } from "./utils/tokenStorage";

// Custom base query with token injection and refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: async (headers) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  credentials: "include", // Important for cookies (refreshToken)
});

// Base query with token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    try {
      const refreshResult = await baseQuery(
        {
          url: "/user/new-access-token",
          method: "POST",
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // /user/new-access-token returns just the access token as a string
        const newAccessToken = refreshResult.data as string;
        await tokenStorage.setAccessToken(newAccessToken);
        // Refresh token stays in cookie, no need to update it

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, clear tokens and redirect to login
        await tokenStorage.clearTokens();
      }
    } catch (error) {
      // Refresh failed, clear tokens
      await tokenStorage.clearTokens();
    }
  }

  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Recipe", "Product", "Tracking", "Favorite", "Media"],
  endpoints: () => ({}),
});
