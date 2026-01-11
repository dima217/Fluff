import { useGetProfileQuery, useOauthLoginMutation } from "@/api";
import { useAppDispatch } from "@/api/hooks";
import { setProfile } from "@/api/slices/userSlice";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import GradientButton from "@/shared/Buttons/GradientButton";
import LoginForm from "@/shared/Forms/LoginForm";
import ErrorModal from "@/shared/Modals/ErrorModal";
import WelcomeModal from "@/shared/Modals/WelcomeModal";
import SignUpPrompt from "@/shared/ui/SignUpPrompt";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Fluff from "../../assets/images/Fluff.svg";

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [oauthLogin] = useOauthLoginMutation();
  const { refetch: refetchProfile } = useGetProfileQuery();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    try {
      // TODO: Replace with actual Google OAuth token
      // This should get the token from Google Sign-In SDK
      // For now, this is a placeholder
      const googleToken = "PLACEHOLDER_TOKEN"; // Replace with actual token from Google OAuth

      await oauthLogin({
        token: googleToken,
        type: "GOOGLE",
      }).unwrap();

      // Load user profile after successful login
      try {
        const profileResult = await refetchProfile();
        if (profileResult.data) {
          dispatch(setProfile(profileResult.data));
        }
      } catch (profileError) {
        console.error("Failed to load profile:", profileError);
      }

      setShowWelcomeModal(true);
    } catch (error: any) {
      let errorMsg = t("auth.loginFailed") || "Не удалось войти через Google";

      if (error?.data?.message) {
        errorMsg = error.data.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    router.replace("/(app)/home");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Fluff />
          <ThemedText>{t("auth.login")}</ThemedText>
        </View>
        <LoginForm />
        <TouchableOpacity
          onPress={() => router.push("/(auth)/recovery")}
          style={styles.recoveryLink}
        >
          <ThemedText type="xs" style={styles.recoveryLinkText}>
            {t("auth.forgotPassword") || "Забыли пароль?"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.innerContainer}>
        <GradientButton
          title={`${t("auth.continueWith")} Google`}
          onPress={handleGoogleLogin}
        />
        <SignUpPrompt
          onPressSignUp={() => {
            router.navigate("/(auth)/register");
          }}
        />
      </View>
      <WelcomeModal isVisible={showWelcomeModal} onClose={handleWelcomeClose} />
      <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: "center",
  },
  container: {
    width: "90%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    marginBottom: 80,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: "15%",
    width: "90%",
    alignItems: "center",
  },
  recoveryLink: {
    marginTop: 15,
    alignItems: "center",
  },
  recoveryLinkText: {
    textDecorationLine: "underline",
    color: Colors.primary,
  },
});
