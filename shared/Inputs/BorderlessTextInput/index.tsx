import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

type BorderlessTextInputProps = TextInputProps;

const BorderlessTextInput: React.FC<BorderlessTextInputProps> = (props) => {
  const colors = useColors();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      input: {
        borderWidth: 0,
        backgroundColor: "transparent",
        padding: 0,
        margin: 0,
        color: c.text,
        fontSize: 32,
        fontWeight: "600",
        includeFontPadding: false,
      },
    })
  );

  return (
    <RNTextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.secondary}
    />
  );
};

export default BorderlessTextInput;
