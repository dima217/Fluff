import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { WheelItem } from "./WheelItem";

interface AnimatedWheelPickerProps {
  data: (string | number)[];
  itemHeight?: number;
  visibleCount?: number;
  onValueChange: (value: string | number, index: number) => void;
  initialIndex?: number;
}

export function AnimatedWheelPicker({
  data,
  itemHeight = 56,
  visibleCount = 3,
  onValueChange,
  initialIndex = 0,
}: AnimatedWheelPickerProps) {
  const scrollY = useSharedValue(initialIndex * itemHeight);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / itemHeight);
      runOnJS(onValueChange)?.(data[index], index);
    },
  });

  const padding = ((visibleCount - 1) / 2) * itemHeight;

  const isScrollEnabled = data.length > visibleCount - 1;

  return (
    <View style={[styles.container, { height: itemHeight * visibleCount }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        scrollEnabled={isScrollEnabled}
        contentContainerStyle={{
          paddingVertical: padding,
        }}
      >
        {data.map((item, index) => (
          <WheelItem
            key={index}
            index={index}
            item={item}
            itemHeight={itemHeight}
            scrollY={scrollY}
          />
        ))}
      </Animated.ScrollView>

      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "transparent"]}
        style={[styles.gradient, { top: 0 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)"]}
        style={[styles.gradient, { bottom: 0 }]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.selector,
          {
            top: padding,
            height: itemHeight,
          },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "70%",
    position: "relative",
    overflow: "hidden",
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
  },
  selector: {
    position: "absolute",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    zIndex: 5,
  },
});
