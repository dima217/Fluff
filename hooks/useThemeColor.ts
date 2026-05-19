import { AppColors, ColorPalette } from "@/constants/design-tokens";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof AppColors
) {
  const theme = useColorScheme() ?? "dark";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return ColorPalette[theme === "light" ? "light" : "dark"][colorName];
}
