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

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: hasToken === false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await tokenStorage.getAccessToken();
        setHasToken(!!accessToken);

        if (accessToken) {
        } else {
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

  useEffect(() => {
    if (profile) {
      dispatch(setProfile(profile));
    } else if (profileError && hasToken) {
      dispatch(clearUser());
      tokenStorage.clearTokens().catch(console.error);
      setHasToken(false);
    }
  }, [profile, profileError, hasToken, dispatch]);

  useEffect(() => {
    if (isInitializing || isLoadingProfile) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (inOnboarding) {
      return;
    }

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [isAuthenticated, isInitializing, isLoadingProfile, segments, router]);

  const value: AuthContextType = {
    isAuthenticated: isAuthenticated || !!userProfile,
    isLoading: isInitializing || isLoadingProfile,
    profile: userProfile || profile,
  };

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
