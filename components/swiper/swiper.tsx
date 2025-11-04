import ArrowRight from "@/assets/images/ArrowRight.svg";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AnimatedText from "../ui/animated/CustomAnimatedText";
import Circle from "../ui/circle";
import { styles } from "./swiper.styles";

export interface SwiperProps {
  onSwipeEnd: () => void;
}

const SWIPER_WIDTH = Dimensions.get("window").width * 0.9;
const CIRCLE_SIZE = 45;
const PADDING = 5;
const THRESHOLD = SWIPER_WIDTH - CIRCLE_SIZE - PADDING * 4;

const Swiper = ({ onSwipeEnd }: SwiperProps) => {
  const isPressed = useSharedValue(false);
  const translateX = useSharedValue(0);

  const arrowPhase = useSharedValue(0);

  arrowPhase.value = withRepeat(
    withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(1, { duration: 500 })
    ),
    -1,
    false
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      const newTranslateX = e.translationX;
      translateX.value = Math.min(Math.max(0, newTranslateX), THRESHOLD);
    })
    .onEnd(() => {
      if (translateX.value === THRESHOLD) {
        runOnJS(onSwipeEnd)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const opacity = translateX.value ? 0 : 1;
    return {
      opacity: opacity,
    };
  });

  const animatedSwiperStyle = useAnimatedStyle(() => {
    const width = SWIPER_WIDTH - translateX.value;
    return {
      width: width,
    };
  });

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
    <View style={styles.container}>
      <Animated.View style={[styles.swiperBar, animatedSwiperStyle]}>
        <LinearGradient
          colors={["#242424", "#1A1A1A"]}
          start={[0.5, 0]}
          end={[0.5, 1]}
          style={styles.background}
        />
        <Animated.View style={styles.animatedCircleStyle}>
          <Circle svg={<ArrowRight />} gesture={panGesture} />
        </Animated.View>

        <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
          <AnimatedText text="Swipe to Start" />
        </Animated.View>

        <View style={styles.blinkingArrowsContainer}>
          <Animated.Text style={animatedArrowStyleLeft}>
            <Ionicons name="chevron-forward" size={24} />
          </Animated.Text>

          <Animated.Text style={animatedArrowStyleRight}>
            <Ionicons name="chevron-forward" size={24} />
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default Swiper;
