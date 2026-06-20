import { useOauthLoginMutation } from "@/api/slices/authApi";
import { useLazyGetProfileQuery } from "@/api/slices/profileApi";
import type { AppDispatch } from "@/api/store";
import { useTranslation } from "@/hooks/useTranslation";
import { completeGoogleAuthSession } from "@/services/auth/completeGoogleAuthSession";
import { ensureGoogleSignInConfigured } from "@/services/google/configureGoogleSignIn";
import { getDeviceTimeZone } from "@/services/timezone";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";

export interface GoogleAuthAlert {
  title: string;
  message: string;
}

export function useGoogleAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useTranslation();
  const [oauthLogin] = useOauthLoginMutation();
  const [getProfile] = useLazyGetProfileQuery();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<GoogleAuthAlert | null>(null);

  const clearAlert = useCallback(() => setAlert(null), []);

  const signInWithGoogle = useCallback(async (): Promise<boolean | undefined> => {
    if (Platform.OS === "web") {
      setAlert({
        title: t("auth.googleSignInTitle"),
        message: t("auth.googleSignInWebOnly"),
      });
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
        throw new Error(t("auth.googleSignInNoToken"));
      }

      const tokens = await oauthLogin({
        token: idToken,
        type: "GOOGLE",
        timeZone: getDeviceTimeZone(),
      }).unwrap();
      const googleAccountEmail = signInResult.data.user.email;
      const isNewUser = await completeGoogleAuthSession(
        dispatch,
        tokens,
        async () => getProfile().unwrap(),
        { googleAccountEmail },
      );
      return isNewUser;
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      const msg =
        err?.data?.message ??
        err?.message ??
        (typeof e === "string" ? e : t("auth.googleSignInError"));
      setAlert({
        title: t("auth.googleSignInTitle"),
        message: String(msg),
      });
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [dispatch, getProfile, oauthLogin, router, t]);

  return { signInWithGoogle, loading, alert, clearAlert };
}
