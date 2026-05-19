import { ColorPalette } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";

interface CircleProps {
  size?: number;
  color?: string;
  onPress?: () => void;
  gesture?: any;
  isSearchTriggered?: boolean;
  svg?: ReactNode;
  text?: string;
  frostedGlass?: boolean;
}

const Circle = ({
  color,
  size = 50,
  gesture,
  isSearchTriggered,
  onPress,
  svg,
  text,
  frostedGlass = false,
}: CircleProps) => {
  const colors = useColors();
  const isLightTheme =
    colors.background === ColorPalette.light.background;
  const circleColor = color ?? colors.primary;

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: circleColor,
  };

  const glowStyle = isSearchTriggered
    ? {
        shadowColor: colors.text,
        shadowOpacity: 0.8,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
        elevation: 10,
        transform: [{ scale: 1.05 }],
      }
    : {};

  if (onPress) {
    if (frostedGlass) {
      return (
        <TouchableOpacity onPress={onPress}>
          <BlurView
            intensity={isSearchTriggered ? 60 : isLightTheme ? 40 : 20}
            tint="dark"
            style={[
              styles.glassCircle,
              {
                width: circleStyle.width,
                height: circleStyle.height,
                borderRadius: circleStyle.borderRadius,
                backgroundColor: isLightTheme
                  ? "rgba(0, 0, 0, 0.2)"
                  : colors.overlayMedium,
                borderColor: isLightTheme
                  ? "rgba(0, 0, 0, 0.14)"
                  : colors.overlayMedium,
              },
              glowStyle,
            ]}
          >
            <View>{svg}</View>
          </BlurView>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} style={[circleStyle, styles.circle]}>
        {svg ? <View>{svg}</View> : <ThemedText type="xs">{text}</ThemedText>}
      </TouchableOpacity>
    );
  }

  if (gesture) {
    return (
      <GestureDetector gesture={gesture}>
        <View style={[circleStyle, styles.circle]}>{svg}</View>
      </GestureDetector>
    );
  }
  return <View style={[circleStyle, styles.circle]}>{svg}</View>;
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  glassCircle: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
  },
});

export default Circle;
