/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";

interface ProgressBarProps {
  progress: number;
}

const animateProgress = (shared: SharedValue<number>, to: number) => {
  'worklet';
  shared.value = withTiming(to, { duration: 1000 });
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const sharedValue = useSharedValue(0);
  const clampedProgress = Math.max(0, Math.min(100, progress)) / 100;

  useEffect(() => {
    scheduleOnUI(() => animateProgress(sharedValue, clampedProgress));
  }, [clampedProgress]);

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: "left center",
      width: "100%",
      transform: [{ scaleX: sharedValue.value }],
    };
  });

  return (
    <View style={styles.progressBarWrapper}>
      <Animated.View style={[styles.progressBar, animatedBarStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarWrapper: {
    height: 10,
    backgroundColor: "#333333",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default ProgressBar;
