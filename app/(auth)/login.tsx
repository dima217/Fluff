import { useAppDispatch } from "@/api/hooks";
import { setAuth } from "@/api/slices/userSlice";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTranslation } from "@/hooks/useTranslation";
import GradientButton from "@/shared/Buttons/GradientButton";
import LoginForm from "@/shared/Forms/LoginForm";
import ErrorModal from "@/shared/Modals/ErrorModal";
import WelcomeModal from "@/shared/Modals/WelcomeModal";
import SignUpPrompt from "@/shared/ui/SignUpPrompt";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const Login = () => {
  const styles = useThemedStyles(createstyles);
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signInWithGoogle, alert, clearAlert } = useGoogleAuth();

  const handleGoogleLogin = async () => {
    try {
      const isNewUser = await signInWithGoogle();
      if (isNewUser === true) {
        router.replace("/(auth)/register?googleOnboarding=1");
        return;
      }
      if (isNewUser === false) {
        dispatch(setAuth(true));
        router.replace("/(app)/home");
      }
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
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
          <Image
            source={require("../../assets/images/adaptive-icon.png")}
            style={styles.logo}
          />
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
      <ErrorModal
        isVisible={!!alert}
        title={alert?.title}
        message={alert?.message ?? ""}
        onClose={clearAlert}
      />
    </View>
  );
};

export default Login;

const createstyles = (colors: AppColors) => StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.background,
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
  logo: {
    width: 80,
    height: 80,
    borderRadius: 22,
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
    color: colors.primary,
  },
});
