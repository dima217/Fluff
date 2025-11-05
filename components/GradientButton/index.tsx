import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Colors } from "@/constants/Colors";

import ActivityIndicator from "@/components/ui/ActivityIndicator";

import styles from "./styles";

const disabledGradient = [Colors.inactive, Colors.secondary] as const;

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonColors?: (string | number)[];
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  gradientStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const GradientButton = ({
  title,
  onPress,
  loading,
  disabled,
  buttonColors,
  textColor,
  style,
  gradientStyle,
  textStyle,
}: GradientButtonProps) => {
  const isDisabled = disabled || loading;

  const gradientColors = isDisabled ? disabledGradient : Colors.gradient;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.touchableContainer, isDisabled && styles.outline, style]}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradientContainer, gradientStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.inactive} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  textColor ?? (isDisabled ? Colors.text : Colors.inactive),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
