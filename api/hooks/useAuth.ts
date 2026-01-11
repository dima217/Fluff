import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { useGetProfileQuery } from "../slices/profileApi";
import { setProfile } from "../slices/userSlice";
import { tokenStorage } from "../utils/tokenStorage";

/**
 * Hook to initialize authentication state and load user profile
 * Should be called at app startup
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfileQuery(undefined, {
    skip: false, // Always try to fetch profile
  });

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = await tokenStorage.getAccessToken();
      if (accessToken && profile) {
        dispatch(setProfile(profile));
      } else if (!accessToken) {
        // No token means user is not authenticated
        dispatch(setProfile(null));
      }
    };

    checkAuth();
  }, [profile, dispatch]);

  return {
    isAuthenticated: !!profile,
    isLoading,
    profile,
    error,
  };
};
