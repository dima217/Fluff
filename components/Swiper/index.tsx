import ArrowRight from "@/assets/images/ArrowRight.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import AnimatedArrows from "../ui/Animated/AnimatedArrows";
import AnimatedText from "../ui/Animated/CustomAnimatedText";
import Circle from "../ui/Circle";
import { styles } from "./styles";

export interface SwiperProps {
  onSwipeEnd: () => void;
}

const SWIPER_WIDTH = Dimensions.get("window").width * 0.9;
const PADDING = 5;
const THRESHOLD = SWIPER_WIDTH - CircleSizes.SMALL - PADDING * 4;

const Swiper = ({ onSwipeEnd }: SwiperProps) => {
  const isPressed = useSharedValue(false);
  const translateX = useSharedValue(0);

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

  const animatedArrowsStyle = useAnimatedStyle(() => {
    const opacity = translateX.value ? 0 : 1;
    return {
      opacity: opacity,
    };
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

        <AnimatedArrows style={animatedArrowsStyle} />
      </Animated.View>
    </View>
  );
};

export default Swiper;
