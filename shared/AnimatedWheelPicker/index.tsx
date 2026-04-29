import { Colors } from "@/constants/design-tokens";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from "react-native-reanimated";
import { WheelItem } from "./components/WheelItem";

export type WheelItemValue<T> = T;

export type WheelItemData<T> = {
  key: string;
  value: WheelItemValue<T>;
  content?: ReactNode;
  dataForContent: any;
};

interface FlexibleWheelPickerProps<T = string | number | Date> {
  data: WheelItemData<T>[];
  itemSize?: number;
  visibleCount?: number;
  onValueChange: (value: T, index: number) => void;
  initialIndex?: number;
  containerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  selectStyle?: StyleProp<ViewStyle>;
  orientation?: "vertical" | "horizontal";
  animationType?: "fixed" | "lens";
  noBackground?: boolean;
}

type SupportedWheelValue = string | number | Date;

export function AnimatedWheelPicker<
  T extends SupportedWheelValue = SupportedWheelValue,
>({
  data,
  itemSize = 56,
  visibleCount = 5,
  onValueChange,
  initialIndex = 0,
  containerStyle,
  selectStyle,
  itemStyle,
  animationType = "fixed",
  orientation = "horizontal",
  noBackground = false,
}: FlexibleWheelPickerProps<T>) {
  const isHorizontal = orientation === "horizontal";
  const scrollPosition = useSharedValue(initialIndex * itemSize);

  const scrollRef = useRef<Animated.FlatList<WheelItemData<T>>>(null);
  const didInitialScroll = useRef(false);

  useEffect(() => {
    if (didInitialScroll.current) return;
    didInitialScroll.current = true;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToOffset({
        offset: initialIndex * itemSize,
        animated: false,
      });
    });
  }, [initialIndex, isHorizontal, itemSize]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = isHorizontal
        ? event.contentOffset.x
        : event.contentOffset.y;
    },
  });

  const handleMomentumEnd = useCallback(
    (event: any) => {
      const offset = isHorizontal
        ? event.nativeEvent.contentOffset.x
        : event.nativeEvent.contentOffset.y;

      const index = Math.round(offset / itemSize);
      const finalIndex = Math.max(0, Math.min(data.length - 1, index));

      if (!isHorizontal) {
        const targetOffset = finalIndex * itemSize;
        const delta = Math.abs(targetOffset - offset);
        if (delta > 0.5) {
          scrollRef.current?.scrollToOffset({
            offset: targetOffset,
            animated: true,
          });
        }
      }

      onValueChange(data[finalIndex].value, finalIndex);
    },
    [data, isHorizontal, itemSize, onValueChange]
  );

  const padding = ((visibleCount - 1) / 2) * itemSize;

  const isScrollEnabled = data.length > visibleCount - 1;

  const containerSizeStyle = isHorizontal
    ? { width: itemSize * visibleCount, height: itemSize * 2.2 }
    : { height: itemSize * visibleCount, width: itemSize * 2 };

  const contentPaddingStyle = isHorizontal
    ? { paddingHorizontal: padding }
    : { paddingVertical: padding };

  const selectorStyle = isHorizontal
    ? { left: padding, width: itemSize, top: 0, bottom: 0 }
    : { top: padding, height: itemSize, left: 0, right: 0 };

  const gradientStart = isHorizontal ? { x: 0, y: 0 } : { x: 0, y: 0 };
  const gradientEnd = isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 };

  const gradientSize = isHorizontal
    ? { width: 60, height: "100%" as "100%" }
    : { height: 60, width: "100%" as "100%" };

  return (
    <View style={[styles.container, containerSizeStyle, containerStyle]}>
      <Animated.FlatList
        ref={scrollRef}
        data={data}
        keyExtractor={(item) => item.key}
        horizontal={isHorizontal}
        nestedScrollEnabled
        directionalLockEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemSize}
        decelerationRate="fast"
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        scrollEnabled={isScrollEnabled}
        contentContainerStyle={contentPaddingStyle}
        initialNumToRender={Math.min(data.length, visibleCount + 2)}
        maxToRenderPerBatch={Math.max(visibleCount + 2, 8)}
        windowSize={5}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: itemSize,
          offset: itemSize * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <WheelItem
            index={index}
            item={item}
            itemSize={itemSize}
            scrollPosition={scrollPosition}
            orientation={orientation}
            animationType={animationType}
            style={itemStyle}
          />
        )}
      />

      {!noBackground && (
        <>
          <LinearGradient
            colors={[Colors.background, "transparent"]}
            start={gradientStart}
            end={gradientEnd}
            style={[
              styles.gradient,
              gradientSize,
              isHorizontal ? { left: 0 } : { top: 0 },
            ]}
            pointerEvents="none"
          />
          <LinearGradient
            colors={["transparent", Colors.background]}
            start={gradientStart}
            end={gradientEnd}
            style={[
              styles.gradient,
              gradientSize,
              isHorizontal ? { right: 0 } : { bottom: 0 },
            ]}
            pointerEvents="none"
          />
        </>
      )}

      {!noBackground && (
        <View
          style={[styles.selector, selectorStyle, selectStyle]}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
  },
  selector: {
    position: "absolute",
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  gradient: {
    position: "absolute",
    zIndex: 5,
  },
});
