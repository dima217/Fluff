import React from "react";
import { TextInput as RNTextInput, Text, View } from "react-native";

import type {
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { createTextInputStyles } from "./styles";

export interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const TextInput = ({
  label,
  errorMessage,
  style,
  inputStyle,
  inputContainerStyle,
  left,
  right,
  editable = true,
  ...rest
}: TextInputProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createTextInputStyles);
  const hasError = Boolean(errorMessage);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          hasError && styles.errorInputContainer,
          !editable && styles.disabledInputContainer,
          inputContainerStyle,
        ]}
      >
        {left && <View style={styles.leftContainer}>{left}</View>}
        <RNTextInput
          style={[inputStyle, styles.textInput]}
          editable={editable}
          enablesReturnKeyAutomatically
          textAlignVertical={rest.multiline ? "top" : "center"}
          placeholderTextColor={colors.secondary}
          {...rest}
        />
        {right && <View style={styles.rightContainer}>{right}</View>}
      </View>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default TextInput;
