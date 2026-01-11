import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    try {
      // Ensure token is a string
      const tokenString = typeof token === "string" ? token : String(token);
      if (!tokenString) {
        console.warn("[tokenStorage] Attempted to set empty access token");
        return;
      }
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenString);
      // Log token info (masked for security)
      const maskedToken =
        tokenString.length > 20
          ? `${tokenString.substring(0, 10)}...${tokenString.substring(tokenString.length - 10)}`
          : "***";
      console.log("[tokenStorage] Access token saved:", {
        length: tokenString.length,
        preview: maskedToken,
        full: tokenString, // Full token for debugging (remove in production)
      });
    } catch (error) {
      console.error("[tokenStorage] Error setting access token:", error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      // Ensure token is a string
      const tokenString = typeof token === "string" ? token : String(token);
      if (!tokenString) {
        console.warn("[tokenStorage] Attempted to set empty refresh token");
        return;
      }
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenString);
      // Log token info (masked for security)
      const maskedToken =
        tokenString.length > 20
          ? `${tokenString.substring(0, 10)}...${tokenString.substring(tokenString.length - 10)}`
          : "***";
      console.log("[tokenStorage] Refresh token saved:", {
        length: tokenString.length,
        preview: maskedToken,
        full: tokenString, // Full token for debugging (remove in production)
      });
    } catch (error) {
      console.error("[tokenStorage] Error setting refresh token:", error);
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },
};
