import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode, useEffect } from "react";
import {
  DefaultValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { StyleSheet, ViewStyle } from "react-native";
import { AnyObjectSchema, InferType } from "yup";
import { useRecipeFormContext } from "../../hooks/useRecipeFormContext";

interface StepWrapperProps<T extends AnyObjectSchema> {
  children: ReactNode;
  stepIndex: number;
  onSubmit: (stepIndex: number, data: InferType<T>) => void;
  validationSchema: T;
  defaultValues?: DefaultValues<InferType<T>>;
  style?: ViewStyle;
}

type FormData<T extends AnyObjectSchema> = InferType<T>;

const StepWrapper = <T extends AnyObjectSchema>({
  children,
  stepIndex,
  onSubmit,
  validationSchema,
  defaultValues,
  style,
}: StepWrapperProps<T>) => {
  const context = useRecipeFormContext();
  const { t } = useTranslation();

  if (!context) {
    throw new Error(
      "StepWrapper must be used within RecipeFormContext.Provider"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setStep, totalSteps, isFirstStep, isLastStep } = context;

  const formMethods: UseFormReturn<FormData<T>> = useForm<FormData<T>>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (defaultValues) {
      formMethods.reset(defaultValues as DefaultValues<FormData<T>>);
    }
  }, [defaultValues, formMethods]);

  const handleSubmit = formMethods.handleSubmit((data: FormData<T>) => {
    onSubmit(stepIndex, data);

    if (!isLastStep) {
      setStep(stepIndex + 1);
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

export default StepWrapper;
