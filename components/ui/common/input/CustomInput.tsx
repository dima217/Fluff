import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { TextInput, TextInputProps, View } from "react-native";
import styles from "./input.styles";

interface InputProps extends UseControllerProps<any>, TextInputProps {
  onlyNumbers?: boolean;
  defaultValue?: string;
}

const CustomInput = ({
  name,
  control,
  onlyNumbers,
  ...textInputProps
}: InputProps) => {
  const { field, fieldState } = useController({
    name,
    control,
  });
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputValue = field.value || "";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: fieldState.error
              ? "#ff0000"
              : isFocused
              ? Colors.text
              : Colors.secondary,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={inputValue}
          onChangeText={(text) => {
            let filtered = text;
          
            if (onlyNumbers) {
              
              filtered = filtered.replace(/[^0-9,]/g, '');
          
              filtered = filtered.replace(/^,/, '');
    
              const parts = filtered.split(',');
              filtered = parts[0] + (parts[1] !== undefined ? ',' + parts[1].replace(/,/g, '') : '');
            }
          
            field.onChange(filtered);
          }}
          placeholder={name}
          keyboardType={onlyNumbers ? "numeric" : "default"}
          {...textInputProps}
        />
      </View>
    </View>
  );
};

export default CustomInput;
