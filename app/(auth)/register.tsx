import {
  useGetProfileQuery,
  useOauthLoginMutation,
  useSignUpInitMutation,
  useSignUpMutation,
} from "@/api";
import { useAppDispatch } from "@/api/hooks";
import { setProfile } from "@/api/slices/userSlice";
import { useTranslation } from "@/hooks/useTranslation";
import GradientButton from "@/shared/Buttons/GradientButton";
import ErrorModal from "@/shared/Modals/ErrorModal";
import VerificationCodeModal from "@/shared/Modals/VerificationCodeModal";
import View from "@/shared/View";
import ProgressDots from "@/shared/ui/ProgressDots";
import Age from "@/widgets/SignUp/AgeScreen";
import CodeScreen from "@/widgets/SignUp/CodeScreen";
import EmailScreen from "@/widgets/SignUp/EmailScreen";
import Height from "@/widgets/SignUp/HeightScreen";
import NameScreen from "@/widgets/SignUp/NameScreen";
import PasswordScreen from "@/widgets/SignUp/PasswordScreen";
import Sex from "@/widgets/SignUp/SexScreen";
import { SportActivityScreen } from "@/widgets/SignUp/SportActivityScreen";
import Weight from "@/widgets/SignUp/WeightScreen";
import SignUpFormWrapper, {
  SignUpFormData,
} from "@/widgets/SignUp/components/FormWrapper";
import {
  SignUpFormProvider,
  useSignUpFormContext,
} from "@/widgets/SignUp/hooks/useSignUpFormContext";
import { signUpStepsConfig } from "@/widgets/SignUp/validation/validationSchemas";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

const RegisterScreenContent: React.FC = () => {
  const { step, setTotalSteps, resetForm, formData, setStep } =
    useSignUpFormContext();
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signUpInit] = useSignUpInitMutation();
  const [signUp] = useSignUpMutation();
  const [oauthLogin] = useOauthLoginMutation();
  const { refetch: refetchProfile } = useGetProfileQuery();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      // TODO: Replace with actual Google OAuth token
      // This should get the token from Google Sign-In SDK
      const googleToken = "PLACEHOLDER_TOKEN"; // Replace with actual token from Google OAuth

      await oauthLogin({
        token: googleToken,
        type: "GOOGLE",
      }).unwrap();

      // Load user profile after successful registration
      try {
        const profileResult = await refetchProfile();
        if (profileResult.data) {
          dispatch(setProfile(profileResult.data));
        }
      } catch (profileError) {
        console.error("Failed to load profile:", profileError);
      }

      router.replace("/(app)/home");
      resetForm();
    } catch (error: any) {
      let errorMsg =
        t("auth.loginFailed") || "Не удалось зарегистрироваться через Google";

      if (error?.data?.message) {
        errorMsg = error.data.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    setTotalSteps(9);
  }, [setTotalSteps]);

  useEffect(() => {
    const sendCode = async () => {
      if (step === 1 && formData.email && !codeSent) {
        try {
          await signUpInit({ email: formData.email }).unwrap();
          setCodeSent(true);
          setShowCodeModal(true);
        } catch (error: any) {
          let errorMsg =
            t("auth.failedToSendCode") || "Не удалось отправить код";

          const status = error?.status;
          const data = error?.data;

          if (status === 409) {
            errorMsg = t("auth.emailAlreadyExists");
          } else if (data?.message) {
            errorMsg = data.message;
          }

          setErrorMessage(errorMsg);
          setShowErrorModal(true);
          setStep(0);
          setCodeSent(false);
        }
      }
    };
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, formData.email, codeSent]);

  const handleFinalSubmit = async (finalData: Partial<SignUpFormData>) => {
    if (
      !finalData.email ||
      !finalData.code ||
      !finalData.password ||
      !finalData.firstName ||
      !finalData.lastName
    ) {
      return;
    }

    try {
      const birthDate = new Date();
      birthDate.setFullYear(
        birthDate.getFullYear() - parseInt(finalData.age || "0")
      );

      await signUp({
        email: finalData.email,
        password: finalData.password,
        firstName: finalData.firstName,
        lastName: finalData.lastName,
        code: finalData.code,
        gender:
          finalData.sex === "male"
            ? "male"
            : finalData.sex === "female"
              ? "female"
              : "other",
        birthDate: birthDate.toISOString(),
        height: parseFloat(finalData.height || "0"),
        weight: parseFloat(finalData.weight || "0"),
      }).unwrap();

      // Load user profile after successful registration
      try {
        const profileResult = await refetchProfile();
        if (profileResult.data) {
          dispatch(setProfile(profileResult.data));
        }
      } catch (profileError) {
        console.error("Failed to load profile:", profileError);
      }

      router.replace("/(app)/home");
      resetForm();
    } catch {}
  };

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <EmailScreen />;
      case 1:
        return <CodeScreen />;
      case 2:
        return <PasswordScreen />;
      case 3:
        return <NameScreen />;
      case 4:
        return <Sex />;
      case 5:
        return <Age />;
      case 6:
        return <Height />;
      case 7:
        return <Weight />;
      case 8:
        return <SportActivityScreen />;
      default:
        return null;
    }
  };

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
      >
        <View style={styles.formContainer}>
          <ProgressDots totalSteps={9} activeIndex={step} />
          <SignUpFormWrapper
            key={step}
            onFinalSubmit={handleFinalSubmit}
            validationSchemas={signUpStepsConfig}
            buttonText={t("signUp.continue")}
          >
            {renderStepComponent()}
          </SignUpFormWrapper>
          {step === 0 && (
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
