import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "./config";
import { tokenStorage } from "./utils/tokenStorage";

// Helper function to extract refreshToken from Set-Cookie header
const extractRefreshTokenFromCookie = (
  setCookieHeader: string | string[] | undefined
): string | null => {
  if (!setCookieHeader) return null;

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookie of cookies) {
    // Look for refreshToken cookie
    const match = cookie.match(/refreshToken=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
};

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
  fetchFn: async (url, options) => {
    const response = await fetch(url, options);

    // Extract refreshToken from Set-Cookie header if present
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const refreshToken = extractRefreshTokenFromCookie(setCookieHeader);
      if (refreshToken) {
        // Store refreshToken in SecureStore for later use
        await tokenStorage.setRefreshToken(refreshToken);
      }
    }

    return response;
  },
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
