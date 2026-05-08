import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
} from "react-native";

interface AutoGrowingTextInputProps extends TextInputProps {
  minHeight?: number;
}

const AutoGrowingTextInput: React.FC<AutoGrowingTextInputProps> = ({
  minHeight = 40,
  ...props
}) => {
  const [height, setHeight] = useState(minHeight);

  return (
    <View style={[styles.wrapper]}>
      <RNTextInput
        {...props}
        multiline
        onContentSizeChange={(e) => {
          const newHeight = e.nativeEvent.contentSize.height;

          if (newHeight < minHeight) {
            setHeight(minHeight);
          } else {
            setHeight(newHeight);
          }
        }}
        style={[
          styles.input,
          {
            height,
          },
        ]}
        placeholderTextColor="#8B868F"
      />
    </View>
  );
};

export default AutoGrowingTextInput;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  input: {
    padding: 0,
    margin: 0,

    borderWidth: 0,
    backgroundColor: "transparent",

    color: "#fff",
    fontSize: 26,
    lineHeight: 36,

    textAlignVertical: "top",
  },
});
