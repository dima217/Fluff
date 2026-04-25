import { useAppDispatch } from "@/api/hooks";
import { useSignUpInitMutation, useSignUpMutation } from "@/api/slices/authApi";
import { useLazyGetProfileQuery, useUpdateProfileMutation } from "@/api/slices/profileApi";
import { setAuth, setProfile } from "@/api/slices/userSlice";
import { useTranslation } from "@/hooks/useTranslation";
import { cheatMealSettingsStorage } from "@/utils/cheatMealSettingsStorage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SignUpFormData } from "../wrappers/FormWrapper";
import { useSignUpFormContext } from "./useSignUpFormContext";

export const useSignUp = () => {
    const { step, setTotalSteps, totalSteps, formData, setStep } = useSignUpFormContext();
    const [codeSent, setCodeSent] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [signUpInit] = useSignUpInitMutation();
    const [signUp] = useSignUpMutation();
    const [getProfile] = useLazyGetProfileQuery();
    const [updateProfileMutation] = useUpdateProfileMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
    const sendCode = async () => {
      if (step === 1 && formData.email && !codeSent) {
        try {
          console.log("Sending code to email:", formData.email);
          await signUpInit({ email: formData.email }).unwrap();
          console.log("Code sent successfully");
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
        sportActivity: finalData.sportActivity,
        cheatMealDay: finalData.cheatMealDay,
        periodOfDays: finalData.periodOfDays,
      }).unwrap();

      if (finalData.cheatMealDay != null || finalData.periodOfDays != null) {
        cheatMealSettingsStorage.set({
          cheatMealDay: finalData.cheatMealDay,
          periodOfDays: finalData.periodOfDays,
          configured: true,
        });
      }

      // Load user profile after successful registration
      try {
        const profileResult = await getProfile().unwrap();
        if (profileResult) {
          dispatch(setProfile(profileResult));
        }
      } catch (profileError) {
        console.error("Failed to load profile:", profileError);
      }

      router.replace("/(app)/home");
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  const handleGoogleFinalSubmit = async (finalData: Partial<SignUpFormData>) => {
    if (!finalData.sex || !finalData.age || !finalData.height || !finalData.weight || !finalData.sportActivity || !finalData.cheatMealDay || !finalData.periodOfDays) {
      return;
    }
    console.log("age", finalData.age);
    console.log("height", finalData.height);
    console.log("weight", finalData.weight);
    console.log("sportActivity", finalData.sportActivity);
    console.log("cheatMealDay", finalData.cheatMealDay);
    console.log("periodOfDays", finalData.periodOfDays);
    
    await updateProfileMutation({
      gender: finalData.sex === "male" ? "male" : finalData.sex === "female" ? "female" : "other",
      birthDate: new Date(finalData.age || "0").toISOString(),
      height: parseFloat(finalData.height || "0"),
      weight: parseFloat(finalData.weight || "0"),
      sportActivity: finalData.sportActivity,
      cheatMealDay: finalData.cheatMealDay,
      periodOfDays: finalData.periodOfDays,
    }).unwrap();
    const profileResult = await getProfile().unwrap();
    if (profileResult) {
      dispatch(setProfile(profileResult));
    }
    dispatch(setAuth(true));
    router.replace("/(app)/home");
  }

  return {
    step,
    setStep,
    setTotalSteps,
    totalSteps,
    formData,
    handleFinalSubmit,
    handleGoogleFinalSubmit,
    showCodeModal,
    setShowCodeModal,
    errorMessage,
    setErrorMessage,
    showErrorModal,
    setShowErrorModal,
    codeSent,
    setCodeSent,
  };
}