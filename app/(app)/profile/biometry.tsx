import { useAppSelector } from "@/api/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import ErrorModal from "@/shared/Modals/ErrorModal";
import View from "@/shared/View";
import ProgressDots from "@/shared/ui/ProgressDots";
import { renderBiometryStepComponent } from "@/widgets/Profile/constants/biometryStepOrder";
import {
  BiometryFormProvider,
  useBiometryFormContext,
} from "@/widgets/Profile/hooks/useBiometryFormContext";
import { useBiometryUpdate } from "@/widgets/Profile/hooks/useBiometryUpdate";
import { mapProfileToBiometryFormData } from "@/widgets/Profile/lib/mapProfileToBiometryForm";
import { biometryStepsConfig } from "@/widgets/Profile/validation/biometryValidationSchemas";
import BiometryFormWrapper from "@/widgets/Profile/wrappers/BiometryFormWrapper";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  BackHandler,
  View as RNView,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const BiometryScreenContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLastStep } = useBiometryFormContext();
  const {
    step,
    setStep,
    setTotalSteps,
    totalSteps,
    handleSubmit,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
  } = useBiometryUpdate();

  useEffect(() => {
    setTotalSteps(biometryStepsConfig.length);
  }, [setTotalSteps]);

  useEffect(() => {
    const onBackPress = () => {
      if (step === 0) {
        router.back();
        return true;
      }

      setStep(step - 1);
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [router, setStep, step]);

  return (
    <View>
      <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
      <Header title={t("profile.biometryData")} />

      <KeyboardAwareView style={styles.keyboardAvoid}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <RNView style={styles.formContainer}>
            <ProgressDots totalSteps={totalSteps} activeIndex={step} />
            <BiometryFormWrapper
              key={step}
              onFinalSubmit={handleSubmit}
              validationSchemas={biometryStepsConfig}
              buttonText={
                isLastStep ? t("common.save") : t("signUp.continue")
              }
            >
              {renderBiometryStepComponent(step)}
            </BiometryFormWrapper>
          </RNView>
        </ScrollView>
      </KeyboardAwareView>

      <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

const BiometryScreen = () => {
  const profile = useAppSelector((state) => state.user.profile);
  const initialFormData = useMemo(
    () => mapProfileToBiometryFormData(profile),
    [profile]
  );

  return (
    <BiometryFormProvider initialFormData={initialFormData}>
      <BiometryScreenContent />
    </BiometryFormProvider>
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
    flex: 1,
    paddingTop: "20%",
  },
});

export default BiometryScreen;
