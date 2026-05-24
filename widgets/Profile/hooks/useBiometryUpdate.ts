import { useUpdateProfileMutation } from "@/api/slices/profileApi";
import { useTranslation } from "@/hooks/useTranslation";
import { BiometryFormData } from "@/widgets/Profile/wrappers/BiometryFormWrapper";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useBiometryFormContext } from "./useBiometryFormContext";

export function useBiometryUpdate() {
  const { step, setStep, setTotalSteps, totalSteps, isLastStep } =
    useBiometryFormContext();
  const [updateProfile] = useUpdateProfileMutation();
  const router = useRouter();
  const { t } = useTranslation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (finalData: Partial<BiometryFormData>) => {
    if (
      !finalData.sex ||
      !finalData.age ||
      !finalData.height ||
      !finalData.weight
    ) {
      return;
    }

    try {
      const birthDate = new Date();
      birthDate.setFullYear(
        birthDate.getFullYear() - parseInt(finalData.age, 10)
      );

      await updateProfile({
        gender:
          finalData.sex === "male"
            ? "male"
            : finalData.sex === "female"
              ? "female"
              : "other",
        birthDate: birthDate.toISOString(),
        height: parseFloat(finalData.height),
        weight: parseFloat(finalData.weight),
      }).unwrap();

      router.back();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? error?.message ?? t("common.error")
      );
      setShowErrorModal(true);
    }
  };

  return {
    step,
    setStep,
    setTotalSteps,
    totalSteps,
    isLastStep,
    handleSubmit,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
  };
}
