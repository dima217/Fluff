import React from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

type BorderlessTextInputProps = TextInputProps;

const BorderlessTextInput: React.FC<BorderlessTextInputProps> = (props) => {
  return (
    <RNTextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="#8B868F"
    />
  );
};

export default BorderlessTextInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    backgroundColor: "transparent",

    padding: 0,
    margin: 0,

    color: "#fff",
    fontSize: 32,
    fontWeight: "600",

    includeFontPadding: false,
  },
});
