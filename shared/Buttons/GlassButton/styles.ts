import { AppColors } from "@/constants/design-tokens";
import { styles as buttonStyles } from "@/shared/Buttons/Button/styles";
import { StyleSheet } from "react-native";

export const createGlassButtonStyles = (colors: AppColors) =>
  StyleSheet.create({
    shell: {
      borderRadius: buttonStyles.container.borderRadius,
      overflow: "hidden",
      width: buttonStyles.container.width,
    },
    shellCompact: {
      width: "auto",
    },
    fallbackGlass: {
      borderWidth: 1,
      borderRadius: buttonStyles.container.borderRadius,
    },
    fallbackDisabled: {
      backgroundColor: colors.inactive,
      borderColor: colors.border,
    },
  });
