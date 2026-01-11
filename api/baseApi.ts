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
    const match = cookie.match(/refreshToken=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
};

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
  credentials: "include",
  fetchFn: async (url, options) => {
    const response = await fetch(url, options);

    // Extract refreshToken from Set-Cookie header if present
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const refreshToken = extractRefreshTokenFromCookie(setCookieHeader);
      if (refreshToken) {
        await tokenStorage.setRefreshToken(refreshToken);
      }
    }

    return response;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isLogoutRequest =
    typeof args === "object" &&
    args !== null &&
    "url" in args &&
    args.url === "/user/sign-out";

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !isLogoutRequest) {
    try {
      // Get refreshToken from storage to send as cookie
      const refreshToken = await tokenStorage.getRefreshToken();

      const refreshResult = await baseQuery(
        {
          url: "/user/new-access-token",
          method: "POST",
          headers: refreshToken
            ? {
                Cookie: `refreshToken=${refreshToken}`,
              }
            : undefined,
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newAccessToken = refreshResult.data as string;
        await tokenStorage.setAccessToken(newAccessToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        await tokenStorage.clearTokens();
      }
    } catch {
      await tokenStorage.clearTokens();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Recipe", "Product", "Tracking", "Favorite", "Media"],
  endpoints: () => ({}),
});
