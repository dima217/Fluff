import { Colors } from '@/constants/Colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText = ({ text } : AnimatedTextProps) => {
  const sharedValue = useSharedValue(0);

  React.useEffect(() => {
    sharedValue.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, [sharedValue]);
  
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
    height: 30, 
    width: 200,
  },
  maskText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  gradientContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  gradient: {
    width: 250, 
    height: '100%',
  },
});

export default AnimatedText;