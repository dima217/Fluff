import { useColors } from "@/contexts/ThemeContext";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from "react-native";

type GradientViewProps = Omit<ViewProps, "style"> & {
  colors?: LinearGradientProps["colors"];
  style?: StyleProp<ViewStyle>;
};

const GradientView = ({
  colors: gradientColors,
  style,
  children,
}: GradientViewProps) => {
  const colors = useColors();

  return (
    <LinearGradient
      colors={gradientColors ?? colors.gradient}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientView;
