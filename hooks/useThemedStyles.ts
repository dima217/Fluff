import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useMemo } from "react";

export function useThemedStyles<T>(factory: (colors: AppColors) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [colors]);
}
