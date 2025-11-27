import { Colors } from "@/constants/Colors";
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
  svg?: ReactNode;
  text?: string;
  frostedGlass?: boolean;
}

const Circle = ({
  color = Colors.primary,
  size = 50,
  gesture,
  onPress,
  svg,
  text,
  frostedGlass = false,
}: CircleProps) => {
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
  };

  if (onPress) {
    if (frostedGlass) {
      return (
        <BlurView
          intensity={20}
          tint="dark"
          style={[
            styles.glassCircle,
            {
              width: circleStyle.width,
              height: circleStyle.height,
              borderRadius: circleStyle.borderRadius,
            },
          ]}
        >
          <View>{svg}</View>
        </BlurView>
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
});

export default Circle;
