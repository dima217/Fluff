import { formatDate } from "@/shared/utils/formatDate";
import { memo, useMemo } from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { WheelItemData } from "../..";
import { useInterpolateScaleFixed } from "../../hooks/useInterpolateScaleFixed";
import { useInterpolateScaleLens } from "../../hooks/useInterpolateScaleLens";

interface FlexibleWheelItemProps {
  index: number;
  item: WheelItemData<string | number | Date>;
  itemSize: number;
  scrollPosition: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  orientation: "vertical" | "horizontal";
  animationType?: "fixed" | "lens";
}

export const WheelItem = memo(function FlexibleWheelItem({
  index,
  item,
  itemSize,
  scrollPosition,
  orientation,
  style,
  animationType = "fixed",
}: FlexibleWheelItemProps) {
  const isHorizontal = orientation === "horizontal";

  const fixedStyle = useInterpolateScaleFixed({
    index,
    itemSize,
    scrollPosition,
  });
  
  const lensStyle = useInterpolateScaleLens({
    index,
    itemSize,
    scrollPosition,
  });
  
  const animatedStyle =
    animationType === "fixed" ? fixedStyle : lensStyle;

  const sizeStyle = isHorizontal ? { width: itemSize } : { height: itemSize };

  const displayValue = useMemo(() => {
    return item.value instanceof Date
      ? formatDate(item.value)
      : String(item.value);
  }, [item.value]);

  return (
    <Animated.View style={[styles.itemContainer, sizeStyle, style]}>
      <Animated.View style={[styles.customContentWrapper, animatedStyle]}>
        {item.content ? item.content : (
          <Text style={styles.itemText}>{displayValue}</Text>
        )}
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
  },
  customContentWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
