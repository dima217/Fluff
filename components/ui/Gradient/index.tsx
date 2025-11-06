import { Colors } from "@/constants/Colors";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet, ViewStyle } from "react-native";

interface GradientViewProps {
  colors?: LinearGradientProps["colors"];
  style?: ViewStyle;
}

const GradientView = ({
  colors = Colors.gradient,
  style,
}: GradientViewProps) => {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    ></LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientView;
