import { useTranslation } from "@/hooks/useTranslation";
import View from "@/shared/View";
import ProgressDots from "@/shared/ui/ProgressDots";
import Age from "@/widgets/SignUp/AgeScreen";
import EmailScreen from "@/widgets/SignUp/EmailScreen";
import Height from "@/widgets/SignUp/HeightScreen";
import Sex from "@/widgets/SignUp/SexScreen";
import Weight from "@/widgets/SignUp/WeightScreen";
import SignUpFormWrapper, {
  SignUpFormData,
} from "@/widgets/SignUp/components/FormWrapper";
import {
  SignUpFormProvider,
  useSignUpFormContext,
} from "@/widgets/SignUp/hooks/useSignUpFormContext";
import { signUpStepsConfig } from "@/widgets/SignUp/validation/validationSchemas";
import React, { useEffect } from "react";

const RegisterScreenContent: React.FC = () => {
  const { step, setTotalSteps, resetForm } = useSignUpFormContext();
  const { t } = useTranslation();

  useEffect(() => {
    setTotalSteps(5);
  }, [setTotalSteps]);

  const handleFinalSubmit = (finalData: Partial<SignUpFormData>) => {
    console.log("Registration data:", finalData);
    // Here you would typically send the data to your API
    alert("Registration completed!");
    resetForm();
  };

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <EmailScreen />;
      case 1:
        return <Sex />;
      case 2:
        return <Age />;
      case 3:
        return <Height />;
      case 4:
        return <Weight />;
      default:
        return null;
    }
  };

  return (
    <View style={{ paddingTop: "30%" }}>
      <ProgressDots totalSteps={5} activeIndex={step} />
      <SignUpFormWrapper
        key={step}
        onFinalSubmit={handleFinalSubmit}
        validationSchemas={signUpStepsConfig}
        buttonText={t("signUp.continue")}
      >
        {renderStepComponent()}
      </SignUpFormWrapper>
    </View>
  );
};

const RegisterScreen: React.FC = () => {
  return (
    <SignUpFormProvider>
      <RegisterScreenContent />
    </SignUpFormProvider>
  );
};

export default RegisterScreen;
