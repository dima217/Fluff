import React, { createContext, useContext, useMemo, useState } from "react";

interface RecipeFormContextType {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
}

const RecipeFormContext = createContext<RecipeFormContextType | undefined>(
  undefined
);

interface RecipeFormProviderProps {
  children: React.ReactNode;
  totalSteps: number;
}

export const RecipeFormProvider: React.FC<RecipeFormProviderProps> = ({
  children,
  totalSteps,
}) => {
  const [step, setStep] = useState(0);

  const contextValue = useMemo(
    () => ({ step, setStep, totalSteps }),
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
