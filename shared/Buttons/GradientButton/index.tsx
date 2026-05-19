import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import ActivityIndicator from "@/shared/ui/ActivityIndicator";

import { createGradientButtonStyles } from "./styles";

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
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
  textColor,
  style,
  gradientStyle,
  textStyle,
}: GradientButtonProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createGradientButtonStyles);
  const isDisabled = disabled || loading;

  const disabledGradient = [colors.inactive, colors.secondary] as const;
  const gradientColors = isDisabled ? disabledGradient : colors.gradient;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.touchableContainer, isDisabled && styles.outline, style]}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradientContainer, gradientStyle]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.inactive} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  textColor ?? (isDisabled ? colors.inactive : colors.text),
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
