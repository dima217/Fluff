import { useColors } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

interface RadialGradientBackgroundProps {
  colors?: [string, string];
  opacities?: [number, number];
  style?: StyleProp<ViewStyle>;
}

const RadialGradientBackground: React.FC<RadialGradientBackgroundProps> = ({
  colors: gradientColors,
  opacities = [0.3, 0.1],
  style,
}) => {
  const colors = useColors();
  const stops = gradientColors ?? [colors.primary, colors.primary];

  return (
    <View style={[styles.container, style]}>
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient id="grad" cx="40%" cy="80%" r="50%" fx="50%" fy="50%">
            <Stop
              offset="0%"
              stopColor={stops[0]}
              stopOpacity={opacities[0]}
            />
            <Stop
              offset="100%"
              stopColor={stops[1]}
              stopOpacity={opacities[1]}
            />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});

export default RadialGradientBackground;
