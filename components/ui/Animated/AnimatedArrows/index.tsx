import { CircleSizes } from "@/constants/components/CIrcle";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const PADDING = 10;

interface AnimetedArrowProps {
  style?: ViewStyle;
}

const AnimatedArrows = ({ style }: AnimetedArrowProps) => {
  const arrowPhase = useSharedValue(0);

  arrowPhase.value = withRepeat(
    withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(1, { duration: 500 })
    ),
    -1,
    false
  );

  const animatedArrowStyleLeft = useAnimatedStyle(() => {
    const color = interpolateColor(
      arrowPhase.value,
      [0, 1],
      ["#FFFFFF", "#494242"]
    );
    return { color };
  });

  const animatedArrowStyleRight = useAnimatedStyle(() => {
    const color = interpolateColor(
      arrowPhase.value,
      [0, 1],
      ["#494242", "#FFFFFF"]
    );
    return { color };
  });

  return (
    <Animated.View style={[styles.blinkingArrowsContainer, style]}>
      <Animated.Text style={animatedArrowStyleLeft}>
        <Ionicons name="chevron-forward" size={24} />
      </Animated.Text>

      <Animated.Text style={animatedArrowStyleRight}>
        <Ionicons name="chevron-forward" size={24} />
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blinkingArrowsContainer: {
    position: "absolute",
    right: CircleSizes.SMALL + PADDING,
    top: 0,
    bottom: 0,
    width: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },
});

export default AnimatedArrows;
