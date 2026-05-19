import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
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
  const colors = useColors();
  const [height, setHeight] = useState(minHeight);
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      wrapper: {
        width: "100%",
      },
      input: {
        padding: 0,
        margin: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        color: c.text,
        fontSize: 26,
        lineHeight: 36,
        textAlignVertical: "top",
      },
    })
  );

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
        placeholderTextColor={colors.secondary}
      />
    </View>
  );
};

export default AutoGrowingTextInput;
