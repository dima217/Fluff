import ArrowRight from '@/assets/images/ArrowRight.svg';
import { Animated, Dimensions, Text, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import Circle from "../ui/circle";
import { styles } from './swiper.styles';

export interface SwiperProps {
    label: string;
    onSwipeEnd: () => void;
}

const SWIPER_WIDTH = Dimensions.get('window').width * 0.8; 
const CIRCLE_SIZE = 60;
const PADDING = 5;
const THRESHOLD = SWIPER_WIDTH - CIRCLE_SIZE - PADDING * 2

const Swiper = ( { label, onSwipeEnd }: SwiperProps) => {
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
      if (translateX.value > THRESHOLD) {
        onSwipeEnd();
        translateX.value = withTiming(0);
      } else {
        translateX.value = withSpring(0);
      }
    })
    
    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        }
    });

    const animatedLabelStyle = useAnimatedStyle(() => {
        const opacity = 1 - translateX.value / THRESHOLD;
        return {
            opacity: opacity,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.swiperBar}>
                <Animated.View style={animatedCircleStyle}>
                    <Circle
                        svg={<ArrowRight/>}
                        gesture={panGesture}
                    />
                </Animated.View>
                <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
                    <Text style={styles.labelText}>{label}</Text>
                </Animated.View>
            </View>
        </View>
    )
}

export default Swiper;

