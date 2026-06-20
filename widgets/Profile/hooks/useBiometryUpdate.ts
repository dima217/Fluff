import { useTranslation } from "@/hooks/useTranslation";
import { pendingBiometryStorage } from "@/storage/pendingBiometry/pendingBiometryStorage";
import { buildPendingBiometryFromForm } from "@/widgets/Profile/lib/buildPendingBiometryFromForm";
import { BiometryFormData } from "@/widgets/Profile/wrappers/BiometryFormWrapper";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useBiometryFormContext } from "./useBiometryFormContext";

export function useBiometryUpdate() {
  const { step, setStep, setTotalSteps, totalSteps, isLastStep } =
    useBiometryFormContext();
  const router = useRouter();
  const { t } = useTranslation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (finalData: Partial<BiometryFormData>) => {
    const pending = buildPendingBiometryFromForm(finalData);
    if (!pending) {
      setErrorMessage(t("auth.error"));
      setShowErrorModal(true);
      return;
    }

    pendingBiometryStorage.set(pending);
    router.back();
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
