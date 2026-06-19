import { ColorPalette } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Button from "@/shared/Buttons/Button";
import { styles as buttonStyles } from "@/shared/Buttons/Button/styles";
import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  type GlassStyle,
} from "expo-glass-effect";
import { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { createGlassButtonStyles } from "./styles";

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  tintColor?: string;
  textColor?: string;
  glassEffectStyle?: GlassStyle;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  compact?: boolean;
}

const GlassButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  tintColor,
  textColor,
  glassEffectStyle = "regular",
  style,
  textStyle,
  compact = false,
}: GlassButtonProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createGlassButtonStyles);
  const isDisabled = disabled || loading;
  const isLightTheme = colors.background === ColorPalette.light.background;

  const useNativeGlass = useMemo(() => {
    if (Platform.OS !== "ios" || isDisabled) return false;
    try {
      return isGlassEffectAPIAvailable();
    } catch {
      return false;
    }
  }, [isDisabled]);

  const resolvedTintColor =
    tintColor ?? (isLightTheme ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.12)");

  const shellStyle = [
    styles.shell,
    compact && styles.shellCompact,
    style,
  ];

  const buttonStyle = [
    { backgroundColor: "transparent" },
    isDisabled && { backgroundColor: "transparent" },
  ];

  return (
    <View style={shellStyle}>
      {useNativeGlass ? (
        <GlassView
          style={StyleSheet.absoluteFill}
          glassEffectStyle={glassEffectStyle}
          tintColor={resolvedTintColor}
          isInteractive
        />
      ) : (
        <BlurView
          intensity={isLightTheme ? 48 : 36}
          tint={isLightTheme ? "light" : "dark"}
          style={[
            StyleSheet.absoluteFill,
            styles.fallbackGlass,
            isDisabled && styles.fallbackDisabled,
            {
              backgroundColor: isLightTheme
                ? "rgba(255, 255, 255, 0.35)"
                : colors.overlayMedium,
              borderColor: isLightTheme
                ? "rgba(255, 255, 255, 0.45)"
                : "rgba(255, 255, 255, 0.14)",
            },
          ]}
        />
      )}

      <Button
        title={title}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        compact={compact}
        buttonColor="transparent"
        textColor={textColor}
        style={buttonStyle}
        textStyle={textStyle}
      />
    </View>
  );
};

export default GlassButton;
