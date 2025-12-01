import { Recipe } from "@/constants/types";
import React, { createContext, useContext, useMemo, useState } from "react";

interface RecipeFormContextType {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  setTotalSteps: (step: number) => void;
  goToStep: (targetStep: number) => void;
  formData: Partial<Recipe>;
  updateFormData: (patch: Partial<Recipe>) => void;
  resetForm: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const RecipeFormContext = createContext<RecipeFormContextType | undefined>(
  undefined
);

interface RecipeFormProviderProps {
  children: React.ReactNode;
}

export const RecipeFormProvider: React.FC<RecipeFormProviderProps> = ({
  children,
}) => {
  const [step, setStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [formData, setFormData] = useState({});

  const goToStep = (targetStep: number) => {
    if (targetStep >= 0 && targetStep < totalSteps) {
      setStep(targetStep);
    }
  };

  const updateFormData = (patch: Partial<Recipe>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const resetForm = () => {
    setStep(0);
    setFormData({});
  };

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      totalSteps,
      setTotalSteps,
      goToStep,
      formData,
      updateFormData,
      resetForm,
      isFirstStep: step === 0,
      isLastStep: step === totalSteps - 1,
    }),
    [step, totalSteps]
  );

  return (
    <RecipeFormContext.Provider value={contextValue}>
      {children}
    </RecipeFormContext.Provider>
  );
};

export const useRecipeFormContext = () => {
  const context = useContext(RecipeFormContext);
  if (!context) {
    throw new Error(
      "useRecipeFormContext must be used within a RecipeFormProvider"
    );
  }
  return context;
};
