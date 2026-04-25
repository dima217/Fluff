import { useOauthLoginMutation } from "@/api/slices/authApi";
import { useLazyGetProfileQuery } from "@/api/slices/profileApi";
import type { AppDispatch } from "@/api/store";
import { completeGoogleAuthSession } from "@/services/auth/completeGoogleAuthSession";
import { ensureGoogleSignInConfigured } from "@/services/google/configureGoogleSignIn";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { useDispatch } from "react-redux";

export function useGoogleAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [oauthLogin] = useOauthLoginMutation();
  const [getProfile] = useLazyGetProfileQuery();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = useCallback(async (): Promise<boolean | undefined> => {
    if (Platform.OS === "web") {
      Alert.alert("Google Sign-In", "Доступно в мобильной сборке (Android / iOS).");
      return undefined;
    }

    setLoading(true);
    try {
      ensureGoogleSignInConfigured();
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      try {
        await GoogleSignin.signOut();
      } catch {}

      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type !== "success") {
        return undefined;
      }

      let idToken = signInResult.data.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      if (!idToken) {
        throw new Error(
          "Google не вернул idToken. Проверьте Web client ID в GoogleSignin.configure и тип клиента в консоли Google Cloud."
        );
      }

      const tokens = await oauthLogin({ token: idToken, type: "GOOGLE" }).unwrap();
      const googleAccountEmail = signInResult.data.user.email;
      const isNewUser = await completeGoogleAuthSession(
        dispatch,
        tokens,
        async () => getProfile().unwrap(),
        { googleAccountEmail }
      );
      return isNewUser;
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      const msg =
        err?.data?.message ??
        err?.message ??
        (typeof e === "string" ? e : "Ошибка входа через Google");
      Alert.alert("Google Sign-In", String(msg));
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [dispatch, oauthLogin, router, getProfile]);

  return { signInWithGoogle, loading };
}