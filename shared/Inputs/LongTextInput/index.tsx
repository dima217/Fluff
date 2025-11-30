import React from "react";
import TextInput, { TextInputProps } from "../TextInput";

interface LongTextInputProps extends TextInputProps {
  height?: number;
}

const LongTextInput: React.FC<LongTextInputProps> = ({
  height = 150,
  inputContainerStyle,
  inputStyle,
  ...rest
}) => {
  return (
    <TextInput
      {...rest}
      multiline
      inputContainerStyle={[
        { height, paddingTop: 10, paddingBottom: 10 },
        inputContainerStyle,
      ]}
      inputStyle={[
        {
          flex: 1,
          textAlignVertical: "top",
        },
        inputStyle,
      ]}
    />
  );
};

export default LongTextInput;
