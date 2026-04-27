import {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle
} from "react-native-reanimated";

interface UseInterpolateScaleProps {
  index: number;
  itemSize: number;
  scrollPosition: SharedValue<number>;
}

export const useInterpolateScaleLens = ({
  index,
  itemSize,
  scrollPosition,
}: UseInterpolateScaleProps) => {
  return useAnimatedStyle(() => {
    const offset = index * itemSize - scrollPosition.value;

    const scale = interpolate(
      offset,
      [-itemSize, 0, itemSize],
      [0.9, 1.2, 0.9],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      offset,
      [-itemSize * 2, -itemSize, 0, itemSize, itemSize * 2],
      [0.3, 0.6, 1, 0.6, 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });
};
