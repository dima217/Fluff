import { Colors } from "@/constants/design-tokens";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  progress: number;
};

export default function AnimatedProgressBar({ progress }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "30%",
    height: 8,
    backgroundColor: Colors.inactive,
    borderRadius: 10,
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
});
