import React, { ReactNode } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import * as Haptics from "expo-haptics";

export interface DropZoneLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MealItem {
  id: string;
  title: string;
  productId?: number;
  recipeId?: number;
  [key: string]: any;
}

interface DraggableMealCardProps {
  item: MealItem;
  children: ReactNode;

  dropZoneLayout: SharedValue<DropZoneLayout>;

  onDrop: (item: MealItem) => void;

  setIsOverDropZone: (value: boolean) => void;
}

export const DraggableMealCard: React.FC<DraggableMealCardProps> = ({
  item,
  children,
  dropZoneLayout,
  onDrop,
  setIsOverDropZone,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const isHovering = useSharedValue(0);

  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0);
  const shadowRadius = useSharedValue(0);

  const gesture = Gesture.Pan()
    .activateAfterLongPress(500)
    .onStart(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;

      const zone = dropZoneLayout.value;

      const inside =
        e.absoluteY > zone.y && e.absoluteY < zone.y + zone.height / 2;

      isHovering.value = withTiming(inside ? 1 : 0, {
        duration: 180,
      });

      scale.value = withSpring(inside ? 1.04 : 1);

      shadowOpacity.value = withTiming(inside ? 0.25 : 0);

      shadowRadius.value = withTiming(inside ? 18 : 0);

      runOnJS(setIsOverDropZone)(inside);
    })
    .onEnd((e) => {
      const zone = dropZoneLayout.value;

      const inside =
        e.absoluteY > zone.y && e.absoluteY < zone.y + zone.height / 2;

      if (inside) {
        runOnJS(onDrop)(item);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);

      isHovering.value = withTiming(0);

      scale.value = withSpring(1);

      shadowOpacity.value = withTiming(0);

      shadowRadius.value = withTiming(0);

      runOnJS(setIsOverDropZone)(false);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isHovering.value,
      [0, 1],
      ["rgba(0,0,0,0)", "rgba(76, 175, 80, 0.18)"]
    );

    const borderWidth = interpolate(isHovering.value, [0, 1], [0, 2]);

    const borderColor = interpolateColor(
      isHovering.value,
      [0, 1],
      ["rgba(255,255,255,0)", "#4CAF50"]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],

      backgroundColor,
      borderColor,
      borderWidth,

      borderRadius: 20,

      zIndex: 999,

      shadowOpacity: shadowOpacity.value,
      shadowRadius: shadowRadius.value,

      elevation: isHovering.value ? 12 : 0,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
