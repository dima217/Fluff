import { useAppDispatch } from "@/api/hooks";
import { setAuth } from "@/api/slices/userSlice";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTranslation } from "@/hooks/useTranslation";
import GradientButton from "@/shared/Buttons/GradientButton";
import ErrorModal from "@/shared/Modals/ErrorModal";
import VerificationCodeModal from "@/shared/Modals/VerificationCodeModal";
import View from "@/shared/View";
import ProgressDots from "@/shared/ui/ProgressDots";
import { renderStepComponent } from "@/widgets/SignUp/constants/signUpStepOrder";
import { renderGoogleSignUpStepComponent } from "@/widgets/SignUp/constants/signUpWithGoogleStepOrder";
import { useSignUp } from "@/widgets/SignUp/hooks/useSignUp";
import {
  SignUpFormProvider
} from "@/widgets/SignUp/hooks/useSignUpFormContext";
import {
  googleSignUpStepsConfig,
  signUpStepsConfig,
} from "@/widgets/SignUp/validation/validationSchemas";
import SignUpFormWrapper from "@/widgets/SignUp/wrappers/FormWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const RegisterScreenContent: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { googleOnboarding } = useLocalSearchParams<{
    googleOnboarding?: string;
  }>();
  const { signInWithGoogle } = useGoogleAuth();
  const dispatch = useAppDispatch();
  const { handleFinalSubmit, handleGoogleFinalSubmit, setTotalSteps, totalSteps, step, formData, showCodeModal, setShowCodeModal, showErrorModal, setShowErrorModal, errorMessage } = useSignUp();
  const [isGoogleSignUp, setIsGoogleSignUp] = useState(
    () => googleOnboarding === "1" || googleOnboarding === "true"
  );

  useEffect(() => {
    if (googleOnboarding === "1" || googleOnboarding === "true") {
      setIsGoogleSignUp(true);
    }
  }, [googleOnboarding]);

  const handleGoogleSignUp = async () => {
    try {
      const isNewUser = await signInWithGoogle();
      console.log("isNewUser", isNewUser);
      if (isNewUser) {
        setIsGoogleSignUp(true);
      }
      else {
        dispatch(setAuth(true));
        router.replace("/(app)/home");
      }
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
    }
  };

  useEffect(() => {
    if (isGoogleSignUp) {
      setTotalSteps(googleSignUpStepsConfig.length);
    } else {
      setTotalSteps(signUpStepsConfig.length);
    }
  }, [isGoogleSignUp, setTotalSteps]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <View style={styles.formContainer}>
          <ProgressDots totalSteps={totalSteps} activeIndex={step} />
          <SignUpFormWrapper
            key={`${isGoogleSignUp ? "g" : "e"}-${step}`}
            onFinalSubmit={isGoogleSignUp ? handleGoogleFinalSubmit : handleFinalSubmit}
            validationSchemas={
              isGoogleSignUp ? googleSignUpStepsConfig : signUpStepsConfig
            }
            buttonText={t("signUp.continue")}
          >
            {isGoogleSignUp ? renderGoogleSignUpStepComponent(step) : renderStepComponent(step)}
          </SignUpFormWrapper>
          {step === 0 && !isGoogleSignUp && (
            <RNView style={styles.googleButtonContainer}>
              <GradientButton
                title={`${t("auth.continueWith")} Google`}
                onPress={handleGoogleSignUp}
              />
            </RNView>
          )}
        </View>
      </ScrollView>
      <VerificationCodeModal
        isVisible={showCodeModal}
        email={formData.email || ""}
        onClose={() => setShowCodeModal(false)}
      />
      <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onClose={() => {
          setShowErrorModal(false);
        }}
      />
    </KeyboardAvoidingView>
  );
};

const RegisterScreen: React.FC = () => {
  return (
    <SignUpFormProvider>
      <RegisterScreenContent />
    </SignUpFormProvider>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingTop: "30%",
  },
  googleButtonContainer: {
    width: "100%",
    alignSelf: "center",
  },
});

export default RegisterScreen;
