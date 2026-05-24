import {
  FormProvider,
  useFormContext,
} from "@/contexts/FormContext/FormContext";
import { BiometryFormData } from "@/widgets/Profile/wrappers/BiometryFormWrapper";

export const BiometryFormProvider = FormProvider<BiometryFormData>;

export const useBiometryFormContext = () => useFormContext<BiometryFormData>();
