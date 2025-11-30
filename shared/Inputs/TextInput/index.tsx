import React from "react";
import { TextInput as RNTextInput, Text, View } from "react-native";

import type {
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

import styles from "./styles";

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
  const hasError = Boolean(errorMessage);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
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
          {...rest}
        />
        {right && <View style={styles.rightContainer}>{right}</View>}
      </View>
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    </View>
  );
};

export default TextInput;
