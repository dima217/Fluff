import Icon from "react-native-vector-icons/Ionicons";

import { useToggle } from "@/hooks/useToggle";

import TextInput from "../TextInput";

import { Colors } from "@/constants/Colors";
import type { TextInputProps } from "../TextInput";

interface PasswordInputProps extends TextInputProps {}

const PasswordInput = ({
  label = "PASSWORD",
  placeholder = "Password",
  ...rest
}: PasswordInputProps) => {
  const { state: visible, toggle } = useToggle();

  const iconName = visible ? "eye-off" : "eye";

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      secureTextEntry={!visible}
      right={
        <Icon
          name={iconName}
          size={20}
          color={Colors.secondary}
          onPress={toggle}
        />
      }
      textContentType="password"
      autoComplete="password"
      importantForAutofill="yes"
      autoCorrect={false}
      autoCapitalize="none"
      {...rest}
    />
  );
};

export default PasswordInput;
