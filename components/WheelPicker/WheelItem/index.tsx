import { memo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface WheelItemProps {
  index: number;
  item: string | number;
  itemHeight: number;
  scrollY: SharedValue<number>;
}

export const WheelItem = memo(function WheelItem({
  index,
  item,
  itemHeight,
  scrollY,
}: WheelItemProps) {
  const style = useAnimatedStyle(() => {
    const offset = index * itemHeight - scrollY.value;

    const scale = interpolate(
      offset,
      [-itemHeight * 2, -itemHeight, 0, itemHeight, itemHeight * 2],
      [0.75, 0.9, 1.2, 0.9, 0.75],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      offset,
      [-itemHeight * 2, -itemHeight, 0, itemHeight, itemHeight * 2],
      [0.3, 0.6, 1, 0.6, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.itemContainer, { height: itemHeight }, style]}
    >
      <Text style={styles.itemText}>{String(item)}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    zIndex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
  },
});
