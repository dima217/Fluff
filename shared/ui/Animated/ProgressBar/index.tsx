/* eslint-disable react-hooks/exhaustive-deps */
import { ColorPalette } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
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
  "worklet";
  shared.value = withTiming(to, { duration: 1000 });
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const styles = useThemedStyles((c) => {
    const isLight = c.background === ColorPalette.light.background;

    return StyleSheet.create({
      progressBarWrapper: {
        height: 10,
        backgroundColor: isLight ? c.background : "#333333",
        borderRadius: 5,
        overflow: "hidden",
        width: "100%",
      },
      progressBar: {
        height: "100%",
        backgroundColor: isLight ? c.primary : c.onPrimary,
        borderRadius: 5,
      },
    });
  });
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

export default ProgressBar;
