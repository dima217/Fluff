import {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface UseInterpolateScaleProps {
  index: number;
  itemSize: number;
  scrollPosition: SharedValue<number>;
}

export const useInterpolateScaleFixed = ({
  index,
  itemSize,
  scrollPosition,
}: UseInterpolateScaleProps) => {
  return useAnimatedStyle(() => {
    const offset = index * itemSize - scrollPosition.value;

    const centerTolerance = itemSize / 2;

    const scale = interpolate(
      offset,
      [-centerTolerance, 0, centerTolerance],
      [0.75, 1.1, 0.75],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });
};
