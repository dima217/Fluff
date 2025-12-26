import { Recipe } from "@/constants/types";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode, useEffect, useMemo } from "react";
import {
  DefaultValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { StyleSheet, ViewStyle } from "react-native";
import { AnyObjectSchema } from "yup";
import { useRecipeFormContext } from "../../hooks/useRecipeFormContext";

interface StepConfig {
  schema: AnyObjectSchema;
  defaultValues?: DefaultValues<any>;
}

interface StepWrapperProps {
  children: ReactNode;
  onFinalSubmit: (data: Partial<Recipe>) => void;
  validationSchemas: StepConfig[];
  style?: ViewStyle;
}

type FormData = Record<string, any>;

const FormWrapper = ({
  children,
  validationSchemas,
  onFinalSubmit,
  style,
}: StepWrapperProps) => {
  const context = useRecipeFormContext();
  const { t } = useTranslation();

  if (!context) {
    throw new Error(
      "StepWrapper must be used within RecipeFormContext.Provider"
    );
  }

  const { step, setStep, isLastStep, updateFormData, formData } = context;

  const currentStepConfig = useMemo(() => {
    return validationSchemas[step] || validationSchemas[0];
  }, [step, validationSchemas]);

  const initialValues = useMemo(() => {
    return {
      ...(currentStepConfig.defaultValues || {}),
      ...formData,
    };
  }, [currentStepConfig.defaultValues, formData]);

  const formMethods: UseFormReturn<FormData> = useForm<FormData>({
    resolver: yupResolver(currentStepConfig.schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    formMethods.reset(initialValues, { keepErrors: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSubmit = formMethods.handleSubmit((data: FormData) => {
    updateFormData(data);

    if (!isLastStep) {
      setStep(step + 1);
    } else {
      const finalData = { ...formData, ...data };
      onFinalSubmit(finalData);
    }
  });

  return (
    <FormProvider {...formMethods}>
      {children}
      <Button
        style={styles.button}
        onPress={handleSubmit}
        title={t("recipe.next")}
      />
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    flex: 1,
  },
  button: {
    marginVertical: 32,
  },
});

export default FormWrapper;
