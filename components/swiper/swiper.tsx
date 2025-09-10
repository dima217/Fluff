import ArrowRight from '@/assets/images/ArrowRight.svg';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Dimensions, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import AnimatedText from '../ui/animatedText';
import Circle from "../ui/circle";
import { styles } from './swiper.styles';

export interface SwiperProps {
    label: string;
    onSwipeEnd: () => void;
}

const SWIPER_WIDTH = Dimensions.get('window').width * 0.8; 
const CIRCLE_SIZE = 45;
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
        const opacity = translateX.value ? 1 : 0;
        return {
            opacity: opacity,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.swiperBar}>
                
                <LinearGradient
                    colors={['transparent', Colors.background]} 
                    style={styles.background}
                />

                <Animated.View style={animatedCircleStyle}>
                    <Circle
                        svg={<ArrowRight/>}
                        gesture={panGesture}
                    />
                </Animated.View>

                <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
                    <AnimatedText 
                        text='Swipe to Start'
                    />
                </Animated.View>

            </View>
        </View>
    )
}

export default Swiper;

