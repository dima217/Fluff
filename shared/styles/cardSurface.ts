import { AppColors } from "@/constants/design-tokens";
import { ViewStyle } from "react-native";

/** Card/block fill only — no border or shadow */
export function cardSurface(colors: AppColors): ViewStyle {
  return {
    backgroundColor: colors.card,
  };
}
