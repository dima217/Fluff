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

export const useInterpolateScaleFixed = ({
  index,
  itemSize,
  scrollPosition,
}: UseInterpolateScaleProps) => {
  return useAnimatedStyle(() => {
    'worklet';

    const center = scrollPosition.value;
    const itemCenter = index * itemSize;

    const distance = itemCenter - center;

    const scale = interpolate(
      distance,
      [-itemSize, 0, itemSize],
      [0.8, 1.1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });
};