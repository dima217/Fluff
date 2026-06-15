import { useUpdateProfileMutation } from "@/api/slices/profileApi";
import { useTranslation } from "@/hooks/useTranslation";
import { calorieGoalStorage } from "@/storage/calorieGoal/calorieGoalStorage";
import { calculateDailyCaloriesRaw } from "@/services/equation/calories";
import { getAge } from "@/services/equation/age";
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
  const [showCalorieModal, setShowCalorieModal] = useState(false);
  const [calculatedCalories, setCalculatedCalories] = useState(0);

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
        birthDate.getFullYear() - parseInt(finalData.age, 10),
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
        sportActivity: finalData.sportActivity ?? undefined,
      }).unwrap();

      const age = parseInt(finalData.age, 10);
      const calculated = calculateDailyCaloriesRaw({
        weight: parseFloat(finalData.weight),
        height: parseFloat(finalData.height),
        age,
        gender:
          finalData.sex === "male"
            ? "male"
            : finalData.sex === "female"
              ? "female"
              : "other",
        activity: finalData.sportActivity ?? null,
      });

      calorieGoalStorage.remove();

      if (calculated) {
        setCalculatedCalories(calculated);
        setShowCalorieModal(true);
      } else {
        router.back();
      }
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? error?.message ?? t("common.error"),
      );
      setShowErrorModal(true);
    }
  };

  const handleCalorieSave = (customCalories: number) => {
    calorieGoalStorage.set(customCalories);
    setShowCalorieModal(false);
    router.back();
  };

  const handleCalorieCancel = () => {
    setShowCalorieModal(false);
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
    showCalorieModal,
    calculatedCalories,
    handleCalorieSave,
    handleCalorieCancel,
  };
}
