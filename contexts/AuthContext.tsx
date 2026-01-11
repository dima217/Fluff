import { useAppDispatch, useAppSelector } from "@/api/hooks";
import { useGetProfileQuery } from "@/api/slices/profileApi";
import { clearUser, setProfile } from "@/api/slices/userSlice";
import { tokenStorage } from "@/api/utils/tokenStorage";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { t } = useTranslation();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const userProfile = useAppSelector((state) => state.user.profile);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Try to fetch profile if we have a token
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: hasToken === false, // Skip if we know there's no token
  });

  // Check for token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await tokenStorage.getAccessToken();
        setHasToken(!!accessToken);

        if (accessToken) {
          // We have a token, profile query will run automatically
          // Wait for it to complete
        } else {
          // No token, user is not authenticated
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        dispatch(clearUser());
        setHasToken(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Update profile in Redux when fetched
  useEffect(() => {
    if (profile) {
      dispatch(setProfile(profile));
    } else if (profileError && hasToken) {
      // Token exists but profile fetch failed - likely invalid token
      dispatch(clearUser());
      tokenStorage.clearTokens().catch(console.error);
      setHasToken(false);
    }
  }, [profile, profileError, hasToken, dispatch]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isInitializing || isLoadingProfile) {
      return; // Don't navigate while initializing
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    // Skip navigation if we're on onboarding
    if (inOnboarding) {
      return;
    }

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth group - redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth group - redirect to home
      router.replace("/(app)/home");
    }
  }, [isAuthenticated, isInitializing, isLoadingProfile, segments, router]);

  const value: AuthContextType = {
    isAuthenticated: isAuthenticated || !!userProfile,
    isLoading: isInitializing || isLoadingProfile,
    profile: userProfile || profile,
  };

  // Show loading screen while initializing
  if (isInitializing || (hasToken === true && isLoadingProfile)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText type="default" style={styles.loadingText}>
          {t("common.loading")}
        </ThemedText>
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 20,
  },
  loadingText: {
    color: Colors.text,
  },
});
