import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "../TextInput";

import type { TextInputProps } from "../TextInput";

interface EmailInputProps extends TextInputProps {}

const EmailInput = ({
  label,
  placeholder,
  ...rest
}: EmailInputProps) => {
  const { t } = useTranslation();
  
  return (
    <TextInput
      label={label ?? t("auth.email")}
      placeholder={placeholder ?? t("auth.email")}
      inputMode="email"
      keyboardType="email-address"
      textContentType="emailAddress"
      autoComplete="email"
      importantForAutofill="yes"
      autoCorrect={false}
      autoCapitalize="none"
      {...rest}
    />
  );
};

export default EmailInput;
