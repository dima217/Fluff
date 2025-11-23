/* eslint-disable react-hooks/exhaustive-deps */
import { Colors } from "@/constants/Colors";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface AnimatedTextProps {
  text: string;
}

const AnimatedText = ({ text }: AnimatedTextProps) => {
  const sharedValue = useSharedValue(0);

  useEffect(() => {
    sharedValue.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = sharedValue.value * 250;
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <MaskedView
      style={styles.maskedView}
      maskElement={<Text style={styles.maskText}>{text}</Text>}
    >
      <View style={styles.gradientContainer}>
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={[Colors.text, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedView: {
    height: 20,
    width: 100,
  },
  maskText: {
    color: "#000",
    fontWeight: "400",
    fontSize: 14,
    textAlign: "center",
  },
  gradientContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  gradient: {
    width: 250,
    height: "100%",
  },
});

export default AnimatedText;
