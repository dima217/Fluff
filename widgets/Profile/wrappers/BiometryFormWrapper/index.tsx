import FormWrapper from "@/contexts/FormContext/FormWrapper";
import React from "react";
import { DefaultValues } from "react-hook-form";
import { AnyObjectSchema } from "yup";

interface StepConfig {
  schema: AnyObjectSchema;
  defaultValues?: DefaultValues<any>;
}

export interface BiometryFormData {
  sex: "male" | "female" | "other" | null;
  age: string;
  height: string;
  weight: string;
}

interface BiometryFormWrapperProps {
  children: React.ReactNode;
  onFinalSubmit: (data: Partial<BiometryFormData>) => void;
  validationSchemas: StepConfig[];
  style?: any;
  buttonText?: string;
}

const BiometryFormWrapper = ({
  children,
  validationSchemas,
  onFinalSubmit,
  style,
  buttonText,
}: BiometryFormWrapperProps) => {
  return (
    <FormWrapper<BiometryFormData>
      validationSchemas={validationSchemas}
      onFinalSubmit={onFinalSubmit}
      style={style}
      buttonText={buttonText}
    >
      {children}
    </FormWrapper>
  );
};

export default BiometryFormWrapper;
