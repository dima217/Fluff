import { Text, TouchableOpacity } from "react-native";

import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { useColors } from "@/contexts/ThemeContext";
import ActivityIndicator from "../../ui/ActivityIndicator";

import { styles } from "./styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  buttonColor?: string;
  textColor?: string;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = ({
  title,
  onPress,
  loading,
  disabled,
  compact = false,
  buttonColor,
  textColor,
  numberOfLines,
  style,
  textStyle,
}: ButtonProps) => {
  const colors = useColors();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        numberOfLines != null
          ? styles.containerFlexible
          : compact
            ? styles.containerCompact
            : styles.container,
        { backgroundColor: buttonColor ?? colors.primary },
        isDisabled && { backgroundColor: colors.secondary },
        style,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.inactive} />
      ) : (
        <Text
          numberOfLines={numberOfLines}
          style={[
            styles.buttonText,
            compact && styles.buttonTextCompact,
            numberOfLines != null && styles.buttonTextMultiline,
            { color: textColor ?? colors.text },
            isDisabled && { color: colors.inactive },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
