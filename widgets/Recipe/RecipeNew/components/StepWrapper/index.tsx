import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode } from "react";
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

  if (!context) {
    throw new Error(
      "StepWrapper must be used within RecipeFormContext.Provider"
    );
  }

  const { setStep, totalSteps } = context;

  const formMethods: UseFormReturn<FormData<T>> = useForm<FormData<T>>({
    defaultValues: defaultValues as DefaultValues<FormData<T>>,
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const isLastStep = stepIndex === totalSteps - 1;

  const handleSubmit = formMethods.handleSubmit((data: FormData<T>) => {
    onSubmit(stepIndex, data);

    if (!isLastStep) {
      setStep(stepIndex + 1);
    } else {
      console.log("Final");
    }
  });

  return <FormProvider {...formMethods}>{children}</FormProvider>;
};

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default StepWrapper;
